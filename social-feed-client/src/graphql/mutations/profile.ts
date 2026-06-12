import { gql, type TypedDocumentNode } from "@apollo/client";
import type { UpdateProfileMutationResult } from "../../types/profile";

export const UPDATE_PROFILE_MUTATION: TypedDocumentNode<
  UpdateProfileMutationResult,
  { displayName?: string; bio?: string }
> = gql`
  mutation UpdateProfile($displayName: String, $bio: String) {
    updateProfile(displayName: $displayName, bio: $bio) {
      id
      username
      displayName
      bio
      email
      createdAt
    }
  }
`;
