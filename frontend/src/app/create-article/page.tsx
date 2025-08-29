"use client";

import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../../../store/authStore";
import { useCheckAuth } from "../../../hooks/useCheckAuth";
import { toast } from "sonner";
import ArticleForm from "../../../components/ArticleForm";

const CREATE_ARTICLE = gql`
  mutation CreateArticle($data: CreateArticleDto!) {
    createArticle(data: $data) {
      id
      title
      text
    }
  }
`;

export default function CreateArticlePage() {
  const { accessToken, userId } = useAuthStore();
  useCheckAuth();

  const [createArticle] = useMutation(CREATE_ARTICLE);

  const handleSubmit = async (data: { title: string; text: string }) => {
    try {
      await createArticle({
        variables: {
          data: {
            ...data,
            authorId: userId,
          },
        },
        context: {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      });
    } catch (err) {
      const error = err as Error
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-5xl font-bold mb-4">Create Article</h2>
      <ArticleForm onSubmit={handleSubmit} />
    </div>
  );
}
