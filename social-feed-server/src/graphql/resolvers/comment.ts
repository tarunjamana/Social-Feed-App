import prismaClient from "../../lib/prisma";
import { Context } from "../../types/context";

export interface CreateCommentArgs {
  postId: string;
  content: string;
}

export interface CommentArgs {
  postId: string;
}

export interface DeleteCommentArgs {
  commentId: string;
}

const commentResolvers = {
  Query: {
    comments: async (parent: unknown, args: CommentArgs, context: Context) => {
      const userId = context.userId;
      const { postId } = args;
      if (userId === null) throw new Error("Not authenticated");
      const comments = await prismaClient.comment.findMany({
        where: { postId },
        orderBy: {
          createdAt: "asc",
        },
        include: { author: true }
      });
      return comments
    },
  },
  Mutation: {
    createComment: async (
      parent: unknown,
      args: CreateCommentArgs,
      context: Context,
    ) => {
      const userId = context.userId;
      const { postId, content } = args;
      if (userId === null) throw new Error("Not authenticated");

      const post = await prismaClient.post.findUnique({
        where: { id: postId },
      });
      if (!post) throw new Error("Post not found");

      if (content.length > 280)
        throw new Error("Post content exceeds 280 characters");

      const comment = await prismaClient.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
        include: {
          author: true,
          post: true,
        },
      });

      context.pubSub.publish(`NEW_COMMENT_${postId}`, { newComment: comment })
      return comment;
    },
    deleteComment: async (
      parent: unknown,
      args: DeleteCommentArgs,
      context: Context,
    ) => {
      const userId = context.userId;
      const { commentId } = args;
      if (userId === null) throw new Error("Not authenticated");

      const comment = await prismaClient.comment.findUnique({
        where: { id: commentId },
      });
      if (!comment) throw new Error("Comment not found");

      if (comment.authorId !== userId) throw new Error("Not authorized");

      await prismaClient.comment.delete({ where: { id: commentId } });

      return true;
    },
  },
};

export default commentResolvers;
