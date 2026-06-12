import { gql } from "graphql-tag";

export const postDefs = gql`
type Post{
id: String!
content: String!
authorId: String!
author: User!
likes: [Like!]!
likeCount: Int
isLikedByMe: Boolean
createdAt: String
isFollowedByMe:Boolean
}
`

export const likeDefs = gql`
type Like{
id: String!
userId:String!
postId:String!
createdAt:String
}
`

export const paginatedPostsDef = gql`
type PaginatedPosts{
 posts: [Post!]!
 nextCursor: String
 hasNextPage:Boolean!
}
`