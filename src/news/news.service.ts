import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateArticleDto, UpdateArticleInput } from './dto/create-article.dto';
import { Prisma } from '@prisma/client';
import { NewsPaginationArgs } from './news-pagination.args';
import slugify from 'slugify';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import cloudinary from './cloudinary.provider';
import { FileUpload } from 'graphql-upload-minimal';


type ArticleWithAuthor = Prisma.ArticleGetPayload<{ include: { author: true } }>;

interface SearchArticleType {
  id: string;
  title: string;
  slug: string
}

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateArticleDto, authorId: string, files?: Promise<FileUpload>[]) {
    // Спочатку створюємо статтю (поки без контенту)
    const article = await this.prisma.article.create({
      data: {
        title: dto.title,
        slug: slugify(dto.title, { lower: true, strict: true }),
        author: { connect: { id: authorId } },
      },
    });

    for (let i = 0; i < dto.content.length; i++) {
      const block = dto.content[i];
      let imageUrl: string | null = block.imageUrl ?? null;
      let videoUrl: string | null = block.videoUrl ?? null;

      if (files?.[i]) {
        const file = await files[i];
        const stream = file.createReadStream();

        const uploadResult = await new Promise<{ url: string; resourceType: string }>((resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            { folder: "articles", resource_type: "auto" },
            (error, result) => {
              if (error || !result) return reject(new Error(error?.message || "Upload error"));
              resolve({ url: result.secure_url, resourceType: result.resource_type });
            }
          );
          stream.pipe(upload);
        });

        if (uploadResult.resourceType === "image") imageUrl = uploadResult.url;
        if (uploadResult.resourceType === "video") videoUrl = uploadResult.url;
      }

      await this.prisma.articleContent.create({
        data: {
          articleId: article.id,
          content: block.content,
          imageUrl,
          videoUrl,
          order: block.order ?? i,
        },
      });
    }

    return (await this.prisma.article.findUnique({
      where: { id: article.id },
      include: {
        author: true,
        content: true,
      },
    }))!;

  }


  async getArticles(params?: {
    take?: number;
    skip?: number;
  }): Promise<ArticleWithAuthor[]> {
    return this.prisma.article.findMany({
      take: params?.take,
      skip: params?.skip,
      orderBy: [
        { Like: { _count: 'desc' } },
        { createdAt: 'desc' },
      ],
      include: {
        author: true,
        content: true,
        _count: { select: { Like: true } },
      },
    });
  }

  async getById(id: string): Promise<ArticleWithAuthor | null> {
    return await this.prisma.article.findFirst({
      where: { id },
      include: { author: true, content: true },
    });
  }

  async findAll({ page, limit, author, search, sort }: NewsPaginationArgs) {
    const where: Prisma.ArticleWhereInput = {};

    if (author) where.authorId = author;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { some: { content: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const totalItems = await this.prisma.article.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
      return { items: [], totalItems, totalPages, currentPage: page };
    }

    let orderBy: Prisma.ArticleOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort) {
      if (sort === 'oldest') orderBy = { createdAt: 'asc' };
      if (sort === 'title_asc') orderBy = { title: 'asc' };
      if (sort === 'title_desc') orderBy = { title: 'desc' };
    }

    let cursorId: string | undefined;
    if (page > 1) {
      const cursorItem = await this.prisma.article.findMany({
        where,
        skip: (page - 1) * limit - 1,
        take: 1,
        orderBy,
        include: { author: true, content: true },
      });
      if (cursorItem.length > 0) {
        cursorId = cursorItem[0].id;
      }
    }

    const items = await this.prisma.article.findMany({
      where,
      take: limit,
      skip: cursorId ? 1 : 0,
      cursor: cursorId ? { id: cursorId } : undefined,
      orderBy,
      include: {
        author: true,
        content: true,
      },
    });

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }

  async getBySlug(slug: string): Promise<ArticleWithAuthor | null> {
    return this.prisma.article.findUnique({
      where: { slug },
      include: { author: true, content: true },
    });
  }

  async deleteById(articleId: string, userId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) throw new NotFoundException('Article not found');
    if (article.authorId !== userId) throw new ForbiddenException('Not your article');

    await this.prisma.comment.deleteMany({
      where: { articleId },
    });

    await this.prisma.like.deleteMany({
      where: { articleId },
    });

    await this.prisma.articleContent.deleteMany({
      where: { articleId },
    });

    return this.prisma.article.delete({
      where: { id: articleId },
    });
  }


  async changeById(id: string, data: UpdateArticleInput, userId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { content: true } // підтягуємо блоки контенту
    });
    if (!article) throw new NotFoundException('Article not found');
    if (article.authorId !== userId) throw new ForbiddenException('Not your article');

    const { content, ...restData } = data;

    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: restData,
      include: { author: true, content: true },
    });

    if (content?.length) {
      await this.prisma.articleContent.deleteMany({ where: { articleId: id } });

      const contentToCreate = content.map((block, index) => ({
        articleId: id,
        content: block.content,
        imageUrl: block.imageUrl ?? null,
        videoUrl: block.videoUrl ?? null,
        order: block.order ?? index,
      }));

      await this.prisma.articleContent.createMany({ data: contentToCreate });
    }

    return updatedArticle;
  }

  async toggleLike(userId: string, articleId: string) {
    const existing = await this.prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (existing) {
      await this.prisma.like.delete({
        where: { id: existing.id },
      });
    } else {
      await this.prisma.like.create({
        data: {
          userId,
          articleId,
        },
      });
    }

    return this.prisma.article.findUnique({
      where: { id: articleId },
    });
  }

  async countLikes(articleId: string) {
    return this.prisma.like.count({
      where: { articleId },
    });
  }

  async getTopLikedLast7Days(): Promise<ArticleWithAuthor[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.article.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: [
        { Like: { _count: 'desc' } },
      ],
      take: 5,
      include: {
        author: true,
        content: true,
        _count: { select: { Like: true } },
      },
    });
  }

  async getArticlesByAuthorSimple(authorId: string) {
    return this.prisma.article.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    });
  }

  async searchArticles(query: string) {
    const rawResult = await this.prisma.$runCommandRaw({
      aggregate: "Article",
      pipeline: [
        {
          $search: {
            index: "default",
            wildcard: {
              query: `*${query}*`,
              path: "title",
              allowAnalyzedField: true // 👈 ось тут
            }
          }
        },
        { $limit: 20 },
        {
          $project: {
            _id: 1,
            title: 1,
            slug: 1
          }
        }
      ],
      cursor: {}
    });
    ;

    const result = rawResult as {
      cursor?: { firstBatch?: SearchArticleType[] };
    };

    return result.cursor?.firstBatch ?? [];
  }










}
