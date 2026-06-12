import { gql } from "graphql-tag";

export const profileDefs = gql`
  type UserProfile {
    user: User!
    posts: [Post!]!
    followerCount: Int!
    followingCount: Int!
    isFollowedByMe: Boolean!
  }
`;
