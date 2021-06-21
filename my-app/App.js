import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import Routes from './routes'
import { AuthenticateProvider } from './src/context/authenticate'
import { SelectedUserProvider } from './src/context/user'

export default function App() {
  return (
    <NavigationContainer>
      <AuthenticateProvider>
          <SelectedUserProvider>
            <Routes />
          </SelectedUserProvider>
      </AuthenticateProvider>

    </NavigationContainer>
  )
}
