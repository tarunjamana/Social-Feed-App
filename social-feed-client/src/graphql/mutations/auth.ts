import { gql, type TypedDocumentNode } from "@apollo/client";
import type {
  LoginMutationResult,
  RegisterMutationResult,
} from "../../types/auth";

export const LOGIN_MUTATION: TypedDocumentNode<
  LoginMutationResult,
  { email: string; password: string }
> = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        username
        email
        displayName
      }
    }
  }
`;

export const REGISTER_MUTATION: TypedDocumentNode<
  RegisterMutationResult,
  { username: string; email: string; password: string; displayName: string }
> = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $displayName: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      displayName: $displayName
    ) {
      accessToken
      user {
        id
        username
        email
        displayName
      }
    }
  }
`;
