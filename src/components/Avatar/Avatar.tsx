import React from 'react'
import {StyleSheet, View, Pressable, Image} from 'react-native'
import {ThemeContext} from '../../theme'

interface AvatarProps {
  size: number
  src?: string
  borderRadius?: number
}
const Avatar: React.FC<AvatarProps> = props => {
  const {src, size, borderRadius = 50} = props
  const {theme} = React.useContext(ThemeContext)
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: Math.floor(size / 2),
      }}>
      <Image
        source={src ? {uri: src} : require('../../assets/avatar.png')}
        style={[{width: size, height: size, borderRadius}]}
      />
    </View>
  )
}

export default Avatar

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
  },
  img: {},
})
