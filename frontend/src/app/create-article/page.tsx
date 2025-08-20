"use client";

import Form from "../../../components/Form";
import { FieldConfig } from "../../../types/formTypes";
import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../../../store/authStore";

const CREATE_ARTICLE = gql`
  mutation CreateArticle($data: CreateArticleDto!) {
    createArticle(data: $data) {
      id
      title
      text
    }
  }
`;

const createArticleFields: FieldConfig[] = [
  { name: "title", label: "Input title", type: "text", placeholder: "Title", required: true },
  { name: "text", label: "Input text", type: "text", placeholder: "Text", required: true },
];

export default function Page() {
  const [createArticle] = useMutation(CREATE_ARTICLE);

  const handleSubmit = async (formData: Record<string, any>) => {
    const { accessToken, userId } = useAuthStore.getState();
    if (!accessToken || !userId) {
      alert("User is not authenticated yet");
      return;
    }

    try {
      await createArticle({
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

      alert("Article created! ✅");
      // Можна ще зробити редірект на список статей
      // router.push("/articles") якщо Next.js router
    } catch (err) {
      console.error(err);
      alert("Error creating article ❌");
    }
  };

  return (
    <div>
      <Form fields={createArticleFields} onSubmit={handleSubmit} buttonText="Create" />
    </div>
  );
}
