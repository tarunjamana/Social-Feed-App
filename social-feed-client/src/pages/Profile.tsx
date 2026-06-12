import { useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useQuery, useMutation } from "@apollo/client/react";
import { USER_PROFILE_QUERY } from "../graphql/queries/profile";
import { UPDATE_PROFILE_MUTATION } from "../graphql/mutations/profile";
import {
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
} from "../graphql/mutations/post";
import PostCard from "../components/feed/PostCard";
import PostCardSkeleton from "../components/feed/PostCardSkeleton";
import type { Post } from "../types/feed";
import { useState, useEffect } from "react";
import React from "react";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user: loggedInUser, updateUser } = useAuthStore();
  const isOwnProfile = loggedInUser?.username === username;

  const { data, loading, error } = useQuery(USER_PROFILE_QUERY, {
    variables: { username: username! },
    skip: !username,
  });

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isFollowedByMe, setIsFollowedByMe] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editBio, setEditBio] = useState("");

  const [followUserMutation] = useMutation(FOLLOW_USER_MUTATION);
  const [unfollowUserMutation] = useMutation(UNFOLLOW_USER_MUTATION);
  const [updateProfileMutation, { loading: updateLoading }] = useMutation(
    UPDATE_PROFILE_MUTATION
  );

  useEffect(() => {
    if (data?.userProfile) {
      setAllPosts(data.userProfile.posts);
      setIsFollowedByMe(data.userProfile.isFollowedByMe);
      setFollowerCount(data.userProfile.followerCount);
      setEditDisplayName(data.userProfile.user.displayName ?? "");
      setEditBio(data.userProfile.user.bio ?? "");
    }
  }, [data]);

  const handleFollowToggle = async () => {
    if (!data?.userProfile.user.id) return;
    if (isFollowedByMe) {
      await unfollowUserMutation({
        variables: { followingId: data.userProfile.user.id },
      });
      setIsFollowedByMe(false);
      setFollowerCount((prev) => prev - 1);
    } else {
      await followUserMutation({
        variables: { followingId: data.userProfile.user.id },
      });
      setIsFollowedByMe(true);
      setFollowerCount((prev) => prev + 1);
    }
  };

  const handlePostFollowToggle = (
    authorId: string,
    wasFollowedByMe: boolean
  ) => {
    setAllPosts((prev) =>
      prev.map((post) =>
        post.author.id === authorId
          ? { ...post, isFollowedByMe: !wasFollowedByMe }
          : post
      )
    );
  };

  const handleLikeToggle = (postId: string, isLikedByMe: boolean) => {
    setAllPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLikedByMe: !isLikedByMe,
              likeCount: isLikedByMe ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post
      )
    );
  };

  const handleLikeUpdate = (updatedPost: Post) => {
    setAllPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: updateData } = await updateProfileMutation({
      variables: { displayName: editDisplayName, bio: editBio },
    });
    if (updateData?.updateProfile) {
      updateUser(updateData.updateProfile);
    }
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto flex flex-col gap-4 py-6 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-24" />
            </div>
          </div>
        </div>
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto py-6 px-4">
        <p className="text-red-500 text-sm">{error?.message ?? "User not found"}</p>
      </div>
    );
  }

  const { user, followingCount } = data.userProfile;
  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.username.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4 py-6 px-4">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 text-xl font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{user.displayName}</p>
              <p className="text-sm text-gray-400">@{user.username}</p>
              {user.bio && (
                <p className="text-sm text-gray-600 mt-1 max-w-xs">{user.bio}</p>
              )}
            </div>
          </div>
          {isOwnProfile ? (
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="text-sm font-semibold px-4 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
            >
              Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFollowToggle}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-colors shrink-0 ${
                isFollowedByMe
                  ? "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500"
                  : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {isFollowedByMe ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-5 pt-4 border-t border-gray-50">
          <div>
            <p className="text-sm font-bold text-gray-900">{allPosts.length}</p>
            <p className="text-xs text-gray-400">Posts</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{followerCount}</p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{followingCount}</p>
            <p className="text-xs text-gray-400">Following</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      {allPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-2xl mb-2">✍️</p>
          <p className="text-sm text-gray-400">No posts yet</p>
        </div>
      ) : (
        allPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onFollowToggle={handlePostFollowToggle}
            onLikeToggle={handleLikeToggle}
            onLikeUpdate={handleLikeUpdate}
            hideFollowButton
          />
        ))
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Tell people about yourself..."
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {updateLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
