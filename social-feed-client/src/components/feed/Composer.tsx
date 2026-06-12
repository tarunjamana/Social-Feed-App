import React, { useState } from "react";
import Button from "../ui/Button";
import { useMutation } from "@apollo/client/react";
import { CREATE_POST_MUTATION } from "../../graphql/mutations/post";
import { FEED_QUERY } from "../../graphql/queries/feed";
import useAuthStore from "../../store/authStore";

const Composer = () => {
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState("");
  const user = useAuthStore((s) => s.user);

  const [createPostMutation, { loading, error: mutationError }] =
    useMutation(CREATE_POST_MUTATION, {
      refetchQueries: [{ query: FEED_QUERY, variables: { limit: 10 } }],
    });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      return setError("Post content is required");
    }
    if (postContent.length > 280) {
      return setError("Post content must be under 280 characters");
    }
    await createPostMutation({ variables: { content: postContent } });
    setPostContent("");
    setError("");
  };

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 border-none outline-none bg-transparent leading-relaxed"
          />
        </div>
        {error && <p className="text-red-500 text-xs pl-12">{error}</p>}
        {mutationError && (
          <p className="text-red-500 text-xs pl-12">{mutationError.message}</p>
        )}
        <div className="flex items-center justify-between pl-12">
          <span
            className={`text-xs ${postContent.length > 260 ? "text-red-500" : "text-gray-400"}`}
          >
            {postContent.length} / 280
          </span>
          <Button isLoading={loading} type="submit">
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Composer;
