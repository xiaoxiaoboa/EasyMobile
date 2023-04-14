import {DataType} from '..'
import {FriendType} from '../friend.type'
import {OtherNoticeType} from '../notice.type'

export type RootStackParamList = {
  root: undefined
  postting: undefined
  comment: CommentParams
  chat: ChatParams
  conversation: undefined
  notice: undefined
  login: undefined
  register: undefined
  user_profile: ProfileParams //其他用户主页
  checkNotice: CheckNoticeParams
}

type CommentParams = {
  feed_id: string
  feed_userId: string
  user?: DataType
}
type ProfileParams = {
  user_id: string
  to_userId: string
  notice?: OtherNoticeType
}

type CheckNoticeParams = {
  feed_id: string
  notice_id: string
  newComment?: {
    comment?: string
    source_avatar?: string
    source_nick_name?: string
    source_createdAt?: string
    source_user_id?: string
  }
}

type ChatParams = {
  friend: FriendType
}

export type TabBarParams = {
  home: undefined
  conversation: undefined
  friends: undefined
  profile: undefined
  notice: undefined
}
