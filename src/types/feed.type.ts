import {UserType} from './user.type'

export interface Feed {
  feed_id: string
  feed_userID: string
  feed_text: string
  createdAt: string
  updatedAt: string
}

export interface PublishFeedType extends Feed {
  comment_count: number
  feed_likeds: Feed_LikedType[]
  feed_attaches: Feed_attachType[]
  user_favourites: User_FavouriteType[]
}
export interface FeedType extends PublishFeedType {
  user: Pick<UserType, 'user_id' | 'avatar' | 'nick_name'>
}

/* =====================Feed_attach=========================== */
export interface Feed_attachType {
  feed_id: string
  feed_userID: string
  attach_id: string
  attach_type: 'image' | 'video'
  attach_link: string
}
export type Feed_attach = Omit<Feed_attachType, 'feed_id' | 'feed_userID'>

/* =====================Feed_liked=========================== */
export interface Feed_LikedType {
  id: number
  feed_id: string
  feed_userID: string
  liked: string
}

/* =====================Feed_favourite=========================== */
export interface User_FavouriteType {
  user_id: string
  feed_id: string
  createdAt: string
}

export interface UserFavouritedFeeds extends User_FavouriteType {
  feed: FeedType
}

/* =====================Feed_comment=========================== */
export interface Feed_CommentType {
  feed_id: string
  user_id: string
  comment_id: string
  comment: string
  createdAt: string
  nick_name: string
  avatar: string
  feed_userId:string
}
export type Feed_CommentPublishType = Omit<
  Feed_CommentType,
  'createdAt' | 'avatar' | 'nick_name'
>