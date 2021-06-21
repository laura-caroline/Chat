import styled from 'styled-components/native'

export const Container = styled.View`
    width: 100%;
    height: 100%;
    justify-content: center;
    padding: 10px;
`

export const Label = styled.Text`
    width: 100%;
    marginVertical: 10px;
`
export const Input = styled.TextInput`
    width: 100%;
    border-radius: 5px;
    padding: 15px;
    border: 1px solid #ddd;
`
export const ErrorMessage = styled.Text`
    color: red;
`
export const ButtonSubmit = styled.Button`
    width: 50%;
` 
export const BoxNavigation = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
export const NavigateCreateAccount = styled.Text`  
    width: 50%; 
    textAlign: center; 
    text-decoration-line: underline;    
`

export const BoxForm = styled.View``