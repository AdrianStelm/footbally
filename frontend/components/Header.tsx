"use client";
import { useAuthStore } from "../store/authStore";
import Link from "next/link";
import { useLogout } from "../hooks/useLogout";
import { useInitAuth } from "../hooks/useInitAuth";
import DropdownList from "./DropdownList";

export default function Header() {

    useInitAuth()
    const logout = useLogout();
    const { accessToken, userId, initialized } = useAuthStore();

    if (!initialized) return null;

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
                    <>
                        <button onClick={() => logout(userId)}>Logout</button>
                        <Link href='/create-article'>Create Article</Link>
                    </>
                )}
            </div>
            <DropdownList dropdownCaption="Tables" />
        </header>
    );
}
