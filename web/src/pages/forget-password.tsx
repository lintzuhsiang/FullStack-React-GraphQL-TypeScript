import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import router from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { toErrorMap } from '../utils/toErrorMap';
import login from './login';
import NextLink from 'next/link'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useForgetPasswordMutation } from '../generated/graphql';


const ForgetPassword: React.FC<{}> = ({ }) => {
    const [, ForgetPassword] = useForgetPasswordMutation();
    const [complete, setComplete] = useState(false);
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ email: "" }} onSubmit={async (values) => {
                await ForgetPassword(values)
                setComplete(true)
                // router.push("/")
            }}>
                {({ isSubmitting }) =>

                    complete ? (
                        <Box>If email exists, we will send you a link</Box>
                    ) : (
                        <Form>
                            <InputField name="email" placeholder="email" lable="Email" />
                            <Button mt={4} isLoading={isSubmitting} type="submit" colorScheme="teal">forget password</Button>
                        </Form>
                    )

                }
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(ForgetPassword)
