import { gql } from "@apollo/client";

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: String!) {
    deleteArticle(id: $id)
  }
`;

export const LIKE_ARTICLE = gql`
  mutation LikeArticle($data: CreateLikeInput!) {
    LikeArticle(data: $data) {
      id
      likesCount
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($data: CreateCommentInput!) {
    addComment(data: $data) {
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

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id)
  }
`;

export const UPDATE_ARTICLE = gql`
  mutation ChangeArticle($id: String!, $data: UpdateArticleInput!) {
    changeArticle(id: $id, data: $data) {
      id
      title
      content {
        id
        content
        imageUrl
        videoUrl
        order
      }
      updatedAt
    }
  }
`;

export const CREATE_ARTICLE = gql`
  mutation CreateArticle($data: CreateArticleDto!, $files: [Upload!]) {
    createArticle(data: $data, files: $files) {
      id
      title
      slug
    }
  }
`;