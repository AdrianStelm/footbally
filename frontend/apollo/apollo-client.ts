import { ApolloClient, InMemoryCache, createHttpLink, from, fromPromise } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useAuthStore } from "../store/authStore";
import { API_URL } from "../consts/API_URL";


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
                if (!useAuthStore.getState().userId) {
                    return;
                }
                if (err.message.includes("No token provided")) {
                    window.location.href = "/login";
                }
                const hasRefresh = typeof window !== "undefined" && document.cookie.includes("refreshToken=");
                if (!hasRefresh) {
                    return;
                }

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
                        .then((res) => res.json())
                        .then((data) => {
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
