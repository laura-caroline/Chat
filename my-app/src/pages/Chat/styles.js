import styled from 'styled-components/native'

export const Container = styled.View`
    background-color: white;
    width: 100%;
    height: 100%;
`
export const ListMessages = styled.ScrollView`
    height: 90%
    padding: 10px;
`

export const MessageSendedByMe = styled.Text`
    color: white;
    margin: 10px 0px 10px 0px;
    padding: 20px;
    min-width: 30%;
    max-width: 80%;
    border-radius: 10px;
    align-self: flex-end;
    background-color: #0265fa;

`
export const MessageRecepted = styled.Text`
    color: black;
    margin: 10px 0px 10px 0px;
    padding: 20px;
    min-width: 30%;
    max-width: 80%;
    border-radius: 10px;
    align-self: flex-start; 
    background-color: #9a9b9c; 

`
export const BoxActions = styled.View`
    border: 1px;
    padding: 5px 0px 5px 0px;
    width: 100%
    flex-direction: row;
`

export const Input = styled.TextInput`
    width: 90%;
`

export const ButtonSubmit = styled.Button`
    width: 10%;
`