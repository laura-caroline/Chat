import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
import { TouchableOpacity, Text, View } from 'react-native'
import socket from '../../services/socket'
import { useSelectedUser } from '../../context/user'

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



const ListUsers = () => {
    const { setSelectedUser, selectedUser } = useSelectedUser()
    const navigation = useNavigation()
    const { id } = useRoute().params
    const [users, setUsers] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(users ?.length > 0 ){
            setLoading(false)
        }
    }, [users])

    useEffect(() => {
        // Update users when any user to connect
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
            const { from, content } = data

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
            }
            else {
                copyUsersConnected[userSendedMessage] = {
                    ...copyUsersConnected[userSendedMessage],
                    amountMessagesUnreads: copyUsersConnected[userSendedMessage].amountMessagesUnreads + 1,
                    lastMessage: content
                }
                
            }
            setUsers(copyUsersConnected)


        })
    }, [loading])





    const handleSelectedUser = async (id, userSelected, nickname) => {
        const user = users.findIndex((user) => {
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
            nicknameUserSelected: nickname
        })
    }

    return (
        <Container>
            {users && users.length > 0 ? users.map((user) => {
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
            }) : (
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