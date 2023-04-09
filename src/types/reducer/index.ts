import {DataType} from '../index'
import {FeedType} from '../feed.type'
import {UserType} from '../user.type'
import {FriendType} from '../friend.type'

export interface createContextType {
  state: ReducerState
  dispatch: React.Dispatch<ActionsType>
}

export interface ReducerState {
  user: DataType | undefined
  homeFeeds: FeedType[]
  friends: FriendType[]
}

export enum ActionTypes {
  USER = 'user',
  GETHOMEFEEDS = 'getHomeFeeds',
  DELFEED = 'delFeed',
  POSTTING = 'postting',
  FRIENDS = 'friends',
}

export type ActionMap<M extends {[index: string]: any}> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export interface ReducerPaylodType {
  [ActionTypes.USER]: DataType | undefined
  [ActionTypes.GETHOMEFEEDS]: FeedType[]
  [ActionTypes.DELFEED]: string
  [ActionTypes.POSTTING]: FeedType
  [ActionTypes.FRIENDS]: FriendType[]
}

export type ActionsType = ActionMap<ReducerPaylodType>[keyof ActionMap<ReducerPaylodType>]
