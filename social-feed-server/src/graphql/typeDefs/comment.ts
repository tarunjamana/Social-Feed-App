import { gql } from "graphql-tag";

export const commentsDef = gql`
type Comment{
id: String!
content: String!
authorId: String!
author: User!
createdAt: String
}
`