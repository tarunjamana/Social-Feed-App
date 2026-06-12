import { gql } from "graphql-tag";

export const userDefs = gql `
   type User {
   id: String!
   username: String!
   email: String!
   displayName: String
   bio: String
   avatar: String
   createdAt: String
   }
`

export const authDefs = gql`
type AuthPayload {
accessToken: String!
user: User!
}
`

