import React from 'react'
import {StatusBar, View, StyleSheet, Animated} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {ThemeContext} from '../theme'
import Routes from '../routes'

const AppWrapper = () => {
  const {theme} = React.useContext(ThemeContext)
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar
          barStyle={theme.isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />

        {/* root router */}
        <Routes />
      </SafeAreaView>
    </View>
  )
}

export default AppWrapper
