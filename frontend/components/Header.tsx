"use client";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Link from "next/link";
import { useLogout } from "../hooks/useLogout";
import { useInitAuth } from "../hooks/useInitAuth";
import DropdownList from "./DropdownList";
import { Menu, X } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { SEARCH_ARTICLES_QUERY } from "../graphql/queries/article/articleQuries";
import client from "../apollo/apollo-client";

interface SearchResult {
    id: string;
    title: string;
    slug: string;
}



export default function Header() {
    useInitAuth();
    const logout = useLogout();
    const { accessToken, userId, initialized } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);

    if (!initialized) return null;

    const fetchArticles = async (query: string): Promise<SearchResult[]> => {
        const { data } = await client.query({
            query: SEARCH_ARTICLES_QUERY,
            variables: { query },
            fetchPolicy: "no-cache",
        });
        return data.searchArticles;
    };

    const renderArticle = (article: SearchResult) => (
        <Link
            href={`/articles/${article.slug}`}
            className="block p-3 hover:bg-green-800 text-sm font-medium"
            onClick={() => { }}
        >
            {article.title}
        </Link>
    );

    return (
        <>
            <header className="flex fixed top-0 bg-black  w-full z-50 justify-between items-center p-4 sm:p-6 rounded-3xl">
                <Link href="/" className="text-3xl font-bold">
                    Footbally.
                </Link>

                <div className="hidden md:flex relative w-full max-w-xs">
                    <SearchInput<SearchResult>
                        placeholder="Search articles..."
                        fetchResults={fetchArticles}
                        renderItem={renderArticle}
                    />
                </div>

                <div className="hidden md:flex gap-4 items-center">
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
                    className="md:hidden flex items-center"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </header>

            {menuOpen && (
                <div className="md:hidden w-full bg-black text-white flex flex-col items-center gap-4 py-4 mt-2">
                    <Link href="/articles" onClick={() => setMenuOpen(false)}>
                        News
                    </Link>
                    {!accessToken && (
                        <>
                            <Link href="/register" onClick={() => setMenuOpen(false)}>
                                Register
                            </Link>
                            <Link href="/login" onClick={() => setMenuOpen(false)}>
                                Login
                            </Link>
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
                            <Link href="/profile" onClick={() => setMenuOpen(false)}>
                                Profile
                            </Link>
                        </>
                    )}
                    <DropdownList dropdownCaption="Tables" />
                    <div className="w-full mt-2 px-4">
                        <SearchInput<SearchResult>
                            placeholder="Search articles..."
                            fetchResults={fetchArticles}
                            renderItem={renderArticle}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
