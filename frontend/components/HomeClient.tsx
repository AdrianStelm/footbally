"use client";

import { useState, useEffect } from "react";
import client from "../apollo-client";
import { gql } from "@apollo/client";
import Slider from "./Slider";
import { ArticleType } from "../types/ArticleTypes";
import Link from "next/link";
import ArticleCard from "./Article";
import FootballTable from "./Table";

const ARTICLES_PER_PAGE = 7;

const GET_ARTICLES = gql`
  query LoadMoreArticles($skip: Int, $take: Int) {
    loadMoreArticles(skip: $skip, take: $take) {
      id
      slug
      title
      text
      createdAt
      author {
        id
        username
      }
      likesCount
    }
  }
`;

const GET_TOP7_POPULAR_ARTICLES = gql`
  query {
    getTopLikedLast7Days {
      id
      slug
      title
      text
      createdAt
      author {
        id
        username
      }
      likesCount
    }
  }
`;

type PreviewArticle = Pick<
    ArticleType,
    "title" | "text" | "slug" | "likesCount"
>;

export default function HomeClient({
    initialArticles,
}: {
    initialArticles: ArticleType[];
}) {
    const [articles, setArticles] = useState(initialArticles);
    const [page, setPage] = useState(1);
    const [popularArticles, setPopularArticles] = useState<ArticleType[]>([]);

    useEffect(() => {
        const fetchPopular = async () => {
            const { data } = await client.query({ query: GET_TOP7_POPULAR_ARTICLES });
            setPopularArticles(data?.getTopLikedLast7Days ?? []);
        };
        fetchPopular();
    }, []);

    const loadMore = async () => {
        const skip = page * ARTICLES_PER_PAGE;
        const { data } = await client.query({
            query: GET_ARTICLES,
            variables: { skip, take: ARTICLES_PER_PAGE },
            fetchPolicy: "no-cache",
        });

        const newArticles = data?.loadMoreArticles ?? [];
        setArticles((prev) => [...prev, ...newArticles]);
        setPage((prev) => prev + 1);

        const lastArticle = document.getElementById(`article-${skip}`);
        lastArticle?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="p-6">
            <main className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-5xl text-center mb-6">Popular articles</h2>

                    {popularArticles.length > 0 && (
                        <Slider
                            items={popularArticles}
                            renderItem={(item: PreviewArticle) => (
                                <div className="p-4">
                                    <Link href={`/articles/${item.slug}`}>
                                        <h2 className="text-2xl font-bold hover:underline">
                                            {item.title.slice(0, 21)}
                                        </h2>
                                        <p>{item.text.slice(0, 41)}</p>
                                        <p>❤️{item.likesCount}</p>
                                    </Link>
                                </div>
                            )}
                        />
                    )}
                    <h2 className="text-center text-4xl mt-5">Latest News</h2>
                    <div className="mt-8 grid gap-6 lg:grid-cols-2">
                        {articles.map((article, index) => (
                            <div key={article.id} id={`article-${index}`}>
                                <ArticleCard {...article} />
                            </div>
                        ))}
                    </div>

                    {articles.length >= page * ARTICLES_PER_PAGE && (
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

                <div className="lg:sticky lg:top-8 self-start justify-self-end">
                    <h2 className="text-3xl font-bold text-center mb-4">
                        League Standings
                    </h2>
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
