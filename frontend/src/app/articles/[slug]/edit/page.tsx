"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArticleForm, { Block } from "../../../../../components/ArticleForm";
import { ArticleMediaType } from "../../../../../types/ArticleTypes";
import { UPDATE_ARTICLE } from "../../../../../graphql/mutations/article/articleMutations";
import { GET_ARTICLE_BY_SLUG } from "../../../../../graphql/queries/article/articleQuries";



export default function EditArticlePage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const { data, loading, error } = useQuery(GET_ARTICLE_BY_SLUG, { variables: { slug } });
  const [updateArticle, { loading: mutationLoading }] = useMutation(UPDATE_ARTICLE);

  const [initialTitle, setInitialTitle] = useState("");
  const [initialBlocks, setInitialBlocks] = useState<Block[]>([]);

  useEffect(() => {
    if (data?.getArticleBySlug) {
      setInitialTitle(data.getArticleBySlug.title);

      const sortedBlocks = [...data.getArticleBySlug.content].sort(
        (a, b) => a.order - b.order
      );

      const blocks: Block[] = sortedBlocks.map((b: ArticleMediaType) => {
        if (b.imageUrl) return { id: b.id, type: "image", file: b.imageUrl, content: "" };
        if (b.videoUrl) return { id: b.id, type: "video", file: b.videoUrl, content: "" };
        return { id: b.id, type: "text", content: b.content || "", file: undefined };
      });

      setInitialBlocks(blocks);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.getArticleBySlug) return <p>No article found</p>;

  const handleSubmit = async ({ title, blocks }: { title: string; blocks: Block[] }) => {
    const content = blocks.map((b, idx) => ({
      content: b.type === "text" ? b.content : "",
      imageUrl: b.type === "image" ? (b.file instanceof File ? b.file : b.file) : null,
      videoUrl: b.type === "video" ? (b.file instanceof File ? b.file : b.file) : null,
      order: idx,
    }));

    await updateArticle({
      variables: { id: data.getArticleBySlug.id, data: { title, content } },
    });

    router.push(`/articles/${slug}`);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-6">
      <h2 className="text-5xl font-bold mb-4">Edit Article</h2>
      <ArticleForm
        initialTitle={initialTitle}
        initialBlocks={initialBlocks}
        onSubmit={handleSubmit}
        loading={mutationLoading}
      />
    </div>
  );
}
