"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { ArticleType } from "../types/ArticleTypes";
import Image from "next/image";
import { DELETE_ARTICLE } from "../graphql/mutations/article/articleMutations";
import { LIKE_ARTICLE } from "../graphql/mutations/article/articleMutations";


type Props = ArticleType;

export default function ArticleCard(props: Props) {
    const { id, slug, title, author, createdAt, likesCount, content } = props;

    const router = useRouter();
    const currentUserId = useAuthStore((s) => s.userId);

    const firstMedia = content?.find((c) => c.imageUrl || c.videoUrl);
    const imageUrl = firstMedia?.imageUrl ?? null;
    const videoUrl = firstMedia?.videoUrl ?? null;

    const firstTextBlock = content?.find((c) => c.content)?.content ?? "";

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
            <article className="p-4 min-h-[220px] rounded-lg lg:basis-200">
                <div className="flex flex-col-reverse items-center md:items-stretch md:flex-row md:justify-between gap-4 relative">
                    <Link href={`/articles/${slug}`}>
                        <h2 className="text-2xl font-bold hover:underline">
                            {title.length >= 20 ? title.slice(0, 20) + "..." : title}
                        </h2>
                        <p className="break-words">
                            {firstTextBlock.length >= 50
                                ? firstTextBlock.slice(0, 51) + "..."
                                : firstTextBlock}
                        </p>
                        <p className="text-sm">
                            Автор: {author.username} |{" "}
                            {new Date(createdAt).toLocaleDateString("uk-UA")}
                        </p>
                    </Link>

                    {imageUrl && (
                        <Image
                            loading="lazy"
                            className="object-cover rounded h-[150px]"
                            width={250}
                            height={150}
                            src={imageUrl}
                            alt={title}
                        />
                    )}
                    {!imageUrl && videoUrl && (
                        <video
                            className="rounded"
                            width={250}
                            height={140}
                            controls
                            src={videoUrl}
                        />
                    )}
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

                <button
                    onClick={handleLike}
                    disabled={loading}
                    className="mt-2 px-3 py-1 text-2xl hover:scale-175 cursor-pointer"
                >
                    ❤️ {likes}
                </button>
            </article>
        </div>
    );
}
