import { FormControl, FormLabel, Input, FormHelperText, Box, Button, Link, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react'
import { useMutation } from 'urql';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/wrapper';
import { useLoginMutation, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link'

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