import { gql, type TypedDocumentNode } from "@apollo/client";
import type {
  LikePostMutationResult,
  UnlikePostMutationResult,
  CreatePostMutationResult,
  FollowUserMutationResult,
  UnFollowUserMutationResult
} from "../../types/post";

export const LIKE_POST_MUTATION: TypedDocumentNode<
  LikePostMutationResult,
  { postId: string }
> = gql`
  mutation LikePost($postId: String!) {
    likePost(postId: $postId) {
      id
      likeCount
      isLikedByMe
    }
  }
`;

export const UNLIKE_POST_MUTATION: TypedDocumentNode<
  UnlikePostMutationResult,
  { postId: string }
> = gql`
  mutation UnlikePost($postId: String!) {
    unlikePost(postId: $postId) {
      id
      likeCount
      isLikedByMe
    }
  }
`;

export const CREATE_POST_MUTATION: TypedDocumentNode<CreatePostMutationResult,{content:string}> = gql`
mutation CreatePost($content:String!){
      createPost(content:$content){
       id
       content
       author{
       id
       username
       displayName
       }
       likeCount
       isLikedByMe
       createdAt
      }
}
`

export const FOLLOW_USER_MUTATION: TypedDocumentNode<FollowUserMutationResult, { followingId: string }> = gql`
  mutation FollowUser($followingId: ID!) {
    followUser(followingId: $followingId)
  }
`

export const UNFOLLOW_USER_MUTATION: TypedDocumentNode<UnFollowUserMutationResult, { followingId: string }> = gql`
  mutation UnFollowUser($followingId: ID!) {
    unfollowUser(followingId: $followingId)
  }
`