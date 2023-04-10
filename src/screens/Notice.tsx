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
import {ActionTypes} from '../types/reducer'
import {OtherNoticeType} from '../types/notice.type'
import getUnionUrl from '../utils/getUnionUrl'
import getTimeDiff from '../utils/getTimeDiff'
import myToast from '../utils/Toast'

const Notice = () => {
  const {theme} = React.useContext(ThemeContext)
  const {state, dispatch} = React.useContext(MyContext)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()

  React.useEffect(() => {
    queryNotice(state.user?.result.user_id!, state.user?.token!).then(val => {
      if (val.code === 1) {
        dispatch({type: ActionTypes.NOTICE, payload: val.data})
      }
    })
  }, [])

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
          renderItem={({item}) => (
            <RenderItem
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
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const handleModalVisible = React.useCallback(() => {
    setModalVisible(p => !p)
  }, [])

  return (
    <View>
      <Pressable
        onPress={() => navigation.navigate('checkNotice', {feed_id: notice.feed_id!})}
        onLongPress={handleModalVisible}
        style={[styles.user]}
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
})
