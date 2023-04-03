import React from 'react'
import {StyleSheet, View, Text, Image} from 'react-native'

interface AvatarProps {
  src?: string
  size: number
  borderRadius?: number
}
const Avatar: React.FC<AvatarProps> = props => {
  const {src, size, borderRadius = 50} = props
  return (
    <View>
      <Image
        source={require('../../assets/avatar.jpg')}
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
