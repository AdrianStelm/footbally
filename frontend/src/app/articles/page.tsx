import { gql } from "@apollo/client";
import client from "../../../apollo-client";
import { Article as ArticleComponent } from "../../../components/Article";
import Link from "next/link";


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
    author: { id: string, username: string };
    createdAt: string;
    updatedAt: string;
    slug: string
}

interface GetNewestArticlesData {
    getNewestArticles: Article[];
}

export const revalidate = 100;

export default async function Page() {
    const { data } = await client.query<GetNewestArticlesData>({
        query: GET_ARTICLES,
    });


    return (
        <div>
            {data.getNewestArticles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                    <ArticleComponent
                        id={article.id}
                        title={article.title}
                        text={article.text}
                        author={article.author}
                        createdAt={new Date(article.createdAt)}
                        updatedAt={new Date(article.updatedAt)}
                    />
                </Link>
            ))}
        </div>

    );
}

