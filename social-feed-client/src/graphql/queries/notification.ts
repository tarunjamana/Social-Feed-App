import { gql, type TypedDocumentNode } from "@apollo/client";

import type { NotificationQueryResult } from "../../types/notification";

export const NOTIFICATIONS_QUERY: TypedDocumentNode<NotificationQueryResult> = gql`
query Notifications{
     notifications{
       id 
       fromUserId
       toUserId
       fromUser{
       displayName
       }
       toUser{
       displayName
       }
       relatedPostId
       type
       post{
       id
       content
       }
       isRead
       createdAt
     }
}
`