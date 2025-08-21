import { gql } from "@apollo/client";
import client from "../../../../apollo-client";
import { notFound } from "next/navigation";
import Comments from "../../../../components/Comments";

const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    getArticleBySlug(slug: $slug) {
      id
      title
      text
      createdAt
      author {
        username
        id
      }
    }
  }
`;

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

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

      <Comments articleId={article.id} author={article.author.id} />
    </div>
  );
}
