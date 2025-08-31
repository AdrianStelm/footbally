import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const API_URL =
    typeof window === "undefined"
        ? "http://backend:4000/graphql"
        : "http://localhost:4000/graphql";

export const refreshClient = new ApolloClient({
    link: createHttpLink({
        uri: API_URL,
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
});
