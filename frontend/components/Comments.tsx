"use client";

import { useQuery, useMutation } from "@apollo/client";
import Form from "./Form";
import { FieldConfig } from "../types/formTypes";
import { useAuthStore } from "../store/authStore";
import { CommentType } from "../types/commentPyte";
import { GET_COMMENTS_BY_ARTICLE } from "../graphql/queries/article/articleQuries";
import { ADD_COMMENT, DELETE_COMMENT } from "../graphql/mutations/article/articleMutations";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const field: FieldConfig[] = [
  { name: "comment", type: "text", placeholder: "Write comment...", required: true },
];

interface Props {
  articleId: string;
}

export default function Comments({ articleId }: Props) {
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS_BY_ARTICLE, {
    variables: { articleId },
    fetchPolicy: "no-cache",
  });
  const router = useRouter()
  const currentUserId = useAuthStore((s) => s.userId);

  const [addComment] = useMutation(ADD_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  async function handleSubmit(formData: Record<string, string>) {
    if (!currentUserId) {
      router.replace('/login')
    }
    try {
      await addComment({
        variables: {
          data: {
            text: formData.comment,
            articleId,
          },
        },
      });
      await refetch();
    } catch {
      toast.error("To do it, need sign in");
    }

  }

  async function handleDelete(id: string) {
    if (!currentUserId) {
      router.replace('/login')
    }
    await deleteComment({ variables: { id } });
    await refetch();
  }

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments</p>;

  return (
    <div className="mt-6 ">
      <Form fields={field} onSubmit={handleSubmit} buttonText="Add comment" fullWidthForm />
      <h2 className="font-semibold text-4xl mt-5">Comments</h2>
      <div className="space-y-2 mt-5">
        {data?.commentsByArticle.map((c: CommentType) => (
          <div key={c.id} className=" p-2 rounded flex justify-between items-center">
            <div>
              <p className="font-bold text-2xl">{c.author.username}</p>
              <p>{c.text}</p>
              <span className="text-sm ">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>

            {currentUserId === c.author.id && (
              <button
                onClick={() => handleDelete(c.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
