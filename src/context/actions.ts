import {DataType} from '../types'
import {ConversationType} from '../types/chat.type'
import {FeedType} from '../types/feed.type'
import {FriendType} from '../types/friend.type'
import {OtherNoticeType} from '../types/notice.type'
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
export const addConversion = (state: ReducerState, payload: ConversationType) => {
  return {...state, conversations: [...state.conversations, payload]}
}
/* 删除一个conversation */
export const deleteConversation = (state: ReducerState, payload: string) => {
  return {
    ...state,
    conversations: state.conversations.filter(i => i.conversation_id !== payload),
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
  [ActionTypes.CONVERSATIONS]: addConversion,
  [ActionTypes.DELCONVERSATION]: deleteConversation,
  [ActionTypes.ADDFRIEND]: addFriend,
  [ActionTypes.READNOTICE]: readNotice,
}
export default actions
