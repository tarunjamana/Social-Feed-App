import { gql, type TypedDocumentNode } from "@apollo/client";

import type { LikeSubscriptionResult } from "../../types/feed";

export const NEW_LIKE: TypedDocumentNode<
  LikeSubscriptionResult,
  { postId: string }
> = gql`
  subscription NewLike($postId: String!) {
    newLike(postId: $postId) {
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
  }
`;
