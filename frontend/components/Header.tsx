"use client";
import { useAuthStore } from "../store/authStore";
import Link from "next/link";
import { useLogout } from "../hooks/useLogout";
import { useInitAuth } from "./useInitAuth";

export default function Header() {
    const logout = useLogout();
    const { accessToken, userId, initialized } = useAuthStore();
    useInitAuth();

    if (!initialized) return null; // чекати завершення ініціалізації

    return (
        <header className="flex justify-between items-center p-8 bg-white rounded-3xl ">
            <Link href="/" className="text-4xl">Footbally.</Link>
            <div className="flex gap-2">
                <Link href="/articles">News</Link>

                {!accessToken && (
                    <>
                        <Link href="/register">Register</Link>
                        <Link href="/login">Login</Link>
                    </>
                )}

                {accessToken && userId && (
                    <button onClick={() => logout(userId)}>Logout</button>
                )}
            </div>
        </header>
    );
}
