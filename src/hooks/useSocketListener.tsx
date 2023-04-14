import React from 'react'
import {OtherNoticeType, UnReadMessageType} from '../types/notice.type'
import {MyContext} from '../context/context'
import {ActionTypes} from '../types/reducer'
import {FriendType} from '../types/friend.type'
import {ChatGroupType, ConversationType, MessageType} from '../types/chat.type'
import {queryMessageNotice} from '../api/user.api'

const useSocketListener = () => {
  const {state, dispatch} = React.useContext(MyContext)
  const conversationsCache = React.useRef<ConversationType[]>([])
  const friendsCache = React.useRef<FriendType[]>([])
  const groupsCache = React.useRef<ChatGroupType[]>([])

  /* 未读聊天消息 */
  React.useEffect(() => {
    queryMessageNotice(state.user?.result.user_id!, '1', state.user?.token!).then(val => {
      if (val.code === 1) {
        if (val.data.length === 0) {
          dispatch({type: ActionTypes.UPDATEALLCONVERSATIONS, payload: ''})
        } else {
          const newFriendsSet = new Set(friendsCache.current.map(i => i.friend_id))
          const newUnReadMessages = val.data.filter(i =>
            newFriendsSet.has(i.source.user_id),
          )
          dispatch({type: ActionTypes.UNREADMESSAGES, payload: newUnReadMessages})

          const newConversations = newUnReadMessages.map(i => ({
            conversation_id: i.source.user_id,
            avatar: i.source.avatar,
            name: i.source.nick_name,
            user_name: i.source.nick_name,
            msg: i.message.msg,
            msg_type: i.message.msg_type,
            isGroup: false,
            msg_length: i.total,
            msg_createdAt: i.message.createdAt,
          }))
          dispatch({type: ActionTypes.CONVERSATIONS, payload: newConversations})
        }
      }
    })
  }, [state.user])

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

    /* 监听未处理信息 */
    state.socket?.notice.on(`new_notice_message`, (data: UnReadMessageType) => {
      if (data.message.user_id === state.user?.result.user_id!) return
      /* friend是否存在 */
      const friendExist = friendsCache.current.find(
        i => i.friend_id === data.source.user_id,
      )
      if (!friendExist) return
      /* 是不是群组 */
      // const group = state.groups.find(i => i.group_id === data.source.user_id)
      dispatch({type: ActionTypes.ADDUNREADMESSAGE, payload: data})

      /* 在不在Conversation中 */
      const findeItem = conversationsCache.current.find(
        i => i.conversation_id === data.message.conversation_id,
      )
      if (findeItem) {
        inConversations(findeItem, data)
      } else {
        notInConversations(data)
      }
    })
    return () => {
      state.socket?.notice.off('notice')
      state.socket?.notice.off('friendsRequest')
      state.socket?.notice.off('rejectRequest')
      state.socket?.notice.off('agreeRequest')
      state.socket?.notice.off('new_notice_message')
    }
  }, [])

  const inConversations = (findeItem: ConversationType, data: UnReadMessageType) => {
    const inCurrentTalk =
      state.current_talk?.conversation_id === data.message.conversation_id
    if (!inCurrentTalk) {
      console.log(data)
      const newConversation: ConversationType = {
        ...findeItem,
        msg: data.message.msg,
        msg_type: data.message.msg_type,
        user_name: data.source.nick_name,
        msg_length: inCurrentTalk ? 0 : findeItem.msg_length + data.total,
        msg_createdAt: data.createdAt,
      }

      /* 对话置顶 */
      dispatch({type: ActionTypes.CONVERSATIONTOTOP, payload: newConversation})
    }
  }

  const notInConversations = (data: UnReadMessageType) => {
    const newData: ConversationType = {
      conversation_id: data.source.user_id,
      avatar: data.source.avatar,
      name: data.source.nick_name,
      user_name: data.source.nick_name,
      msg: data.message.msg,
      msg_type: data.message.msg_type,
      isGroup: false,
      msg_length: 1,
      msg_createdAt: data.message.createdAt,
    }
    dispatch({type: ActionTypes.NEWCONVERSATION, payload: newData})
  }

  /* 缓存数据 */
  React.useEffect(() => {
    conversationsCache.current = state.conversations
  }, [state.conversations])
  React.useEffect(() => {
    friendsCache.current = state.friends
  }, [state.friends])
  React.useEffect(() => {
    groupsCache.current = state.groups
  }, [state.groups])

  return
}

export default useSocketListener
