import {MessageType} from './chat.type'
import {UserType} from './user.type'

export interface NoticeType {
  notice_id: string
  target_id: string
  source_id: string
  type: string
  desc: string
  done: number
  source: Pick<UserType, 'user_id' | 'avatar' | 'nick_name'>
  createdAt: string
}

export interface UnReadMessageType extends NoticeType {
  message: Omit<MessageType, 'user'> & {ch_id: string}
}

export interface OtherNoticeType extends NoticeType {
  msg: string
  comment_msg?: string
  feed_id?: string
}
