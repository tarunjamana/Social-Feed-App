import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { SEARCH_USERS_QUERY } from "../graphql/queries/profile";
import {
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
} from "../graphql/mutations/post";
import type { User } from "../types/auth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const Search = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();
  const loggedInUserId = useAuthStore().user?.id;
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, loading } = useQuery(SEARCH_USERS_QUERY, {
    variables: { query: debouncedQuery },
    skip: debouncedQuery.length < 2,
  });

  const [followUserMutation] = useMutation(FOLLOW_USER_MUTATION);
  const [unfollowUserMutation] = useMutation(UNFOLLOW_USER_MUTATION);

  const handleFollowToggle = async (user: User) => {
    if (followedIds.has(user.id)) {
      await unfollowUserMutation({ variables: { followingId: user.id } });
      setFollowedIds((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    } else {
      await followUserMutation({ variables: { followingId: user.id } });
      setFollowedIds((prev) => new Set(prev).add(user.id));
    }
  };

  const getInitials = (user: User) =>
    user.displayName
      ? user.displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : user.username.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4 py-6 px-4">
      {/* Search Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people..."
            autoFocus
            className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {/* No results */}
      {!loading && debouncedQuery.length >= 2 && data?.searchUsers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-400 text-sm">
            No users found for &ldquo;{debouncedQuery}&rdquo;
          </p>
        </div>
      )}

      {/* Results */}
      {data?.searchUsers.map((user) => {
        const isFollowed = followedIds.has(user.id);
        return (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3"
          >
            <button
              type="button"
              onClick={() => navigate(`/profile/${user.username}`)}
              className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center shrink-0 hover:ring-2 hover:ring-indigo-300 transition-all"
            >
              {getInitials(user)}
            </button>
            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => navigate(`/profile/${user.username}`)}
                className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors text-left block"
              >
                {user.displayName}
              </button>
              <p className="text-xs text-gray-400">@{user.username}</p>
              {user.bio && (
                <p className="text-xs text-gray-500 truncate mt-0.5">{user.bio}</p>
              )}
            </div>
            {user.id !== loggedInUserId && (
              <button
                type="button"
                onClick={() => handleFollowToggle(user)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
                  isFollowed
                    ? "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500"
                    : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {isFollowed ? "Following" : "Follow"}
              </button>
            )}
          </div>
        );
      })}

      {/* Empty state */}
      {debouncedQuery.length < 2 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-sm font-medium text-gray-600">Find people to follow</p>
          <p className="text-xs text-gray-400 mt-1">Type at least 2 characters</p>
        </div>
      )}
    </div>
  );
};

export default Search;
