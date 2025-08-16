import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

export const refreshClient = new ApolloClient({
    link: createHttpLink({
        uri: 'http://localhost:4000/graphql',
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
});
