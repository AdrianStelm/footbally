import { gql } from "@apollo/client";
import client from "../../../apollo-client";

const GET_ARTICLES = gql`
  query getNewestArticles {
    getAllArticles {
      id
      title
      text
    }
  }
`;

interface Article {
    id: string
    title: string
    text: string
}

interface getAllArticlesData {
    getAllArticles: Article[]
}

export const revalidate = 300;

export default async function Page() {
    const { data } = await client.query<getAllArticlesData>({ query: GET_ARTICLES });

    return (
        <div>
            {data.getAllArticles.map((article: Article) => (
                <div key={article.id}>
                    <h2>{article.title}</h2>
                    <p>{article.text}</p>
                </div>
            ))}
        </div>
    );
}
