import { PubSub } from "graphql-subscriptions"

export interface Context {
  userId: string | null
  pubSub:PubSub
}