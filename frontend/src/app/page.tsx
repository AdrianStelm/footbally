import HomeClient from "../../components/HomeClient";
import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client";

const GET_ARTICLES = gql`
query LoadMoreArticles($skip: Int, $take: Int) {
  loadMoreArticles(skip: $skip, take: $take) {
    id
    title
    text
    slug
    createdAt
    author { id username }
    likesCount
  }
}
`;

export const revalidate = 120;

export default async function Home() {
  const ssrClient = new ApolloClient({
    link: createHttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL || "http://host.docker.internal:4000/graphql",
      credentials: "include",
    }),
    cache: new InMemoryCache(),
  });

  const { data } = await ssrClient.query({
    query: GET_ARTICLES,
    variables: { skip: 0, take: 7 },
    fetchPolicy: "no-cache",
  });

  const initialArticles = data?.loadMoreArticles ?? [];

  return <HomeClient initialArticles={initialArticles} />;
}
