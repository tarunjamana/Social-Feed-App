import type { User } from "./auth"

export interface Comment{
    id:string
    content:string
    authorId:string
    author: User
    createdAt:string
}

export interface CommentQueryResult{
    comments: Comment[]
}

export interface CommentSubscriptionResult{
  newComment: Comment
}

export interface CreateCommentMutationResult {
  createComment: Comment
}

export interface DeleteCommentMutationResult {
  deleteComment:boolean
}