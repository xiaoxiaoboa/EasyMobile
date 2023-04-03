import React from 'react'
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {ThemeProvider, ThemeContext} from './src/theme'
import TopTabs from './src/components/TopTabs/TopTabs'
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
