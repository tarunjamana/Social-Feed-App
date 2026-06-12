import prismaClient from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Context } from "../../types/context";

export interface RegisterArgs {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface LoginArgs {
    email:string
    password:string
}

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

if (!accessTokenSecret || !refreshTokenSecret) {
  throw new Error("JWT secrets are not defined in environment variables")
}

if(!accessTokenExpiry || !refreshTokenExpiry){
throw new Error("expiries are not defined in environment variables")
}


const authResolvers = {
  Query : {
   me: async (_parent: unknown,args: unknown,context: Context) => {
    const {userId} = context
    if(!userId) return null
     const user = await prismaClient.user.findUnique({
        where: {id:userId}
    })
    return user
   }
  },

  Mutation: {
    register: async (_parent: unknown, args: RegisterArgs) => {
      const { username, email, password, displayName } = args;

      const isEmailTaken = await prismaClient.user.findUnique({
        where: { email },
      });
      if (isEmailTaken) {
        throw new Error("email is already in use");
      }
      const isUserNameTaken = await prismaClient.user.findUnique({
        where: { username },
      });
      if (isUserNameTaken) {
        throw new Error("Username already taken");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prismaClient.user.create({
        data: {
          username,
          email,
          passwordHash,
          displayName,
        },
      });
      const accessToken =  jwt.sign(
        {
          userId: user.id,
          email,
        },
        accessTokenSecret,
        {
            expiresIn:accessTokenExpiry as any
        }
      );

      const refreshToken =  jwt.sign(
        {
          userId: user.id,
          email,
        },
        refreshTokenSecret,
        {
            expiresIn:refreshTokenExpiry as any
        }
      );

      await prismaClient.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return {accessToken,user}
    },
    login: async(_parent:unknown,args:LoginArgs) => {
        const {email,password} = args

        const user = await prismaClient.user.findUnique({
        where: { email },
      });

            if (!user) {
        throw new Error("Invalid email or password");
      }
      const isPasswordCorrect = await bcrypt.compare(password,user.passwordHash)
      if(!isPasswordCorrect){
        throw new Error("Invalid email or password");
      }

       const accessToken =  jwt.sign(
        {
          userId: user.id,
          email,
        },
        accessTokenSecret,
        {
            expiresIn:accessTokenExpiry as any
        }
      );

      const refreshToken =  jwt.sign(
        {
          userId: user.id,
          email,
        },
        refreshTokenSecret,
        {
            expiresIn:refreshTokenExpiry as any
        }
      );

           await prismaClient.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return {accessToken,user}
    }
  },
};

export default authResolvers