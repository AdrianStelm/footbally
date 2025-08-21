"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../store/authStore";

const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: String!) {
    deleteArticle(id: $id)
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
}

export default function ArticleCard({
    id,
    slug,
    title,
    text,
    author,
    createdAt,
    updatedAt,
}: Props) {
    const router = useRouter();
    const currentUserId = useAuthStore((s) => s.userId);

    const [deleteArticle] = useMutation(DELETE_ARTICLE);

    const handleDelete = async () => {
        if (!confirm("Ви впевнені, що хочете видалити статтю?")) return;
        await deleteArticle({ variables: { id } });
        router.refresh(); // оновлює список після видалення
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            {/* Клікабельна частина */}
            <Link href={`/articles/${slug}`}>
                <h2 className="text-xl font-bold hover:underline">{title}</h2>
                <p className="text-gray-700">{text}</p>
            </Link>

            <div className="text-sm text-gray-500 mt-2">
                Автор: {author.username} | {createdAt.toLocaleDateString("uk-UA")}
            </div>

            {/* Кнопки залишаються незалежні */}
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
        </div>
    );
}
