import React from 'react'
import {View, StyleSheet, FlatList, Image, Text, Pressable, Modal} from 'react-native'
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
import {useRoute, RouteProp} from '@react-navigation/native'
import AIcons from 'react-native-vector-icons/AntDesign'
import {UserType} from '../types/user.type'
import {queryUser} from '../api/user.api'

const UserProfile = () => {
  const {theme} = React.useContext(ThemeContext)
  const {state} = React.useContext(MyContext)
  const [feeds, setFeeds] = React.useState<FeedType[]>([])
  const limitRef = React.useRef<number>(5)
  const offsetRef = React.useRef<number>(0)
  const route = useRoute<RouteProp<RootStackParamList, 'user_profile'>>()

  /* 获取用户帖子 */
  const getMyFeeds = () => {
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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.homebg,
        },
      ]}>
      <FlatList
        data={feeds}
        initialNumToRender={3}
        onEndReachedThreshold={0.3}
        onEndReached={getMyFeeds}
        keyExtractor={({feed_id}) => feed_id}
        ListHeaderComponent={Header}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <FeedCard feed={item} />}
      />
    </View>
  )
}

const Header = React.memo(() => {
  const {theme} = React.useContext(ThemeContext)
  const {state} = React.useContext(MyContext)
  const route = useRoute<RouteProp<RootStackParamList, 'user_profile'>>()
  const [isFriend, setIsFriend] = React.useState<boolean>(
    state.friends.find(i => i.friend_id === route.params.to_userId) ? true : false,
  )
  const [modalVisible, setModalVibisle] = React.useState<boolean>(false)
  const [userInfo, setUserInfo] = React.useState<UserType | undefined>(undefined)

  React.useEffect(() => {
    queryUser(route.params.to_userId, state.user?.token!).then(
      val => val.code === 1 && setUserInfo(val.data),
    )
  }, [route.params.to_userId])

  return (
    <View style={[{backgroundColor: theme.colors.background}]}>
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
          {/* 添加好友按钮 */}
          <Pressable
            onPress={() => setModalVibisle(true)}
            style={({pressed}) => [
              styles.friend_btn,
              {
                backgroundColor: isFriend ? theme.colors.divider : theme.colors.primary,
                transform: [{scale: pressed ? 0.97 : 1}],
                opacity: pressed ? 0.9 : 1,
              },
            ]}>
            <Icons
              name={isFriend ? 'checkmark' : 'person-add-outline'}
              size={20}
              color={isFriend ? theme.colors.defaultTextColor : '#FFFFFF'}
            />
            <Text
              style={{
                color: isFriend ? theme.colors.defaultTextColor : '#FFFFFF',
                fontSize: 16,
                fontWeight: '500',
              }}>
              {isFriend ? '好友' : '添加好友'}
            </Text>
          </Pressable>

          {isFriend && (
            <>
              {/* 发消息按钮 */}
              <Pressable
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
        modalVisible={modalVisible}
        setModalVisible={setModalVibisle}
        children={
          <View style={[styles.modal_options]}>
            <Pressable
              style={[styles.modal_option]}
              android_ripple={{color: theme.colors.clickbg}}>
              <AIcons
                name="deleteuser"
                size={30}
                color="#ff5757ed"
              />
              <View>
                <Text style={{fontSize: 18, color: '#ff5757', fontWeight: '500'}}>
                  接触与{userInfo?.nick_name}好友关系
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
    </View>
  )
})

export default UserProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {},
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
