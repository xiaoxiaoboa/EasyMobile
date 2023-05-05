import React from 'react'
import {View, StyleSheet, FlatList, Image, Text, Pressable} from 'react-native'
import Avatar from '../components/Avatar/Avatar'
import {ThemeContext} from '../theme'
import Icons from 'react-native-vector-icons/Ionicons'
import FeedCard from '../components/FeedCard/FeedCard'
import MyModal from '../components/MyModal/MyModal'
import {RootStackParamList} from '../types/route/index'
import getUnionUrl from '../utils/getUnionUrl'
import {MyContext} from '../context/context'
import {FeedType} from '../types/feed.type'
import {feeds_query} from '../api/feed.api'
import myToast from '../utils/Toast'
import {
  useRoute,
  RouteProp,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native'
import AIcons from 'react-native-vector-icons/AntDesign'
import {UserType} from '../types/user.type'
import {deleteFriend, queryUser} from '../api/user.api'
import FIcons from 'react-native-vector-icons/Feather'
import Divider from '../components/Divider/Divider'
import {ActionTypes} from '../types/reducer'
import {ConversationType, Message_type} from '../types/chat.type'
import {Notice_type} from '../types/notice.type'
import {FriendType} from '../types/friend.type'
import {useNetInfo} from '@react-native-community/netinfo'

const UserProfile = () => {
  const {theme} = React.useContext(ThemeContext)
  const {state} = React.useContext(MyContext)
  const [feeds, setFeeds] = React.useState<FeedType[]>([])
  const limitRef = React.useRef<number>(5)
  const offsetRef = React.useRef<number>(0)
  const route = useRoute<RouteProp<RootStackParamList, 'user_profile'>>()
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  const [userInfo, setUserInfo] = React.useState<UserType | undefined>(undefined)
  const {isInternetReachable} = useNetInfo()

  React.useEffect(() => {
    queryUser(route.params.to_userId, state.user?.token!).then(
      val => val.code === 1 && setUserInfo(val.data),
    )
  }, [route.params.to_userId, isInternetReachable])

  /* 获取用户帖子 */
  const getMyFeeds = React.useCallback(() => {
    if (isInternetReachable) {
      feeds_query(
        route.params.to_userId,
        limitRef.current,
        offsetRef.current,
        state.user?.token!,
      ).then(val => {
        if (val.code === 1) {
          setFeeds(p => [...p, ...val.data])
          offsetRef.current += limitRef.current
        }
      })
    }
  }, [isInternetReachable])

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.homebg,
        },
      ]}>
      <View style={[styles.top, {backgroundColor: theme.colors.background}]}>
        <Pressable
          style={[styles.back_btn]}
          android_ripple={{
            color: theme.colors.clickbg,
            borderless: false,
            foreground: true,
          }}
          onPress={() => navigate.goBack()}>
          <FIcons
            name="arrow-left"
            size={30}
            color={theme.colors.defaultTextColor}
          />
        </Pressable>
        <Text style={[styles.top_text, {color: theme.colors.defaultTextColor}]}>
          {userInfo?.nick_name}
        </Text>
      </View>
      <Divider />
      <FlatList
        data={feeds}
        initialNumToRender={3}
        maxToRenderPerBatch={10}
        onEndReachedThreshold={0.3}
        onEndReached={getMyFeeds}
        keyExtractor={({feed_id}) => feed_id}
        ListEmptyComponent={
          <View style={[styles.empty]}>
            <Text style={{color: theme.colors.secondary}}>
              {isInternetReachable ? 'ta还没有发帖子哟~' : '你没有连接网络哎，这怎么玩儿'}
            </Text>
          </View>
        }
        ListHeaderComponent={
          <Header
            userInfo={userInfo}
            navigate={navigate}
          />
        }
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <FeedCard key={item.feed_id} feed={item} />}
      />
    </View>
  )
}

