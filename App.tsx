import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {ThemeProvider} from './src/theme'
import AppWrapper from './src/screens/AppWrapper'
import {MyContextProvider} from './src/context/context'
import 'react-native-gesture-handler'


function App(): JSX.Element {
  return (
    <MyContextProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppWrapper />
        </NavigationContainer>
      </ThemeProvider>
    </MyContextProvider>
  )
}

export default App
