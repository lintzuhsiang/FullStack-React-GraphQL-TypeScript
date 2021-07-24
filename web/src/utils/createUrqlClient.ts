import { dedupExchange, Exchange, fetchExchange } from "urql";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
} from "../generated/graphql";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import Router from "next/router";
import { stringifyVariables } from "@urql/core";
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
    // console.log("allField", allFields);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    // console.log('fieldInfo',fieldInfos)
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }


    // check data is in the cache, and return it
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string,"posts");
    info.partial = !isItInTheCache
    const results: string[] = []
    // console.log('fieldArgs',fieldArgs)
    // console.log('partial',info.partial)
    let hasMore = true;
    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = cache.resolve(key,"posts") as string[];
      const _hasMore = cache.resolve(key,"hasMore")
      // console.log("data",key, hasMore, data);
      if(!_hasMore){
        hasMore = _hasMore as boolean;
      }
      results.push(...data)
    });

    return  {hasMore, posts:results,__typename:"PaginatedPosts"};
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys:{
        PaginatedPosts: () =>  null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
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
});

// export default createUrqlClient;
