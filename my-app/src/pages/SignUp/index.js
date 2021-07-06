import React, { useEffect, useState } from 'react'
import { View, Button, TouchableOpacity, Alert} from 'react-native'
import * as Yup from 'yup'
import { Formik } from 'formik'
import * as ImagePicker from 'expo-image-picker'
import api from '../../config/api'
import { useNavigation } from '@react-navigation/native'
import {useAuthenticate} from '../../context/authenticate'
import socket from '../../services/socket'
import Spinner from 'react-native-loading-spinner-overlay'
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
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState({})
    const [formData, setFormData] = useState([])
    const navigation = useNavigation()
    const {handleLogin} = useAuthenticate()

    useEffect(()=>{
        const unsubscribe = navigation.addListener('blur', ()=>{
            setFormData({})
            setPhoto({})
        })
    },[navigation])

    const FormSchema = Yup.object().shape({
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
        }
    }
    
    const handleChange = (field, value)=>{
        return setFormData({...formData, [field]: value})
    }

    const submitForm = async (values, setFieldError) => {
        setLoading(true)
        try{
            const { nickname, email, password } = values
            const formData = new FormData()
            formData.append('nickname', nickname)
            formData.append('photo', { name: "photo.jpg", type: "image/jpg", uri: photo.uri })
            formData.append('email', email)
            formData.append('password', password)
    
            const response = await api.post('/user', formData)
            const data = response.data
            
    
            if(response.status == 200){
                Alert.alert('Sucess', 'Usuário criado com sucesso')
                return navigation.navigate('SignIn')
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
                enableReinitialize={true}
                validationSchema={FormSchema}
                onSubmit={async (values, { setFieldError }) => {
                    return await submitForm(values, setFieldError)
                }}

            >
                {({ errors, handleSubmit }) => (
                    <BoxForm >
                        <Label>Insira sua foto do perfil:</Label>
                        <BoxPhoto>
                            {!photo.uri ? (
                                <Button
                                    title="Selecione sua foto"
                                    onPress={handleSelectedImageProfile}
                                />
                            ):(
                                <TouchableOpacity style={{width: '100%'}} onPress={handleSelectedImageProfile}>
                                    <Photo
                                        source={{ uri: photo.uri }}
                                        style={{ width: '100%' }}
                                    />
                                </TouchableOpacity>
                            )}
                        </BoxPhoto>
                        <Label>Nome:</Label>
                        <Input
                            onChangeText={(nickname)=> handleChange('nickname', nickname)}
                            placeholder="Digite seu nome"

                        />
                        <ErrorMessage>
                            {errors.nickname && errors.nickname}
                        </ErrorMessage>
                        <Label>Email:</Label>
                        <Input
                            onChangeText={(email)=> handleChange('email', email)}
                            placeholder="Digite seu email"
                            autoCapitalize="none"
                        />
                        <ErrorMessage>
                            {errors.email && errors.email}
                        </ErrorMessage>
                        <Label>Senha:</Label>
                        <Input
                            onChangeText={(password)=> handleChange('password', password)}
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