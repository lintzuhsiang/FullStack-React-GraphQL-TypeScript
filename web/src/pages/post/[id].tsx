import { withUrqlClient } from 'next-urql'
import React from 'react'
import { createUrqlClient } from '../../utils/createUrqlClient'

import { useRouter } from 'next/router'
import { Layout } from '../../components/Layout'
import { Flex, Heading } from '@chakra-ui/react'
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl'
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons'

// interface [id]Props {

// }

const Post = ({ }) => {
    const router = useRouter()
    const [{ data, error, fetching }] = useGetPostFromUrl();

    if (fetching) {
        return (
            <Layout>
                <div>loading</div>
            </Layout>
        )
    }
    if (error) {
        <div>error</div>
        console.log('error:', error);
    }
    if (!data?.post) {
        return (
            <Layout>
                could not find post here
            </Layout>
        )
    }
    return (
        <Layout>
            <Heading mb={4}>{data?.post?.title}</Heading>
            <Flex align="center">
                {data?.post?.text}
                <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />
            </Flex>
        </Layout>
    )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
