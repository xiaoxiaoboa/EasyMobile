import {MessageType} from './chat.type'
import {UserType} from './user.type'

export enum Notice_type {
  FRIENDREQUEST = '0',
  RESOLEV = '00',
  REJECT = '01',
  CHATMESSAGE = '1',
  FEEDCOMMENT = '2',
  FEEDLIKE = '3',
}

export interface NoticeType {
  notice_id: string
  target_id: string
  source_id: string
  type: Notice_type
  desc: string
  done: number
  source: Pick<UserType, 'user_id' | 'avatar' | 'nick_name'>
  createdAt: string
  total: number
}

export interface UnReadMessageType extends NoticeType {
  message: Omit<MessageType, 'user'> & {ch_id: string}
}

export interface OtherNoticeType extends NoticeType {
  msg: string
  comment_msg?: string
  feed_id?: string
}
