import React from 'react'
import {Text, View, FlatList, StyleSheet, Pressable} from 'react-native'
import {ThemeContext} from '../theme'
import MyInput from '../components/MyInput/MyInput'
import Avatar from '../components/Avatar/Avatar'
import {Colors} from '../theme/theme-types'
import MyModal from '../components/MyModal/MyModal'
import AIcons from 'react-native-vector-icons/AntDesign'

import {RootStackParamList} from '../types/route'
import {useNavigation, NavigationProp} from '@react-navigation/native'
import {MyContext} from '../context/context'
import {ConversationType} from '../types/chat.type'
import getUnionUrl from '../utils/getUnionUrl'
import {FriendType} from '../types/friend.type'
import {ActionTypes, ActionsType} from '../types/reducer'
import getTimeDiff from '../utils/getTimeDiff'

const Conversation = () => {
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  const {theme} = React.useContext(ThemeContext)
  const {state, dispatch} = React.useContext(MyContext)

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.wrapper]}>
        <MyInput
          placeholder="搜索"
          paddingHorizontal={10}
        />
        <FlatList
          data={state.conversations}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          keyExtractor={({conversation_id}) => conversation_id}
          ItemSeparatorComponent={() => (
            <View style={{paddingLeft: 80}}>
              <View style={{height: 1, backgroundColor: theme.colors.listdivder}} />
            </View>
          )}
          renderItem={({item}) => (
            <RenderItem
              theme={theme.colors}
              navigation={navigate}
              conversation={item}
              friends={state.friends}
              dispatch={dispatch}
            />
          )}
        />
      </View>
    </View>
  )
}

interface RenderItemProps {
  theme: Colors
  navigation: NavigationProp<RootStackParamList>
  conversation: ConversationType
  friends: FriendType[]
  dispatch: React.Dispatch<ActionsType>
}
const RenderItem = (props: RenderItemProps) => {
  const {theme, navigation, conversation, friends, dispatch} = props
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)

  const handleModalVisible = React.useCallback(() => {
    setModalVisible(p => !p)
  }, [])

  const handleTalk = () => {
    const findFriend = friends.find(i => i.friend_id === conversation.conversation_id)
    dispatch({type: ActionTypes.CURRENTTALK, payload: conversation})
    dispatch({
      type: ActionTypes.UPDATECONVERSATIONMSGLENGTH,
      payload: conversation.conversation_id,
    })
    dispatch({
      type: ActionTypes.UPDATEUNREADMESSAGE,
      payload: conversation.conversation_id,
    })
    navigation.navigate('chat', {friend: findFriend!})
  }

  const handleRemoveConversation = () => {
    dispatch({type: ActionTypes.DELCONVERSATION, payload: conversation.conversation_id})
    handleModalVisible()
  }
  return (
    <View>
      <Pressable
        onPress={handleTalk}
        onLongPress={handleModalVisible}
        style={[styles.user]}
        android_ripple={{color: theme.clickbg}}>
        <Avatar
          src={getUnionUrl(conversation.avatar)}
          size={60}
        />
        <View style={{flex: 1}}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[styles.user_name, {color: theme.defaultTextColor}]}>
            {conversation.name}
          </Text>
          {conversation.msg_length > 0 && (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.user_message, {color: theme.secondary}]}>
              {conversation.msg_type === 'video' && `[视频]`}
              {conversation.msg_type === 'image' && `[图片]`}
              {conversation.msg_type === 'text' && conversation.msg}
            </Text>
          )}
        </View>
        <View style={styles.timestamp}>
          <Text style={{color: theme.secondary}}>
            {conversation.msg_createdAt.length > 0 &&
              getTimeDiff(conversation.msg_createdAt, 'time')}
          </Text>
          {conversation.msg_length > 0 && (
            <View style={[styles.message_length, {backgroundColor: theme.primary}]}>
              <Text style={{color: '#FFFFFF'}}>{conversation.msg_length}</Text>
            </View>
          )}
        </View>
      </Pressable>
      <MyModal
        half
        modalVisible={modalVisible}
        setModalVisible={handleModalVisible}
        children={
          <View>
            <Pressable
              onPress={handleRemoveConversation}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 20,
                paddingLeft: 18,
              }}
              android_ripple={{color: theme.clickbg}}>
              <AIcons
                name="delete"
                size={28}
                color={theme.secondary}
              />
              <Text style={{color: theme.defaultTextColor, fontSize: 18}}>
                删除与<Text style={{fontWeight: '500'}}>原小新</Text>的聊天
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  )
}

export default Conversation
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
  },
  wrapper: {
    paddingTop: 10,
    gap: 10,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  user_name: {
    fontSize: 20,
    fontWeight: '500',
  },
  user_message: {
    width: '80%',
  },
  timestamp: {
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 10,
    gap: 4,
  },
  message_length: {
    paddingHorizontal: 5,
    paddingVertical: 0,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
