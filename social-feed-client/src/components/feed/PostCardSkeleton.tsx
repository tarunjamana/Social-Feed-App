const PostCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-3 w-12 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default PostCardSkeleton;
