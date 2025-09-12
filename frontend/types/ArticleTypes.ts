import { PaginatedResponse } from "./paginationType";

export type ArticleMediaType = {
    id: string
    content?: string | null;
    imageUrl?: string | null;
    videoUrl?: string | null;
    order?: number | null;
};

export type ArticleType = {
    id: string;
    title: string;
    text: string;
    slug: string;
    author: { id: string; username: string };
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    content?: ArticleMediaType[];
}

export type ArticlesPaginatedDataType = {
    articlesPaginated: PaginatedResponse<ArticleType>
}