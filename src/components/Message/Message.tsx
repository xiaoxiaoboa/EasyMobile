import React from 'react'
import {View, StyleSheet, Text, Dimensions} from 'react-native'
import Avatar from '../Avatar/Avatar'
import {ThemeContext} from '../../theme'
import getUnionUrl from '../../utils/getUnionUrl'
import getTimeDiff from '../../utils/getTimeDiff'

interface MessageProps {
  avatar: string
  timestamp: string
  text: string
  me?: boolean
  nick_name?: string
}
const Message = React.memo((props: MessageProps) => {
  const {me, text, avatar, timestamp, nick_name} = props
  const {theme} = React.useContext(ThemeContext)

  return (
    <View style={[styles.container, {flexDirection: me ? 'row-reverse' : 'row'}]}>
      <View>
        <Avatar
          src={getUnionUrl(avatar)}
          size={44}
        />
      </View>
      <View style={[styles.message_wrapper]}>
        <View style={[styles.message, {backgroundColor: theme.colors.messagebg}]}>
          <Text
            ellipsizeMode="tail"
            style={[styles.name, {color: theme.colors.primary, maxWidth: '100%'}]}>
            {nick_name}
          </Text>
          <Text
            selectable
            style={[{color: theme.colors.defaultTextColor, fontSize: 18}]}>
            {text}
          </Text>
        </View>
        <Text style={[styles.timestamp, {color: theme.colors.secondary}]}>
          {getTimeDiff(timestamp)}
        </Text>
      </View>
    </View>
  )
})

export default Message

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    gap: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  message_wrapper: {
    maxWidth: '75%',
  },
  message: {
    paddingVertical: 6,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
  },
})
