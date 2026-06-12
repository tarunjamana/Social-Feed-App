import type { Post } from "../../types/feed";
import {
  LIKE_POST_MUTATION,
  UNLIKE_POST_MUTATION,
  FOLLOW_USER_MUTATION,
  UNFOLLOW_USER_MUTATION,
} from "../../graphql/mutations/post";
import { useMutation, useQuery } from "@apollo/client/react";
import useAuthStore from "../../store/authStore";
import React, { useState } from "react";
import { COMMENT_QUERY } from "../../graphql/queries/comment";
import CommentSkeleton from "./CommentSkeleton";
import {
  CREATE_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
} from "../../graphql/mutations/comment";
import { useSubscription } from "@apollo/client/react";
import {NEW_COMMENT} from '../../graphql/subscriptions/comment'
import {NEW_LIKE} from '../../graphql/subscriptions/like'
import { useNavigate } from "react-router-dom";

const PostCard = ({
  post,
  onFollowToggle,
  onLikeToggle,
  onLikeUpdate,
  hideFollowButton = false,
}: {
  post: Post;
  onFollowToggle: (authorId: string, isFollowedByMe: boolean) => void;
  onLikeToggle:(postId:string,isLikedByMe:boolean) => void;
  onLikeUpdate:(updatedPost:Post) => void;
  hideFollowButton?: boolean;
}) => {
  const navigate = useNavigate();
  const {
    id,
    content,
    createdAt,
    likeCount,
    isLikedByMe,
    isFollowedByMe,
    author: { id: authorId, username, displayName },
  } = post;

  const [likePostMutation, { error: mutationErrorLike }] =
    useMutation(LIKE_POST_MUTATION);
  const [unlikePostMutation, { error: mutationErrorUnlike }] =
    useMutation(UNLIKE_POST_MUTATION);
  const [followUserMutation, { error: mutationErrorFollowUser }] =
    useMutation(FOLLOW_USER_MUTATION);
  const [unfollowUserMutation, { error: mutationErrorUnFollowUser }] =
    useMutation(UNFOLLOW_USER_MUTATION);

  const loggedInUserId = useAuthStore().user?.id;
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState("");

  const { data, loading, error } = useQuery(COMMENT_QUERY, {
    variables: { postId: id },
    skip: !isCommentsOpen,
  });

  const [
    createCommentMutation,
    { loading: commentLoading, error: mutationError },
  ] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [{ query: COMMENT_QUERY, variables: { postId: id } }],
  });

  const [
    deleteCommentMutation,
    { loading: deleteCommentLoading, error: deleteMutationError },
  ] = useMutation(DELETE_COMMENT_MUTATION, {
    refetchQueries: [{ query: COMMENT_QUERY, variables: { postId: id } }],
  });

  useSubscription(NEW_COMMENT, {
    variables: { postId: id },
    skip: !isCommentsOpen,
    onData: ({ client }) => {
      client.refetchQueries({
        include: [COMMENT_QUERY],
      });
    },
  });



  useSubscription(NEW_LIKE, {
    variables: {postId:id},
  onData: ({ data }) => {
    const newPost = data.data?.newLike
    if (newPost) onLikeUpdate(newPost)
  }
})

  const handleLike = async () => {
    // optimistic update — fires immediately before server responds
    onLikeToggle(id, isLikedByMe);
    if (isLikedByMe) {
      await unlikePostMutation({ variables: { postId: id } });
    } else {
      await likePostMutation({ variables: { postId: id } });
    }
  };

  const handleFollow = async () => {
    if (isFollowedByMe) {
      await unfollowUserMutation({ variables: { followingId: authorId } });
    } else {
      await followUserMutation({ variables: { followingId: authorId } });
    }
    onFollowToggle(authorId, isFollowedByMe);
  };

  const handleCommentSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return setCommentError("Comment is required");
    if (commentContent.length > 280)
      return setCommentError("Comment must be under 280 characters");
    await createCommentMutation({
      variables: { postId: id, content: commentContent },
    });
    setCommentContent("");
    setCommentError("");
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation({ variables: { commentId } });
  };

  if (displayName === undefined) {
    return;
  }

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(`/profile/${username}`)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-400">@{username}</p>
          </div>
        </button>
        <div className="flex items-center gap-2">
          {(mutationErrorFollowUser || mutationErrorUnFollowUser) && (
            <p className="text-red-500 text-xs">
              {mutationErrorFollowUser?.message ||
                mutationErrorUnFollowUser?.message}
            </p>
          )}
          {!hideFollowButton && authorId !== loggedInUserId && (
            <button
              type="button"
              onClick={handleFollow}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                isFollowedByMe
                  ? "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500"
                  : "border-indigo-500 text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {isFollowedByMe ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-800 leading-relaxed">{content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-50">
        <span>
          {new Date(Number(createdAt)).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <div className="flex items-center gap-3">
          {(mutationErrorLike || mutationErrorUnlike) && (
            <p className="text-red-500 text-xs">
              {mutationErrorLike?.message || mutationErrorUnlike?.message}
            </p>
          )}
          <button
            type="button"
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="flex items-center gap-1 text-gray-400 hover:text-indigo-500 transition-colors"
          >
            💬 {isCommentsOpen ? "Hide" : "Comments"}
          </button>
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1 transition-colors ${isLikedByMe ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
          >
            {isLikedByMe ? "❤️" : "🤍"} {likeCount}
          </button>
        </div>
      </div>

      {/* Comments section */}
      {isCommentsOpen && (
        <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
          {/* Comment composer */}
          <form
            onSubmit={handleCommentSubmit}
            className="flex gap-2 items-start"
          >
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="flex-1 resize-none text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="px-3 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {commentLoading ? "..." : "Post"}
            </button>
          </form>
          {commentError && (
            <p className="text-red-500 text-xs">{commentError}</p>
          )}
          {mutationError && (
            <p className="text-red-500 text-xs">{mutationError.message}</p>
          )}

          {/* Comments list */}
          {loading && <CommentSkeleton />}
          {!loading && data?.comments.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">
              No comments yet — be the first!
            </p>
          )}
          {deleteMutationError && (
            <p className="text-red-500 text-xs">
              {deleteMutationError.message}
            </p>
          )}
          {error && <p className="text-red-500 text-xs">{error.message}</p>}
          {data?.comments.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col gap-1 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-gray-800">
                    {comment.author.displayName}
                  </p>
                  <p className="text-xs text-gray-400">
                    @{comment.author.username}
                  </p>
                </div>
                {comment.authorId === loggedInUserId && (
                  <button
                    type="button"
                    disabled={deleteCommentLoading}
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
