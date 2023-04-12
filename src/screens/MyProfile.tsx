import React from 'react'
import {View, StyleSheet, FlatList, Image, Text, Pressable, Modal} from 'react-native'
import Avatar from '../components/Avatar/Avatar'
import {ThemeContext} from '../theme'
import Icons from 'react-native-vector-icons/Ionicons'
import FIcons from 'react-native-vector-icons/Feather'
import FAIcons from 'react-native-vector-icons/FontAwesome'
import EIcons from 'react-native-vector-icons/Entypo'
import FeedCard from '../components/FeedCard/FeedCard'
import {images} from './Home'
import MyModal from '../components/MyModal/MyModal'
import ToggleTheme from '../components/ToggleTheme/ToggleTheme'
import Divider from '../components/Divider/Divider'
import {Colors} from '../theme/theme-types'
import {Asset, launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {RootStackParamList} from '../types/route/index'
import ModalTop from '../components/ModalTop/ModalTop'
import getUnionUrl from '../utils/getUnionUrl'
import {MyContext} from '../context/context'
import {FeedType} from '../types/feed.type'
import {feeds_query} from '../api/feed.api'
import {alterationAvatar, alterationCover} from '../api/user.api'
import {UserType} from '../types/user.type'
import {DataType, ResponseType} from '../types'
import {ActionTypes} from '../types/reducer'
import {storage} from '../utils/getLocalData'
import myToast from '../utils/Toast'
import {useNavigation, NavigationProp} from '@react-navigation/native'
import {useNetInfo} from '@react-native-community/netinfo'

const MyProfile = () => {
  const {theme} = React.useContext(ThemeContext)
  const {state, dispatch} = React.useContext(MyContext)
  const limitRef = React.useRef<number>(5)
  const offsetRef = React.useRef<number>(0)
  const {isInternetReachable} = useNetInfo()

  /* 获取用户帖子 */
  const getMyFeeds = React.useCallback(() => {
    if (isInternetReachable) {
      feeds_query(
        state.user?.result.user_id!,
        limitRef.current,
        offsetRef.current,
        state.user?.token!,
      ).then(val => {
        if (val.code === 1) {
          dispatch({type: ActionTypes.PROFILEFEEDS, payload: val.data})

          offsetRef.current += limitRef.current
        }
      })
    }
  }, [isInternetReachable])

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.homebg,
        },
      ]}>
      <FlatList
        extraData={isInternetReachable}
        data={state.profileFeeds}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        onEndReachedThreshold={0.3}
        onEndReached={getMyFeeds}
        keyExtractor={({feed_id}) => feed_id}
        ListHeaderComponent={Header}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[styles.empty]}>
            <Text style={{color: theme.colors.secondary}}>
              {isInternetReachable
                ? '还没有帖子哟，发表一个吧~'
                : '你没有连接网络哎，这怎么玩儿'}
            </Text>
          </View>
        }
        renderItem={({item}) => <FeedCard feed={item} />}
      />
    </View>
  )
}

