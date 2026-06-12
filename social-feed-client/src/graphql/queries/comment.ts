import { gql, type TypedDocumentNode } from "@apollo/client";


import type { CommentQueryResult } from "../../types/comment";

export const COMMENT_QUERY: TypedDocumentNode<CommentQueryResult,{postId:string}> = gql`
query Comments($postId:String!){
       comments(postId:$postId){
          id 
          content
          authorId
          author { username displayName }        
       }
  }

`