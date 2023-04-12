import React from 'react'
import {View, StyleSheet, Text, Pressable} from 'react-native'
import Avatar from '../Avatar/Avatar'
import {ThemeContext} from '../../theme'
import getUnionUrl from '../../utils/getUnionUrl'
import getTimeDiff from '../../utils/getTimeDiff'
import {useNavigation, NavigationProp} from '@react-navigation/native'
import {RootStackParamList} from '../../types/route'

interface MessageProps {
  avatar: string
  timestamp: string
  text: string
  to_id?: string
  user_id?: string
  me?: boolean
  nick_name?: string
}
const Message = React.memo((props: MessageProps) => {
  const {me, text, avatar, timestamp, nick_name, to_id, user_id} = props
  const {theme} = React.useContext(ThemeContext)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()

  /* 跳转到用户主页 */
  const handleNavigate = () => {
    if (to_id && user_id) {
      navigate.navigate('user_profile', {to_userId: to_id, user_id})
    }
  }

  return (
    <View style={[styles.container, {flexDirection: me ? 'row-reverse' : 'row'}]}>
      <Pressable onPress={handleNavigate}>
        <Avatar
          src={getUnionUrl(avatar)}
          size={44}
        />
      </Pressable>
      <View style={[styles.message_wrapper]}>
        <View style={[styles.message, {backgroundColor: theme.colors.messagebg}]}>
          {nick_name && (
            <Text
              ellipsizeMode="tail"
              style={[styles.name, {color: theme.colors.primary, maxWidth: '100%'}]}>
              {nick_name}
            </Text>
          )}

          <Text
            selectable
            style={[{color: theme.colors.defaultTextColor, fontSize: 18}]}>
            {text}
          </Text>
        </View>
        <Text
          style={[
            styles.timestamp,
            {color: theme.colors.secondary, textAlign: me ? 'right' : 'left'},
          ]}>
          {getTimeDiff(timestamp, 'time')}
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
    paddingVertical: 10,
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
