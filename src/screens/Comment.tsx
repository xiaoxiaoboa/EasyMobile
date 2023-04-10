import React from 'react'
import {View, StyleSheet, Text, FlatList} from 'react-native'
import {ThemeContext} from '../theme'
import Divider from '../components/Divider/Divider'
import Message from '../components/Message/Message'
import ModalTop from '../components/ModalTop/ModalTop'
import MyInput from '../components/MyInput/MyInput'
import type {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RootStackParamList} from '../types/route'
import {Feed_CommentType} from '../types/feed.type'
import {comment_publish, feed_comments} from '../api/feed.api'
import {nanoid} from 'nanoid'

type CommentProps = NativeStackScreenProps<RootStackParamList, 'comment'>
const Comment = React.memo((props: CommentProps) => {
  const {navigation, route} = props
  const {theme} = React.useContext(ThemeContext)
  const [comments, setComments] = React.useState<Feed_CommentType[]>([])

  React.useEffect(() => {
    feed_comments(route.params.feed_id).then(val => {
      setComments(val.data)
    })
  }, [])

  /* 发评论 */
  const handleGetInputValue = React.useCallback((value: string) => {
    if (route.params.user && value.trim() !== '') {
      const newComment: Feed_CommentType = {
        feed_id: route.params.feed_id,
        comment_id: nanoid(9),
        user_id: route.params.user.result.user_id,
        comment: value,
        createdAt: Date(),
        avatar: route.params.user.result.avatar,
        nick_name: route.params.user.result.nick_name,
        feed_userId: route.params.feed_userId,
      }
      setComments(p => [...p, newComment])
      const {createdAt, avatar, nick_name, ...res} = newComment
      comment_publish(res, route.params.user.token)
    }
  }, [])
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ModalTop
        name={
          <Text style={[styles.title, {color: theme.colors.defaultTextColor}]}>
            评论 <Text style={{fontSize: 14}}>{comments.length}条</Text>
          </Text>
        }
        btnDisabled={false}
        isBtnDisplay={false}
        onClose={() => navigation.goBack()}
      />
      <Divider />
      <View style={[styles.comment]}>
        <FlatList
          data={comments}
          initialNumToRender={15}
          renderItem={({item}) => (
            <Message
              avatar={item.avatar}
              text={item.comment}
              timestamp={item.createdAt}
              nick_name={item.nick_name}
            />
          )}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          keyExtractor={({comment_id}) => comment_id}
        />
      </View>
      <Divider />
      <MyInput
        placeholder="写评论~"
        hiddenIcon
        hiddenEmoji={false}
        paddingHorizontal={10}
        paddingVertical={10}
        getInputValue={handleGetInputValue}
      />
    </View>
  )
})

export default Comment

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
  },
  comment: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 10,
    paddingTop: 10,
  },
})
