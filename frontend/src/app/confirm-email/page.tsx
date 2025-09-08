"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gql, useMutation } from "@apollo/client";
import { useAuthStore } from "../../../store/authStore";

const CONFIRM_EMAIL = gql`
  mutation confirmEmailChange($token: String!) {
    confirmEmailChange(token: $token)
  }
`;

export default function ConfirmEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { accessToken } = useAuthStore();
    const token = searchParams.get("token");
    console.log('Token', token)
    const [status, setStatus] = useState("Verifying...");
    const [confirmEmailChange] = useMutation(CONFIRM_EMAIL, {
        context: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });

    useEffect(() => {
        if (!token) {
            setStatus("No token provided confirm email page");
            return;
        }

        confirmEmailChange({ variables: { token } })
            .then((res) => {
                if (res.data.confirmEmailChange) {
                    setStatus("Email confirmed! Redirecting...");
                    setTimeout(() => router.push("/profile"), 2000);
                } else {
                    setStatus("Invalid or expired token");
                }
            })
            .catch((err) => {
                console.error(err);
                setStatus("Error confirming email");
            });
    }, [token, confirmEmailChange, router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">{status}</h1>
        </div>
    );
}
