import { ApolloClient, InMemoryCache, createHttpLink, from, fromPromise } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useAuthStore } from "./store/authStore";

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
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
                return fromPromise(
                    fetch("http://localhost:4000/graphql", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            query: `
                mutation {
                  refreshTokens {
                    access_token
                    userId
                  }
                }
              `,
                        }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (!data.data?.refreshTokens) throw new Error("Refresh failed");

                            const { access_token, userId } = data.data.refreshTokens;
                            useAuthStore.getState().setAuth(access_token, userId);

                            operation.setContext(({ headers = {} }) => ({
                                headers: {
                                    ...headers,
                                    authorization: `Bearer ${access_token}`,
                                },
                            }));
                        })
                ).flatMap(() => forward(operation));
            }
        }
    }
});

export const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
});

export default client;
