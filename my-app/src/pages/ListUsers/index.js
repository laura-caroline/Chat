import React, { useEffect, useState, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
import { TouchableOpacity, Text, View } from 'react-native'
import socket from '../../services/socket'
import Spinner from 'react-native-loading-spinner-overlay'
import {schedulePushNotification} from '../../services/notifications'


import {
    Container,
    BoxUser,
    Photo,
    Nickname,
    BoxProfile,
    LastMessage,
    BoxDataUser,
    BoxMessagesUnreads,
    NumberMessagesUnreads,
    BoxMessageEmptyListUsers,
    MessageEmptyListUsers

} from './styles'
import api from '../../config/api'



const ListUsers = () => {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState()
    const [selectedUser, setSelectedUser] = useState('')
    const navigation = useNavigation()
    const { id } = useRoute().params

    const usersRef = useRef(users)

    useEffect(()=>{
        usersRef.current = users
    })

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', ()=>{
            setSelectedUser('')
        })
    },[navigation])


    socket.on('users_connected', async users_connected => {
        const usersExceptMe = users_connected.filter((user) => {
            return user.id !== id
        })
        setUsers(usersExceptMe)
    })

    // Update users when any user to disconnect
    socket.on('user_disconnected', async users_connected => {
        setUsers(users_connected)
    })

    // Update the last message of user thats i sent an message
    socket.on('user_sended_message', async data => {
        const { userSelected, content } = data

        const userReceptedMessage = users.findIndex((user) => {
            return user.socketId === userSelected
        })
        const copyUsersConnected = [...users]

        copyUsersConnected[userReceptedMessage] = {
            ...copyUsersConnected[userReceptedMessage],
            amountMessagesUnreads: 0,
            lastMessage: content
        }
        setUsers(copyUsersConnected)

    })
    // Update the last message of user thats sent a message
    socket.on('private_message', async data => {
        const { nickname, from, content } = data

        const userSendedMessage = users.findIndex((user) => {
            return user.socketId === from
        })
        const copyUsersConnected = [...users]

        if (selectedUser == from) {
            copyUsersConnected[userSendedMessage] = {
                ...copyUsersConnected[userSendedMessage],
                amountMessagesUnreads: 0,
                lastMessage: content
            }

            return setUsers(copyUsersConnected)
        }
        else {
            copyUsersConnected[userSendedMessage] = {
                ...copyUsersConnected[userSendedMessage],
                amountMessagesUnreads: copyUsersConnected[userSendedMessage].amountMessagesUnreads + 1,
                lastMessage: content
            }
            return setUsers(copyUsersConnected)
        }
    })

    const handleSelectedUser = async (id, userSelected, nickname) => {
        const user = users?.findIndex((user) => {
            return user.socketId === userSelected
        })
        const copyUsersConnected = [...users]

        copyUsersConnected[user] = {
            ...copyUsersConnected[user],
            amountMessagesUnreads: 0
        }

        setSelectedUser(userSelected)
        setUsers(copyUsersConnected)

        return navigation.navigate('Chat', {
            to_user: id,
            selectedUser: userSelected,
            nicknameUserSelected: nickname
        })
    }
    return (
        <Container>
            <Spinner
                visible={loading}
                textContent="Loading..."
                color="#fff"
            />
            {users && users.length > 0 && users.map((user) => {
                return (
                    <TouchableOpacity onPress={() => handleSelectedUser(user.id, user.socketId, user.nickname)}>
                        <BoxUser>
                            <BoxProfile>
                                <Photo source={{ uri: user.photo }} />
                                <BoxDataUser >
                                    <Nickname>{user.nickname}</Nickname>
                                    <LastMessage>{user.lastMessage}</LastMessage>
                                </BoxDataUser>
                                {user.amountMessagesUnreads > 0 ? (
                                    <BoxMessagesUnreads>
                                        <NumberMessagesUnreads>
                                            {user.amountMessagesUnreads}
                                        </NumberMessagesUnreads>
                                    </BoxMessagesUnreads>
                                ) : null}
                            </BoxProfile>
                        </BoxUser>
                    </TouchableOpacity>
                )
            })}
            {!users?.length > 0 && (
                <BoxMessageEmptyListUsers>
                    <MessageEmptyListUsers>
                        Nenhum usuário online
                    </MessageEmptyListUsers>
                </BoxMessageEmptyListUsers>
                
            )}
        </Container>
    )
}
export default ListUsers