import { gql } from "@apollo/client";
import client from "../../../../apollo-client";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    getArticleBySlug(slug: $slug) {
      id
      title
      text
      createdAt
      updatedAt
      author {
        username
      }
    }
  }
`;

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;

    const { data } = await client.query({
        query: GET_ARTICLE_BY_SLUG,
        variables: { slug },
        fetchPolicy: "no-cache",
    });

    const article = data?.getArticleBySlug;
    if (!article) return notFound();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{article.title}</h1>
            <p className="text-gray-500">
                By {article.author.username} |{" "}
                {new Date(article.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-4">{article.text}</div>
        </div>
    );
}
