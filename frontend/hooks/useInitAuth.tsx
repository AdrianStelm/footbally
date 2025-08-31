"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { gql } from "@apollo/client";
import client from "../apollo-client";

const REFRESH_TOKENS = gql`
  mutation RefreshTokens {
    refreshTokens {
      access_token
      userId
    }
  }
`;

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
