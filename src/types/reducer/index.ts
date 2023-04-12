import {DataType, MySocket} from '../index'
import {FeedType} from '../feed.type'
import {UserType} from '../user.type'
import {FriendType} from '../friend.type'
import {OtherNoticeType, UnReadMessageType} from '../notice.type'
import {ChatGroupType, ConversationType, MessageType} from '../chat.type'

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
  current_talk: ConversationType | undefined
  unread_messages: UnReadMessageType[]
  groups: ChatGroupType[]
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
  DELCONVERSATION = 'delConversation',
  ADDFRIEND = 'addFriend',
  READNOTICE = 'readNotice',
  CURRENTTALK = 'current_talk',
  CONVERSATIONTOTOP = 'conversationToTop',
  UNREADMESSAGES = 'unread_messages',
  ADDUNREADMESSAGE = 'addUnReadMessage',
  GROUPS = 'groups',
  NEWCONVERSATION = 'newConversation',
  UPDATEUNREADMESSAGE = 'updateUnReadMessage',
  UPDATECONVERSATIONMSGLENGTH = 'updateConversationMsgLength'
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
  [ActionTypes.CURRENTTALK]: ConversationType
  [ActionTypes.CONVERSATIONTOTOP]: ConversationType
  [ActionTypes.UNREADMESSAGES]: UnReadMessageType[]
  [ActionTypes.ADDUNREADMESSAGE]: UnReadMessageType
  [ActionTypes.GROUPS]: ChatGroupType[]
  [ActionTypes.NEWCONVERSATION]: ConversationType
  [ActionTypes.UPDATEUNREADMESSAGE]: string
  [ActionTypes.UPDATECONVERSATIONMSGLENGTH]: string
}

export type ActionsType = ActionMap<ReducerPaylodType>[keyof ActionMap<ReducerPaylodType>]
