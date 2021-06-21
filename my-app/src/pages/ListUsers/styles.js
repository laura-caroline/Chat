import styled from 'styled-components/native'

export const Container = styled.ScrollView`
    width: 100%;
    height: 100%
`
export const BoxUser = styled.View`
    width: 100%
    border: 1px solid #ddd;
    margin-top: 5px;
    padding: 10px;
    flex-direction: column;
    justify-content: space-between;
`
export const Photo = styled.Image`
    width: 60px;
    height: 60px;
    borderRadius: 50;
`
export const BoxProfile = styled.View`
    width: 80%;
    flex-direction: row;
`
export const BoxDataUser = styled.View`
    width: 80%;
`
export const Nickname = styled.Text`
    width: 100%;
    margin-left: 10px;
`
export const LastMessage = styled.Text`
    padding-top: 20px;
    margin-left: 10px;
`
export const BoxMessagesUnreads = styled.View`
    width: 20%;
    justify-content: center;
    align-items: flex-end; 
`
export const NumberMessagesUnreads = styled.Text`
    background-color: #4fabc2;
    color: white;
    padding: 5px;
    width: 50%;
    border-radius: 50;
    text-align: center; 
`

export const BoxMessageEmptyListUsers = styled.View`
    height: 500px;
    justify-content: center;
    align-items: center;

`
export const MessageEmptyListUsers = styled.Text`

`
