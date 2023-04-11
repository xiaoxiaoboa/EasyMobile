import React from 'react'
import reducer from './reducer'
import {ActionTypes, createContextType, ReducerState} from '../types/reducer'
import {getLocalData, storage} from '../utils/getLocalData'
import {io} from 'socket.io-client'
import {getFriends, queryNotice} from '../api/user.api'
import findNoFriend from '../utils/findNoFriend'

const inintSocket = () =>
  getLocalData('user') && {
    chat: io('ws://192.168.1.102:8000/chat', {autoConnect: true}),
    group: io('ws://192.168.1.102:8000/group_chat', {autoConnect: true}),
    notice: io('ws://192.168.1.102:8000', {autoConnect: true}),
  }

const initialValue: ReducerState = {
  user: getLocalData('user'),
  homeFeeds: [],
  friends: getLocalData('friends') || [],
  profileFeeds: [],
  notice: getLocalData('notice') || [],
  socket: inintSocket(),
  conversations: getLocalData('conversations') || [],
}

export const MyContext = React.createContext<createContextType>({
  state: initialValue,
  dispatch: () => null,
})

type MyContextProviderProps = {children: React.ReactNode}
export const MyContextProvider = ({children}: MyContextProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialValue)

  /* socket连接 */
  React.useEffect(() => {
    if (state.user) {
      state.socket?.chat.on('connect', () => {
        state.socket?.chat?.emit(
          'connected',
          state.socket?.chat?.id,
          state.user?.result.user_id,
        )
      })
      state.socket?.group.on('connect', () => {
        state.socket?.group?.emit('connected', state.user?.result.user_id)
      })
      state.socket?.notice.on('connect', () => {
        state.socket?.notice?.emit(
          'connected',
          state.socket?.notice?.id,
          state.user?.result.user_id,
        )
      })
    }
    return () => {
      state.socket?.chat.off('connect')
      state.socket?.group.off('connect')
      state.socket?.notice.off('connect')
    }
  }, [state.user])

  /* 启动后初始化值 */
  React.useEffect(() => {
    if (!state.user) return
    /* 获取通知数据 */
    queryNotice(state.user?.result.user_id!, state.user?.token!).then(val => {
      if (val.code === 1) {
        dispatch({type: ActionTypes.NOTICE, payload: val.data})
      }
    })
    /* 好友列表 */
    getFriends(state.user?.result.user_id!, state.user?.token!).then(val => {
      if (val.code === 1) {
        const newFriendList = findNoFriend(val.data)
        dispatch({type: ActionTypes.FRIENDS, payload: newFriendList})
      }
    })
  }, [state.user])

  /* 变化存储 */
  React.useEffect(() => {
    storage.set('conversations', JSON.stringify(state.conversations))
  }, [state.conversations])
  React.useEffect(() => {
    storage.set('friends', JSON.stringify(state.friends))
  }, [state.friends])
  React.useEffect(() => {
    storage.set('notice', JSON.stringify(state.notice))
  }, [state.notice])

  return <MyContext.Provider value={{state, dispatch}}>{children}</MyContext.Provider>
}
