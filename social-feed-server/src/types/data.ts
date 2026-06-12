
export interface PostArgs{
 id:string
 content:string
 authorId:string
 author: UserArgs
 likes:LikeArgs[]
 likeCount:number
 isLikedByMe:boolean
 createdAt:string
}

export interface LikeArgs{
    id:string
    userId:string
    postId: string
    createdAt:string
}
export interface UserArgs {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface CommentArgs{
  id:string
  content:string
  authorId:string
  author:UserArgs
  postId: string
  post: PostArgs[]
  createdAt: string
}






export interface NotificationArgs{
 id: string
 fromUserId: string
 toUserId: string
 fromUser: UserArgs
 toUser: UserArgs
 type: "FOLLOW" | "LIKE" | "COMMENT"
 createdAt: string
 relatedPostId: string
 post: PostArgs
 isRead: boolean
}