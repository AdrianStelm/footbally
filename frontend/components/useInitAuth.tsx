import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { refreshClient } from "../apollo-client-refresh";
import { gql } from "@apollo/client";

const REFRESH_TOKENS = gql`
  mutation RefreshTokens {
    refreshTokens {
      access_token
      refresh_token
      userId
    }
  }
`;

export const useInitAuth = () => {
    const { setAuth, setInitialized } = useAuthStore();

    useEffect(() => {
        const init = async () => {
            try {
                const { data } = await refreshClient.mutate({ mutation: REFRESH_TOKENS });
                if (data?.refreshTokens) {
                    setAuth(data.refreshTokens.access_token, data.refreshTokens.userId);
                } else {
                    setInitialized();
                }
            } catch {
                setInitialized();
            }
        };
        init();
    }, [setAuth, setInitialized]);
};
