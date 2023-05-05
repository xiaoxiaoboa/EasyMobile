import React from 'react'
import {View, StyleSheet, FlatList, Pressable, Text} from 'react-native'
import {ThemeContext} from '../theme'
import MyInput from '../components/MyInput/MyInput'
import {Colors} from '../theme/theme-types'
import {NavigationProp, useNavigation} from '@react-navigation/native'
import {RootStackParamList} from '../types/route'
import AIcons from 'react-native-vector-icons/AntDesign'
import Avatar from '../components/Avatar/Avatar'
import MyModal from '../components/MyModal/MyModal'
import {queryNotice, updateNotice} from '../api/user.api'
import {MyContext} from '../context/context'
import {ActionTypes, ActionsType} from '../types/reducer'
import {Notice_type, OtherNoticeType} from '../types/notice.type'
import getUnionUrl from '../utils/getUnionUrl'
import getTimeDiff from '../utils/getTimeDiff'
import myToast from '../utils/Toast'
import Divider from '../components/Divider/Divider'

const Notice = () => {
  const {theme} = React.useContext(ThemeContext)
  const {state, dispatch} = React.useContext(MyContext)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()

  const hancleCleanNotice = React.useCallback(
    (notice: OtherNoticeType) => {
      updateNotice({notice_id: notice.notice_id}, state.user?.token!).then(val => {
        if (val.code === 1) {
          dispatch({type: ActionTypes.DELNOTICE, payload: notice.notice_id})
          myToast('通知已清除')
        }
      })
    },
    [state.user],
  )

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text
        style={[styles.title, {paddingLeft: 10, color: theme.colors.defaultTextColor}]}>
        通知
      </Text>
      <View style={[styles.wrapper]}>
        <MyInput
          placeholder="搜索"
          paddingHorizontal={10}
        />
        <FlatList
          data={state.notice}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          keyExtractor={({notice_id}) => notice_id}
          ItemSeparatorComponent={() => (
            <View style={{paddingLeft: 80}}>
              <View style={{height: 1, backgroundColor: theme.colors.listdivder}} />
            </View>
          )}
          renderItem={({item}) => (
            <RenderItem
              key={item.notice_id}
              notice={item}
              theme={theme.colors}
              navigation={navigate}
              hancleCleanNotice={hancleCleanNotice}
            />
          )}
        />
      </View>
    </View>
  )
}

interface RenderItemProps {
  theme: Colors
  notice: OtherNoticeType
  navigation: NavigationProp<RootStackParamList>
  hancleCleanNotice: (notice: OtherNoticeType) => void
}
const RenderItem = React.memo((props: RenderItemProps) => {
  const {theme, navigation, notice, hancleCleanNotice} = props
  const {state, dispatch} = React.useContext(MyContext)
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const handleModalVisible = React.useCallback(() => {
    setModalVisible(p => !p)
  }, [])

  const handleCheck = () => {
    let newComment = undefined
    switch (notice.type) {
      case Notice_type.FRIENDREQUEST:
        navigation.navigate('user_profile', {
          user_id: notice.target_id,
          to_userId: notice.source.user_id,
          notice: notice.done === 0 ? notice : undefined,
        })
        break
      case Notice_type.RESOLEV:
      case Notice_type.REJECT:
        updateNotice({notice_id: notice.notice_id}, state.user?.token!).then(val => {
          if (val.code === 1) {
            dispatch({type: ActionTypes.READNOTICE, payload: notice.notice_id})
          }
        })
        break
      case Notice_type.FEEDCOMMENT:
        newComment = {
          source_avatar: notice.source.avatar,
          comment: notice.comment_msg,
          source_nick_name: notice.source.nick_name,
          source_createdAt: notice.createdAt,
          source_user_id: notice.source.user_id,
        }
        navigation.navigate('checkNotice', {
          feed_id: notice.feed_id!,
          newComment,
          notice_id: notice.notice_id,
        })
        break
      case Notice_type.FEEDLIKE:
        navigation.navigate('checkNotice', {
          feed_id: notice.feed_id!,
          notice_id: notice.notice_id,
        })
        break
      default:
        break
    }
  }

  return (
    <View>
      <Pressable
        onPress={handleCheck}
        onLongPress={handleModalVisible}
        style={[
          styles.user,
          {backgroundColor: notice.done === 0 ? theme.unreadNotice : 'transparent'},
        ]}
        android_ripple={{color: theme.clickbg}}>
        <Avatar
          src={getUnionUrl(notice.source?.avatar)}
          size={60}
        />
        <View style={{flex: 1, marginLeft: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Text style={[styles.user_name, {color: theme.defaultTextColor}]}>
              {notice.source?.nick_name}
            </Text>
            <Text style={{fontSize: 16, color: theme.secondary}}>
              {notice.comment_msg && notice.msg}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.user_message, {color: theme.secondary, width: '100%'}]}>
            {notice.comment_msg || notice.msg}
          </Text>
        </View>
        <View style={{marginLeft: 'auto', paddingRight: 10}}>
          <Text style={{color: theme.secondary}}>{getTimeDiff(notice?.createdAt)}</Text>
        </View>
      </Pressable>
      <MyModal
        half
        modalVisible={modalVisible}
        setModalVisible={handleModalVisible}
        children={
          <View>
            <Pressable
              onPress={() => hancleCleanNotice(notice)}
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
                删除这条消息
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  )
})

export default Notice

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
  },
  wrapper: {
    paddingTop: 10,
    gap: 10,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  user_name: {
    fontSize: 20,
    fontWeight: '500',
  },
  user_message: {
    width: '80%',
  },
  sign: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#42b72a',
    elevation: 20,
  },
})
