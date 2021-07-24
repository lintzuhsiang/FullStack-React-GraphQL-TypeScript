import {
  Box,
  Button,
  Flex,
  Heading,
  Link, Stack,
  Text
} from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import NextLink from 'next/link'

const Index = () => {
  const [variables, setVariables] = useState({ cursor: null as null | string, limit: 33})
  const [{ data, fetching }] = usePostsQuery({
    variables: variables
  });

  console.log('index varaiables:', variables, data, fetching)
  if (!fetching && !data) {
    return <div>you got no post now </div>
  }
  return (
    <>
      <Layout>
        <Flex align="center">
          <Heading>Shine Website</Heading>
          <NextLink href="/create-post">
            <Link ml="auto">
              create Post
            </Link>
          </NextLink>
        </Flex>
        <br />

        <Box>fetching: {fetching}</Box>
        {!data && fetching ? (
          <div>loading...</div>
        ) :
          (
            <>
              <Stack spacing={8}>
                  {data!.posts.posts.map((p) => (
                    // <Flex>
                      <Box key={p.id} p={5} shadow="md" borderWidth="1px"> 
                        <Heading fontSize="xl">{p.title}</Heading> 
                        <Text mt={4}>{p.textSnippet}</Text>
                       </Box>
                    // {/* // </Flex> */}
                  ))}
              </Stack>
            </>
          )
        }
        {data && data.posts.hasMore ? (
          <Flex >
            <Button isLoading={fetching} my={4} m="auto" onClick={() => { setVariables({ limit: variables.limit, cursor: data.posts.posts[data.posts.posts.length - 1].createdAt }) }}>Load more...</Button>
          </Flex>) : null}
      </Layout>
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
