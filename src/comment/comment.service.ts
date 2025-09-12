import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCommentInput, UpdateCommentInput } from './dto/comment.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCommentInput, userId: string) {
        return this.prisma.comment.create({
            data: {
                text: dto.text,
                articleId: dto.articleId,
                authorId: userId,
            },
            include: {
                author: true,
                article: {
                    include: { author: true }, // ось тут важливо!
                },
            },
        });
    }

    async findByArticle(articleId: string) {
        return this.prisma.comment.findMany({
            where: { articleId },
            include: {
                author: true,
                article: {
                    include: { author: true },
                },
            },
        });
    }

    async update(dto: UpdateCommentInput, userId: string) {
        const comment = await this.prisma.comment.findUnique({ where: { id: dto.id } });
        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.authorId !== userId) {
            throw new ForbiddenException('You can update only your own comments');
        }

        return this.prisma.comment.update({
            where: { id: dto.id },
            data: { text: dto.text },
            include: {
                author: true,
                article: { include: { author: true } },
            },
        });
    }

    async remove(id: string, userId: string) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.authorId !== userId) {
            throw new ForbiddenException('You can delete only your own comments');
        }

        return this.prisma.comment.delete({
            where: { id },
            include: {
                author: true,
                article: { include: { author: true } },
            },
        });
    }



    async getAuthor(commentId: string) {
        return this.prisma.comment
            .findUnique({ where: { id: commentId } })
            .author();
    }

    async getArticle(commentId: string) {
        return this.prisma.comment
            .findUnique({ where: { id: commentId } })
            .article();
    }

}
