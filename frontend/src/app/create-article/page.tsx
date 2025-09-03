"use client";

import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../../../store/authStore";
import { useCheckAuth } from "../../../hooks/useCheckAuth";
import { toast } from "sonner";
import ArticleForm from "../../../components/ArticleForm";
import uploadClient from "../../../apollo-upload-client";

const CREATE_ARTICLE = gql`
  mutation CreateArticle($data: CreateArticleDto!, $file: Upload) {
    createArticle(data: $data, file: $file) {
      id
      title
      text
      imageUrl
    }
  }
`;


export default function CreateArticlePage() {
  const { accessToken } = useAuthStore();
  useCheckAuth();

  const [createArticle] = useMutation(CREATE_ARTICLE, { client: uploadClient });

  const handleSubmit = async (data: { title: string; text: string; file?: File }) => {
    console.log(data.file)
    try {
      await createArticle({
        variables: {
          data: {
            title: data.title,
            text: data.text,
          },
          file: data.file,
        },
        context: {
          headers: {
            authorization: `Bearer ${accessToken}`,
            'apollo-require-preflight': 'true',

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
