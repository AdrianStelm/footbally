import { ApolloClient, InMemoryCache, createHttpLink, from, fromPromise } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useAuthStore } from "./store/authStore";

const API_URL =
    typeof window === "undefined"
        ? "http://backend:4000/graphql"
        : "http://localhost:4000/graphql";

const httpLink = createHttpLink({
    uri: API_URL,
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
        for (const err of graphQLErrors) {
            if (err.extensions?.code === "UNAUTHENTICATED") {
                return fromPromise(
                    fetch(API_URL, {
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

const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
});


export default client;