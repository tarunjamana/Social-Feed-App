import { gql, type TypedDocumentNode } from "@apollo/client";

import type { CreateCommentMutationResult ,DeleteCommentMutationResult} from "../../types/comment";

export const CREATE_COMMENT_MUTATION: TypedDocumentNode<
  CreateCommentMutationResult,
  { postId: string; content: string }
> = gql`
  mutation CreateComment($postId: String!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      id
      content
      author {
        id
        displayName
        username
      }
      createdAt
    }
  }
`;


export const DELETE_COMMENT_MUTATION: TypedDocumentNode<DeleteCommentMutationResult,{commentId:string}> = gql`
mutation DeleteComment($commentId:String!){
     deleteComment(commentId:$commentId)
}
`