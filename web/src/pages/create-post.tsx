import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { Wrapper } from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import { useIsAuth } from '../utils/useIsAuth';
import login from './login';


const CreatePost: React.FC<{}> = ({ }) => {
    const router = useRouter()
    useIsAuth()
    const [{ }, createPost] = useCreatePostMutation()

    return (
        <Layout variant="small">
            <Formik initialValues={{ title: "", text: "" }} onSubmit={async (values, { setErrors }) => {
                console.log('values', values)
                const { error } = await createPost({ input: values })
                if (!error) {
                    router.push("/")
                }


                // if (response.data?.createPost.errors) {
                //     setErrors(toErrorMap(response.data.createPost.errors))
                // } else if (response.data?.createPost.user) {
                //     router.push("/")
                // }


            }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="title" placeholder="title" lable="Title"></InputField>
                        <Box mt={4}></Box>
                        <InputField name="text" placeholder="text" lable="Text" textarea={true}></InputField>
                        <Button mt={4} isLoading={isSubmitting} type="submit" colorScheme="teal">Create Post</Button>
                        {/* <Flex ml={2}>
                            <NextLink href="forget-password">
                                <Link ml="auto">
                                    Forget Password
                                </Link>
                            </NextLink>
                        </Flex> */}
                    </Form>
                )}
            </Formik>

        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost)