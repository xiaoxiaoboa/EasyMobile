import {DataType, MySocket} from '../index'
import {FeedType} from '../feed.type'
import {UserType} from '../user.type'
import {FriendType} from '../friend.type'
import {OtherNoticeType} from '../notice.type'
import {ConversationType} from '../chat.type'

export interface createContextType {
  state: ReducerState
  dispatch: React.Dispatch<ActionsType>
}

export interface ReducerState {
  user: DataType | undefined
  homeFeeds: FeedType[]
  friends: FriendType[]
  profileFeeds: FeedType[]
  notice: OtherNoticeType[]
  socket: MySocket | undefined
  conversations: ConversationType[]
}

export enum ActionTypes {
  USER = 'user',
  GETHOMEFEEDS = 'getHomeFeeds',
  DELFEED = 'delFeed',
  POSTTING = 'postting',
  FRIENDS = 'friends',
  PROFILEFEEDS = 'profileFeeds',
  NOTICE = 'notice',
  DELNOTICE = 'delNotice',
  SOCKETTONOTICE = 'socketToNotice',
  DELFRIEND = 'delFriend',
  CONVERSATIONS = 'conversations',
  DELCONVERSATION='delConversation',
  ADDFRIEND='addFriend',
  READNOTICE='readNotice'
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
  [ActionTypes.PROFILEFEEDS]: FeedType[]
  [ActionTypes.NOTICE]: OtherNoticeType[]
  [ActionTypes.DELNOTICE]: string
  [ActionTypes.SOCKETTONOTICE]: OtherNoticeType
  [ActionTypes.DELFRIEND]: string
  [ActionTypes.CONVERSATIONS]: ConversationType
  [ActionTypes.DELCONVERSATION]: string
  [ActionTypes.ADDFRIEND]: FriendType
  [ActionTypes.READNOTICE]: string
}

export type ActionsType = ActionMap<ReducerPaylodType>[keyof ActionMap<ReducerPaylodType>]
