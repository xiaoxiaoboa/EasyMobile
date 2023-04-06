import React from 'react'
import {View, StyleSheet} from 'react-native'
import {ThemeContext} from '../../theme'

const Divider = () => {
  const {theme} = React.useContext(ThemeContext)
  return <View style={[styles.container, {backgroundColor: theme.colors.divider}]}></View>
}

export default Divider

const styles = StyleSheet.create({
  container: {
    height: 1,
  },
})
