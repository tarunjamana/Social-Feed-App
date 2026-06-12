import { gql, type TypedDocumentNode } from "@apollo/client";
import type { UserProfileQueryResult, SearchUsersQueryResult } from "../../types/profile";

export const USER_PROFILE_QUERY: TypedDocumentNode<UserProfileQueryResult, { username: string }> = gql`
  query UserProfile($username: String!) {
    userProfile(username: $username) {
      user {
        id
        username
        displayName
        bio
        createdAt
      }
      posts {
        id
        content
        author {
          id
          username
          displayName
        }
        likeCount
        isLikedByMe
        createdAt
        isFollowedByMe
      }
      followerCount
      followingCount
      isFollowedByMe
    }
  }
`;

export const SEARCH_USERS_QUERY: TypedDocumentNode<SearchUsersQueryResult, { query: string }> = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      username
      displayName
      bio
    }
  }
`;
