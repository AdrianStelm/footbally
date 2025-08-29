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

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const { data } = await client.query({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug },
    fetchPolicy: "no-cache",
  });

  const article = data?.getArticleBySlug;
  if (!article) return notFound();

  return (
    <div className="p-4 flex-1">
      <h2 className="text-4xl font-bold">{article.title}</h2>
      <p>
        By {article.author.username} |{" "}
        {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <p className="mt-4">{article.text}</p>

      <Comments articleId={article.id} />
    </div>
  );
}
