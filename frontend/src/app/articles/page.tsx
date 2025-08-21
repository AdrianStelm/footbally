import { gql } from "@apollo/client";
import client from "../../../apollo-client";
import ArticleCard from "../../../components/Article";

const GET_ARTICLES = gql`
  query getNewestArticles {
    getNewestArticles {
      id
      title
      text
      slug
      author {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

interface Article {
    id: string;
    title: string;
    text: string;
    author: { id: string; username: string };
    createdAt: string;
    updatedAt: string;
    slug: string;
}

interface GetNewestArticlesData {
    getNewestArticles: Article[];
}

export const revalidate = 1;

export default async function Page() {
    const { data } = await client.query<GetNewestArticlesData>({
        query: GET_ARTICLES,
        fetchPolicy: "no-cache"
    });

    return (
        <div className="space-y-4">
            {data.getNewestArticles.map((article) => (
                <ArticleCard
                    key={article.id}
                    id={article.id}
                    slug={article.slug}
                    title={article.title}
                    text={article.text}
                    author={article.author}
                    createdAt={new Date(article.createdAt)}
                    updatedAt={new Date(article.updatedAt)}
                />
            ))}
        </div>
    );
}
