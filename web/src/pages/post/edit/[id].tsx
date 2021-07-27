import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdateMutationMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';



const EditPost = ({ }) => {
    const router = useRouter()
    const intId = useGetIntId()
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId
        }
    })



    const [, updatePost] = useUpdateMutationMutation()

    if (fetching) {
        <Layout>
            <div>loading</div>
        </Layout>
    }
    if (!data?.post) {
        return (
            <Layout>
                could not find post here
            </Layout>
        )
    }
    return (
        <Layout variant="small">

            <Formik initialValues={{ title: data.post.title, text: data.post.text }}
                onSubmit={async (values, { setErrors }) => {
                    await updatePost({ id: intId, ...values })
                    // router.push("/")
                    router.back()
                }}>

                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="title" placeholder="title" lable="Title"></InputField>
                        <Box mt={4}></Box>
                        <InputField name="text" placeholder="text" lable="Text" textarea={true}></InputField>
                        <Button mt={4} isLoading={isSubmitting} type="submit" colorScheme="teal">Edit Post</Button>
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

        </Layout >
    )
}

export default withUrqlClient(createUrqlClient)(EditPost)

