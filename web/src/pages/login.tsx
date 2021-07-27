import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

interface loginProps {

}

const login: React.FC<loginProps> = ({ }) => {
    const [_, login] = useLoginMutation()

    const router = useRouter()
    console.log('login',router)
    return (

        <Wrapper variant="small">
            <Formik initialValues={{ usernameOrEmail: "", password: "" }} onSubmit={async (values, { setErrors }) => {
                const response = await login(values)
                console.log('response', response);

                if (response.data?.login.errors) {
                    setErrors(toErrorMap(response.data.login.errors))
                } else if (response.data?.login.user) {
                    if (typeof router.query.next === 'string') {
                        router.push(router.query.next)
                    } else {
                        router.push("/")
                    }
                }


            }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="usernameOrEmail" placeholder="username or email" lable="usernameOrEmail"></InputField>
                        <Box mt={4}></Box>
                        <InputField name="password" placeholder="password" lable="password" type="password"></InputField>
                        <Button mt={4} isLoading={isSubmitting} type="submit" colorScheme="teal">login</Button>
                        <Flex ml={2}>
                            <NextLink href="forget-password">
                                <Link ml="auto">
                                    Forget Password
                                </Link>
                            </NextLink>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(login);;