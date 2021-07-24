import { FormControl, FormLabel, Input, FormHelperText, Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react'
import { useMutation } from 'urql';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import {useRouter} from 'next/router'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
interface registerProps {

}



const register: React.FC<registerProps> = ({ }) => {
    const [, register] = useRegisterMutation()
    const router = useRouter()
    return (

        <Wrapper invariant="small">
            <Formik initialValues={{ username: "", email: "", password: "" }} onSubmit={async (values, {setErrors}) => {
                console.log('value',values)
                const response = await register({options:values})
                console.log(response);
                
                if (response.data?.register.errors) {
                    console.log('error',response.data?.register.errors)
                    setErrors(toErrorMap(response.data.register.errors))
                }else if(response.data?.register.user){
                    router.push("/")
                }


            }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name="username" placeholder="username" lable="username"></InputField>
                        <Box mt={4}></Box>
                        <InputField name="email" placeholder="email" lable="Email"></InputField>
                        <Box mt={4}></Box>
                        <InputField name="password" placeholder="password" lable="password" type="password"></InputField>
                        <Button mt={4} isLoading={isSubmitting} type="submit" colorScheme="teal">register</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient)(register);