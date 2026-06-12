
import authResolvers from "./auth";
import postResolvers from "./post";
import followResolvers from "./follow";
import commentResolvers from "./comment";
import {newPostSubscriptions,newCommentSubscriptions,newLikeSubscription,newNotificationSubscription} from "./subscription";
import notificationResolvers from "./notification";
import profileResolvers from "./profile";

const baseResolvers = {
  Query: {
    hello: () => "Hello from SocialFeed!",
  },
};

export default [baseResolvers,authResolvers,postResolvers,followResolvers,commentResolvers,newPostSubscriptions,newCommentSubscriptions,newLikeSubscription,newNotificationSubscription,notificationResolvers,profileResolvers]