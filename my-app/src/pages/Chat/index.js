import React, { useState, useRef, useCallback, useEffect } from 'react'
import { RefreshControl } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { useSelectedUser } from '../../context/user'
import { useAuthenticate } from '../../context/authenticate'
import api from '../../config/api'
import socket from '../../services/socket'

import {
    Container,
    ListMessages,
    BoxActions,
    ButtonSubmit,
    Input,
    MessageRecepted,
    MessageSendedByMe
} from './styles'
import { set } from 'react-native-reanimated'

const Chat = () => {
    //Estados
    const [messages, setMessages] = useState([])
    const [msg, setMsg] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const [offset, setOffset] = useState(0)
    const [posScroll, setPosScroll] = useState()
    const [dimensions, setDimensions] = useState({})
    const [numberRenderization, setNumberRenderization] = useState(1)

    // Hooks and contexts
    const { setSelectedUser, selectedUser } = useSelectedUser()
    const { profile: { id } } = useAuthenticate()
    const navigation = useNavigation()
    const scrollViewRef = useRef();

    navigation.addListener('beforeRemove', () => {
        setSelectedUser('')
    })
    
    const {
        to_user,
        nicknameUserSelected
    } = useRoute().params

    useEffect(() => {
        navigation.setOptions({
            title: nicknameUserSelected,
        })
    }, [])

    useEffect(() => {
        (async () => {
            const response = await api.get('/messages', {
                params: {
                    from_user: id,
                    to_user
                }
            })
            const data = response.data
            return setMessages(data.reverse())
        })()
    }, [])

    useEffect(() => {
        socket.on('private_message', async data => {
            const {content, from} = data

            if (from === selectedUser) {
                setMessages([...messages, { text: content }])
            }
        })
    }, [messages])

    const onRefresh = useCallback(async () => {
        const limit = 20
        const skip = offset + limit

        const response = await api.get(`messages`, {
            params: {
                offset: skip,
                from_user: id,
                to_user
            }
        })
        setRefreshing(false)
        setMessages([...response.data, ...messages])
        setOffset(skip)


    }, [offset || messages]);

    const handleChangeMessage = (msg) => {
        return setMsg({
            to_user,
            from_user: id,
            text: msg,
            userSelected: selectedUser,
            createdAt: new Date(),
            sended_for_me: true
        })
    }
    const handleSendingMessage = () => {
        socket.emit('private_message', msg)
        setMessages([...messages, msg])
        setMsg('')


    }
    return (
        <Container>
            <ListMessages
                ref={scrollViewRef}
                onScroll={({ nativeEvent }) => {
                    const {
                        layoutMeasurement,
                        contentOffset,
                        contentSize
                    } = nativeEvent

                    const calc = layoutMeasurement?.height + contentOffset?.y
                    
                    // when scroll is at the end, save height of contentoffset and posteriorly save yours dimensions
                    if (calc >= contentSize.height) {
                        setPosScroll(contentOffset.y * 1.78)
                        setDimensions({calc: calc, content: contentSize.height})
                    }
                    setDimensions({calc: calc, content: contentSize.height})
                }}

                onContentSizeChange={() => {
                    const {calc, content} = dimensions

                    // when no have value in posScroll is because the scroll never was to the end
                    // then user opened chat now. So scroll to the end for user see yours last messages sent or received
                    if(!posScroll){
                        return scrollViewRef.current.scrollToEnd()
                    }

                    // when scroll is at the end and change size of the content,
                    // roll for end and see new message
                    if(calc >= content){
                        return scrollViewRef.current.scrollToEnd()
                    }
                    // when change size content and scroll not is in down, is top so
                    // keep the scroll, because when renderize content scroll goes to the top
                    scrollViewRef.current.scrollTo({y: posScroll, animated: false})
                    
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {messages.length > 0 ? messages.map((message) => {
                    if (message.sended_for_me) {
                        return (
                            <MessageSendedByMe>
                                {message.text}
                            </MessageSendedByMe>
                        )
                    }
                    return (    
                        <MessageRecepted>
                            {message.text}
                        </MessageRecepted>
                    )


                }) : null}
            </ListMessages>
            <BoxActions>
                <Input
                    onFocus={()=> scrollViewRef.current.scrollToEnd()}
                    onChangeText={(v) => handleChangeMessage(v)}
                    placeholder="Digite qualquer coisa"
                    value={msg}
                />
                <ButtonSubmit
                    onPress={() => handleSendingMessage()}
                    title="->"
                />
            </BoxActions>
        </Container>
    )
}

export default Chat
