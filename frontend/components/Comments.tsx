"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import Form from "./Form";
import { FieldConfig } from "../types/formTypes";
import { useAuthStore } from "../store/authStore";

const field: FieldConfig[] = [
    { name: "comment", type: "text", placeholder: "Write comment...", required: true },
];

const GET_COMMENTS_BY_ARTICLE = gql`
  query CommentsByArticle($articleId: String!) {
    commentsByArticle(articleId: $articleId) {
      id
      text
      createdAt
      author {
        id
        username
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($data: CreateCommentInput!) {
    addComment(data: $data) {
      id
      text
      createdAt
      author {
        id
        username
      }
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id)
  }
`;

interface Props {
    articleId: string;
}

export default function Comments({ articleId }: Props) {
    const { data, loading, error, refetch } = useQuery(GET_COMMENTS_BY_ARTICLE, {
        variables: { articleId },
        fetchPolicy: "no-cache",
    });

    const currentUserId = useAuthStore((s) => s.userId);

    const [addComment] = useMutation(ADD_COMMENT);
    const [deleteComment] = useMutation(DELETE_COMMENT);

    async function handleSubmit(formData: Record<string, any>) {
        await addComment({
            variables: {
                data: {
                    text: formData.comment,
                    articleId,
                },
            },
        });
        await refetch();
    }

    async function handleDelete(id: string) {
        if (!confirm("Ви впевнені, що хочете видалити коментар?")) return;
        await deleteComment({ variables: { id } });
        await refetch();
    }

    if (loading) return <p>Loading comments...</p>;
    if (error) return <p>Error loading comments</p>;

    return (
        <div className="mt-6">
            <h2 className="font-semibold">Comments</h2>
            <div className="space-y-2 mt-2">
                {data?.commentsByArticle.map((c: any) => (
                    <div key={c.id} className="border p-2 rounded flex justify-between items-center">
                        <div>
                            <p>{c.text}</p>
                            <span className="text-sm text-gray-500">
                                by {c.author.username} | {new Date(c.createdAt).toLocaleString()}
                            </span>
                        </div>

                        {currentUserId === c.author.id && (
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                            >
                                Видалити
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <Form fields={field} onSubmit={handleSubmit} buttonText="Add comment" />
        </div>
    );
}
