import { gql } from "@apollo/client";

export const GET_COMMENTS_BY_ARTICLE = gql`
  query CommentsByArticle($articleId: String!) {
    commentsByArticle(articleId: $articleId) {
      id
      text
      createdAt
      author {
        id
        username
      }
    }
  }
`;

export const SEARCH_ARTICLES_QUERY = gql`
  query SearchArticles($query: String!) {
    searchArticles(query: $query) {
      title
      slug
    }
  }
`;

export const GET_ARTICLES_PAGINATED = gql`
  query ArticlesPaginated($page: Int!, $limit: Int!) {
    articlesPaginated(page: $page, limit: $limit) {
      items {
        id
        title
        slug
        author {
          id
          username
        }
        createdAt
        updatedAt
        likesCount
      content {
        content
        imageUrl
        videoUrl
      }
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;

export const GET_TOP7_POPULAR_ARTICLES = gql`
  query {
    getTopLikedLast7Days {
      id
      title
      slug
      author { id username }
      createdAt
      updatedAt
      likesCount
      content {
        content
        imageUrl
        videoUrl
      }
    }
  }
`;


export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    getArticleBySlug(slug: $slug) {
      id
      title
      slug
      author {
        id
        username
      }
      createdAt
      updatedAt
      likesCount
      content {
        id
        content
        imageUrl
        videoUrl
        order
      }
    }
  }
`;



export const GET_MY_ARTICLES = gql`
  query GetArticlesByAuthor {
    getArticlesByAuthor {
      id
      slug
      title
      author {
        id
        username
      }
      content{
        content
        imageUrl
        order
        videoUrl
      }
      createdAt
      updatedAt
      likesCount
    }
  }
`;

export const GET_MORE_ARTICLES = gql`
query LoadMoreArticles($skip: Int, $take: Int) {
  loadMoreArticles(skip: $skip, take: $take) {
    id
    title
    slug
    createdAt
    author { id username }
    likesCount
          content {
        content
        imageUrl
        videoUrl
        order
      }
  }
}
`;
