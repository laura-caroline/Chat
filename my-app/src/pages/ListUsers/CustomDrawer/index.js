import React from 'react'
import {View, Image} from 'react-native'
import ListUsers from '../index'
import {useAuthenticate} from '../../../context/authenticate'
import socket from '../../../services/socket'


import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator()

const DrawerNavigation = () => {
    return(
        <Drawer.Navigator drawerStyle={{width: '50%'}} drawerContent={(props) => <CustomDrawerComp {...props} />}>
            <Drawer.Screen name="ListUsers" component={ListUsers} />
        </Drawer.Navigator>
    )   
}

const CustomDrawerComp = (props) => {
    const { navigation } = props;
    const {handleLogout} = useAuthenticate()

    const handleSignOut = async ()=>{
        await handleLogout()
        socket.disconnect()
        return navigation.navigate('SignIn')
    }

    return (
        <DrawerContentScrollView {...props}>
            <View>
                <DrawerItem  
                    label={`Usuário: ${socket.auth?.nickname}`}
                />
                <DrawerItem
                    label="Sair"
                    onPress={handleSignOut}
                />
            </View>
        </DrawerContentScrollView>
    );
};


export default DrawerNavigation