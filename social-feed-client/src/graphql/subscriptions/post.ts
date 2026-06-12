import { gql, type TypedDocumentNode } from "@apollo/client";
import type { NewPostSubscriptionResult } from "../../types/feed";

export const NEW_POST: TypedDocumentNode<NewPostSubscriptionResult> = gql`
  subscription NewPost {
    newPost {
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
