import prismaClient from "../../lib/prisma";
import { Context } from "../../types/context";
import { PostArgs } from "../../types/data";

export interface CreatePostArgs {
  content: string;
}

export interface PostIdArgs {
  postId: string;
}

export interface FeedArgs {
  cursor?: string;
  limit?: number;
}

const postResolvers = {
  Query: {
    feed: async (_parent: unknown, args: FeedArgs, context: Context) => {
      const userId = context.userId;
      const { cursor, limit } = args;
      if (userId === null) throw new Error("Not authenticated");
      const take = limit ?? 10;
      const posts = await prismaClient.post.findMany({
        where: {
          OR: [
            { authorId: userId },
            { author: { following: { some: { followerId: userId } } } },
          ],
        },
        take: take + 1,
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1,
        }),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          likes: true,
        },
      });
      const hasNextPage = posts.length > take;
      if (hasNextPage) posts.pop();
      if (!posts) throw new Error("posts not found");
      const nextCursor = hasNextPage
        ? (posts[posts.length - 1]?.id ?? null)
        : null;
      return { posts, nextCursor, hasNextPage };
    },
  },
  Mutation: {
    createPost: async (
      _parent: unknown,
      args: CreatePostArgs,
      context: Context,
    ) => {
      const userId = context.userId;
      const { content } = args;
      if (userId === null) throw new Error("Not authenticated");

      if (content.length > 280)
        throw new Error("Post content exceeds 280 characters");

      const post = await prismaClient.post.create({
        data: {
          content,
          authorId: userId,
        },
        include: {
          author: true,
          likes: true,
        },
      });

      context.pubSub.publish("NEW_POST", { newPost: post });
      return post;
    },
    deletePost: async (
      _parent: unknown,
      args: PostIdArgs,
      context: Context,
    ) => {
      const userId = context.userId;
      const { postId } = args;
      if (userId === null) throw new Error("Not authenticated");
      const post = await prismaClient.post.findUnique({
        where: { id: postId },
      });
      if (!post) throw new Error("Post not found");
      if (post.authorId !== userId) throw new Error("Not authorized");
      await prismaClient.post.delete({ where: { id: postId } });
      return true;
    },
    likePost: async (_parent: unknown, args: PostIdArgs, context: Context) => {
      const userId = context.userId;
      const { postId } = args;
      if (userId === null) throw new Error("Not authenticated");

      const like = await prismaClient.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (!like) {
        await prismaClient.like.create({
          data: { userId, postId },
        });
      }

      const updatedPost = await prismaClient.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
          likes: true,
        },
      });
      if (!updatedPost) throw new Error("Post not found");

      const notification = await prismaClient.notification.create({
        data: {
          fromUserId: userId,
          toUserId: updatedPost.author.id,
          type: "LIKE",
        },
        include: { fromUser: true, toUser: true },
      });
      context.pubSub.publish(`NEW_NOTIFICATION_${updatedPost.author.id}`, {
        newNotification: notification,
      });
      context.pubSub.publish(`NEW_LIKE_${postId}`, { newLike: updatedPost });
      return updatedPost;
    },
    unlikePost: async (
      _parent: unknown,
      args: PostIdArgs,
      context: Context,
    ) => {
      const userId = context.userId;
      const { postId } = args;
      if (userId === null) throw new Error("Not authenticated");
      await prismaClient.like.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });
      const updatedPost = await prismaClient.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
          likes: true,
        },
      });
      if (!updatedPost) throw new Error("Post not found");
      context.pubSub.publish(`NEW_LIKE_${postId}`, { newLike: updatedPost });
      return updatedPost;
    },
  },
  Post: {
    likeCount: (parent: PostArgs) => {
      const likes = parent.likes;

      return likes.length;
    },
    isLikedByMe: (parent: PostArgs, args: unknown, context: Context) => {
      const userId = context.userId;
      if (userId === null) throw new Error("Not authenticated");
      const likes = parent.likes;

      const isLikedByMe = likes.filter((like) => like.userId === userId);

      return isLikedByMe.length > 0 ? true : false;
    },
    isFollowedByMe: async (
      parent: PostArgs,
      args: unknown,
      context: Context,
    ) => {
      const userId = context.userId;
      if (userId === null) throw new Error("Not authenticated");

      const authorId = parent.author.id;

      const follow = await prismaClient.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: authorId,
          },
        },
      });

      return follow !== null ? true : false;
    },
  },
};

export default postResolvers;
