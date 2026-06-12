import { gql, type TypedDocumentNode } from "@apollo/client";

import type { MarkAllNotificationsAsRead } from "../../types/notification";


export const MARK_NOTIFICATIONS_AS_READ: TypedDocumentNode<MarkAllNotificationsAsRead> = gql`
mutation MarkNotificationAsRead{
    markNotificationAsRead
}
`