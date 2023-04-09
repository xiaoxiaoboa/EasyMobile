import {DataType} from '..'

export type RootStackParamList = {
  root: undefined
  postting: undefined
  comment: Comment
  chat: undefined
  conversation: undefined
  notice: undefined
  login: undefined
  register: undefined
}

type Comment = {
  feed_id: string
  feed_userId: string
  user?: DataType
}
