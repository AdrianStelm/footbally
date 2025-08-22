import ArticleCard from "../../../components/Article";
import client from "../../../apollo-client";
import { gql } from "@apollo/client";
import Link from "next/link";

const GET_ARTICLES_PAGINATED = gql`
  query ArticlesPaginated($page: Int!, $limit: Int!) {
    articlesPaginated(page: $page, limit: $limit) {
      items {
        id
        title
        text
        slug
        author {
          id
          username
        }
        createdAt
        updatedAt
        likesCount
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;

interface Article {
  id: string;
  title: string;
  text: string;
  slug: string;
  author: { id: string; username: string };
  createdAt: string;
  updatedAt: string;
  likesCount: number;
}

interface ArticlesPaginatedData {
  articlesPaginated: {
    items: Article[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export const revalidate = 50;

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 👇 тут ми await searchParams
  const searchParams = await props.searchParams;

  const page = searchParams?.page ? parseInt(searchParams.page as string, 10) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit as string, 10) : 10;

  const { data } = await client.query<ArticlesPaginatedData>({
    query: GET_ARTICLES_PAGINATED,
    variables: { page, limit },
    fetchPolicy: "no-cache",
  });

  if (!data) return <p>Статей немає</p>;

  const { items, totalPages, currentPage } = data.articlesPaginated;

  return (
    <div className="space-y-4">
      {items.map((article) => (
        <ArticleCard
          key={article.id}
          id={article.id}
          slug={article.slug}
          title={article.title}
          text={article.text}
          author={article.author}
          createdAt={new Date(article.createdAt)}
          updatedAt={new Date(article.updatedAt)}
          likesCount={article.likesCount}
        />
      ))}

      {/* Пагінація */}
      <div className="flex items-center gap-2 mt-6">
        {/* Попередня */}
        {currentPage > 1 && (
          <Link
            href={`/articles?page=${currentPage - 1}&limit=${limit}`}
            prefetch={false}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Попередня
          </Link>
        )}

        {/* Номери сторінок */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <Link
            key={pageNumber}
            href={`/articles?page=${pageNumber}&limit=${limit}`}
            prefetch={false}
            className={`px-3 py-1 rounded ${pageNumber === currentPage
                ? "bg-blue-500 text-white font-bold"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {pageNumber}
          </Link>
        ))}

        {/* Наступна */}
        {currentPage < totalPages && (
          <Link
            href={`/articles?page=${currentPage + 1}&limit=${limit}`}
            prefetch={false}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Наступна
          </Link>
        )}
      </div>
    </div>
  );
}
