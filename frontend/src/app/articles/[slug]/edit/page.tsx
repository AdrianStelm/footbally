"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ArticleForm from "../../../../../components/ArticleForm";

const GET_ARTICLE = gql`
  query GetArticleBySlug($slug: String!) {
    getArticleBySlug(slug: $slug) {
      id
      title
      text
      author {
        id
        username
      }
    }
  }
`;

const UPDATE_ARTICLE = gql`
  mutation ChangeArticle($id: String!, $data: UpdateArticleInput!) {
    changeArticle(id: $id, data: $data) {
      id
      title
      text
      updatedAt
    }
  }
`;

export default function EditArticlePage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();

  const { data, loading, error } = useQuery(GET_ARTICLE, { variables: { slug } });
  const [updateArticle, { loading: mutationLoading }] = useMutation(UPDATE_ARTICLE);

  const [initialValues, setInitialValues] = useState<{ title: string; text: string }>({
    title: "",
    text: "",
  });

  useEffect(() => {
    if (data?.getArticleBySlug) {
      setInitialValues({
        title: data.getArticleBySlug.title,
        text: data.getArticleBySlug.text,
      });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.getArticleBySlug) return <p>No article found</p>;

  const handleSubmit = async (formData: { title: string; text: string }) => {
    await updateArticle({
      variables: { id: data.getArticleBySlug.id, data: formData },
    });
    router.push(`/articles/${slug}`);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-6">
      <h2 className="text-5xl font-bold mb-4">Edit Article</h2>
      <ArticleForm
        initialTitle={initialValues.title}
        initialText={initialValues.text}
        onSubmit={handleSubmit}
        loading={mutationLoading}
      />
    </div>
  );
}
