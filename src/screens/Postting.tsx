import React from 'react'
import {TextInput, View, Text, StyleSheet, Pressable, Image, Keyboard} from 'react-native'
import {ThemeContext} from '../theme'
import Divider from '../components/Divider/Divider'
import FWIcon from 'react-native-vector-icons/FontAwesome'
import {Asset, launchCamera, launchImageLibrary} from 'react-native-image-picker'
import ModalTop from '../components/ModalTop/ModalTop'
import FIcons from 'react-native-vector-icons/Feather'
import MyModal from '../components/MyModal/MyModal'
import {Colors, Theme} from '../theme/theme-types'

import type {NativeStackScreenProps} from '@react-navigation/native-stack'

type PosttingProps = NativeStackScreenProps<any, 'postting'>
const Postting = React.memo((props: PosttingProps) => {
  const {navigation} = props
  const {theme} = React.useContext(ThemeContext)
  const [input, setInput] = React.useState<string>('')
  const [selected, setSelected] = React.useState<Asset[]>([])
  const inputRef = React.useRef<TextInput | null>(null)
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)

  /* 选择相册内资源 */
  const getGallery = () => {
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

  const handleModalVisible = React.useCallback((visible: boolean) => {
    setModalVisible(visible)
  }, [])

  return (
    <View
      style={[styles.container, styles.flex, {backgroundColor: theme.colors.background}]}>
      {/* top */}
      <ModalTop
        name="创建帖子"
        buttonName="发布"
        onClose={() => navigation.goBack()}
        handleSubmit={() => {}}
      />
      <Divider />
      {/* input */}
      <PosttingInput
        selectedAssets={selected}
        theme={theme.colors}
      />
      <View style={{marginTop: 'auto', backgroundColor: theme.colors.background}}>
        <Divider />
        <View style={[styles.fn]}>
          {/* 图片视频 */}
          <Pressable
            android_ripple={{color: theme.colors.divider}}
            style={[styles.flex, styles.fnItem]}
            onPress={() => getGallery()}>
            <FWIcon
              name="photo"
              size={30}
              color={theme.colors.primary}
            />
          </Pressable>
          {/* 相机 */}
          <Pressable
            onPress={() => handleModalVisible(true)}
            android_ripple={{color: theme.colors.divider}}
            style={[styles.flex, styles.fnItem]}>
            <FIcons
              name="camera"
              size={30}
              color="orange"
            />
          </Pressable>
        </View>
      </View>
      <MyModal
        half
        modalVisible={modalVisible}
        setModalVisible={handleModalVisible}
        children={
          <View style={[styles.options]}>
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
}
const PosttingInput = React.memo((props: PosttingInputProps) => {
  const {theme, selectedAssets} = props
  const [input, setInput] = React.useState<string>('')
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
