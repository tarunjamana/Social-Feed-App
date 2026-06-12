import type { User } from "./auth";
import type { Post } from "./feed";

export interface UserProfile {
  user: User;
  posts: Post[];
  followerCount: number;
  followingCount: number;
  isFollowedByMe: boolean;
}

export interface UserProfileQueryResult {
  userProfile: UserProfile;
}

export interface SearchUsersQueryResult {
  searchUsers: User[];
}

export interface UpdateProfileMutationResult {
  updateProfile: User;
}
