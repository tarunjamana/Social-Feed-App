import prismaClient from "../../lib/prisma";
import { Context } from "../../types/context";



const notificationResolvers = {
  Query: {
    notifications: async (parent: unknown, args: unknown, context: Context) => {
      const userId = context.userId;

      if (userId === null) throw new Error("Not authenticated");

      const notifications = await prismaClient.notification.findMany({
        where: {
          toUserId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          fromUser: true,
          toUser: true,
        },
      });

      return notifications;
    },
  },
  Mutation: {
    markNotificationAsRead: async (
      parent: unknown,
      args: unknown,
      context: Context,
    ) => {
      const userId = context.userId;
        
      if (userId === null) throw new Error("Not authenticated");

      await prismaClient.notification.updateMany({
        where:{
           toUserId:userId,
           isRead:false,
           },
           data:{
            isRead:true
           }
      })
      return true
    },
  },
};

export default notificationResolvers;
