import React, {createContext, useContext, useState, useEffect} from 'react'
import { AsyncStorage } from 'react-native'
import api from '../config/api'

const AuthenticateContext = createContext()

export const AuthenticateProvider = ({children})=>{
    const keyAuth = "@auth"
    const keyProfiles = "@profiles" 
    // Estados
    const [authenticate, setAuthenticate] = useState(false)
    const [profile, setProfile] = useState()
    
    useEffect(()=>{
        (async()=>{
            const getToken = await AsyncStorage.getItem(keyAuth)
            if(getToken){
                api.defaults.headers.Authorization = `Bearer ${getToken}`
                const {token} = await api.get('/check-token')
                if(token){
                    const dataProfile = JSON.parse(await AsyncStorage.getItem(keyProfiles))
                    setProfile(dataProfile)
                    return setAuthenticate(true)
                }
                await AsyncStorage.removeItem(keyAuth)
                await AsyncStorage.removeItem(keyProfiles)            
            }
            
        })()
    },[])
    const handleLogin = async (token, dataUser) =>{
        await AsyncStorage.setItem(keyAuth, token)
        await AsyncStorage.setItem(keyProfiles, JSON.stringify(dataUser))
        setAuthenticate(true)
        setProfile(dataUser)

        

    }

    const handleLogout = async ()=>{
        await AsyncStorage.removeItem('auth')
    }

    return(
        <AuthenticateContext.Provider value={{
            authenticate,
            setAuthenticate,
            handleLogin,
            handleLogout,
            profile
        }}>
            {children}
        </AuthenticateContext.Provider>
    )   
}

export const useAuthenticate = ()=>{
    const {authenticate, setAuthenticate, handleLogin, handleLogout, profile} = useContext(AuthenticateContext) 
    return {authenticate, setAuthenticate, handleLogin, handleLogout, profile}
}
