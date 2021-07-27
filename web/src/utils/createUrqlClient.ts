import { dedupExchange, Exchange, fetchExchange, gql } from "urql";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
  DeletePostMutationVariables,
} from "../generated/graphql";
import { cacheExchange, Resolver,Cache } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import Router from "next/router";
import { stringifyVariables } from "@urql/core";
import { isServer } from "./isServer";
// import { Resolver, Variables, NullArray } from '../types';

// export type MergeMode = 'before' | 'after';

// export interface PaginationParams {
//   offsetArgument?: string;
//   limitArgument?: string;
//   mergeMode?: MergeMode;
// }

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      })
    );
  };

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    // console.log(entityKey, fieldName);
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    // console.log('fieldInfo',fieldInfos)
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    // check data is in the cache, and return it
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    const results: string[] = [];
    // console.log('fieldArgs',fieldArgs)
    // console.log('partial',info.partial)
    let hasMore = true;
    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      // console.log("data",key, hasMore, data);
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return { hasMore, posts: results, __typename: "PaginatedPosts" };
  };
};

function invalidateAllPosts(cache:Cache){
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter(
    (info) => info.fieldName === "posts"
  );
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "posts", fi.arguments);
  });
  cache.invalidate("Query", "posts", {
    limit: 33,
  });
}

export const createUrqlClient = (ssrExchange: any,ctx:any) => {
  let cookie = ''
  
  if(isServer()){
    // console.log('cookie',ctx.req);
    cookie = ctx?.req?.headers.cookie
  }

  return {
  
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
    headers:cookie ?{
      cookie
    } : undefined
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          deletePost: (_result,_args,cache,_info) =>{
            cache.invalidate({__typename:"Post",id:(_args as DeletePostMutationVariables).id})
          },
          vote: (_result, _args, cache, _info) => {
            const { postId, value } = _args as VoteMutationVariables;
            const data = cache.readFragment(
              gql`
                fragment _ on Post {
                  id
                  points
                  voteStatus
                }
              `,
              { id: postId }
            );
            // console.log('data: ',data)
            if(data){
              if(data.voteStatus===value){
                return
              }
              const newPoints = (data.points as number) + ((!data.voteStatus ? 1 : 2) * value)
              cache.writeFragment(
                gql`
                fragment _ on Post{
                  points
                  voteStatus
                }
                `,
                {id:postId,points:newPoints,voteStatus:value}
              )
            }
            
          },
          

          createPost: (_result, _args, cache, _info) => {
            // console.log('start')
            // console.log(cache.inspectFields("Query"));
            invalidateAllPosts(cache)
            // console.log(cache.inspectFields("Query"));
            // console.log("end");
          },
          logout: (_result, _args, cache, _info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => {
                return { me: null };
              }
            );
          },
          login: (_result, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
            invalidateAllPosts(cache)
          },
          register: (_result, _args, cache, _info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
}};

// export default createUrqlClient;
