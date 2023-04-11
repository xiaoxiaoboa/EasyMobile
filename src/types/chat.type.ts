import { FriendType } from "./friend.type"
import { UserType } from "./user.type"

export enum Message_type {
  TEXT = "text",
  FILE = "file",
  IMAGE = "image",
  VIDEO = "video"
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
}

export interface ChatGroupType {
  group_id: string
  group_owner: string
  group_name: string
  group_avatar: string
  group_desc: string | null
}

export interface UnReadMessageType extends Omit<MessageType, "user" | 'conversation_id'> {
  source: UnReadMessageSourceType
  isGroup: boolean
  id: number
  read: boolean
}
interface UnReadMessageSourceType
  extends Pick<UserType, "avatar" | "nick_name" | "user_id"> {
  group: Pick<ChatGroupType, "group_id" | "group_avatar" | "group_name">
}
