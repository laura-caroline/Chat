import React, { useEffect, createContext, useState, useContext } from 'react'

const selectedUserContext = createContext()

export const SelectedUserProvider = ({children})=>{
    const [selectedUser, setSelectedUser] = useState('')

    return(
        <selectedUserContext.Provider value={{
            selectedUser,
            setSelectedUser

        }}>
            {children}
        </selectedUserContext.Provider>
    )   

}

export const useSelectedUser= ()=>{
    const {selectedUser, setSelectedUser} = useContext(selectedUserContext)
    return {selectedUser, setSelectedUser}
}