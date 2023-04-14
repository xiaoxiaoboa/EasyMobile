import React from 'react'
import {StyleSheet, View, FlatList, Pressable, Text} from 'react-native'
import {
  useNavigation,
  NavigationProp,
  useRoute,
  RouteProp,
} from '@react-navigation/native'
import {RootStackParamList} from '../types/route'
import {MyContext} from '../context/context'
import {FeedType, Feed_CommentType} from '../types/feed.type'
import FeedCard from '../components/FeedCard/FeedCard'
import {comment_publish, feed_comments, feed_queryOne} from '../api/feed.api'
import {ThemeContext} from '../theme'
import Message from '../components/Message/Message'
import MyInput from '../components/MyInput/MyInput'
import Divider from '../components/Divider/Divider'
import {nanoid} from 'nanoid'
import FIcons from 'react-native-vector-icons/Feather'
import {updateNotice} from '../api/user.api'
import {ActionTypes} from '../types/reducer'

const CheckNotice = () => {
  const {state, dispatch} = React.useContext(MyContext)
  const {theme} = React.useContext(ThemeContext)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute<RouteProp<RootStackParamList, 'checkNotice'>>()
  const [feed, setFeeds] = React.useState<FeedType | undefined>(undefined)
  const [comments, setComments] = React.useState<Feed_CommentType[]>([])
  const [noData, setNoData] = React.useState<boolean>(false)

  /* 更新通知 */
  React.useEffect(() => {
    updateNotice({notice_id: route.params.notice_id}, state.user?.token!).then(val => {
      if (val.code === 1) {
        dispatch({type: ActionTypes.READNOTICE, payload: route.params.notice_id})
      }
    })
  }, [])

  /* 获取帖子 */
  React.useEffect(() => {
    feed_queryOne(route.params.feed_id!, state.user?.token!).then(val => {
      if (val.code === 1) {
        setFeeds(val.data)
      } else {
        setNoData(true)
      }
    })
    feed_comments(route.params.feed_id).then(val => {
      setComments(val.data)
    })
  }, [route.params.feed_id])

  /* 发评论 */
  const handleGetInputValue = React.useCallback((value: string) => {
    if (value.trim() !== '') {
      const newComment: Feed_CommentType = {
        feed_id: route.params.feed_id,
        comment_id: nanoid(9),
        user_id: state.user?.result.user_id!,
        comment: value,
        createdAt: Date(),
        avatar: state.user?.result.avatar!,
        nick_name: state.user?.result.nick_name!,
        feed_userId: feed?.feed_userID!,
      }
      setComments(p => [...p, newComment])
      const {createdAt, avatar, nick_name, ...res} = newComment
      comment_publish(res, state.user?.token!)
    }
  }, [])

  return (
    <View style={[styles.flex, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.top]}>
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
          {feed?.user.nick_name}
        </Text>
      </View>
      <Divider />
      <View style={[styles.flex]}>
        <FlatList
          data={comments}
          initialNumToRender={15}
          contentContainerStyle={feed ? [] : styles.flex}
          ListEmptyComponent={
            noData ? (
              <View
                style={[styles.flex, {justifyContent: 'center', alignItems: 'center'}]}>
                <Text style={{fontSize: 18, color: theme.colors.secondary}}>
                  帖子不存在或已被删除
                </Text>
              </View>
            ) : undefined
          }
          ListHeaderComponent={
            feed && (
              <View style={{marginBottom: 10}}>
                <FeedCard
                  feed={feed}
                  clickComment
                  checkNoticeDelFeed={() => navigate.goBack()}
                />
                <Divider />
                {route.params.newComment && (
                  <View style={{paddingHorizontal: 10, gap: 6}}>
                    <Text
                      style={{
                        color: theme.colors.defaultTextColor,
                        fontSize: 16,
                        fontWeight: '500',
                      }}>
                      新评论
                    </Text>
                    <Message
                      avatar={route.params.newComment?.source_avatar!}
                      text={route.params.newComment?.comment!}
                      timestamp={route.params.newComment?.source_createdAt!}
                      nick_name={route.params.newComment?.source_nick_name!}
                      to_id={route.params.newComment?.source_user_id!}
                      user_id={state.user?.result.user_id}
                    />
                  </View>
                )}
                <Divider />
              </View>
            )
          }
          renderItem={({item}) => (
            <View style={{paddingHorizontal: 10}}>
              <Message
                avatar={item.avatar}
                text={item.comment}
                timestamp={item.createdAt}
                nick_name={item.nick_name}
                to_id={item.user_id}
                user_id={state.user?.result.user_id}
              />
            </View>
          )}
          keyboardDismissMode="on-drag"
          // showsVerticalScrollIndicator={false}
          keyExtractor={({comment_id}) => comment_id}
        />
      </View>
      <Divider />
      <MyInput
        editable={!noData}
        placeholder="写评论~"
        hiddenIcon
        hiddenEmoji={false}
        paddingHorizontal={10}
        paddingVertical={10}
        getInputValue={handleGetInputValue}
      />
    </View>
  )
}

export default CheckNotice
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  top: {
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
})
