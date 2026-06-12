import { gql, type TypedDocumentNode } from "@apollo/client";

import type { FeedQueryResult } from "../../types/feed";

export const FEED_QUERY: TypedDocumentNode<
  FeedQueryResult,
  { cursor?: string; limit?: number }
> = gql`
 query Feed($cursor:String,$limit:Int){
      feed(cursor:$cursor,limit:$limit){
       posts{
       id
       content
       author{
       id
       username
       displayName
       }
       likeCount
       isLikedByMe
       createdAt
       isFollowedByMe
       }
       nextCursor
       hasNextPage
      }
 }
`;
