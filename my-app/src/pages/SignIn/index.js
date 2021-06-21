import React from 'react'
import { View, Text } from 'react-native'
import * as Yup from 'yup'
import { Formik } from 'formik'
import api from '../../config/api'
import { useNavigation } from '@react-navigation/native'
import { useAuthenticate } from '../../context/authenticate'

import socket from '../../services/socket'

import {
    Container,
    Label,
    Input,
    ErrorMessage,
    ButtonSubmit,
    BoxNavigation,
    NavigateCreateAccount,
    BoxForm
} from './styles'

const SignIn = () => {
    const navigation = useNavigation()
    const { handleLogin } = useAuthenticate()

    const FormSchema = Yup.object().shape({
        email: Yup
            .string()
            .matches(/^(\w+)\@(\w+)(\W+\w+)+/, "Email invalido")
            .required('Campo obrigatório')
        ,
        password: Yup
            .string()
            .required('Campo obrigatório')
    })

    const submitForm = async (values, setFieldError) => {
        const response = await api.post('/auth', values)
        const data = response.data
        const {
            id,
            nickname,
            photo
        } = data.dataUser

        if (response.status === 200) {
            await handleLogin(data.token, data.dataUser)
            socket.auth = {
                id_bd: id,
                nickname,
                photo
            }
            socket.connect()

            return navigation.navigate('DrawerNavigation', {
                screen: 'ListUsers',
                params: { id }
            })
        }
        return setFieldError('password', data.error)

    }


    return (
        <Container>
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                validationSchema={FormSchema}
                onSubmit={(values, { setFieldError }) => {
                    return submitForm(values, setFieldError)
                }}

            >
                {({ errors, handleChange, handleSubmit }) => (
                    <BoxForm >
                        <Label>Email</Label>
                        <Input
                            onChangeText={handleChange('email')}
                            placeholder="Digite seu email"
                            autoCapitalize="none"
                        />
                        <ErrorMessage>
                            {errors.email && errors.email}
                        </ErrorMessage>
                        <Label>Senha</Label>
                        <Input
                            onChangeText={handleChange('password')}
                            placeholder="Digite sua senha"
                            autoCapitalize="none"
                            secureTextEntry
                        />
                        <ErrorMessage>
                            {errors.password && errors.password}
                        </ErrorMessage>
                        <BoxNavigation>
                            <ButtonSubmit
                                title="Entrar"
                                onPress={handleSubmit}
                            />
                            <NavigateCreateAccount
                                onPress={() => navigation.navigate('SignUp')}
                            >
                                Criar conta
                    </NavigateCreateAccount>
                        </BoxNavigation>


                    </BoxForm>
                )}
            </Formik>
        </Container>

    )
}

export default SignIn