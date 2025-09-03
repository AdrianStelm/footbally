import { PaginatedResponse } from "./paginationType";

export type ArticleType = {
    id: string;
    title: string;
    text: string;
    slug: string;
    author: { id: string; username: string };
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    imageUrl: string;
}

export type ArticlesPaginatedDataType = {
    articlesPaginated: PaginatedResponse<ArticleType>
}