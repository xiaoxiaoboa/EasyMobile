import React from 'react'
import {View, StyleSheet, Text, Pressable, DrawerLayoutAndroidBase} from 'react-native'
import {ThemeContext} from '../theme'
import FIcons from 'react-native-vector-icons/Feather'
import Divider from '../components/Divider/Divider'
import Message from '../components/Message/Message'
import {FlatList} from 'react-native-gesture-handler'
import MyInput from '../components/MyInput/MyInput'
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native'
import {RootStackParamList} from '../types/route'
import {MessageType, Message_type} from '../types/chat.type'
import {MyContext} from '../context/context'
import getTimeDiff from '../utils/getTimeDiff'
import {updateNotice} from '../api/user.api'

const text = [
  {
    me: false,
    text: `1杨家将是中国历史上著名的军事将领家族之一，起源于宋朝时期。最著名的代表人物为杨业、杨岐、杨坚等，以及杨家将团队的其他成员。杨家将的战功卓著，曾在历次战争中发挥重要作用。他们擅长火器战术和创新性地运用骑兵，并以强大的战斗力和组织能力著称。在宋金战争中，杨家将被派往南方，防守钦州、邕州等城池，保卫南宋国土。杨家将是中国军事史上的传奇之一，也是中国文化中具有重要地位的形象之一。`,
  },
  {
    me: true,
    text: `2杨家将是中国历史上著名的军事将领家族之一，起源于宋朝时期。最著名的代表人物为杨业、杨岐、杨坚等，以及杨家将团队的其他成员。杨家将的战功卓著，曾在历次战争中发挥重要作用。他们擅长火器战术和创新性地运用骑兵，并以强大的战斗力和组织能力著称。在宋金战争中，杨家将被派往南方，防守钦州、邕州等城池，保卫南宋国土。杨家将是中国军事史上的传奇之一，也是中国文化中具有重要地位的形象之一。`,
  },
]

const Chat = () => {
  const {state, dispatch} = React.useContext(MyContext)
  const {theme} = React.useContext(ThemeContext)
  const route = useRoute<RouteProp<RootStackParamList, 'chat'>>()
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  const [messages, setMessages] = React.useState<MessageType[]>([])

  /* 消息已读 */
  React.useEffect(() => {
    updateNotice({source_id: route.params.friend.friend_id}, state.user?.token!)
  }, [])

  React.useEffect(() => {
    /* 私聊 */
    state.socket?.chat.on('private_message', (data: MessageType, callback) => {
      setMessages(p => [...p, data])
      callback('nosave')
    })
    return () => {
      state.socket?.chat.off('private_message')
    }
  }, [])

  /* 获取聊天记录 */
  React.useEffect(() => {
    if (state.current_talk?.isGroup) {
      state.socket?.group.emit(
        'group_chat_history',
        state.current_talk.conversation_id,
        (data: MessageType[]) => {
          // dispatch({type: ActionTypes.CURRENT_MESSAGES, payload: data})
        },
      )
    } else {
      state.socket?.chat.emit(
        'private_chat_history',
        state.user?.result.user_id,
        route.params.friend.friend_id,
        (data: MessageType[]) => {
          setMessages(data)
        },
      )
    }

    return () => {}
  }, [route.params.friend.friend_id])

  const handleGetInputValue = React.useCallback((value: string) => {
    let newMessage: MessageType
    if (state.current_talk?.isGroup) {
    } else {
      newMessage = {
        user_id: state.user?.result.user_id!,
        createdAt: new Date().toISOString(),
        msg: value,
        msg_type: Message_type.TEXT,
        to_id: state.current_talk?.conversation_id!,
        user: {
          avatar: state.user?.result.avatar!,
          nick_name: state.user?.result.nick_name!,
        },
        conversation_id: state.user?.result.user_id!,
        status: 0,
      }
      setMessages(p => [...p, newMessage])

      state.socket?.chat.emit('private_chat', newMessage, (res: any, err: any) => {})
    }
  }, [])

  return (
    <View style={[styles.flex, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.top]}>
        <Pressable
          style={{padding: 6, borderRadius: 50, overflow: 'hidden'}}
          android_ripple={{
            color: theme.colors.clickbg,
            borderless: false,
            foreground: true,
          }}>
          <FIcons
            name="arrow-left"
            size={30}
            color={theme.colors.defaultTextColor}
          />
        </Pressable>
        <Text style={[styles.topText, {color: theme.colors.defaultTextColor}]}>
          {route.params.friend.nick_name}
        </Text>
      </View>
      <Divider />
      <View style={[styles.flex]}>
        <View style={[styles.messages_list]}>
          <FlatList
            data={[...messages].reverse()}
            inverted
            initialNumToRender={15}
            showsVerticalScrollIndicator={false}
            renderItem={({index, item}) => (
              <Message
                avatar={item.user.avatar}
                text={item.msg}
                timestamp={item.createdAt}
                to_id={item.user_id}
                user_id={item.to_id}
                me={item.user_id === state.user?.result.user_id!}
              />
            )}
          />
        </View>
      </View>
      <Divider />
      <View style={[styles.bottom_input]}>
        <MyInput
          placeholder="输入消息"
          hiddenEmoji={false}
          getInputValue={handleGetInputValue}
          paddingHorizontal={10}
          paddingVertical={10}
          editable={route.params.friend.friendship}
        />
      </View>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 10,
  },
  topText: {
    fontSize: 20,
    marginLeft: 10,
  },
  messages_list: {
    padding: 10,
  },
  bottom_input: {
    // padding: 10,
    // flexDirection: 'row',
    // alignItems: 'center',
  },
})
