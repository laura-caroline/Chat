import React, {useEffect, useState} from 'react'
import { View, Text } from 'react-native'
import * as Yup from 'yup'
import { Formik } from 'formik'
import api from '../../config/api'
import { useNavigation } from '@react-navigation/native'
import { useAuthenticate } from '../../context/authenticate'
import Spinner from 'react-native-loading-spinner-overlay'

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
    const [formData, setFormData] = useState([])
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()
    const { handleLogin } = useAuthenticate()

    useEffect(()=>{
        const unsubscribe = navigation.addListener('blur', ()=>{
            console.log('aqui')
            return setFormData({})
        })
    },[navigation])

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

    const handleChange = (field, value)=>{
        return setFormData({...formData, [field]: value})
    }

    const submitForm = async (values, setFieldError) => {
        setLoading(true)
        try{
            const response = await api.post('/user/auth', values)
            const data = response.data
            const {
                id,
                nickname,
                photo
            } = data.dataUser
    
            setLoading(false)
            if (response.status == 200) {
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
        }
        catch(error){
            setLoading(false)
            return setFieldError('password', error.response.data.error)
        }

    }

    return (
        <Container>
            <Spinner
                visible={loading}
                textContent="Loading..."
                textStyle={{color: '#fff'}}
            />
            <Formik
                initialValues={formData}
                validationSchema={FormSchema}
                enableReinitialize={true}
                onSubmit={async (values, { setFieldError }) => {
                    return await submitForm(values, setFieldError)
                }}

            >
                {({ errors, handleSubmit }) => (
                    <BoxForm >
                        <Label>Email</Label>
                        <Input
                            value={formData.email}
                            onChangeText={(email)=> handleChange('email', email)}
                            placeholder="Digite seu email"
                            autoCapitalize="none"
                        />
                        <ErrorMessage>
                            {errors.email && errors.email}
                        </ErrorMessage>
                        <Label>Senha</Label>
                        <Input
                            value={formData.password}
                            onChangeText={(password)=> handleChange('password', password)}
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