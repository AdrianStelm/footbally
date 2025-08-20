import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Article } from '@prisma/client'
import { CreateArticleDto, UpdateArticleDto } from './news.dto';
import { Prisma } from '@prisma/client';
import { NewsPaginationArgs } from './news-pagination.args';
import slugify from 'slugify';
import { NotFoundException, ForbiddenException } from '@nestjs/common';


type ArticleWithAuthor = Prisma.ArticleGetPayload<{ include: { author: true } }>;


@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        title: dto.title,
        text: dto.text,
        slug: slugify(dto.title, { lower: true, strict: true }),
        author: { connect: { id: dto.authorId } },
      },
      include: { author: true },
    });
  }

  async getArticles(params?: {
    take?: number;
    skip?: number;
    orderBy?: { [P in keyof Article]?: 'asc' | 'desc' };
    where?: any;
  }): Promise<ArticleWithAuthor[]> {
    return this.prisma.article.findMany({
      take: params?.take,
      skip: params?.skip,
      orderBy: params?.orderBy,
      where: params?.where,
      include: { author: true },
    });
  }

  async getById(id: string): Promise<ArticleWithAuthor | null> {
    return await this.prisma.article.findFirst({
      where: { id },
      include: { author: true },
    });
  }

  async findAll({ page, limit, author, search, sort }: NewsPaginationArgs) {
    const where: Prisma.ArticleWhereInput = {};

    if (author) where.author = { id: author };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { text: { contains: search, mode: 'insensitive' } },
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
        include: { author: true },
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
      include: { author: true },
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
      include: { author: true },
    });
  }

  async deleteById(id: string, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    console.log('article.authorId =', article?.authorId, 'userId from token =', userId);
    if (article.authorId !== userId) throw new ForbiddenException('Not your article');

    return this.prisma.article.delete({ where: { id } });
  }

  async changeById(id: string, data: UpdateArticleDto, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    if (article.authorId !== userId) throw new ForbiddenException('Not your article');

    return this.prisma.article.update({ where: { id }, data });
  }


}
