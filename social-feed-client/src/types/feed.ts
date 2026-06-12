import type { User } from "./auth"

export interface Post{
 id:string
 content:string
 authorId:string
 author: User
 likes:Like[]
 likeCount:number
 isLikedByMe:boolean
 createdAt:string
 isFollowedByMe: boolean
}

export interface Like{
    id:string
    userId:string
    postId: string
    createdAt:string
}


export interface FeedQueryResult {
 feed: {
    posts: Post[]
    nextCursor: string | null
    hasNextPage: boolean
  }
}

export interface NewPostSubscriptionResult{
  newPost :Post
}

export interface LikeSubscriptionResult{
  newLike: Post
}