import HomeClient from "../../components/HomeClient";
import client from "../../apollo-client";
import { gql } from "@apollo/client";

const GET_ARTICLES = gql`
query LoadMoreArticles($skip: Int, $take: Int) {
  loadMoreArticles(skip: $skip, take: $take) {
    id
    title
    text
    createdAt
    author { id username }
    likesCount
  }
}
`;

export const revalidate = 120;

export default async function Home() {
  const { data } = await client.query({
    query: GET_ARTICLES,
    variables: { skip: 0, take: 7 },
    fetchPolicy: "no-cache",
  });

  const initialArticles = data?.loadMoreArticles ?? [];

  return <HomeClient initialArticles={initialArticles} />;
}
