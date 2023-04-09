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
import {useNavigation, NavigationProp} from '@react-navigation/native'
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

const Profile = () => {
  const {theme} = React.useContext(ThemeContext)
  const {state, dispatch} = React.useContext(MyContext)
  const [myFeeds, setMyFeeds] = React.useState<FeedType[]>([])
  const limitRef = React.useRef<number>(5)
  const offsetRef = React.useRef<number>(0)

  /* 获取用户帖子 */
  const getMyFeeds = () => {
    feeds_query(
      state.user?.result.user_id!,
      limitRef.current,
      offsetRef.current,
      state.user?.token!,
    ).then(val => {
      if (val.code === 1) {
        setMyFeeds(p => [...p, ...val.data])
        offsetRef.current += limitRef.current
      }
    })
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.homebg}]}>
      <FlatList
        data={myFeeds}
        initialNumToRender={3}
        onEndReachedThreshold={0.3}
        onEndReached={getMyFeeds}
        keyExtractor={({feed_id}) => feed_id}
        ListHeaderComponent={Header}
        showsVerticalScrollIndicator={false}
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
      {/* 背景图 */}
      <View>
        <Image
          style={{width: '100%', height: 260}}
          source={
            backgroundUri
              ? {uri: backgroundUri.uri}
              : {
                  uri: getUnionUrl(state.user?.result.profile_img),
                }
          }
        />
      </View>
      {/* 头像和名字 */}
      <View style={[styles.avatar]}>
        <View
          style={{
            borderWidth: 5,
            borderColor: theme.colors.background,
            borderRadius: 120,
          }}>
          <Avatar
            src={avatarUri?.uri || getUnionUrl(state.user?.result.avatar)}
            size={150}
            borderRadius={120}
          />
        </View>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={[
            styles.name,
            {
              color: theme.colors.defaultTextColor,
              width: 150,
            },
          ]}>
          {state.user?.result.nick_name}asdkabdahb
        </Text>

        {/* 更换头像按钮 */}
        <Pressable
          onPress={() => handleAvatarModalVisible(true)}
          style={({pressed}) => [
            styles.background_btn,
            {
              backgroundColor: theme.colors.divider,
              transform: [{scale: pressed ? 0.97 : 1}],
              opacity: pressed ? 0.9 : 1,
              bottom: 40,
              right: -10,
            },
          ]}>
          <Icons
            name="camera"
            size={30}
            color={theme.colors.defaultTextColor}
          />
        </Pressable>
      </View>
      {/* 更换背景图按钮 */}
      <Pressable
        onPress={() => handleBackgroundModal(true)}
        style={({pressed}) => [
          styles.background_btn,
          {
            backgroundColor: theme.colors.divider,
            transform: [{scale: pressed ? 0.97 : 1}],
            opacity: pressed ? 0.9 : 1,
            bottom: 90,
            right: 16,
          },
        ]}>
        <Icons
          name="camera"
          size={30}
          color={theme.colors.defaultTextColor}
        />
      </Pressable>
      {/* 按钮 */}
      <View style={[styles.group_btns, {gap: 10}]}>
        <Pressable
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
          <Text style={{color: '#FFFFFF', fontSize: 16}}>添加好友</Text>
        </Pressable>
        {/* <Pressable
          style={({pressed}) => [
            styles.friend_btn,
            {
              backgroundColor: theme.clolors.primary,
              transform: [{scale: pressed ? 0.97 : 1}],
              opacity: pressed ? 0.9 : 1,
            },
          ]}>
          <Icons
            name="chatbubble-outline"
            size={20}
            color="#FFFFFF"
          />
          <Text style={{color: '#FFFFFF', fontSize: 16}}>发消息</Text>
        </Pressable> */}
        {/* 设置按钮 */}
        <Pressable
          onPress={() => handleSettingModalVisible(true)}
          style={({pressed}) => [
            styles.friend_btn,
            {
              backgroundColor: theme.colors.divider,
              transform: [{scale: pressed ? 0.97 : 1}],
              opacity: pressed ? 0.9 : 1,
              paddingRight: 8,
            },
          ]}>
          <Icons
            name="settings"
            size={20}
            color={theme.colors.defaultTextColor}
          />
        </Pressable>
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
        <View style={[styles.top]}>
          {/* 背景图 */}
          <View>
            <Image
              style={{width: '100%', height: 260}}
              source={{uri: background?.uri || getUnionUrl(current_bg)}}
            />
          </View>
          {/* 头像和名字 */}
          <View style={[styles.avatar]}>
            <View
              style={{
                borderWidth: 5,
                borderColor: theme.background,
                borderRadius: 120,
              }}>
              <Avatar
                src={avatar?.uri || getUnionUrl(current_avatar)}
                size={150}
                borderRadius={120}
              />
            </View>
            <Text style={[styles.name, {color: theme.defaultTextColor}]}>原小新</Text>
          </View>
        </View>
      </View>
    </Modal>
  )
})

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
  },
  top: {
    height: 340,
  },
  avatar: {
    position: 'absolute',
    bottom: 5,
    left: 20,
    alignItems: 'center',
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
    position: 'absolute',
    right: 26,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  friend_btn: {
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
