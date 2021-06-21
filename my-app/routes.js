import React from 'react'
//Navigation
import {createStackNavigator} from '@react-navigation/stack'
import DrawerNavigation from './src/pages/ListUsers/CustomDrawer/index'
// Screens
import SignIn from './src/pages/SignIn/index'
import SignUp from './src/pages/SignUp/index'
import Chat from './src/pages/Chat/index'
// Context
import {useAuthenticate} from './src/context/authenticate'
//
const Stack = createStackNavigator()

const Routes = ()=>{
    const {authenticate} = useAuthenticate()
    return( 
        <Stack.Navigator initialRouteName="SignIn">
            <Stack.Screen name="SignIn" component={SignIn} options={{title: 'Faça seu login'}}/>
            <Stack.Screen name="SignUp" component={SignUp} options={{title: 'Crie sua conta'}}/>
            {authenticate && (
                <>
                    <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{title:'Usuários online'}}/>
                    <Stack.Screen name="Chat" component={Chat} />
                </>
            )}
            
        </Stack.Navigator>
    )
}


export default Routes