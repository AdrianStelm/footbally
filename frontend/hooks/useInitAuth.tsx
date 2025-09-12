"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import client from "../apollo/apollo-client";
import { REFRESH_TOKENS } from "../graphql/mutations/auth/authMutations";


export const useInitAuth = () => {
    const { setAuth, setInitialized } = useAuthStore();

    useEffect(() => {
        const init = async () => {
            try {
                const { data } = await client.mutate({
                    mutation: REFRESH_TOKENS,
                    context: {
                        fetchOptions: {
                            credentials: "include",
                        },
                    },
                });

                if (data?.refreshTokens) {
                    setAuth(data.refreshTokens.access_token, data.refreshTokens.userId);
                }
            }
            finally {
                setInitialized();
            }
        };

        init();
    }, [setAuth, setInitialized]);
};
