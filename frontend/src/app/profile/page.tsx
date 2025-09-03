"use client";

import { gql, useQuery } from "@apollo/client";
import { useAuthStore } from "../../../store/authStore";
import ArticleCard from "../../../components/Article";
import { ArticleType } from "../../../types/ArticleTypes";

const GET_MY_ARTICLES = gql`
  query GetArticlesByAuthor {
    getArticlesByAuthor {
      id
      slug
      title
      text
      author {
        id
        username
      }
      createdAt
      updatedAt
      likesCount
    }
  }
`;

export default function ProfilePage() {
    const { accessToken, initialized } = useAuthStore();

    const { data, loading, error } = useQuery(GET_MY_ARTICLES, {
        skip: !initialized,
        context: {
            headers: {
                authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
        },
    });

    if (!initialized) return <p>Loading auth...</p>;

    if (loading) return <p>Loading articles...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const items: ArticleType[] = data?.getArticlesByAuthor || [];

    return (
        <section>
            <h2 className="text-4xl font-bold">Your profile</h2>
            <p>{items[0].author.username}</p>
            <h2 className="text-3xl text-center font-bold mt-4">Your articles</h2>
            <div className="space-y-4 mt-2">
                {items.map((article) => (
                    <ArticleCard
                        key={article.id}
                        id={article.id}
                        slug={article.slug}
                        title={article.title}
                        text={article.text}
                        author={article.author}
                        createdAt={article.createdAt}
                        updatedAt={article.updatedAt}
                        likesCount={article.likesCount}
                    />
                ))}
            </div>
        </section>
    );
}