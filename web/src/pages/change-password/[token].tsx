import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';

const ChangePassword: NextPage = () => {
    const [, changePassword] = useChangePasswordMutation();
    const router = useRouter();
    
    const [tokenError, setTokenError] = useState("")
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ newPassword: "" }} onSubmit={async (values, { setErrors }) => {
                const response = await changePassword({ newPassword: values.newPassword, token:typeof router.query.token === "string" ? router.query.token : "" })
                // console.log('response',response);

                if (response.data?.changePassword.errors) {
                    const errorMap = toErrorMap(response.data.changePassword.errors)
                    if ('token' in errorMap) {
                        setTokenError(errorMap.token)
                    }
                    setErrors(toErrorMap(response.data.changePassword.errors))
                } else if (response.data?.changePassword.user) {
                    router.push("/")
                }


            }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="newPassword" placeholder="New Password" lable="newPassword" type="password"></InputField>
                        <Box mt={4}></Box>
                        {tokenError ?
                            <Flex>
                                <Box mt={4} color="red"></Box>
                                <NextLink href="forget-password">
                                    <Link>
                                        Click here for a new password
                                    </Link>
                                </NextLink>
                            </Flex>
                            : null}

                        <Button mt={4} isLoading={isSubmitting} type="submit" colorScheme="teal">Change Password</Button>

                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
};

// ChangePassword.getInitialProps = ({ query }) => {
//     return {
//         token: query.token as string,
//     };
// };

export default withUrqlClient(createUrqlClient)(ChangePassword);
