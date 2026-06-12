import type { Post } from "./feed"


export interface LikePostMutationResult{
    likePost: Post
}

export interface UnlikePostMutationResult{
    unlikePost: Post
}

export interface CreatePostMutationResult {
     createPost:Post
}

export interface FollowUserMutationResult {
  followUser: boolean
}

export interface UnFollowUserMutationResult {
  unfollowUser: boolean
}
