import React from 'react'
import {View, StyleSheet, Text, Pressable} from 'react-native'
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
import {messageUpload, updateNotice} from '../api/user.api'
import Icons from 'react-native-vector-icons/Ionicons'
import MyModal from '../components/MyModal/MyModal'
import {Asset, launchCamera, launchImageLibrary} from 'react-native-image-picker'
import FAIcons from 'react-native-vector-icons/FontAwesome'
import myToast from '../utils/Toast'
import {ActionTypes} from '../types/reducer'

const Chat = () => {
  const {state, dispatch} = React.useContext(MyContext)
  const {theme} = React.useContext(ThemeContext)
  const route = useRoute<RouteProp<RootStackParamList, 'chat'>>()
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  const [messages, setMessages] = React.useState<MessageType[]>([])
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const listRef = React.useRef<FlatList | null>(null)

  /* 消息已读 */
  React.useEffect(() => {
    updateNotice({source_id: route.params.friend.friend_id}, state.user?.token!)

    return () => {
      dispatch({type: ActionTypes.CURRENTTALK, payload: undefined})
    }
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
      // state.socket?.group.emit(
      //   'group_chat_history',
      //   state.current_talk.conversation_id,
      //   (data: MessageType[]) => {
      //     dispatch({type: ActionTypes.CURRENT_MESSAGES, payload: data})
      //   },
      // )
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
    handleMessage(value, Message_type.TEXT)
  }, [])

  /* 选择相册内资源 */
  const getGallery = () => {
    setModalVisible(false)
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      ({assets}) => {
        if (assets) {
          messageUpload(
            assets[0],
            state.user?.result.user_id!,
            route.params.friend.friend_id,
            state.user?.token!,
          ).then(val => {
            if (val.code === 1) {
              handleMessage(val.data, Message_type.IMAGE)
            } else {
              myToast('无法发送，你和对方不是双向好友')
              dispatch({
                type: ActionTypes.UPDATEFRIEND,
                payload: state.current_talk?.conversation_id!,
              })
            }
          })
        }
      },
    )
  }

  /* 启动相机 */
  const startCamera = () => {
    launchCamera(
      {mediaType: 'photo', cameraType: 'back', videoQuality: 'low', durationLimit: 30},
      ({assets}) => {
        if (assets) {
          messageUpload(
            assets[0],
            state.user?.result.user_id!,
            route.params.friend.friend_id,
            state.user?.token!,
          ).then(val => {
            if (val.code === 1) {
              handleMessage(val.data, Message_type.IMAGE)
            }
          })
        }
      },
    )
    setModalVisible(p => !p)
  }
  /* 生成message */
  const handleMessage = (value: string, type: Message_type) => {
    let newMessage: MessageType
    if (state.current_talk?.isGroup) {
      /* 群组消息 */
    } else {
      console.log(state.user)
      newMessage = {
        user_id: state.user?.result.user_id!,
        createdAt: new Date().toISOString(),
        msg: value,
        msg_type: type,
        to_id: state.current_talk?.conversation_id!,
        user: {
          avatar: state.user?.result.avatar!,
          nick_name: state.user?.result.nick_name!,
        },
        conversation_id: state.user?.result.user_id!,
        status: 0,
      }
      setMessages(p => [...p, newMessage])
      listRef.current?.scrollToIndex({index: 0, animated: true})

      state.socket?.chat.emit('private_chat', newMessage, (res: any, err: any) => {
        if (res === false) {
          myToast('无法发送，你和对方不是双向好友')
          dispatch({
            type: ActionTypes.UPDATEFRIEND,
            payload: state.current_talk?.conversation_id!,
          })
        }
      })
    }
  }

  /* modal控制 */
  const handleModalVisible = React.useCallback(() => {
    setModalVisible(p => !p)
  }, [])

  return (
    <View style={[styles.flex, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.top]}>
        <Pressable
          onPress={() => navigate.goBack()}
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
            ref={listRef}
            data={route.params.friend.friendship ? [...messages].reverse() : []}
            inverted
            keyboardDismissMode="on-drag"
            initialNumToRender={50}
            maxToRenderPerBatch={15}
            contentContainerStyle={
              route.params.friend.friendship
                ? []
                : {
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }
            }
            ListEmptyComponent={
              <View>
                <Text style={{color: theme.colors.secondary}}>
                  {!route.params.friend.friendship &&
                    '无法聊天，你和对方不是双向好友关系'}
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            renderItem={({index, item}) => (
              <Message
                avatar={item.user.avatar}
                text={item.msg}
                timestamp={item.createdAt}
                to_id={item.user_id}
                user_id={item.to_id}
                me={item.user_id === state.user?.result.user_id!}
                msg_type={item.msg_type}
                imageStrs={messages
                  .filter(i => i.msg_type === 'image')
                  .map(i => i.msg)
                  .reverse()}
              />
            )}
          />
        </View>
      </View>
      <Divider />
      <View style={[styles.bottom_wrapper]}>
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
        <Pressable
          onPress={handleModalVisible}
          style={{marginRight: 10}}>
          <Icons
            name="add-circle-outline"
            size={36}
            color={theme.colors.secondary}
          />
        </Pressable>
      </View>
      {/* modal */}
      <MyModal
        half
        modalVisible={modalVisible}
        setModalVisible={handleModalVisible}
        children={
          <View style={[styles.options]}>
            <Pressable
              onPress={() => getGallery()}
              style={[styles.option]}
              android_ripple={{color: theme.colors.clickbg}}>
              <FAIcons
                name="file-photo-o"
                size={30}
                color={theme.colors.secondary}
              />
              <Text style={[styles.option_text, {color: theme.colors.defaultTextColor}]}>
                从相册里选择
              </Text>
            </Pressable>
            <Pressable
              onPress={() => startCamera()}
              style={[styles.option]}
              android_ripple={{color: theme.colors.clickbg}}>
              <FAIcons
                name="camera"
                size={30}
                color={theme.colors.secondary}
              />
              <Text style={[styles.option_text, {color: theme.colors.defaultTextColor}]}>
                使用相机拍照片
              </Text>
            </Pressable>
          </View>
        }
      />
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
    flex: 1,
    paddingHorizontal: 10,
  },
  bottom_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottom_input: {
    flex: 1,
  },
  options: {
    justifyContent: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 18,
    paddingVertical: 20,
  },
  option_text: {
    fontSize: 18,
  },
})
