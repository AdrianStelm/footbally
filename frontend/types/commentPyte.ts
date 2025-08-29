export type CommentType = {
    id: string;
    text: string;
    createdAt: string;
    author: {
        id: string;
        username: string;
    };
}