"use client"

import { useState } from "react";
import Form from "../../../components/Form";
import { FieldConfig } from "../../../types/formTypes";
import { gql, useMutation } from "@apollo/client";
import { Article } from "../../../components/Article";
import { useAuthStore } from "../../../store/authStore";

const CREATE_ARTICLE = gql`
  mutation CreateArticle($data: CreateArticleDto!) {
    createArticle(data: $data) {
      id
      title
      text
      author { username }
      createdAt
      updatedAt
    }
  }
`;


const createArticleFields: FieldConfig[] = [
  { name: "title", label: "Input title", type: "text", placeholder: "Title", required: true },
  { name: "text", label: "Input text", type: "text", placeholder: "Text", required: true },
];

export default function Page() {
  const [setArticles] = useState<any[]>([]);
  const [createArticle] = useMutation(CREATE_ARTICLE);


  const handleSubmit = async (formData: Record<string, any>) => {
    const { accessToken, userId } = useAuthStore.getState();
    if (!accessToken || !userId) {
      alert("User is not authenticated yet");
      return;
    }

    try {
      const { data } = await createArticle({
        variables: {
          data: {
            title: formData.title,
            text: formData.text,
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
      console.error(err);
      alert("Error creating article");
    }
  };
  return (
    <div>
      <Form fields={createArticleFields} onSubmit={handleSubmit} buttonText="Create" />
    </div>
  );
}
