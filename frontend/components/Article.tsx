"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";

const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: String!) {
    deleteArticle(id: $id)
  }
`;

const LIKE_ARTICLE = gql`
  mutation LikeArticle($data: CreateLikeInput!) {
    LikeArticle(data: $data) {
      id
      likesCount
    }
  }
`;



interface Props {
    id: string;
    slug: string;
    title: string;
    text: string;
    author: { id: string; username: string };
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
}

export default function ArticleCard({
    id,
    slug,
    title,
    text,
    author,
    createdAt,
    updatedAt,
    likesCount
}: Props) {
    const router = useRouter();
    const currentUserId = useAuthStore((s) => s.userId);

    const [deleteArticle] = useMutation(DELETE_ARTICLE);
    const [likeArticle, { loading }] = useMutation(LIKE_ARTICLE);
    const [likes, setLikes] = useState(likesCount);

    const handleLike = async () => {
        const { data } = await likeArticle({
            variables: { data: { articleId: id } },
        });

        if (data?.LikeArticle) {
            setLikes(data.LikeArticle.likesCount);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Ви впевнені, що хочете видалити статтю?")) return;
        await deleteArticle({ variables: { id } });
        router.refresh();
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <Link href={`/articles/${slug}`}>
                <h2 className="text-xl font-bold hover:underline">{title}</h2>
                <p className="text-gray-700">{text}</p>
            </Link>

            <div className="text-sm text-gray-500 mt-2">
                Автор: {author.username} | {createdAt.toLocaleDateString("uk-UA")}
            </div>

            {currentUserId === author.id && (
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => router.push(`/articles/${slug}/edit`)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                        Редагувати
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                        Видалити
                    </button>
                </div>
            )}
            <button onClick={handleLike} disabled={loading} className="mt-2 px-3 py-1 rounded bg-blue-500 text-white">
                ❤️ {likes}
            </button>
        </div>
    );
}
