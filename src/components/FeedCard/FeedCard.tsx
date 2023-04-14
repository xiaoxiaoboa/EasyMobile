import React from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import {ThemeContext} from '../../theme'
import Avatar from '../Avatar/Avatar'
import MIcons from 'react-native-vector-icons/MaterialIcons'
import FIcons from 'react-native-vector-icons/FontAwesome'
import OIcons from 'react-native-vector-icons/Octicons'
import AIcons from 'react-native-vector-icons/AntDesign'
import Divider from '../Divider/Divider'
import Attaches from './Attaches'
import MyModal from '../MyModal/MyModal'
import {useNavigation, NavigationProp} from '@react-navigation/native'
import {RootStackParamList} from '../../types/route'
import {FeedType} from '../../types/feed.type'
import getUnionUrl from '../../utils/getUnionUrl'
import {MyContext} from '../../context/context'
import {feed_delete, feed_fav, feed_like} from '../../api/feed.api'
import {ActionTypes} from '../../types/reducer'
import myToast from '../../utils/Toast'

interface FeedCardProps {
  feed: FeedType
  clickComment?: boolean
  checkNoticeDelFeed?: () => void
}
const FeedCard = React.memo((props: FeedCardProps) => {
  const {feed, clickComment = false, checkNoticeDelFeed} = props
  const {theme} = React.useContext(ThemeContext)
  const {state, dispatch} = React.useContext(MyContext)
  const [menuModalVisible, setMenuModalVisible] = React.useState<boolean>(false)
  const [isLiked, setIsLiked] = React.useState<boolean>(
    feed.feed_likeds.find(i => i.liked === state.user?.result.user_id) ? true : false,
  )
  const [likedCount, setLikedCount] = React.useState<number>(feed.feed_likeds.length)
  const [isFav, setIsFav] = React.useState<boolean>(
    feed.user_favourites.find(i => i.user_id === state.user?.result.user_id)
      ? true
      : false,
  )
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()

  /* 控制菜单modal */
  const handleMenuModalVisible = React.useCallback(() => {
    setMenuModalVisible(p => !p)
  }, [])

  /* 点赞 */
  const handleLike = () => {
    if (!state.user) return
    feed_like(
      feed.feed_id,
      state.user.result.user_id,
      feed.feed_userID,
      state.user.token,
    ).then(val => {
      if (val.code === 1) {
        setIsLiked(p => !p)
        setLikedCount(p => (isLiked ? p - 1 : p + 1))
      }
    })
  }
  /* 收藏 */
  const handleFavourite = () => {
    feed_fav(feed.feed_id, state.user?.result.user_id!, state.user?.token!).then(val => {
      if (val.code === 1) {
        setIsFav(p => !p)
        setMenuModalVisible(p => !p)
        myToast(val.message)
      }
    })
  }
  /* 删除 */
  const handleRemove = () => {
    feed_delete(feed.feed_id, state.user?.token!).then(val => {
      if (val.code === 1) {
        dispatch({type: ActionTypes.DELFEED, payload: feed.feed_id})

        setMenuModalVisible(p => !p)
        /* 在查看通知页面进入帖子时，点击删除帖子触发 */
        checkNoticeDelFeed && checkNoticeDelFeed()
        myToast(val.message)
      }
    })
  }
  /* 跳转至用户主页 */
  const handleNavigate = () => {
    if (state.user?.result.user_id === feed.feed_userID) return
    navigate.navigate('user_profile', {
      user_id: state.user?.result.user_id!,
      to_userId: feed.feed_userID,
    })
  }
  /* 评论 */
  const handleComment = () => {
    !clickComment &&
      navigate.navigate('comment', {
        feed_id: feed.feed_id,
        feed_userId: feed.feed_userID,
        user: state.user,
      })
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.wrapper]}>
        {/* 顶部 */}
        <View style={[styles.top]}>
          {/* 头像 */}
          <Pressable
            onPress={handleNavigate}
            style={[styles.top_avatar]}>
            <Avatar
              src={getUnionUrl(
                state.user?.result.user_id === feed.feed_userID
                  ? state.user?.result.avatar
                  : feed.user.avatar,
              )}
              size={40}
            />
            <View>
              <Text style={[styles.top_name, {color: theme.colors.defaultTextColor}]}>
                {feed.user.nick_name}
              </Text>
              <Text style={[styles.top_timestamp, {color: theme.colors.secondary}]}>
                {feed.createdAt}
              </Text>
            </View>
          </Pressable>
          {/* 菜单按钮 */}
          {state.user && state.user.result.user_id === feed.feed_userID && (
            <Pressable
              hitSlop={10}
              onPress={handleMenuModalVisible}
              style={{
                marginLeft: 'auto',
                padding: 4,
                borderRadius: 50,
                overflow: 'hidden',
              }}
              android_ripple={{
                color: theme.colors.clickbg,
                borderless: false,
                foreground: true,
              }}>
              <MIcons
                name="more-horiz"
                size={30}
                color={isFav ? theme.colors.primary : theme.colors.secondary}
              />
            </Pressable>
          )}
        </View>
        {/* 中部 */}
        <View>
          {feed.feed_text.length > 0 && (
            <View style={{paddingHorizontal: 10, marginBottom: 10}}>
              <Text style={{fontSize: 18, color: theme.colors.defaultTextColor}}>
                {feed.feed_text}
              </Text>
            </View>
          )}
          <View style={[styles.middle, {backgroundColor: theme.colors.divider}]}>
            <Attaches attaches={feed.feed_attaches} />
          </View>
        </View>
        {/* 底部 */}
        <View style={[styles.bottom]}>
          <View style={[styles.bootom_count]}>
            <Text style={{color: theme.colors.secondary}}>{likedCount}个赞</Text>
            <Text style={{color: theme.colors.secondary}}>·</Text>
            <Text style={{color: theme.colors.secondary}}>
              {feed.comment_count}条评论
            </Text>
          </View>
          <Divider />
          <View style={[styles.bottom_btns]}>
            {/* 点赞 */}
            <Pressable
              onPress={handleLike}
              style={[styles.bottom_btn]}
              android_ripple={{
                color: theme.colors.divider,
                borderless: false,
              }}>
              {isLiked ? (
                <FIcons
                  size={24}
                  name="thumbs-up"
                  color={theme.colors.primary}
                />
              ) : (
                <FIcons
                  size={24}
                  name="thumbs-o-up"
                  color={theme.colors.secondary}
                />
              )}

              <Text style={{color: theme.colors.secondary}}>赞</Text>
            </Pressable>
            {/* 评论 */}
            <Pressable
              style={[styles.bottom_btn]}
              onPress={handleComment}
              android_ripple={{
                color: theme.colors.divider,
                borderless: false,
              }}>
              <OIcons
                size={22}
                name="comment"
                color={theme.colors.secondary}
              />
              <Text style={{color: theme.colors.secondary}}>评论</Text>
            </Pressable>
            {/* 分享 */}
            <Pressable
              onPress={() => myToast('功能正在准备中...')}
              style={[styles.bottom_btn]}
              android_ripple={{
                color: theme.colors.divider,
                borderless: false,
              }}>
              <OIcons
                size={22}
                name="share-android"
                color={theme.colors.secondary}
              />
              <Text style={{color: theme.colors.secondary}}>分享</Text>
            </Pressable>
          </View>
        </View>

        {/* 菜单modal */}
        <MyModal
          half
          modalVisible={menuModalVisible}
          setModalVisible={handleMenuModalVisible}
          children={
            <View style={[styles.options]}>
              <Pressable
                onPress={handleFavourite}
                style={[styles.option, {paddingLeft: isFav ? 18 : 22}]}
                android_ripple={{color: theme.colors.clickbg}}>
                {isFav ? (
                  <OIcons
                    name="bookmark-slash"
                    size={30}
                    color={theme.colors.secondary}
                  />
                ) : (
                  <OIcons
                    name="bookmark"
                    size={30}
                    color={theme.colors.secondary}
                  />
                )}
                <Text
                  style={[
                    styles.option_text,
                    {marginLeft: 4, color: theme.colors.defaultTextColor},
                  ]}>
                  {isFav ? '从收藏夹移除这个帖子' : '收藏这个帖子'}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleRemove}
                style={[styles.option, {paddingLeft: 18}]}
                android_ripple={{color: theme.colors.clickbg}}>
                <AIcons
                  name="delete"
                  size={28}
                  color={theme.colors.secondary}
                />
                <View>
                  <Text
                    style={[styles.option_text, {color: theme.colors.defaultTextColor}]}>
                    删除这个帖子
                  </Text>
                  <Text style={{color: theme.colors.secondary}}>
                    永久删除帖子所有信息
                  </Text>
                </View>
              </Pressable>
            </View>
          }
        />
      </View>
    </View>
  )
})

export default FeedCard

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    marginTop: 10,
  },
  wrapper: {},
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  top_avatar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  top_name: {
    fontSize: 18,
    fontWeight: '500',
  },
  top_timestamp: {
    fontSize: 12,
  },
  middle: {flexDirection: 'row', flexWrap: 'wrap', maxHeight: 360},
  bottom: {
    padding: 10,
  },
  bootom_count: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bottom_btns: {
    flexDirection: 'row',
    marginTop: 6,
  },
  bottom_btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '33.3%',
    paddingVertical: 4,
  },
  options: {
    justifyContent: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 20,
  },
  option_text: {
    fontSize: 18,
  },
})
