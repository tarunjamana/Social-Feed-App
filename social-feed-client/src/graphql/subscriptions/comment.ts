import { gql, type TypedDocumentNode } from "@apollo/client";

import type { CommentSubscriptionResult } from "../../types/comment";

export const NEW_COMMENT: TypedDocumentNode<
  CommentSubscriptionResult,
  { postId: string }
> = gql`
  subscription NewComment($postId: String!) {
    newComment(postId: $postId) {
      id
      content
      authorId
      author {
        username
        displayName
      }
    }
  }
`;