const Header = React.memo(() => {
  const {theme} = React.useContext(ThemeContext)
  const {state} = React.useContext(MyContext)
  const [settingModalVisible, setSettingModalVisible] = React.useState<boolean>(false)
  const [backgroundModalVisible, setBackgroundModalVisible] =
    React.useState<boolean>(false)
  const [avatarModalVisible, setAvatarModalVisible] = React.useState<boolean>(false)
  const [confirmModalVisible, setConfirmModalVisible] = React.useState<boolean>(false)
  const [avatarUri, setAvatarUri] = React.useState<Asset>()
  const [backgroundUri, setBackgroundUri] = React.useState<Asset>()
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  const {isInternetReachable} = useNetInfo()

  /* 打开modal */
  const handleBackgroundModal = React.useCallback((visible: boolean) => {
    setBackgroundModalVisible(visible)
  }, [])
  /* 打开modal */
  const handleAvatarModalVisible = React.useCallback((visible: boolean) => {
    setAvatarModalVisible(visible)
  }, [])
  /* 打开modal */
  const handleSettingModalVisible = React.useCallback((visible: boolean) => {
    setSettingModalVisible(visible)
  }, [])
  /* 打开modal */
  const handleConfirmVisible = React.useCallback((visible: boolean) => {
    setConfirmModalVisible(visible)
  }, [])

  /* 处理修改的头像 */
  const handleAvatarUri = React.useCallback((avatar?: Asset) => {
    setAvatarUri(avatar)
  }, [])
  /* 处理修改的背景图 */
  const handleBackgroundUri = React.useCallback((background?: Asset) => {
    setBackgroundUri(background)
  }, [])

  return (
    <View style={[styles.top, {backgroundColor: theme.colors.background}]}>
      {!isInternetReachable && (
        <View style={[styles.noNetwork]}>
          <Text style={{color: '#FFFFFF'}}>没有网络连接，正在重试...</Text>
        </View>
      )}
      {/* 背景图 */}
      <View>
        <Image
          style={{width: '100%', height: 240}}
          source={
            backgroundUri
              ? {uri: backgroundUri.uri}
              : {
                  uri: getUnionUrl(state.user?.result.profile_img),
                }
          }
        />
        {/* 更换背景图按钮 */}
        <Pressable
          onPress={() => handleBackgroundModal(true)}
          style={({pressed}) => [
            styles.background_btn,
            {
              backgroundColor: theme.colors.divider,
              transform: [{scale: pressed ? 0.97 : 1}],
              opacity: pressed ? 0.9 : 1,
              bottom: 10,
              right: 16,
            },
          ]}>
          <Icons
            name="camera"
            size={30}
            color={theme.colors.defaultTextColor}
          />
        </Pressable>
      </View>
      {/* 头像和名字 */}
      <View style={[styles.avatar_wrapper]}>
        <View
          style={[
            styles.avatar,
            {
              borderColor: theme.colors.background,
            },
          ]}>
          <Avatar
            src={avatarUri?.uri || getUnionUrl(state.user?.result.avatar)}
            size={150}
            borderRadius={120}
          />
          {/* 更换头像按钮 */}
          <Pressable
            onPress={() => handleAvatarModalVisible(true)}
            style={({pressed}) => [
              styles.background_btn,
              {
                backgroundColor: theme.colors.divider,
                transform: [{scale: pressed ? 0.97 : 1}],
                opacity: pressed ? 0.9 : 1,
                bottom: 10,
                right: -20,
              },
            ]}>
            <Icons
              name="camera"
              size={30}
              color={theme.colors.defaultTextColor}
            />
          </Pressable>
        </View>
        {/* 名字 */}
        <Text
          style={[
            styles.name,
            {
              color: theme.colors.defaultTextColor,
              paddingLeft: 10,
            },
          ]}>
          {state.user?.result.nick_name}
        </Text>
        {/* 按钮 */}
        <View style={[styles.group_btns, {gap: 10}]}>
          {/* 发帖子按钮 */}
          <Pressable
            onPress={() => navigate.navigate('postting')}
            style={({pressed}) => [
              styles.friend_btn,
              {
                backgroundColor: theme.colors.primary,
                transform: [{scale: pressed ? 0.97 : 1}],
                opacity: pressed ? 0.9 : 1,
              },
            ]}>
            <EIcons
              name="plus"
              size={20}
              color="#FFFFFF"
            />
            <Text style={{color: '#FFFFFF', fontSize: 16, fontWeight: '500'}}>
              发帖子
            </Text>
          </Pressable>

          {/* 设置按钮 */}
          <Pressable
            onPress={() => handleSettingModalVisible(true)}
            style={({pressed}) => [
              styles.setting,
              {
                backgroundColor: theme.colors.divider,
                transform: [{scale: pressed ? 0.97 : 1}],
                opacity: pressed ? 0.9 : 1,
              },
            ]}>
            <Icons
              name="settings"
              size={20}
              color={theme.colors.defaultTextColor}
            />
          </Pressable>
        </View>
      </View>

      {/* settingmodal */}
      <MyModal
        half
        modalVisible={settingModalVisible}
        setModalVisible={setSettingModalVisible}
        children={
          <View style={[styles.modal_options]}>
            <ToggleTheme />
            <Divider />
            <Pressable
              style={[styles.modal_option]}
              android_ripple={{color: theme.colors.clickbg}}>
              <Icons
                name="exit"
                size={30}
                color={'#ff5757ed'}
              />
              <Text style={[styles.modal_option_text, {color: '#ff5757ed'}]}>
                退出账号
              </Text>
            </Pressable>
          </View>
        }
      />
      {/* 背景图和头像 */}
      <MyModal
        half
        modalVisible={avatarModalVisible}
        setModalVisible={setAvatarModalVisible}
        children={
          <ChangePhotoModal
            type="avatar"
            title="头像"
            theme={theme.colors}
            handleAvatarUri={handleAvatarUri}
            handleBackgroundUri={handleBackgroundUri}
            closeModal={handleAvatarModalVisible}
            openConfirm={handleConfirmVisible}
          />
        }
      />
      <MyModal
        half
        modalVisible={backgroundModalVisible}
        setModalVisible={setBackgroundModalVisible}
        children={
          <ChangePhotoModal
            type="bg"
            title="背景图"
            theme={theme.colors}
            handleAvatarUri={handleAvatarUri}
            handleBackgroundUri={handleBackgroundUri}
            closeModal={handleBackgroundModal}
            openConfirm={handleConfirmVisible}
          />
        }
      />

      {/* 更换头像或背景的确认modal */}
      <ImageConfirmModal
        current_avatar={state.user?.result.avatar!}
        current_bg={state.user?.result.profile_img!}
        avatar={avatarUri}
        background={backgroundUri}
        theme={theme.colors}
        visible={confirmModalVisible}
        setVisible={handleConfirmVisible}
        handleAvatarUri={handleAvatarUri}
        handleBackgroundUri={handleBackgroundUri}
      />
    </View>
  )
})
interface ChangePhotoModalProps {
  type: 'avatar' | 'bg'
  theme: Colors
  title: string
  handleAvatarUri: (avatar: Asset) => void
  handleBackgroundUri: (background: Asset) => void
  closeModal: (visible: boolean) => void
  openConfirm: (visible: boolean, uri?: string) => void
}
const ChangePhotoModal = React.memo((props: ChangePhotoModalProps) => {
  const {
    type,
    theme,
    title,
    closeModal,
    openConfirm,
    handleAvatarUri,
    handleBackgroundUri,
  } = props
  /* 选择相册内资源 */
  const getGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      ({assets}) => {
        if (assets) {
          if (type === 'avatar') {
            handleAvatarUri(assets[0])
          } else if (type === 'bg') {
            handleBackgroundUri(assets[0])
          }
          closeModal(false)
          openConfirm(true)
        }
      },
    )
  }
  /* 启动相机 */
  const startCamera = () => {
    launchCamera({mediaType: 'photo', cameraType: 'back'}, ({assets}) => {
      if (assets) {
        if (type === 'avatar') {
          handleAvatarUri(assets[0])
        } else if (type === 'bg') {
          handleBackgroundUri(assets[0])
        }
        closeModal(false)
        openConfirm(true)
      }
    })
  }
  return (
    <View>
      <Text
        style={[
          {
            fontSize: 18,
            fontWeight: '500',
            marginLeft: 18,
            color: theme.defaultTextColor,
          },
        ]}>
        {title}
      </Text>
      <Pressable
        onPress={() => getGallery()}
        style={[styles.modal_option]}
        android_ripple={{color: theme.clickbg}}>
        <FAIcons
          name="file-photo-o"
          size={30}
          color={theme.secondary}
        />
        <View>
          <Text
            style={[
              styles.modal_option_text,
              {color: theme.defaultTextColor, marginLeft: 4},
            ]}>
            从相册里选
          </Text>
          <Text style={{color: theme.secondary, marginLeft: 4}}>长按图片可放大</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => startCamera()}
        style={[styles.modal_option]}
        android_ripple={{color: theme.clickbg}}>
        <FIcons
          name="camera"
          size={30}
          color={theme.secondary}
        />
        <Text style={[styles.modal_option_text, {color: theme.defaultTextColor}]}>
          打开相机拍照
        </Text>
      </Pressable>
    </View>
  )
})

