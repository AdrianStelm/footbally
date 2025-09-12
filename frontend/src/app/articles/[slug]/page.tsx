import { GET_ARTICLE_BY_SLUG } from "../../../../graphql/queries/article/articleQuries";
import client from "../../../../apollo/apollo-client";
import { notFound } from "next/navigation";
import Comments from "../../../../components/Comments";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data } = await client.query({
      query: GET_ARTICLE_BY_SLUG,
      variables: { slug },
      fetchPolicy: "no-cache",
    });

    const article = data?.getArticleBySlug;
    if (!article) return { title: "Article not found" };

    const previewText =
      article.content.find((block: any) => block.content)?.content?.slice(0, 150) ??
      "Read the latest football news";

    return {
      title: article.title,
      description: previewText,
      openGraph: {
        title: article.title,
        description: previewText,
        images: article.content.find((block: any) => block.imageUrl)?.imageUrl
          ? [article.content.find((block: any) => block.imageUrl).imageUrl]
          : [],
      },
    };
  } catch {
    return { title: "Error loading article" };
  }
}


export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const { data } = await client.query({
    query: GET_ARTICLE_BY_SLUG,
    variables: { slug },
    fetchPolicy: "no-cache",
  });

  const article = data?.getArticleBySlug;
  if (!article) return notFound();

  const blocks = [...article.content].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 flex-1 flex justify-center">
      <div className="max-w-3xl w-full space-y-6 text-left">
        <h2 className="text-4xl font-bold">{article.title}</h2>
        <p className="text-gray-600">
          By <span className="font-medium">{article.author.username}</span> |{" "}
          {new Date(article.createdAt).toLocaleDateString()}
        </p>
        <div className="space-y-6">
          {blocks.map((block) => {
            if (block.content) {
              return (
                <p key={block.id} className="leading-relaxed text-lg">
                  {block.content}
                </p>
              );
            }
            if (block.imageUrl) {
              return (
                <Image
                  key={block.id}
                  src={block.imageUrl}
                  alt={article.title}
                  width={625}
                  height={250}
                  className="rounded-lg shadow-md w-full h-auto"
                  priority
                />

              );
            }
            if (block.videoUrl) {
              return (
                <video
                  key={block.id}
                  src={block.videoUrl}
                  controls
                  className="w-full max-w-3xl rounded-lg shadow-md"
                />
              );
            }
            return null;
          })}
        </div>

        <div className="pt-8">
          <Comments articleId={article.id} />
        </div>
      </div>
    </div>
  );
}
