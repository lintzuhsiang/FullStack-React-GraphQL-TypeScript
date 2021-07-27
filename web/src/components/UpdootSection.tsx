import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
    const [, vote] = useVoteMutation()

    return (
        <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
            <IconButton aria-label="updoot" icon={<ChevronUpIcon />} w={6} h={6} onClick={async () => {
                if (post.voteStatus === 1) { return }
                setLoadingState("updoot-loading")
                await vote({
                    postId: post.id,
                    value: 1
                })
                setLoadingState("not-loading")

            }}
                isLoading={loadingState === 'updoot-loading'}
            colorScheme={post.voteStatus === 1 ?  "green" : undefined}
            />
            {post.points}
            <IconButton aria-label="downdoot" icon={<ChevronDownIcon />} w={6} h={6} onClick={async () => {
                if (post.voteStatus === -1) { return }
                setLoadingState("downdoot-loading")
                await vote({
                    postId: post.id,
                    value: -1
                })
                setLoadingState("not-loading")
            }}
                colorScheme={post.voteStatus === -1 ?  "red" : undefined}
                isLoading={loadingState === 'downdoot-loading'}
            // isLoading={fetching && operation?.variables?.value === -1}
            />
        </Flex>
    );
}

