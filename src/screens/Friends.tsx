import React from 'react'
import {StyleSheet, View, Text, FlatList, Pressable} from 'react-native'
import {ThemeContext} from '../theme'
import MyInput from '../components/MyInput/MyInput'
import Avatar from '../components/Avatar/Avatar'
import MIcons from 'react-native-vector-icons/MaterialIcons'
import Divider from '../components/Divider/Divider'
import MyModal from '../components/MyModal/MyModal'
import {Colors} from '../theme/theme-types'
import Icons from 'react-native-vector-icons/Ionicons'
import AIcons from 'react-native-vector-icons/AntDesign'
import {deleteFriend} from '../api/user.api'
import {MyContext} from '../context/context'
import {ActionTypes} from '../types/reducer'
import myToast from '../utils/Toast'
import {FriendType} from '../types/friend.type'
import getUnionUrl from '../utils/getUnionUrl'
import getTimeDiff from '../utils/getTimeDiff'
import {useNavigation, NavigationProp} from '@react-navigation/native'
import {RootStackParamList} from '../types/route'

const Friends = () => {
  const {theme} = React.useContext(ThemeContext)
  const {state, dispatch} = React.useContext(MyContext)

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* 顶部 */}
      <View style={[styles.top]}>
        <View>
          <Text style={[styles.title, {color: theme.colors.defaultTextColor}]}>好友</Text>
        </View>
        <View>
          <MyInput
            placeholder="搜索"
            paddingVertical={10}
          />
        </View>
        <Pressable
          style={({pressed}) => [
            styles.request,
            {
              backgroundColor: theme.colors.clickbg,
              transform: [{scale: pressed ? 0.97 : 1}],
            },
          ]}>
          <Text
            style={{
              color: theme.colors.defaultTextColor,
              fontWeight: '500',
              fontSize: 16,
            }}>
            好友申请
          </Text>
        </Pressable>
        <Divider />
      </View>

      {/* 列表 */}
      <FlatList
        data={state.friends}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={50}
        renderItem={({item}) => (
          <RenderItem
            friend={item}
            theme={theme.colors}
          />
        )}
      />
    </View>
  )
}

interface RenderItemProps {
  theme: Colors
  friend: FriendType
}
const RenderItem = React.memo((props: RenderItemProps) => {
  const {friend, theme} = props
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()

  const handleModalVisible = React.useCallback((visible: boolean) => {
    setModalVisible(visible)
  }, [])
  return (
    <>
      <Pressable
        onPress={() =>
          navigate.navigate('user_profile', {
            user_id: friend.user_id,
            to_userId: friend.friend_id,
          })
        }
        style={[styles.user]}
        android_ripple={{color: theme.clickbg}}>
        <Avatar
          src={getUnionUrl(friend.avatar)}
          size={60}
        />
        <Text style={[styles.user_name, {color: theme.defaultTextColor}]}>
          {friend.nick_name}
        </Text>
        <Pressable
          onPress={() => handleModalVisible(true)}
          style={[styles.user_btn]}
          hitSlop={15}
          android_ripple={{
            color: theme.clickbg,
            foreground: true,
            borderless: false,
          }}>
          <MIcons
            name="more-horiz"
            size={28}
            color={theme.defaultTextColor}
          />
        </Pressable>
      </Pressable>

      {/* modal */}
      <MyModal
        half
        modalVisible={modalVisible}
        setModalVisible={handleModalVisible}
        children={
          <ModalContent
            friend={friend}
            theme={theme}
          />
        }
      />
    </>
  )
})

interface ModalContentProps {
  theme: Colors
  friend: FriendType
}
const ModalContent = React.memo((props: ModalContentProps) => {
  const {theme, friend} = props
  const {state, dispatch} = React.useContext(MyContext)
  const dateRef = React.useRef(new Date(friend.createdAt)).current

  const handleDeleteFriend = () => {
    deleteFriend(state.user?.result.user_id!, friend.friend_id, state.user?.token!).then(
      val => {
        if (val.code === 1) {
          dispatch({type: ActionTypes.DELFRIEND, payload: friend.friend_id})
          /* 删除时如果有对话，一起删掉 */
          if (state.conversations.find(i => i.conversation_id === friend.friend_id)) {
            dispatch({type: ActionTypes.DELCONVERSATION, payload: friend.friend_id})
          }
        }
      },
    )
  }
  return (
    <View>
      <View style={[styles.options_top]}>
        <Avatar
          src={getUnionUrl(friend.avatar)}
          size={56}
        />
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '500',
              color: theme.defaultTextColor,
            }}>
            {friend.nick_name}
          </Text>
          <Text style={{color: theme.secondary}}>
            从{dateRef.getFullYear()}年{dateRef.getMonth() + 1}月{dateRef.getDate()}
            日成为好友 · {getTimeDiff(friend.createdAt)}
          </Text>
        </View>
      </View>
      <Divider />
      <View style={[styles.options]}>
        <Pressable
          style={[styles.option]}
          android_ripple={{color: theme.clickbg}}>
          <Icons
            name="chatbubbles-outline"
            size={30}
            color={theme.secondary}
          />
          <Text style={{fontSize: 18, color: theme.defaultTextColor}}>
            发消息给<Text style={{fontWeight: '500'}}>{friend.nick_name}</Text>
          </Text>
        </Pressable>
        <Pressable
          onPress={handleDeleteFriend}
          style={[styles.option]}
          android_ripple={{color: theme.clickbg}}>
          <AIcons
            name="deleteuser"
            size={30}
            color="#ff5757ed"
          />
          <View>
            <Text style={{fontSize: 18, color: '#ff5757', fontWeight: '500'}}>
              删除好友
            </Text>
            <Text style={[{color: theme.secondary}]}>
              永久删除好友<Text style={{fontWeight: '500'}}>{friend.nick_name}</Text>
              的全部相关信息
            </Text>
          </View>
        </Pressable>
        <View></View>
      </View>
    </View>
  )
})

export default Friends

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
  },
  top: {
    paddingHorizontal: 10,
  },
  title_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
  },
  user: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  user_name: {
    fontSize: 20,
    fontWeight: '500',
  },
  user_btn: {
    marginLeft: 'auto',
    borderRadius: 50,
    padding: 6,
    overflow: 'hidden',
  },
  request: {
    marginRight: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 6,
  },
  options: {
    paddingTop: 10,
  },
  options_top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 10,
  },
})
