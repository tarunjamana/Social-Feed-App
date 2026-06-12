import { gql } from "graphql-tag";



export const notificationDefs= gql`


enum NotificationType {
  FOLLOW
  LIKE
  COMMENT
}

type Notification{
id: String!
fromUserId: String!
toUserId: String
fromUser: User!
toUser: User!
type: NotificationType!
createdAt: String!
relatedPostId: String
post: Post
isRead: Boolean
}
`