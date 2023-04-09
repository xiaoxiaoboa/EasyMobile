import {UserType} from './user.type'

export interface FriendType extends Pick<UserType, 'nick_name' | 'avatar'> {
  user_id: string
  friend_id: string
  createdAt: string
}

export interface RequestFriendsType
  extends Pick<UserType, 'user_id' | 'nick_name' | 'avatar'> {
  timestamp: string
}
