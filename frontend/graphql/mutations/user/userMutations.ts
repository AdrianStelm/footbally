import { gql } from "@apollo/client";

export const UPDATE_USERNAME = gql`
  mutation updateUserData($data: UpdateUser!) {
    updateUser(data: $data) {
      username
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword($inputedPassword: String!, $newPassword: String!) {
    changePassword(inputedPassword: $inputedPassword, newPassword: $newPassword)
  }
`;

export const REQUEST_EMAIL_CHANGE = gql`
  mutation requestEmailChange($newEmail: String!) {
    requestEmailChange(newEmail: $newEmail)
  }
`;

export const NEW_PASSWORD = gql`
  mutation passwordReset($token: String!, $newPassword: String!) {
    passwordReset(token: $token, newPassword: $newPassword)
  }
`