import React from 'react'
import {TextInput, View, Text, StyleSheet, Pressable, Image, Keyboard} from 'react-native'
import {ThemeContext} from '../theme'
import Divider from '../components/Divider/Divider'
import FAIcons from 'react-native-vector-icons/FontAwesome'
import {Asset, launchCamera, launchImageLibrary} from 'react-native-image-picker'
import ModalTop from '../components/ModalTop/ModalTop'
import FIcons from 'react-native-vector-icons/Feather'
import SLIcons from 'react-native-vector-icons/SimpleLineIcons'
import MyModal from '../components/MyModal/MyModal'
import {Colors} from '../theme/theme-types'
import EmojiPicker from 'rn-emoji-keyboard'

import type {NativeStackScreenProps} from '@react-navigation/native-stack'
import {feed_publish} from '../api/feed.api'
import {MyContext} from '../context/context'
import {ActionTypes} from '../types/reducer'
import {FeedType} from '../types/feed.type'
import myToast from '../utils/Toast'

type PosttingProps = NativeStackScreenProps<any, 'postting'>
const Postting = React.memo((props: PosttingProps) => {
  const {navigation} = props
  const {theme} = React.useContext(ThemeContext)
  const {state, dispatch} = React.useContext(MyContext)
  const [input, setInput] = React.useState<string>('')
  const inputRef = React.useRef<TextInput | null>(null)
  const [selected, setSelected] = React.useState<Asset[]>([])
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)

  /* 选择相册内资源 */
  const getGallery = () => {
    setModalVisible(false)
    launchImageLibrary(
      {
        mediaType: 'mixed',
        videoQuality: 'low',
        selectionLimit: 4,
      },
      ({assets}) => {
        if (assets) {
          setSelected(assets)
        }
      },
    )
  }
  /* 启动相机 */
  const startCamera = (type: 'video' | 'photo') => {
    launchCamera(
      {mediaType: type, cameraType: 'back', videoQuality: 'low', durationLimit: 30},
      ({assets}) => {
        if (assets) {
          setSelected(assets)
        }
      },
    )
    setModalVisible(p => !p)
  }

  const handleModalVisible = React.useCallback(() => {
    setModalVisible(p => !p)
  }, [])

  const getEmoji = (emoji: string) => {
    setInput(p => p + emoji)
  }

  /* 发布帖子 */
  const handlePostting = () => {
    feed_publish(
      selected,
      {feed_userID: state.user?.result.user_id!, feed_text: input},
      state.user?.token!,
    ).then(val => {
      if (val.code === 1) {
        val.data.createdAt = new Date(val.data.createdAt)
          .toLocaleString()
          .replace(/\//g, '-')
        const newFeed: FeedType = {
          ...val.data,
          user: {
            avatar: state.user?.result.avatar!,
            nick_name: state.user?.result.nick_name!,
            user_id: state.user?.result.user_id!,
          },
        }
        dispatch({type: ActionTypes.POSTTING, payload: newFeed})
        myToast(val.message)
        navigation.goBack()
      } else {
        myToast(val.message + val.data)
      }
    })
  }

  return (
    <View
      style={[styles.container, styles.flex, {backgroundColor: theme.colors.background}]}>
      {/* top */}
      <ModalTop
        name="创建帖子"
        buttonName="发布"
        onClose={() => navigation.goBack()}
        handleSubmit={handlePostting}
      />
      <Divider />
      {/* input */}
      <Pressable
        style={[styles.flex]}
        onPress={() =>
          Keyboard.isVisible() ? Keyboard.dismiss() : inputRef.current?.focus()
        }>
        <TextInput
          ref={inputRef}
          placeholder="分享你的瞬间把~"
          placeholderTextColor={theme.colors.secondary}
          multiline
          numberOfLines={5}
          value={input}
          cursorColor={theme.colors.primary}
          onChange={e => {
            e.persist()
            setInput(e.nativeEvent.text)
          }}
          style={{
            textAlignVertical: 'top',
            fontSize: 20,
            color: theme.colors.defaultTextColor,
          }}
        />
        <View style={[styles.showImg]}>
          {selected.map((item, index) => (
            <Image
              style={{width: '50%', height: 200}}
              key={index}
              source={{uri: item.uri}}
            />
          ))}
        </View>
      </Pressable>
      <PosttingBtns
        theme={theme.colors}
        handleModalVisible={handleModalVisible}
        getEmoji={getEmoji}
      />
      <MyModal
        half
        modalVisible={modalVisible}
        setModalVisible={handleModalVisible}
        children={
          <View style={[styles.options]}>
            <Pressable
              onPress={() => getGallery()}
              style={[styles.option]}
              android_ripple={{color: theme.colors.clickbg}}>
              <FAIcons
                name="file-photo-o"
                size={30}
                color={theme.colors.secondary}
              />
              <Text style={[styles.option_text, {color: theme.colors.defaultTextColor}]}>
                从相册里选择
              </Text>
            </Pressable>
            <Pressable
              onPress={() => startCamera('photo')}
              style={[styles.option]}
              android_ripple={{color: theme.colors.clickbg}}>
              <FIcons
                name="camera"
                size={30}
                color={theme.colors.secondary}
              />
              <Text style={[styles.option_text, {color: theme.colors.defaultTextColor}]}>
                使用相机拍照片
              </Text>
            </Pressable>
            <Pressable
              onPress={() => startCamera('video')}
              style={[styles.option]}
              android_ripple={{color: theme.colors.clickbg}}>
              <FIcons
                name="video"
                size={30}
                color={theme.colors.secondary}
              />
              <Text style={[styles.option_text, {color: theme.colors.defaultTextColor}]}>
                使用相机拍视频
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  )
})

interface PosttingInputProps {
  theme: Colors
  selectedAssets: Asset[]
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}
const PosttingInput = React.memo((props: PosttingInputProps) => {
  const {theme, selectedAssets, input, setInput} = props
  const inputRef = React.useRef<TextInput | null>(null)
  return (
    <Pressable
      style={[styles.flex]}
      onPress={() =>
        Keyboard.isVisible() ? Keyboard.dismiss() : inputRef.current?.focus()
      }>
      <TextInput
        ref={inputRef}
        placeholder="分享你的瞬间把~"
        placeholderTextColor={theme.secondary}
        multiline
        numberOfLines={5}
        value={input}
        onChange={e => {
          e.persist()
          setInput(e.nativeEvent.text)
        }}
        style={{textAlignVertical: 'top', fontSize: 20}}
      />
      <View style={[styles.showImg]}>
        {selectedAssets.map((item, index) => (
          <Image
            style={{width: '50%', height: 200}}
            key={index}
            source={{uri: item.uri}}
          />
        ))}
      </View>
    </Pressable>
  )
})
interface PosttingBtnsProps {
  theme: Colors
  handleModalVisible: (visible: boolean) => void
  getEmoji: (emoji: string) => void
}
const PosttingBtns = React.memo((props: PosttingBtnsProps) => {
  const {theme, handleModalVisible, getEmoji} = props
  const [openEmoji, setOpenEmoji] = React.useState<boolean>(false)
  return (
    <View style={{marginTop: 'auto', backgroundColor: theme.background}}>
      <Divider />
      <View style={[styles.fn]}>
        {/* 表情 */}
        <Pressable
          android_ripple={{color: theme.divider}}
          style={[styles.flex, styles.fnItem]}
          onPress={() => setOpenEmoji(true)}>
          <SLIcons
            name="emotsmile"
            size={30}
            color="#ffc71b"
          />
        </Pressable>
        {/* 相机 */}
        <Pressable
          onPress={() => handleModalVisible(true)}
          android_ripple={{color: theme.divider}}
          style={[styles.flex, styles.fnItem]}>
          <FAIcons
            name="photo"
            size={30}
            color={theme.primary}
          />
        </Pressable>
      </View>
      <EmojiPicker
        open={openEmoji}
        onClose={() => setOpenEmoji(false)}
        onEmojiSelected={({emoji}) => getEmoji(emoji)}
        disabledCategories={[
          'animals_nature',
          'flags',
          'food_drink',
          'objects',
          'search',
          'symbols',
          'travel_places',
        ]}
      />
    </View>
  )
})

export default Postting

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingTop: 10,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  topText: {
    fontSize: 20,
    marginLeft: 10,
    textAlignVertical: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  fn: {
    flexDirection: 'row',
    width: '100%',
  },
  fnItem: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  showImg: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  options: {
    justifyContent: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 18,
    paddingVertical: 20,
  },
  option_text: {
    fontSize: 18,
  },
})
