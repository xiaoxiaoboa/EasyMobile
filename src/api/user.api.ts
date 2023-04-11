import {Asset} from 'react-native-image-picker'
import {DataType, ResponseType} from '../types'
import {AlterationCoverType, CompressedType, UserType} from '../types/user.type'
import request, {uploadRequest} from '../utils/request'
import {FriendType, FriendsListType} from '../types/friend.type'
import {OtherNoticeType} from '../types/notice.type'

/* 登录 */
export const sign_in = async (
  email: string,
  passwd: string,
): Promise<ResponseType<DataType>> => {
  return await request({url: '/login', methods: 'POST', body: {email, passwd}})
}

/* 注册 */
export const sing_up = async (
  nick_name: string,
  email: string,
  passwd: string,
): Promise<ResponseType<UserType>> => {
  return await request({
    url: '/register',
    methods: 'POST',
    body: {nick_name, email, passwd},
  })
}

/* 更改封面 */
export const alterationCover = async (
  params: AlterationCoverType,
  t: string,
): Promise<ResponseType<UserType>> => {
  const {file, user_id} = params
  const blur_img = await compress(file, t)
  const formData = new FormData()
  formData.append('background', params.file)
  formData.append('data', JSON.stringify({user_id, blur: blur_img.data}))
  return await uploadRequest({
    url: '/cover',
    methods: 'POST',
    body: formData,
    token: t,
  })
}
const compress = async (pic: Asset, t: string): Promise<ResponseType<CompressedType>> => {
  const formData = new FormData()
  formData.append('file', pic)
  return await uploadRequest({
    url: '/compress',
    methods: 'POST',
    body: formData,
    token: t,
  })
}

/* 更改头像 */
export const alterationAvatar = async (
  user_id: string,
  file: Asset,
  t: string,
): Promise<ResponseType<UserType>> => {
  const formData = new FormData()
  formData.append('avatar', file)
  formData.append('user', JSON.stringify({user_id}))
  return await uploadRequest({
    url: '/avatar',
    methods: 'POST',
    body: formData,
    token: t,
  })
}

/* 查找好友 */
export const getFriends = (
  user_id: string,
  t: string,
): Promise<ResponseType<FriendsListType>> => {
  return request({
    url: '/friends',
    methods: 'POST',
    body: {user_id},
    token: t,
  })
}

/* 查询用户 */
export const queryUser = async (
  user_id: string,
  t: string,
): Promise<ResponseType<UserType>> => {
  return await request({
    url: '/user',
    methods: 'POST',
    body: {user_id},
    token: t,
  })
}

/* 查询好友请求点赞评论未读的notice */
export const queryNotice = async (
  user_id: string,
  t: string,
): Promise<ResponseType<OtherNoticeType[]>> => {
  return await request({
    url: '/notice',
    methods: 'POST',
    body: {target_id: user_id},
    token: t,
  })
}

/* 将和已读消息相关的记录都更新为已读 */
export const updateNotice = async (
  {source_id, notice_id}: {source_id?: string; notice_id?: string},
  t: string,
): Promise<ResponseType<void>> => {
  return await request({
    url: '/read',
    methods: 'POST',
    body: {source_id, notice_id},
    token: t,
  })
}
/* 删除好友 */
export const deleteFriend = async (
  user_id: string,
  friend_id: string,
  t: string,
): Promise<ResponseType<void>> => {
  return await request({
    url: '/del_friend',
    methods: 'POST',
    body: {user_id, friend_id},
    token: t,
  })
}
