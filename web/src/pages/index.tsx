import {
  Box,
  Button,
  Flex,
  Heading, Link, Stack,
  Text
} from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import React, { useState } from 'react'
import { EditDeletePostButtons } from '../components/EditDeletePostButtons'
import { Layout } from '../components/Layout'
import { UpdootSection } from '../components/UpdootSection'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => {
  const [variables, setVariables] = useState({ cursor: null as null | string, limit: 33 })
  const [{ data, fetching }] = usePostsQuery({
    variables: variables
  });

  // console.log('index varaiables:', variables, data, fetching)
  if (!fetching && !data) {
    return <div>you got no post now </div>
  }



  return (
    <>
      <Layout>
        <Flex align="center">
          <Heading>Shine Website</Heading>

        </Flex>


        {!data && fetching ? (
          <div>loading...</div>
        ) :
          (
            <>
              <Stack spacing={8}>
                {data!.posts.posts.map((p) =>
                  !p ? null : (
                    <Flex key={p.id} p={5} shadow="md" borderWidth="1px">

                      <UpdootSection post={p} />
                      <Box flex={1}>
                        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                          <Link>
                            <Heading fontSize="xl">{p.title}</Heading>
                          </Link>
                        </NextLink>
                        <Text> Posted by {p.creator.username}</Text>
                        <Flex >
                          <Text flex={1} mt={4}>{p.textSnippet}</Text>
                          <Box ml="auto">
                          <EditDeletePostButtons id={p.id}  creatorId={p.creator.id}/>
                          </Box>

                        </Flex>

                      </Box>
                    </Flex>
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

