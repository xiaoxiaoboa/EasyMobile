import React from 'react'
import {View, StyleSheet, Text, Dimensions} from 'react-native'
import Avatar from '../Avatar/Avatar'
import {ThemeContext} from '../../theme'

interface MessageProps {}
const Message = () => {
  const {theme} = React.useContext(ThemeContext)
  const windowWidth = React.useMemo(() => Dimensions.get('window').width, [])
  return (
    <View style={[styles.container]}>
      <View>
        <Avatar
          src={undefined}
          size={44}
        />
      </View>
      <View style={[styles.message_wrapper]}>
        <View style={[styles.message, {backgroundColor: theme.messagebg}]}>
          <Text style={[styles.name, {color: theme.defaultTextColor}]}>小新</Text>
          <Text style={[{color: theme.defaultTextColor}]}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse temporibus
            cupiditate vitae hic placeat. Architecto quod neque dolorem cupiditate
            molestiae amet. Id deserunt suscipit quam esse iure quidem, quod magnam?
          </Text>
        </View>
        <Text style={[styles.timestamp, {color: theme.secondary}]}>1天前</Text>
      </View>
    </View>
  )
}

export default Message

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    overflow: 'hidden',
    marginBottom: 10
  },
  message_wrapper: {
    maxWidth: '86%',
  },
  message: {
    padding: 6,
    borderRadius: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
  },
})
