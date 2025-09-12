"use client";

import { useMutation } from "@apollo/client";
import { useAuthStore } from "../../../store/authStore";
import { useCheckAuth } from "../../../hooks/useCheckAuth";
import { toast } from "sonner";
import ArticleForm, { Block } from "../../../components/ArticleForm";
import uploadClient from "../../../apollo/apollo-upload-client";
import { useRouter } from "next/navigation";
import { CREATE_ARTICLE } from "../../../graphql/mutations/article/articleMutations";


export default function CreateArticlePage() {
  const { accessToken } = useAuthStore();
  const router = useRouter()
  useCheckAuth();

  const [createArticle, { loading }] = useMutation(CREATE_ARTICLE, {
    client: uploadClient,
  });

  const handleSubmit = async (data: { title: string; blocks: Block[] }) => {
    try {
      const files: File[] = [];
      for (const block of data.blocks) {
        if ((block.type === "image" || block.type === "video") && block.file instanceof File) {
          if (block.type === "video") {
            const maxSizeMB = 50;
            if (block.file.size / 1024 / 1024 > maxSizeMB) {
              toast.error(`Video "${block.file.name}" exceeds ${maxSizeMB} MB`);
              return;
            }
          }
          files.push(block.file);
        }
      }


      const content = data.blocks.map((block, i) => ({
        content: block.type === "text" ? block.content || "" : "",
        imageUrl: block.type === "image" ? null : undefined,
        videoUrl: block.type === "video" ? null : undefined,
        order: i,
      }));

      await createArticle({
        variables: {
          data: {
            title: data.title,
            content,
          },
          files: files.length > 0 ? files : undefined,
        },
        context: {
          headers: {
            authorization: `Bearer ${accessToken}`,
            "apollo-require-preflight": "true",
          },
        },
      });

      toast.success("Article created successfully");
      router.replace('/articles')
    } catch (err) {
      console.error("Apollo error:", err);
      const error = err as Error;
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-5xl font-bold mb-6">Create Article</h2>
      <ArticleForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
