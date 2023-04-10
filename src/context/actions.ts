import {DataType} from '../types'
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
  return {...state, friends: [...state.friends, ...payload]}
}

/* 获取profile页面帖子 */
export const getProfileFeeds = (state: ReducerState, payload: FeedType[]) => {
  return {...state, profileFeeds: [...state.profileFeeds, ...payload]}
}
/* 获取notice */
export const notice = (state: ReducerState, payload: OtherNoticeType[]) => {
  return {...state, notice: [...state.notice, ...payload]}
}
/* 删除notice */
export const delNotice = (state: ReducerState, payload: string) => {
  return {...state, notice: [...state.notice.filter(i => i.notice_id !== payload)]}
}

const actions = {
  [ActionTypes.USER]: user,
  [ActionTypes.GETHOMEFEEDS]: getHomeFeeds,
  [ActionTypes.DELFEED]: delFeed,
  [ActionTypes.POSTTING]: postting,
  [ActionTypes.FRIENDS]: getFriends,
  [ActionTypes.PROFILEFEEDS]: getProfileFeeds,
  [ActionTypes.NOTICE]: notice,
  [ActionTypes.DELNOTICE]: delNotice
}
export default actions
