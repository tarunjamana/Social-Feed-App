import type { User } from "./auth"
import type { Post } from "./feed"

export interface Notification{
 id: string
 fromUserId: string
 toUserId: string
 fromUser: User
 toUser: User
 type: "FOLLOW" | "LIKE" | "COMMENT"
 createdAt: string
 relatedPostId?: string
 post?: Post
 isRead: boolean
}

export interface NotificationQueryResult{
 notifications: Notification[]
}

export interface NotificationSubscriptionResult{
    newNotification: Notification
}

export interface MarkAllNotificationsAsRead{
    markNotificationAsRead: boolean
}