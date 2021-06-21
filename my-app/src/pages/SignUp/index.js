import React, { useState } from 'react'
import { View, Button } from 'react-native'
import * as Yup from 'yup'
import { Formik } from 'formik'
import * as ImagePicker from 'expo-image-picker'
import api from '../../config/api'
import { useNavigation } from '@react-navigation/native'
import {useAuthenticate} from '../../context/authenticate'
import socket from '../../services/socket'
import {
    Container,
    Label,
    Input,
    BoxPhoto,
    Photo,
    ErrorMessage,
    ButtonSubmit,
    BoxForm,

} from './styles'
const SignUp = () => {
    const [photo, setPhoto] = useState({})
    const navigation = useNavigation()
    const {handleLogin} = useAuthenticate()

    const FormSchema = Yup.object().shape({
        photo: Yup
            .object()
            .required('Campo obrigatório')
        ,
        nickname: Yup
            .string()
            .required('Campo obrigatório')
        ,
        email: Yup
            .string()
            .matches(/^(\w+)\@(\w+)(\W+\w+)+/, "Email invalido")
            .required('Campo obrigatório')
        ,
        password: Yup
            .string()
            .required('Campo obrigatório')
    })

    const handleSelectedImageProfile = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
        if (!result.cancelled) {
            setPhoto(result)
            return result
        }
    }

    const submitForm = async (values, setFieldError) => {
        const { nickname, email, password } = values

        const formData = new FormData()
        formData.append('nickname', nickname)
        formData.append('photo', { name: `photo.jpg`, type: "image/jpg", uri: photo.uri })
        formData.append('email', email)
        formData.append('password', password)

        const response = await api.post('/users', formData)
        const data = response.data
        const {
            id,
            nickname,
            photo
        } = data.dataUser

        if(response.status === 200){
            await handleLogin(data.token, data.dataUser)
            socket.auth = {
                id_bd: id,
                nickname,
                photo
            }
            socket.connect()
            return navigation.navigate('DrawerNavigation', {
                screen: 'ListUsers', 
                params: {id}
            })
        }
       
        return setFieldError('password', data.error)
        
        
    }

    return (
        <Container>
            <Formik
                initialValues={{
                    photo,
                    nickname: '',
                    email: '',
                    password: ''
                }}
                validationSchema={FormSchema}
                onSubmit={(values, { setFieldError }) => {
                    return submitForm(vaues, setFieldError)
                }}

            >
                {({ errors, handleChange, handleSubmit, setFieldValue }) => (
                    <BoxForm >
                        <Label>Insira sua foto do perfil:</Label>
                        <BoxPhoto>
                            {!photo.uri ? (
                                <Button
                                    title="Selecione sua foto"
                                    onPress={() => setFieldValue('photo', handleSelectedImageProfile())}
                                />
                            ) : (
                                    <Photo
                                        source={{ uri: photo.uri }}
                                        style={{ width: '100%' }}
                                    />
                                )}
                        </BoxPhoto>
                        <Label>Nome:</Label>
                        <Input
                            onChangeText={handleChange('nickname')}
                            placeholder="Digite seu nome"

                        />
                        <ErrorMessage>
                            {errors.nickname && errors.nickname}
                        </ErrorMessage>
                        <Label>Email:</Label>
                        <Input
                            onChangeText={handleChange('email')}
                            placeholder="Digite seu email"
                            autoCapitalize="none"
                        />
                        <ErrorMessage>
                            {errors.email && errors.email}
                        </ErrorMessage>
                        <Label>Senha:</Label>
                        <Input
                            onChangeText={handleChange('password')}
                            placeholder="Digite sua senha"
                            autoCapitalize="none"
                            secureTextEntry
                        />
                        <ErrorMessage>
                            {errors.password && errors.password}
                        </ErrorMessage>
                        <ButtonSubmit
                            title="Criar conta"
                            onPress={handleSubmit}
                        />
                    </BoxForm>
                )}
            </Formik>
        </Container>

    )
}

export default SignUp