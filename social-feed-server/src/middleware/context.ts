
import { Request } from "express"
import jwt from "jsonwebtoken"
import { Context } from "../types/context"
import { PubSub } from "graphql-subscriptions"

export const contextMiddleware = (req: Request,pubSub:PubSub): Context => {
const authHeader = req.headers.authorization

const token = authHeader?.split(" ")[1]

if (!token) return { userId: null,pubSub}

try {
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string }
  return { userId: decoded.userId ,pubSub}
} catch {
  return { userId: null, pubSub }
}

}