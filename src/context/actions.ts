import {DataType} from '../types'
import {ConversationType, MessageType} from '../types/chat.type'
import {FeedType} from '../types/feed.type'
import {FriendType} from '../types/friend.type'
import {OtherNoticeType, UnReadMessageType} from '../types/notice.type'
import {ActionsType} from '../types/reducer'
import {ActionTypes, ReducerState} from '../types/reducer'

/* 设置用户 */
export const user = (state: ReducerState, payload?: DataType) => {
  return {...state, user: payload}
}

/* 获取帖子 */
export const getHomeFeeds = (state: ReducerState, payload: FeedType[]) => {
  return {...state, homeFeeds: [...state.homeFeeds, ...payload]}
}
/* 删除帖子 */
export const delFeed = (state: ReducerState, payload: string) => {
  return {
    ...state,
    homeFeeds: [...state.homeFeeds.filter(i => i.feed_id !== payload)],
    profileFeeds: [...state.profileFeeds.filter(i => i.feed_id !== payload)],
  }
}
/* 发布帖子 */
export const postting = (state: ReducerState, payload: FeedType) => {
  return {
    ...state,
    homeFeeds: [payload, ...state.homeFeeds],
    profileFeeds: [payload, ...state.profileFeeds],
  }
}

/* 获取好友 */
export const getFriends = (state: ReducerState, payload: FriendType[]) => {
  return {...state, friends: payload}
}
/* 删除好友 */
export const delFriend = (state: ReducerState, payload: string) => {
  return {...state, friends: state.friends.filter(i => i.friend_id !== payload)}
}
/* 新增一个好友 */
export const addFriend = (state: ReducerState, payload: FriendType) => {
  return {...state, friends: [...state.friends, payload]}
}

/* 获取profile页面帖子 */
export const getProfileFeeds = (state: ReducerState, payload: FeedType[]) => {
  return {...state, profileFeeds: [...state.profileFeeds, ...payload]}
}
/* 获取notice */
export const notice = (state: ReducerState, payload: OtherNoticeType[]) => {
  /* 过滤掉本地已经存在的未读消息 */
  const newSet = new Set(state.notice.map(i => i.notice_id))
  const newNotice = payload.filter(i => !newSet.has(i.notice_id))
  return {...state, notice: [...newNotice, ...state.notice]}
}
/* socket接收到的notice */
export const socketToNotice = (state: ReducerState, payload: OtherNoticeType) => {
  return {...state, notice: [payload, ...state.notice]}
}
/* 删除notice */
export const delNotice = (state: ReducerState, payload: string) => {
  return {...state, notice: [...state.notice.filter(i => i.notice_id !== payload)]}
}
/* 已读notice */
export const readNotice = (state: ReducerState, payload: string) => {
  const newNotice = state.notice.map(i => {
    if (i.notice_id === payload) {
      return {...i, done: 1}
    } else {
      return i
    }
  })
  return {...state, notice: newNotice}
}

/* 添加conversation */
export const addConverstion = (state: ReducerState, payload: ConversationType) => {
  return {...state, conversations: [...state.conversations, payload]}
}
/* 删除一个conversation */
export const deleteConversation = (state: ReducerState, payload: string) => {
  return {
    ...state,
    conversations: state.conversations.filter(i => i.conversation_id !== payload),
  }
}
/* 更新conversation msg_length */
export const updateConversationMsgLength = (
  state: ReducerState,
  payload: string,
): ReducerState => {
  const newData = state.conversations.map(i => {
    if (i.conversation_id === payload) {
      return {...i, msg_length: 0}
    } else {
      return i
    }
  })
  return {...state, conversations: newData}
}
/* 来新消息，置顶conversation */
export const updataConversation = (
  state: ReducerState,
  payload: ConversationType,
): ReducerState => {
  console.log([
    payload,
    ...state.conversations.filter(i => i.conversation_id !== payload.conversation_id),
  ])
  return {
    ...state,
    conversations: [
      payload,
      ...state.conversations.filter(i => i.conversation_id !== payload.conversation_id),
    ],
  }
}
/* 来新消息，新conversation */
export const newConversation = (
  state: ReducerState,
  payload: ConversationType,
): ReducerState => {
  console.log('actions:', payload)
  return {...state, conversations: [payload, ...state.conversations]}
}

/* current_talk */
export const currentTalk = (
  state: ReducerState,
  payload: ConversationType | undefined,
) => {
  return {...state, current_talk: payload}
}
/* 上线后获取unread_messages */
export const unReadMessages = (
  state: ReducerState,
  payload: UnReadMessageType[],
): ReducerState => {
  return {...state, unread_messages: payload}
}
/* 新增unread_message */
export const addUnReadMessage = (
  state: ReducerState,
  payload: UnReadMessageType,
): ReducerState => {
  return {...state, unread_messages: [...state.unread_messages, payload]}
}
/* 修改unread_message为已读 */
export const updateUnReadMessage = (
  state: ReducerState,
  payload: string,
): ReducerState => {
  const newData = state.unread_messages.map(i => {})
  return {
    ...state,
    unread_messages: state.unread_messages.filter(i => i.source_id !== payload),
  }
}

const actions = {
  [ActionTypes.USER]: user,
  [ActionTypes.GETHOMEFEEDS]: getHomeFeeds,
  [ActionTypes.DELFEED]: delFeed,
  [ActionTypes.POSTTING]: postting,
  [ActionTypes.FRIENDS]: getFriends,
  [ActionTypes.PROFILEFEEDS]: getProfileFeeds,
  [ActionTypes.NOTICE]: notice,
  [ActionTypes.DELNOTICE]: delNotice,
  [ActionTypes.SOCKETTONOTICE]: socketToNotice,
  [ActionTypes.DELFRIEND]: delFriend,
  [ActionTypes.CONVERSATIONS]: addConverstion,
  [ActionTypes.DELCONVERSATION]: deleteConversation,
  [ActionTypes.ADDFRIEND]: addFriend,
  [ActionTypes.READNOTICE]: readNotice,
  [ActionTypes.UNREADMESSAGES]: unReadMessages,
  [ActionTypes.ADDUNREADMESSAGE]: addUnReadMessage,
  [ActionTypes.CONVERSATIONTOTOP]: updataConversation,
  [ActionTypes.NEWCONVERSATION]: newConversation,
  [ActionTypes.UPDATEUNREADMESSAGE]: updateUnReadMessage,
  [ActionTypes.UPDATECONVERSATIONMSGLENGTH]: updateConversationMsgLength,
  [ActionTypes.CURRENTTALK]: currentTalk,
}
export default actions
