"use client";

import { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../store/authStore";

const GOOGLE_LOGIN_MUTATION = gql`
  mutation GoogleLogin($idToken: String!) {
    googleLogin(idToken: $idToken) {
      access_token
      userId
    }
  }
`;

export default function GoogleLoginButton() {
    const [googleLogin] = useMutation(GOOGLE_LOGIN_MUTATION);
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        /* global google */
        window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("google-login-btn"),
            { theme: "outline", size: "large" }
        );
    }, []);

    const handleCredentialResponse = async (response: any) => {
        const idToken = response.credential;
        if (!idToken) return;

        try {
            const { data } = await googleLogin({ variables: { idToken } });

            if (data?.googleLogin?.access_token && data.googleLogin.userId) {
                setAuth(data.googleLogin.access_token, data.googleLogin.userId);
            }
        } catch (err) {
            console.error("Google login failed", err);
        }
    };

    return <div id="google-login-btn"></div>;
}