interface ImageConfirmModalProps {
  current_avatar: string
  current_bg: string
  avatar?: Asset
  background?: Asset
  theme: Colors
  visible: boolean
  setVisible: (visible: boolean) => void
  handleAvatarUri: (avatar?: Asset) => void
  handleBackgroundUri: (background?: Asset) => void
}
const ImageConfirmModal = React.memo((props: ImageConfirmModalProps) => {
  const {
    visible,
    setVisible,
    theme,
    avatar,
    background,
    current_avatar,
    current_bg,
    handleAvatarUri,
    handleBackgroundUri,
  } = props
  const {state, dispatch} = React.useContext(MyContext)

  const handleClose = () => {
    setVisible(false)
    handleAvatarUri()
    handleBackgroundUri()
  }
  /* 确定保存更改 */
  const handleSubmit = (avatar?: Asset, background?: Asset) => {
    handleAvatarUri(avatar)
    handleBackgroundUri(background)
    if (avatar) {
      alterationAvatar(state.user?.result.user_id!, avatar, state.user?.token!).then(
        val => {
          changeLocalUserData(val)
        },
      )
    }
    if (background) {
      alterationCover(
        {file: background, user_id: state.user?.result.user_id!},
        state.user?.token!,
      ).then(val => {
        changeLocalUserData(val)
      })
    }
    setVisible(false)
  }

  const changeLocalUserData = (newData: ResponseType<UserType>) => {
    if (newData.code === 1) {
      const userData: DataType = {
        result: newData.data,
        token: state.user?.token!,
      }
      dispatch({type: ActionTypes.USER, payload: userData})
      storage.set('user', JSON.stringify(userData))
      myToast(newData.message)
    } else {
      myToast(newData.message)
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={() => handleClose()}>
      <View style={{flex: 1, backgroundColor: theme.background}}>
        <ModalTop
          name="预览"
          onClose={() => handleClose()}
          handleSubmit={() => handleSubmit(avatar, background)}
          buttonName="保存"
        />
        <Divider />
        {/* 背景图 */}
        <View>
          <Image
            style={{width: '100%', height: 240}}
            source={{uri: background?.uri || getUnionUrl(current_bg)}}
          />
        </View>
        {/* 头像和名字 */}
        <View style={[styles.avatar_wrapper]}>
          <View
            style={[
              styles.avatar,
              {
                borderColor: theme.background,
              },
            ]}>
            <Avatar
              src={avatar?.uri || getUnionUrl(current_avatar)}
              size={150}
              borderRadius={120}
            />
          </View>
          <Text
            style={[
              styles.name,
              {
                color: theme.defaultTextColor,
                paddingLeft: 10,
              },
            ]}>
            {state.user?.result.nick_name}
          </Text>
        </View>
      </View>
    </Modal>
  )
})

export default MyProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
  },
  noNetwork: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fb8c8c',
  },
  top: {},
  empty: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar_wrapper: {
    alignItems: 'flex-start',
    paddingTop: 40,
    gap: 10,
  },
  avatar: {
    position: 'absolute',
    top: -120,
    left: 10,
    borderWidth: 5,
    borderRadius: 120,
  },
  name: {
    fontSize: 30,
    fontWeight: '500',
  },

  background_btn: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  group_btns: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  friend_btn: {
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  setting: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  modal_options: {
    // flex: 1,
    justifyContent: 'center',
  },
  modal_option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingLeft: 18,
    gap: 10,
  },
  modal_option_text: {
    fontSize: 18,
  },
})
