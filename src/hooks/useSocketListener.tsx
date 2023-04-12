import React from 'react'
import {OtherNoticeType, UnReadMessageType} from '../types/notice.type'
import {MyContext} from '../context/context'
import {ActionTypes} from '../types/reducer'
import {FriendType} from '../types/friend.type'
import {ChatGroupType, ConversationType, MessageType} from '../types/chat.type'

const useSocketListener = () => {
  const {state, dispatch} = React.useContext(MyContext)
  const conversationsCache = React.useRef<ConversationType[]>([])

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

    // /* 私聊 */
    // state.socket?.chat.on('private_message', (data: MessageType, callback) => {
    //   const findeItem = state.conversations.find(
    //     i => i.conversation_id === data.conversation_id,
    //   )
    //   /* 在不在Conversation中 */
    //   if (findeItem) {
    //     inConversations(findeItem, data, callback)
    //   } else {
    //     // noConversations(data)
    //   }
    // })

    /* 监听未处理信息 */
    state.socket?.notice.on(`new_notice_message`, (data: UnReadMessageType) => {
      if (data.message.user_id === state.user?.result.user_id!) return
      dispatch({type: ActionTypes.ADDUNREADMESSAGE, payload: data})

      /* 是不是群组 */
      const group = state.groups.find(i => i.group_id === data.message.conversation_id)
      /* 在不在Conversation中 */
      const findeItem = conversationsCache.current.find(
        i => i.conversation_id === data.message.conversation_id,
      )
      if (findeItem) {
        inConversations(findeItem, data)
      } else {
        notInConversations(data, group)
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
      const newConversation: ConversationType = {
        ...findeItem,
        msg: data.message.msg,
        msg_type: data.message.msg_type,
        user_name: data.source.nick_name,
        msg_length: inCurrentTalk ? 0 : findeItem.msg_length + 1,
        msg_createdAt: data.createdAt,
      }

      /* 对话置顶 */
      dispatch({type: ActionTypes.CONVERSATIONTOTOP, payload: newConversation})
    }
  }

  const notInConversations = (data: UnReadMessageType, group?: ChatGroupType) => {
    const newData: ConversationType = {
      conversation_id: data.message.conversation_id,
      avatar: group ? group.group_avatar : data.source.avatar,
      name: group ? group.group_name : data.source.nick_name,
      user_name: data.source.nick_name,
      msg: data.message.msg,
      msg_type: data.message.msg_type,
      isGroup: group ? true : false,
      msg_length: 1,
      msg_createdAt: data.message.createdAt,
    }
    dispatch({type: ActionTypes.NEWCONVERSATION, payload: newData})
  }

  /* 缓存数据 */
  React.useEffect(() => {
    conversationsCache.current = state.conversations
  }, [state.conversations])

  return
}

export default useSocketListener
