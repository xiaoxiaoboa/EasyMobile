import {DataType} from '../types'
import {FeedType} from '../types/feed.type'
import {FriendType} from '../types/friend.type'
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
  }
}
/* 发布帖子 */
export const postting = (state: ReducerState, payload: FeedType) => {
  return {...state, homeFeeds: [payload, ...state.homeFeeds]}
}

/* 获取好友 */
export const getFriends = (state: ReducerState, payload: FriendType[]) => {
  return {...state, friends: [...state.friends, ...payload]}
}

const actions = {
  [ActionTypes.USER]: user,
  [ActionTypes.GETHOMEFEEDS]: getHomeFeeds,
  [ActionTypes.DELFEED]: delFeed,
  [ActionTypes.POSTTING]: postting,
  [ActionTypes.FRIENDS]: getFriends,
}
export default actions
