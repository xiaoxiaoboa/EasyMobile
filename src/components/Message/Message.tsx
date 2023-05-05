import React from 'react'
import {View, StyleSheet, Text, Pressable, Image} from 'react-native'
import Avatar from '../Avatar/Avatar'
import {ThemeContext} from '../../theme'
import getUnionUrl from '../../utils/getUnionUrl'
import getTimeDiff from '../../utils/getTimeDiff'
import {useNavigation, NavigationProp} from '@react-navigation/native'
import {RootStackParamList} from '../../types/route'
import Swiper from '../Swiper/Swiper'

interface MessageProps {
  avatar: string
  timestamp: string
  text: string
  msg_type?: 'text' | 'file' | 'image' | 'video'
  to_id?: string
  user_id?: string
  me?: boolean
  nick_name?: string
  imageStrs?: string[]
}
const Message = React.memo((props: MessageProps) => {
  const {me, text, avatar, timestamp, nick_name, to_id, user_id, msg_type, imageStrs} =
    props
  const {theme} = React.useContext(ThemeContext)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  const [swiperVisible, setSwiperVisible] = React.useState<boolean>(false)
  const targetIndexRef = React.useRef<any>()
  const imageStrsRef = React.useRef<string[]>([])

  /* 跳转到用户主页 */
  const handleNavigate = () => {
    if (to_id && user_id) {
      navigate.navigate('user_profile', {to_userId: to_id, user_id})
    }
  }

  /* 查看图片 */
  const handleSwiper = () => {
    if (msg_type !== 'image') return
    const index = imageStrs?.findIndex(i => i === text)
    if (index !== undefined) {
      targetIndexRef.current = index
      handleSwiperVisible()
    }
  }
  const handleSwiperVisible = React.useCallback(() => {
    setSwiperVisible(p => !p)
  }, [])

  return (
    <View style={[styles.container, {flexDirection: me ? 'row-reverse' : 'row'}]}>
      <Pressable onPress={handleNavigate}>
        <Avatar
          src={getUnionUrl(avatar)}
          size={44}
        />
      </Pressable>
      <Pressable
        onPress={imageStrs ? handleSwiper : () => {}}
        style={[styles.message_wrapper]}>
        <View
          style={[
            styles.message,
            {
              backgroundColor:
                msg_type === 'image' || msg_type === 'video'
                  ? 'transparent'
                  : theme.colors.clickbg,
            },
          ]}>
          {(msg_type === 'text' || msg_type === 'video') && (
            <>
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
                {msg_type === 'video' ? `[视频消息暂不支持查看]` : text}
              </Text>
            </>
          )}
          {msg_type === 'image' && (
            <View
              style={{
                borderWidth: 1,
                borderRadius: 6,
                borderColor: theme.colors.clickbg,
              }}>
              <Image
                source={{uri: getUnionUrl(text)}}
                style={{width: 200, height: 200, borderRadius: 6}}
              />
            </View>
          )}
          {!msg_type && (
            <>
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
            </>
          )}
        </View>

        <Text
          style={[
            styles.timestamp,
            {color: theme.colors.secondary, textAlign: me ? 'right' : 'left'},
          ]}>
          {getTimeDiff(timestamp, 'time')}
        </Text>
      </Pressable>

      {imageStrs && (
        <Swiper
          source={imageStrs}
          targetIndex={targetIndexRef.current}
          visible={swiperVisible}
          setVisible={setSwiperVisible}
        />
      )}
    </View>
  )
})

export default Message

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    gap: 10,
    overflow: 'hidden',
    marginBottom: 5,
    marginTop: 5,
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
