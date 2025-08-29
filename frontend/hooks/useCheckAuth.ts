"use client"

import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useCheckAuth() {
    const { accessToken, userId } = useAuthStore();
    const router = useRouter()
    useEffect(() => {
        if (!accessToken || !userId) {
            router.replace("/login");
        }
    }, [accessToken, userId, router]);
}