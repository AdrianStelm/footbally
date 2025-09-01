import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

import { API_URL } from './consts/API_URL';

export const refreshClient = new ApolloClient({
    link: createHttpLink({
        uri: API_URL,
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
});
