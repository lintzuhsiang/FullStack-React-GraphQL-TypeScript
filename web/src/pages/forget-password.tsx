import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgetPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';


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
