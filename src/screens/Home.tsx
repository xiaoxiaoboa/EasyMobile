import React from 'react'
import {Text, View, StyleSheet, Pressable, FlatList, StatusBar} from 'react-native'
import {ThemeContext} from '../theme'
import Avatar from '../components/Avatar/Avatar'
import type {NativeStackScreenProps} from '@react-navigation/native-stack'
import FeedCard from '../components/FeedCard/FeedCard'
import 'react-native-get-random-values'
import {nanoid} from 'nanoid'
import {Colors} from '../theme/theme-types'
import {useNavigation, NavigationProp} from '@react-navigation/native'
import {RootStackParamList} from '../types/route'
import {MyContext} from '../context/context'
import getUnionUrl from '../utils/getUnionUrl'
import {feeds_all} from '../api/feed.api'
import {ActionTypes} from '../types/reducer'
import {useNetInfo} from '@react-native-community/netinfo'
import myToast from '../utils/Toast'

export type imagesType = {id: string; uri: string}
export const images: imagesType[] = [
  {
    id: nanoid(),
    uri: 'https://images.pexels.com/photos/4041122/pexels-photo-4041122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: nanoid(),
    uri: `https://images.pexels.com/photos/15955850/pexels-photo-15955850.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load`,
  },
  {
    id: nanoid(),
    uri: `https://images.pexels.com/photos/15955859/pexels-photo-15955859.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load`,
  },
  {
    id: nanoid(),
    uri: `https://images.pexels.com/photos/15955945/pexels-photo-15955945.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load`,
  },
  // {
  //   id: nanoid(),
  //   uri: `https://images.pexels.com/photos/16157620/pexels-photo-16157620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`,
  // },
]

const Home = () => {
  const {theme} = React.useContext(ThemeContext)
  const {state, dispatch} = React.useContext(MyContext)
  const limitRef = React.useRef<number>(50)
  const offsetRef = React.useRef<number>(0)
  const {isInternetReachable} = useNetInfo()

  React.useEffect(() => {
    limitRef.current = 50
    offsetRef.current = 0
    dispatch({type: ActionTypes.RESETHOMEFEEDS, payload: ''})
  }, [state.user])

  /* 获取帖子 */
  const getFeeds = React.useCallback(() => {
    if (isInternetReachable) {
      feeds_all(limitRef.current, offsetRef.current).then(val => {
        if (val.code === 1) {
          dispatch({type: ActionTypes.GETHOMEFEEDS, payload: val.data})
          offsetRef.current += limitRef.current
        }
      })
    }
  }, [isInternetReachable])

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.homebg}]}>
      <View style={{flex: 1, paddingTop: 100}}>
        <FlatList
          data={state.homeFeeds}
          initialNumToRender={3}
          maxToRenderPerBatch={20}
          onEndReachedThreshold={0.3}
          onEndReached={getFeeds}
          ListEmptyComponent={
            <View style={[styles.empty]}>
              <Text style={{color: theme.colors.secondary}}>
                {isInternetReachable
                  ? '还没有帖子哟，发表一个吧~'
                  : '你没有连接网络哎，这怎么玩儿'}
              </Text>
            </View>
          }
          ListHeaderComponent={() => (
            <HeaderComponent
              theme={theme.colors}
              isInternetReachable={isInternetReachable}
            />
          )}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <FeedCard feed={item} />}
          keyExtractor={({feed_id}) => feed_id}
        />
      </View>
    </View>
  )
}
interface HeaderComponentProps {
  theme: Colors
  isInternetReachable: boolean | null
}
const HeaderComponent = React.memo((props: HeaderComponentProps) => {
  const {theme, isInternetReachable} = props
  const {state} = React.useContext(MyContext)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()

  const handlePost = () => {
    if (!state.user) return myToast('先登录吧~')
    navigate.navigate('postting')
  }
  return (
    <View>
      {!state.user && (
        <View
          style={[
            styles.nologin,
            {
              backgroundColor: theme.background,
            },
          ]}>
          <Pressable
            onPress={() => navigate.navigate('login')}
            style={({pressed}) => [
              styles.nologin_btns,
              {backgroundColor: theme.primary, transform: [{scale: pressed ? 0.97 : 1}]},
            ]}>
            <Text style={[styles.nologin_btns_text]}>登录</Text>
          </Pressable>
          <Pressable
            onPress={() => navigate.navigate('register')}
            style={({pressed}) => [
              styles.nologin_btns,
              {backgroundColor: '#36a420', transform: [{scale: pressed ? 0.97 : 1}]},
            ]}>
            <Text style={[styles.nologin_btns_text]}>注册</Text>
          </Pressable>
        </View>
      )}
      {!isInternetReachable && (
        <View style={[styles.noNetwork]}>
          <Text style={{color: '#FFFFFF'}}>没有网络连接，正在重试...</Text>
        </View>
      )}

      <View style={[styles.homeTop, {backgroundColor: theme.background}]}>
        <Avatar
          src={getUnionUrl(state.user?.result.avatar)}
          size={40}
        />
        <View style={[styles.postting, {borderColor: theme.secondary}]}>
          <Pressable
            style={[styles.topbtn]}
            android_ripple={{
              color: theme.divider,
              borderless: false,
              foreground: true,
            }}
            onPress={handlePost}>
            <Text style={{color: theme.secondary}}>分享好瞬间~</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
})

export default Home

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  homeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    gap: 10,
  },
  topbtn: {
    height: 40,
    borderRadius: 26,
    justifyContent: 'center',
    paddingLeft: 10,
    overflow: 'hidden',
  },
  postting: {
    flex: 1,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: 'center',
  },

  nologin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 10,
  },
  nologin_btns: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  nologin_btns_text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
})
