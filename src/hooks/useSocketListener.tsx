import React from 'react'
import {OtherNoticeType} from '../types/notice.type'
import {MyContext} from '../context/context'
import {ActionTypes} from '../types/reducer'
import {FriendType} from '../types/friend.type'

const useSocketListener = () => {
  const {state, dispatch} = React.useContext(MyContext)

  React.useEffect(() => {
    /* 点赞评论帖子 */
    state.socket?.notice.on('notice', (data: OtherNoticeType) => {
      dispatch({type: ActionTypes.SOCKETTONOTICE, payload: data})
    })

    /* 监听好友请求 */
    state.socket?.notice.on('friendsRequest', (data: OtherNoticeType) => {
      dispatch({type: ActionTypes.SOCKETTONOTICE, payload: data})
    })

    /* 拒绝 */
    state.socket?.notice.on('rejectRequest', (data: OtherNoticeType) => {
      dispatch({type: ActionTypes.SOCKETTONOTICE, payload: data})
    })

    /* 同意 */
    state.socket?.notice.on('agreeRequest', (data: OtherNoticeType) => {
      dispatch({type: ActionTypes.SOCKETTONOTICE, payload: data})
      const newFriend: FriendType = {
        avatar: data.source.avatar,
        createdAt: Date(),
        friend_id: data.source.user_id,
        friendship: true,
        nick_name: data.source.nick_name,
        user_id: data.target_id,
      }
      dispatch({
        type: ActionTypes.ADDFRIEND,
        payload: newFriend,
      })
    })
    return () => {
      state.socket?.notice.off('notice')
      state.socket?.notice.off('friendsRequest')
      state.socket?.notice.off('rejectRequest')
      state.socket?.notice.off('agreeRequest')
    }
  }, [])

  return
}

export default useSocketListener
