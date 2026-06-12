import prismaClient from "../../lib/prisma";
import { Context } from "../../types/context";

interface UserProfileArgs {
  username: string;
}

interface SearchUsersArgs {
  query: string;
}

interface UpdateProfileArgs {
  displayName?: string;
  bio?: string;
}

const profileResolvers = {
  Query: {
    userProfile: async (parent: unknown, args: UserProfileArgs, context: Context) => {
      const userId = context.userId;
      if (userId === null) throw new Error("Not authenticated");

      const user = await prismaClient.user.findUnique({
        where: { username: args.username },
        include: {
          posts: {
            orderBy: { createdAt: "desc" },
            include: { author: true, likes: true },
          },
          _count: { select: { followers: true, following: true } },
        },
      });

      if (!user) throw new Error("User not found");

      const follow = await prismaClient.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: user.id,
          },
        },
      });

      return {
        user,
        posts: user.posts,
        // followers = Follow rows where followingId=user.id (incoming follows)
        followerCount: user._count.following,
        // following = Follow rows where followerId=user.id (outgoing follows)
        followingCount: user._count.followers,
        isFollowedByMe: follow !== null,
      };
    },

    searchUsers: async (parent: unknown, args: SearchUsersArgs, context: Context) => {
      const userId = context.userId;
      if (userId === null) throw new Error("Not authenticated");

      return await prismaClient.user.findMany({
        where: {
          OR: [
            { username: { contains: args.query, mode: "insensitive" } },
            { displayName: { contains: args.query, mode: "insensitive" } },
          ],
          NOT: { id: userId },
        },
        take: 20,
      });
    },
  },

  Mutation: {
    updateProfile: async (parent: unknown, args: UpdateProfileArgs, context: Context) => {
      const userId = context.userId;
      if (userId === null) throw new Error("Not authenticated");

      return await prismaClient.user.update({
        where: { id: userId },
        data: {
          ...(args.displayName !== undefined && { displayName: args.displayName }),
          ...(args.bio !== undefined && { bio: args.bio }),
        },
      });
    },
  },
};

export default profileResolvers;
