import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router'
interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const router = useRouter()
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    })
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
    let body = null;


    if (fetching) {

    } else if (!data?.me) {
        body = (
            <>
                <NextLink href='/login'>
                    <Link mr={4}>Login</Link>
                </NextLink>
                <NextLink href='/register'>
                    <Link >Register</Link>
                </NextLink>
            </>
        )
    } else {
        body = (
            <>
                <Flex align="center">
                    <NextLink href="/create-post">
                        <Button a={Link} mr={4}>
                            create Post
                        </Button>
                    </NextLink>
                    <Box mr={2}>
                        {data.me.username}
                    </Box>
                    <Button 
                    onClick={async () => {await logout(); router.reload()}}
                    isLoading={logoutFetching} variant="link">LogOut</Button>
            </Flex>
            </>
        )
    }


return (
    <Flex zIndex={1} position="sticky" top={0} bg="tomato" p={4} align="center" >
        <Flex maxW={800} flex={1} m="auto" align="center">
            <NextLink href="/">
                <Link>
                    <Heading>
                        ShineLin Website
                    </Heading>
                </Link>
            </NextLink>

            <Box ml={'auto'} >
                {body}
            </Box>
        </Flex>
    </Flex>
);
}