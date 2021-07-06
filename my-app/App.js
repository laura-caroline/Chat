import 'react-native-gesture-handler';
import React from 'react';
import { LogBox } from 'react-native';

import { NavigationContainer } from '@react-navigation/native'
import Routes from './routes'
import { AuthenticateProvider } from './src/context/authenticate'


LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();//Ignore all log notifications

export default function App() {
  return (
    <NavigationContainer>
      <AuthenticateProvider>
            <Routes />
      </AuthenticateProvider>

    </NavigationContainer>
  )
}
