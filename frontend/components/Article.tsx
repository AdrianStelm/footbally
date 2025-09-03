"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { ArticleType } from "../types/ArticleTypes";
import Image from "next/image";

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

type Props = ArticleType

export default function ArticleCard({
    id,
    slug,
    title,
    text,
    author,
    createdAt,
    likesCount,
    imageUrl
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
        await deleteArticle({ variables: { id } });
        router.refresh();
    };

    return (
        <div className="lg:flex justify-center">
            <article className="p-4 min-h-[220px] rounded-lg bg- lg:basis-200">
                <div className="flex flex-col-reverse items-center md:items-stretch md:flex-row md:justify-between gap-4">
                    <Link href={`/articles/${slug}`}>
                        <h2 className="text-2xl font-bold hover:underline">{(title.length >= 20) ? title.slice(1, 20) + '...' : title}</h2>
                        <p className="break-words">{(text.length >= 50) ? text.slice(1, 51) + '...' : text}</p>
                        <p className="text-sm ">Автор: {author.username} | {new Date(createdAt).toLocaleDateString("uk-UA")}</p>
                    </Link>
                    <Image loading="lazy" className="w-full max-w-[250px] h-auto object-cover rounded" width={250} height={140} src={imageUrl} alt={title}></Image>
                </div>
                {currentUserId === author.id && (
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => router.push(`/articles/${slug}/edit`)}
                            className="basis-20 py-1 bg-blue-500 text-white rounded"
                            disabled={loading}
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="basis-20 py-1 bg-red-500 text-white rounded"
                            disabled={loading}
                        >
                            Delete
                        </button>
                    </div>
                )}
                <button onClick={handleLike} disabled={loading} className="mt-2 px-3 py-1 text-2xl hover:scale-175 cursor-pointer ">
                    ❤️ {likes}
                </button>
            </article>
        </div>
    );
}
