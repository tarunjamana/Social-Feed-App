import prismaClient from "../../lib/prisma";
import { Context } from "../../types/context";

export interface FollowingIdArgs {
  followingId: string;
}

const followResolvers = {
  Mutation: {
    followUser: async (
      parent: unknown,
      args: FollowingIdArgs,
      context: Context,
    ) => {
      const userId = context.userId;
      const { followingId } = args;
      if (userId === null) throw new Error("Not authenticated");

      const follow = await prismaClient.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId,
          },
        },
      });

      if (!follow) {
        await prismaClient.follow.create({
          data: {
            followerId: userId,
            followingId,
          },
        });

        const notification = await prismaClient.notification.create({
          data: {
            fromUserId: userId,
            toUserId: followingId,
            type: "FOLLOW",
          },
          include: { fromUser: true, toUser: true },
        });

        context.pubSub.publish(`NEW_NOTIFICATION_${followingId}`, {
          newNotification: notification,
        });
        return true;
      }

      return false;
    },
    unfollowUser: async (
      parent: unknown,
      args: FollowingIdArgs,
      context: Context,
    ) => {
      const userId = context.userId;
      const { followingId } = args;
      if (userId === null) throw new Error("Not authenticated");

      const follow = await prismaClient.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId,
          },
        },
      });

      if (follow) {
        await prismaClient.follow.delete({
          where: {
            followerId_followingId: {
              followerId: userId,
              followingId,
            },
          },
        });
        return true;
      }

      return false;
    },
  },
};

export default followResolvers;
