import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import React from 'react'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';
import NextLink from 'next/link'


interface EditDeletePostButtonsProps {
    id: number
    creatorId: number
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id, creatorId }) => {
    const [_, deletePost] = useDeletePostMutation()
    const [{ data: meData },] = useMeQuery()

    if(meData?.me?.id !== creatorId){
        return null
    }

    return (
            <Box>
                <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`} >
                    <IconButton as={Link} icon={<EditIcon />} aria-label="Edit Post" ml="auto" />
                </NextLink>
                <IconButton icon={<DeleteIcon />} aria-label="Delete Post" ml="auto" onClick={() => { deletePost({ id: id }) }} />
            </Box>

    );
}