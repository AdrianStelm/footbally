import ArticleCard from "../../../components/Article";
import client from "../../../apollo/apollo-client";
import Link from "next/link";
import { ArticlesPaginatedDataType, ArticleType } from "../../../types/ArticleTypes";
import { GET_ARTICLES_PAGINATED } from "../../../graphql/queries/article/articleQuries";


export const revalidate = 60;

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const page = searchParams?.page ? parseInt(searchParams.page as string, 10) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit as string, 10) : 10;

  const { data } = await client.query<ArticlesPaginatedDataType>({
    query: GET_ARTICLES_PAGINATED,
    variables: { page, limit },
    fetchPolicy: "no-cache",
  });

  const { items, totalPages, currentPage } = data.articlesPaginated;

  return (
    <div className="space-y-4">
      {items.map((article: ArticleType) => (
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
          content={article.content}
        />
      ))}

      <div className="flex items-center justify-center gap-2 mt-6 text-white">
        {currentPage > 1 && (
          <Link
            href={`/articles?page=${currentPage - 1}&limit=${limit}`}
            prefetch={false}
            className="px-3 py-1 bg-green-800 rounded hover:bg-green-900"
          >
            Previous
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <Link
            key={pageNumber}
            href={`/articles?page=${pageNumber}&limit=${limit}`}
            prefetch={false}
            className={`px-3 py-1 rounded ${pageNumber === currentPage
              ? "bg-green-800 font-bold"
              : "bg-black hover:bg-green-700"
              }`}
          >
            {pageNumber}
          </Link>
        ))}

        {currentPage < totalPages && (
          <Link
            href={`/articles?page=${currentPage + 1}&limit=${limit}`}
            prefetch={false}
            className="px-3 py-1 bg-black rounded hover:bg-green-700"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
