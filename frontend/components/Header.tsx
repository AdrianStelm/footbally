"use client";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Link from "next/link";
import { useLogout } from "../hooks/useLogout";
import { useInitAuth } from "../hooks/useInitAuth";
import DropdownList from "./DropdownList";
import { Menu, X } from "lucide-react"; // іконки

export default function Header() {
    useInitAuth();
    const logout = useLogout();
    const { accessToken, userId, initialized } = useAuthStore();

    const [menuOpen, setMenuOpen] = useState(false);

    if (!initialized) return null;

    return (
        <header className="flex fixed bg-black text-white w-full z-50 justify-between items-center p-6 rounded-3xl cursor-pointer">
            <Link href="/" className="text-3xl font-bold">
                Footbally.
            </Link>

            <div className="hidden max-[425px]:hidden sm:flex gap-4 items-center">
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
                        <Link href="/create-article">Create Article</Link>
                        <Link href="/profile">Profile</Link>
                    </>
                )}
                <DropdownList dropdownCaption="Tables" />
            </div>

            <button
                className="sm:hidden max-[425px]:flex items-center"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {menuOpen && (
                <div className="absolute top-20 left-0 w-full bg-black text-white flex flex-col items-center gap-4 py-6 sm:hidden">
                    <Link href="/articles" onClick={() => setMenuOpen(false)}>News</Link>

                    {!accessToken && (
                        <>
                            <Link href="/register" onClick={() => setMenuOpen(false)}>Register</Link>
                            <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                        </>
                    )}

                    {accessToken && userId && (
                        <>
                            <button
                                onClick={() => {
                                    logout(userId);
                                    setMenuOpen(false);
                                }}
                            >
                                Logout
                            </button>
                            <Link href="/create-article" onClick={() => setMenuOpen(false)}>
                                Create Article
                            </Link>
                            <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                        </>
                    )}
                    <DropdownList dropdownCaption="Tables" />
                </div>
            )}
        </header>
    );
}
