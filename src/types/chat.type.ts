import {FriendType} from './friend.type'
import {UserType} from './user.type'

export enum Message_type {
  TEXT = 'text',
  FILE = 'file',
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface MessageType {
  user_id: string
  to_id: string
  msg: string
  msg_type: Message_type
  user: {
    nick_name: string
    avatar: string
  }
  createdAt: string
  conversation_id: string
  status: number
}

export type ConversationType = {
  conversation_id: string
  avatar: string
  name: string
  user_name: string
  msg: string
  msg_type: Message_type
  isGroup: boolean
  msg_length: number
  msg_createdAt: string
}

export interface ChatGroupType {
  group_id: string
  group_owner: string
  group_name: string
  group_avatar: string
  group_desc: string | null
}
