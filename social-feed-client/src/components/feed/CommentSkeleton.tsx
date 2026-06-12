const CommentSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 py-2 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-12 bg-gray-200 rounded" />
      </div>
      <div className="h-3 w-full bg-gray-200 rounded" />
      <div className="h-3 w-3/4 bg-gray-200 rounded" />
    </div>
  );
};

export default CommentSkeleton;
