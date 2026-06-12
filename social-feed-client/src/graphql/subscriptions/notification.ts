import { gql, type TypedDocumentNode } from "@apollo/client";

import type {NotificationSubscriptionResult} from "../../types/notification"

export const NEW_NOTIFICATION: TypedDocumentNode<NotificationSubscriptionResult> = gql`
subscription NewNotification{
   newNotification{
   id
   fromUserId
   toUserId
   fromUser{
   username
   displayName
   }
   toUser{
   username
   displayName
   }
   type
   isRead
   createdAt
   }
}
`