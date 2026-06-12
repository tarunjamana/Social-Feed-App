import PostCard from "../components/feed/PostCard";
import PostCardSkeleton from "../components/feed/PostCardSkeleton";
import { useQuery } from "@apollo/client/react";
import { FEED_QUERY } from "../graphql/queries/feed";
import type { Post } from "../types/feed";
import Composer from "../components/feed/Composer";
import { useRef, useEffect, useState } from "react";
import { useSubscription } from "@apollo/client/react";
import { NEW_POST } from "../graphql/subscriptions/post";

const Home = () => {
  const { data, loading, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: { limit: 10 },
  });

  const posts = data?.feed.posts;
  const initializedRef = useRef(false);
  const isFetchingMore = useRef(false)

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const cursor = useRef<string | undefined>(undefined)
  const hasNextPageRef = useRef<boolean |undefined>(undefined)

 const handleFollowToggle = (authorId: string, isFollowedByMe: boolean) => {
  setAllPosts(prev => prev.map(post => {
    if (post.author.id === authorId) {
      return { ...post, isFollowedByMe: !isFollowedByMe }
    }
    return post
  }))
}

const handleLikeToggle = (postId:string,isLikedByMe:boolean) =>{
  setAllPosts(prev => prev.map(post =>{
        if (post.id === postId) {
      return { ...post, isLikedByMe: !isLikedByMe ,likeCount: isLikedByMe ? post.likeCount - 1 : post.likeCount + 1}
    }
    return post
  }))
}

const handleLikeUpdate = (updatedPost: Post) => {
  setAllPosts(prev => prev.map(post => 
    post.id === updatedPost.id ? updatedPost : post
  ))
}

useSubscription(NEW_POST, {
  onData: ({ data }) => {
    const newPost = data.data?.newPost
    if (newPost) {
      setAllPosts((prev) => [newPost,...prev])
    }
  }
})

  useEffect(() => {
    console.log("data seed useEffect")
    if (posts && !initializedRef.current) {
      initializedRef.current = true;
      setAllPosts([...posts]);
      cursor.current = data?.feed.nextCursor ?? undefined
      hasNextPageRef.current = data?.feed.hasNextPage 
     }
  }, [data]);

  useEffect(() => {
    console.log("intersection observer useEffect")
    const observer = new IntersectionObserver(async (entries) => {
      const entry = entries[0];

      if (entry.isIntersecting && !isFetchingMore.current && hasNextPageRef.current) {
        console.log("intersected");
        // do something here
        isFetchingMore.current = true;
        const morePosts = await fetchMore({
          variables: {
            cursor: cursor.current ?? undefined,
            limit: 10,
          },
        });
        console.log(morePosts)
        if (morePosts.data?.feed.posts) {
          setAllPosts((prev) => [...prev, ...morePosts.data!.feed.posts]);
        }
        isFetchingMore.current = false
        cursor.current = morePosts.data?.feed.nextCursor ?? undefined
        hasNextPageRef.current = morePosts.data?.feed.hasNextPage
      }
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

return (
  <div className="max-w-xl mx-auto flex flex-col gap-4 py-6 px-4">
    {loading && allPosts.length === 0 ? (
      <>
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </>
    ) : error ? (
      <p className="text-red-500 text-sm">{error.message}</p>
    ) : (
      <>
        <Composer />
        {allPosts.map((post: Post) => (
          <PostCard key={post.id} post={post} onFollowToggle={handleFollowToggle} onLikeToggle={handleLikeToggle} onLikeUpdate={handleLikeUpdate}/>
        ))}
      </>
    )}
    <div ref={sentinelRef} />
  </div>
);
};

export default Home;
