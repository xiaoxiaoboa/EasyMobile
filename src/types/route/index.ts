import {DataType} from '..'

export type RootStackParamList = {
  root: undefined
  postting: undefined
  comment: CommentParams
  chat: undefined
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
}

type CheckNoticeParams = {
  feed_id: string
}
