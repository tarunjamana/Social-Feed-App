import { gql } from "graphql-tag";
import { authDefs ,userDefs} from "./auth";
import { postDefs,likeDefs,paginatedPostsDef } from "./post";
import { commentsDef } from "./comment";
import {notificationDefs} from "./notification"
import { profileDefs } from "./profile"

const baseDefs = gql`
  type Query {
    hello: String
    me: User
    feed(cursor:String,limit:Int):PaginatedPosts!
    comments(postId: String!): [Comment!]!
    notifications:[Notification!]!
    userProfile(username: String!): UserProfile!
    searchUsers(query: String!): [User!]!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      displayName: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createPost(content: String!):Post!
    deletePost(postId: String!): Boolean!
    likePost(postId:String!): Post!
    unlikePost(postId:String!): Post!
    followUser(followingId: ID!): Boolean!
    unfollowUser(followingId: ID!): Boolean!
    createComment(postId: String! ,content: String!): Comment!
    deleteComment(commentId: String!):Boolean!
    markNotificationAsRead:Boolean!
    updateProfile(displayName: String, bio: String): User!
  }
  type Subscription{
  newPost: Post!
  newComment(postId: String!): Comment!
  newLike(postId: String!): Post!
  newNotification: Notification!
  }
`;

export default [baseDefs,authDefs,userDefs,postDefs,likeDefs,paginatedPostsDef,commentsDef,notificationDefs,profileDefs];
