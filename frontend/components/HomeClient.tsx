"use client";

import { useState, useEffect } from "react";
import client from "../apollo/apollo-client";
import Slider from "./Slider";
import { ArticleType } from "../types/ArticleTypes";
import Link from "next/link";
import ArticleCard from "./Article";
import FootballTable from "./Table";
import EventsLeagueCard from "./EventsLeagueCard";
import { GET_TOP7_POPULAR_ARTICLES, GET_ARTICLES_PAGINATED } from "../graphql/queries/article/articleQuries";
import Spinner from "./Spinner";


const ARTICLES_PER_PAGE = 7;



export default function HomeClient({ initialArticles }: { initialArticles: ArticleType[] }) {
    const [articles, setArticles] = useState<ArticleType[]>(initialArticles);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [popularArticles, setPopularArticles] = useState<ArticleType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPopular = async () => {
            const { data } = await client.query({ query: GET_TOP7_POPULAR_ARTICLES });
            setPopularArticles(data?.getTopLikedLast7Days ?? []);
        };
        fetchPopular();
    }, []);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const { data } = await client.query({
                    query: GET_ARTICLES_PAGINATED,
                    variables: { page: 1, limit: ARTICLES_PER_PAGE },
                    fetchPolicy: "no-cache",
                });

                const { items, totalPages } = data.articlesPaginated;
                setArticles(items);
                setTotalPages(totalPages);
                setPage(2);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const loadMore = async () => {
        setLoading(true);
        const { data } = await client.query({
            query: GET_ARTICLES_PAGINATED,
            variables: { page, limit: ARTICLES_PER_PAGE },
            fetchPolicy: "no-cache",
        });

        const { items } = data.articlesPaginated;
        setArticles((prev) => [...prev, ...items]);
        setPage((prev) => prev + 1);
    };

    return (
        <div className="p-6">
            {loading && <Spinner />}
            <main className="grid grid-cols-1 2xl:grid-cols-[1fr_1fr_auto] gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-5xl text-center mb-6">Popular articles</h2>
                    {popularArticles.length > 0 && (
                        <Slider
                            items={popularArticles}
                            renderItem={(item: ArticleType) => {
                                const firstTextBlock = item.content?.find(
                                    (c) => c.content && c.content.trim() !== ""
                                );
                                return (
                                    <div key={item.id} className="p-4">
                                        <Link href={`/articles/${item.slug}`}>
                                            <h2 className="text-2xl font-bold hover:underline">
                                                {item.title.slice(0, 21)}
                                            </h2>
                                            {firstTextBlock?.content && (
                                                <p>{firstTextBlock.content.slice(0, 41)}...</p>
                                            )}
                                            <p>❤️ {item.likesCount}</p>
                                        </Link>
                                    </div>
                                );
                            }}
                        />
                    )}
                    <h2 className="text-center text-5xl mt-5">Upcoming matches</h2>
                    <EventsLeagueCard idLeague="4332" />
                    <h2 className="text-center text-4xl mt-5">Latest News</h2>
                    <div className="mt-8 grid gap-6 lg:grid-cols-2">
                        {articles.map((article, index) => (
                            <div key={article.id} id={`article-${index}`}>
                                <ArticleCard {...article} />
                            </div>
                        ))}
                    </div>

                    {page <= totalPages && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={loadMore}
                                className="px-4 py-2 bg-black rounded text-white hover:bg-green-700 transition"
                            >
                                Show more
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:sticky lg:top-8 self-start  2xl:justify-self-center">
                    <h2 className="text-3xl font-bold text-center mb-4">League Standings</h2>
                    <FootballTable
                        idLeague="4332"
                        season="2025-2026"
                        columns={["intRank", "strBadge", "strTeam", "intPoints"]}
                    />
                </div>
            </main>
        </div>
    );
}
