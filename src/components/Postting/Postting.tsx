import React from 'react'
import {TextInput, View, Text, StyleSheet, Pressable, Image, Keyboard} from 'react-native'
import {ThemeContext} from '../../theme'
import Divider from '../Divider/Divider'
import type {NativeStackScreenProps} from '@react-navigation/native-stack'
import FWIcon from 'react-native-vector-icons/FontAwesome'
import ADIcon from 'react-native-vector-icons/AntDesign'
import {CameraRoll, PhotoIdentifier} from '@react-native-camera-roll/camera-roll'
import GetAssets from '../GetAssets/GetAssets'
import ModalTop from '../ModalTop/ModalTop'

type Props = NativeStackScreenProps<any, 'postting'>
const Postting = (props: Props) => {
  const {navigation} = props
  const {theme, toggleTheme} = React.useContext(ThemeContext)
  const [input, setInput] = React.useState<string>('')
  const [visible, setVisible] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<PhotoIdentifier[]>([])
  const inputRef = React.useRef<TextInput | null>(null)

  /* 键盘监听器 */
  React.useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => inputRef.current?.blur())
    return () => {
      Keyboard.removeAllListeners('keyboardDidHide')
    }
  }, [])

  return (
    <View style={[styles.flex, {backgroundColor: theme.background}]}>
      {/* top */}
      <ModalTop
        name="创建帖子"
        buttonName="发布"
        onClose={() => navigation.goBack()}
        handleSubmit={() => {}}
      />
      <Divider />
      {/* input */}
      <Pressable
        style={[styles.flex]}
        onPress={e => e.currentTarget === e.target && inputRef.current?.focus()}>
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
          {selected.map((item, index) => (
            <Image
              style={{width: '50%', height: 200}}
              key={index}
              source={{uri: item.node.image.uri}}
            />
          ))}
        </View>
        <View style={{marginTop: 'auto', backgroundColor: theme.background}}>
          <Divider />
          <View style={[styles.fn]}>
            {/* 图片视频 */}
            <Pressable
              android_ripple={{color: theme.divider}}
              style={[styles.flex, styles.fnItem]}
              onPress={() => setVisible(true)}>
              <FWIcon
                name="photo"
                size={30}
                color={theme.primary}
              />
            </Pressable>
            {/* 表情 */}
            <Pressable
              android_ripple={{color: theme.divider}}
              style={[styles.flex, styles.fnItem]}>
              <ADIcon
                name="smileo"
                size={30}
                color="orange"
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
      <GetAssets
        visible={visible}
        setVisible={setVisible}
        setSelected={setSelected}
      />
    </View>
  )
}

export default Postting

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    paddingTop: 10,
  },
  wrapper: {},
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
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
  submit: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
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
})
