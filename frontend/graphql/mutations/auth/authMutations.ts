import { gql } from "@apollo/client";

export const CONFIRM_EMAIL = gql`
  mutation confirmEmailChange($token: String!) {
    confirmEmailChange(token: $token)
  }
`;

export const RESET_PASSWORD = gql`
  mutation requestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
      userId
    }
  }
`;

export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($idToken: String!) {
    googleLogin(idToken: $idToken) {
      access_token
      userId
    }
  }
`;

export const REGISTER_USER = gql`
mutation RegisterUser($data: CreateUser!) {
  createUser(data: $data) {
    userId
    access_token
  }
}
`;

export const REFRESH_TOKENS = gql`
  mutation RefreshTokens {
    refreshTokens {
      access_token
      userId
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout($userId: String!) {
    logout(userId: $userId)
  }
`;