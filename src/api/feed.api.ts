import {Asset} from 'react-native-image-picker'
import {ResponseType} from '../types'
import {
  Feed,
  FeedType,
  Feed_CommentPublishType,
  Feed_CommentType,
  PublishFeedType,
} from '../types/feed.type'
import request, {uploadRequest} from '../utils/request'

/* 发布帖子 */
export const feed_publish = async (
  files: Asset[],
  params: Pick<Feed, 'feed_userID' | 'feed_text'>,
  t: string,
): Promise<ResponseType<PublishFeedType>> => {
  const formData = new FormData()
  files.map((file, index) => formData.append(`file-${index}`, file))
  formData.append('data', JSON.stringify(params))
  return await uploadRequest({
    url: '/feed_create',
    methods: 'POST',
    body: formData,
    token: t,
  })
}

/* 获取所有帖子 */
export const feeds_all = async (
  limit: number,
  offset: number,
): Promise<ResponseType<FeedType[]>> => {
  return await request({
    url: `/feeds_all?limit=${limit}&offset=${offset}`,
    methods: 'GET',
  })
}

/* 点赞 */
export const feed_like = async (
  feed_id: string,
  user_id: string,
  feed_userId: string,
  t: string,
): Promise<ResponseType<void>> => {
  return await request({
    url: '/feed_like',
    methods: 'POST',
    body: {feed_id, user_id, feed_userId},
    token: t,
  })
}

/* 获取帖子的评论 */
export const feed_comments = async (
  feed_id: string,
): Promise<ResponseType<Feed_CommentType[]>> => {
  return await request({
    url: '/feed_comment',
    methods: 'POST',
    body: {feed_id},
  })
}

/* 发布评论 */
export const comment_publish = async (
  params: Feed_CommentPublishType,
  t: string,
): Promise<ResponseType<Feed_CommentType>> => {
  return await request({
    url: '/comment_create',
    methods: 'POST',
    body: params,
    token: t,
  })
}

/* 收藏 */
export const feed_fav = async (
  feed_id: string,
  user_id: string,
  t: string,
): Promise<ResponseType<any>> => {
  return await request({
    url: '/fav',
    methods: 'POST',
    body: {feed_id, user_id},
    token: t,
  })
}

/* 删除 */
export const feed_delete = async (
  feed_id: string,
  t: string,
): Promise<ResponseType<number>> => {
  return await request({
    url: '/feed_delete',
    methods: 'POST',
    body: {feed_id},
    token: t,
  })
}

/* 获取用户的帖子 */
export const feeds_query = async (
  user_id: string,
  limit: number,
  offset: number,
  t: string,
): Promise<ResponseType<FeedType[]>> => {
  return await request({
    url: '/feed_query',
    methods: 'POST',
    body: {user_id, limit, offset},
    token: t,
  })
}