interface HeaderProps {
  userInfo: UserType | undefined
  navigate: NavigationProp<RootStackParamList>
}
const Header = React.memo((props: HeaderProps) => {
  const {userInfo, navigate} = props
  const {theme} = React.useContext(ThemeContext)
  const {state, dispatch} = React.useContext(MyContext)
  const route = useRoute<RouteProp<RootStackParamList, 'user_profile'>>()
  const {isInternetReachable} = useNetInfo()

  const findFriend = React.useMemo(
    () => state.friends.find(i => i.friend_id === route.params.to_userId),
    [state.friends],
  )
  const [isFriend, setIsFriend] = React.useState<boolean>(findFriend ? true : false)
  const [delFriendModalVisible, setDelFriendModalVisible] = React.useState<boolean>(false)
  const [responseRequestModalVisible, setResponseRequestModalVisible] =
    React.useState<boolean>(false)

  /* 删除好友 */
  const handleDeleteFriend = () => {
    deleteFriend(
      state.user?.result.user_id!,
      userInfo?.user_id!,
      state.user?.token!,
    ).then(val => {
      if (val.code === 1) {
        dispatch({type: ActionTypes.DELFRIEND, payload: userInfo?.user_id!})
        setIsFriend(false)
        setDelFriendModalVisible(p => !p)
        myToast('解除好友关系')
        /* 删除时如果有对话，一起删掉 */
        if (state.conversations.find(i => i.conversation_id === userInfo?.user_id!)) {
          dispatch({type: ActionTypes.DELCONVERSATION, payload: userInfo?.user_id!})
        }
      }
    })
  }

  /* 发送消息 */
  const handleTalk = () => {
    if (!state.conversations.find(i => i.conversation_id === findFriend?.friend_id)) {
      const newConversation: ConversationType = {
        conversation_id: findFriend?.friend_id!,
        avatar: findFriend?.avatar!,
        isGroup: false,
        name: findFriend?.nick_name!,
        msg: '',
        msg_length: 0,
        msg_type: Message_type.TEXT,
        user_name: findFriend?.nick_name!,
        msg_createdAt: '',
      }
      dispatch({type: ActionTypes.CURRENTTALK, payload: newConversation})
      dispatch({
        type: ActionTypes.UPDATEUNREADMESSAGE,
        payload: newConversation.conversation_id,
      })

      dispatch({type: ActionTypes.NEWCONVERSATION, payload: newConversation})
    }
    navigate.navigate('chat', {friend: findFriend!})
  }

  /* 发送添加好友申请 */
  const handleSendFriendRequest = () => {
    state.socket?.notice.emit(
      'friendsRequest',
      state.user?.result.user_id,
      route.params.to_userId,
    )
  }
  /* 打开删除好友modal */
  const handleDelFriendModal = React.useCallback(() => {
    setDelFriendModalVisible(p => !p)
  }, [])
  /* 打开处理好友申请modal */
  const handleResponseRequestModal = React.useCallback(() => {
    setResponseRequestModalVisible(p => !p)
  }, [])

  /* 同意好友申请 */
  const handleAgreeRequest = () => {
    state.socket?.notice.emit(
      'agreeRequest',
      state.user?.result.user_id,
      route.params.to_userId,
      route.params?.notice?.notice_id,
      (res: any, err: any) => {
        if (res) {
          const newFriend: FriendType = {
            avatar: userInfo?.avatar!,
            createdAt: Date(),
            friend_id: userInfo?.user_id!,
            friendship: true,
            nick_name: userInfo?.nick_name!,
            user_id: route.params.user_id!,
          }
          handleResponseRequestModal()
          dispatch({type: ActionTypes.ADDFRIEND, payload: newFriend})
          setIsFriend(p => !p)
          dispatch({
            type: ActionTypes.READNOTICE,
            payload: route.params?.notice?.notice_id!,
          })
        }
      },
    )
  }
  /* 拒绝好友申请 */
  const handleRejectRequest = () => {
    state.socket?.notice.emit(
      'rejectRequest',
      route.params?.notice?.notice_id!,
      route.params.to_userId,
      state.user?.result.user_id!,
    )
    dispatch({
      type: ActionTypes.READNOTICE,
      payload: route.params?.notice?.notice_id!,
    })
    handleResponseRequestModal()
  }

  return (
    <View style={[{backgroundColor: theme.colors.background}]}>
      {!isInternetReachable && (
        <View style={[styles.noNetwork]}>
          <Text style={{color: '#FFFFFF'}}>没有网络连接，正在重试...</Text>
        </View>
      )}
      {/* 背景图 */}
      <View>
        <Image
          style={{width: '100%', height: 240}}
          source={
            userInfo
              ? {uri: getUnionUrl(userInfo.profile_img)}
              : require('../assets/avatar.png')
          }
        />
      </View>
      {/* 头像和名字 */}
      <View style={[styles.avatar_wrapper]}>
        <View
          style={[
            styles.avatar,
            {
              borderColor: theme.colors.background,
            },
          ]}>
          <Avatar
            src={getUnionUrl(userInfo?.avatar)}
            size={150}
            borderRadius={120}
          />
        </View>
        {/* 名字 */}
        <Text
          style={[
            styles.name,
            {
              color: theme.colors.defaultTextColor,
              paddingLeft: 10,
            },
          ]}>
          {userInfo?.nick_name}
        </Text>
        {/* 按钮 */}
        <View style={[styles.group_btns, {gap: 10}]}>
          {/* 删除好友按钮 */}
          {isFriend && (
            <Pressable
              onPress={handleDelFriendModal}
              style={({pressed}) => [
                styles.friend_btn,
                {
                  backgroundColor: theme.colors.divider,
                  transform: [{scale: pressed ? 0.97 : 1}],
                  opacity: pressed ? 0.9 : 1,
                },
              ]}>
              <Icons
                name="checkmark"
                size={20}
                color={theme.colors.defaultTextColor}
              />
              <Text
                style={{
                  color: theme.colors.defaultTextColor,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                好友
              </Text>
            </Pressable>
          )}

          {/* 好友申请按钮 */}
          {!isFriend && route.params?.notice?.type !== Notice_type.FRIENDREQUEST && (
            <Pressable
              onPress={handleSendFriendRequest}
              style={({pressed}) => [
                styles.friend_btn,
                {
                  backgroundColor: theme.colors.primary,
                  transform: [{scale: pressed ? 0.97 : 1}],
                  opacity: pressed ? 0.9 : 1,
                },
              ]}>
              <Icons
                name="person-add-outline"
                size={20}
                color="#FFFFFF"
              />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                添加好友
              </Text>
            </Pressable>
          )}

          {/* 好友申请处理按钮 */}
          {route.params?.notice?.type === Notice_type.FRIENDREQUEST && !isFriend && (
            <Pressable
              onPress={handleResponseRequestModal}
              style={({pressed}) => [
                styles.friend_btn,
                {
                  backgroundColor: '#42b72a',
                  transform: [{scale: pressed ? 0.97 : 1}],
                  opacity: pressed ? 0.9 : 1,
                },
              ]}>
              <Icons
                name="person-add-outline"
                size={20}
                color={'#FFFFFF'}
              />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                处理ta的好友申请
              </Text>
            </Pressable>
          )}

          {isFriend && (
            <>
              {/* 发消息按钮 */}
              <Pressable
                onPress={handleTalk}
                style={({pressed}) => [
                  styles.friend_btn,
                  {
                    backgroundColor: theme.colors.primary,
                    transform: [{scale: pressed ? 0.97 : 1}],
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}>
                <Icons
                  name="chatbubble-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '500',
                  }}>
                  发消息
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <MyModal
        half
        modalVisible={delFriendModalVisible}
        setModalVisible={handleDelFriendModal}
        children={
          <View style={[styles.modal_options]}>
            <Pressable
              onPress={handleDeleteFriend}
              style={[styles.modal_option]}
              android_ripple={{color: theme.colors.clickbg}}>
              <AIcons
                name="deleteuser"
                size={30}
                color="#ff5757ed"
              />
              <View>
                <Text style={{fontSize: 18, color: '#ff5757', fontWeight: '500'}}>
                  解除与{userInfo?.nick_name}的好友关系
                </Text>
                <Text style={[{color: theme.colors.secondary}]}>
                  永久删除好友
                  <Text style={{fontWeight: '500'}}>{userInfo?.nick_name}</Text>
                  的全部相关信息
                </Text>
              </View>
            </Pressable>
          </View>
        }
      />

      <MyModal
        half
        modalVisible={responseRequestModalVisible}
        setModalVisible={handleResponseRequestModal}
        children={
          <View style={[styles.modal_options]}>
            <Pressable
              onPress={handleAgreeRequest}
              style={[styles.modal_option, {justifyContent: 'center', paddingLeft: 0}]}
              android_ripple={{color: theme.colors.clickbg}}>
              <Text
                style={{
                  fontSize: 18,
                  color: theme.colors.defaultTextColor,
                  fontWeight: '500',
                }}>
                同意
              </Text>
            </Pressable>
            <Pressable
              onPress={handleRejectRequest}
              style={[styles.modal_option, {justifyContent: 'center', paddingLeft: 0}]}
              android_ripple={{color: theme.colors.clickbg}}>
              <Text
                style={{
                  fontSize: 18,
                  color: theme.colors.defaultTextColor,
                  fontWeight: '500',
                }}>
                拒绝
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  )
})

export default UserProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noNetwork: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fb8c8c',
  },
  top: {
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  back_btn: {
    padding: 6,
    borderRadius: 50,
    overflow: 'hidden',
    marginLeft: 10,
    position: 'absolute',
    left: 0,
    top: 4,
  },
  top_text: {
    fontSize: 24,
  },
  avatar_wrapper: {
    gap: 10,
    alignItems: 'flex-start',
    paddingTop: 40,
  },
  avatar: {
    position: 'absolute',
    top: -120,
    left: 10,
    borderWidth: 5,
    borderRadius: 120,
  },
  name: {
    fontSize: 30,
    fontWeight: '500',
  },

  background_btn: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  group_btns: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  friend_btn: {
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  setting: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  modal_options: {
    justifyContent: 'center',
  },
  modal_option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingLeft: 18,
    gap: 10,
  },
  modal_option_text: {
    fontSize: 18,
  },
})
