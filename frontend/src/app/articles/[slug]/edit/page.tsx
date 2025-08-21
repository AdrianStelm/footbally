"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import Form from "../../../../../components/Form";
import { FieldConfig } from "../../../../../types/formTypes";
import { useEffect, useState } from "react";

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
    const [updateArticle] = useMutation(UPDATE_ARTICLE);

    const [defaultValues, setDefaultValues] = useState<{ title: string; text: string } | null>(null);

    useEffect(() => {
        if (data?.getArticleBySlug) {
            setDefaultValues({
                title: data.getArticleBySlug.title,
                text: data.getArticleBySlug.text,
            });
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!defaultValues) return <p>No article found</p>;

    const fields: FieldConfig[] = [
        { name: "title", label: "Title", type: "text", placeholder: "Enter title", required: true },
        { name: "text", label: "Text", type: "text", placeholder: "Enter text", required: true },
    ];

    const handleSubmit = async (formData: any) => {
        await updateArticle({
            variables: { id: data.getArticleBySlug.id, data: formData },
        });
        router.push(`/articles/${slug}`);
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Редагувати статтю</h1>
            <Form
                fields={fields}
                onSubmit={handleSubmit}
                buttonText="Зберегти"
                defaultValues={defaultValues}
            />
        </div>
    );
}
