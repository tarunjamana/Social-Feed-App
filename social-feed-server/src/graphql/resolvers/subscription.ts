import { Context } from "../../types/context";
import { PostArgs, CommentArgs, LikeArgs,NotificationArgs } from "../../types/data";

export interface PostIdArgs {
  postId: string;
}

export const newPostSubscriptions = {
  Subscription: {
    newPost: {
      subscribe: (parent: unknown, args: unknown, context: Context) => {
        return context.pubSub.asyncIterableIterator(["NEW_POST"]);
      },
      resolve: (payload: { newPost: PostArgs }) => payload.newPost,
    },
  },
};

export const newCommentSubscriptions = {
  Subscription: {
    newComment: {
      subscribe: (parent: unknown, args: PostIdArgs, context: Context) => {
        const { postId } = args;
        return context.pubSub.asyncIterableIterator([`NEW_COMMENT_${postId}`]);
      },
      resolve: (payload: { newComment: CommentArgs }) => payload.newComment,
    },
  },
};

export const newLikeSubscription = {
  Subscription: {
    newLike: {
      subscribe: (parent: unknown, args: PostIdArgs, context: Context) => {
        const { postId } = args;
        return context.pubSub.asyncIterableIterator([`NEW_LIKE_${postId}`]);
      },
      resolve: (payload: { newLike: LikeArgs }) => payload.newLike,
    },
  },
};

export const newNotificationSubscription = {
  Subscription: {
    newNotification: {
      subscribe: (parent: unknown, args: unknown, context: Context) => {
        const userId = context.userId;
        return context.pubSub.asyncIterableIterator([`NEW_NOTIFICATION_${userId}`])
      },
      resolve: (payload:{newNotification:NotificationArgs}) => payload.newNotification
    },
  },
};
