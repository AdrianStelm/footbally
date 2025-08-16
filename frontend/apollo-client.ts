import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useAuthStore } from "./store/authStore";

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include", // для кукі з refreshToken
});

const authLink = setContext((_, { headers }) => {
    const token = useAuthStore.getState().accessToken;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            if (err.extensions?.code === "UNAUTHENTICATED") {
                // спробувати оновити токен
                return fetch("http://localhost:4000/graphql", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        query: `
    mutation {
      refreshTokens {
        access_token
        refresh_token
        userId
      }
    }
  `
                    })

                })
                    .then((res) => res.json())
                    .then((data) => {
                        const newToken = data.data.refreshTokens.accessToken;
                        useAuthStore.getState().setAuth(newToken, ""); // онови zustand
                        operation.setContext(({ headers = {} }) => ({
                            headers: {
                                ...headers,
                                authorization: `Bearer ${newToken}`,
                            },
                        }));
                        return forward(operation);
                    });
            }
        }
    }
});

export const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
});

export default client;
