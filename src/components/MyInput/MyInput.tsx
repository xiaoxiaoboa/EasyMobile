import React from 'react'
import {StyleSheet, View, TextInput, Pressable} from 'react-native'
import FIcons from 'react-native-vector-icons/FontAwesome'
import {ThemeContext} from '../../theme'
import EmojiPicker, {EmojiKeyboard} from 'rn-emoji-keyboard'
import SLIcons from 'react-native-vector-icons/SimpleLineIcons'
import {Colors} from '../../theme/theme-types'

interface MyInputProps {
  placeholder: string
  editable?: boolean
  hiddenIcon?: boolean
  hiddenEmoji?: boolean
  paddingHorizontal?: number
  paddingVertical?: number
  getInputValue?: (value: string) => void
}
const MyInput = React.memo((props: MyInputProps) => {
  const {
    editable = true,
    hiddenIcon = true,
    hiddenEmoji = true,
    placeholder,
    getInputValue,
    paddingHorizontal,
    paddingVertical,
  } = props
  const {theme} = React.useContext(ThemeContext)
  const [openEmoji, setOpenEmoji] = React.useState<boolean>(false)
  const [inputValue, setInputValue] = React.useState<string>('')
  const inputRef = React.useRef<TextInput | null>(null)

  const getEmoji = (emoji: string) => {
    setInputValue(p => p + emoji)
  }
  const handleOpenEmoji = React.useCallback(() => {
    editable && setOpenEmoji(p => !p)
  }, [])
  const handleEndEditing = (text: string) => {
    getInputValue && getInputValue(text)
    setInputValue('')
  }

  return (
    <View style={[]}>
      <View style={[styles.container, {paddingHorizontal, paddingVertical}]}>
        <View style={[styles.input_wrapper, {backgroundColor: theme.colors.inputbg}]}>
          {/* icon */}
          <FIcons
            name="search"
            size={20}
            color={theme.colors.secondary}
            style={{display: hiddenIcon ? 'none' : 'flex'}}
          />
          {/* input */}
          <TextInput
            editable={editable}
            ref={inputRef}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.secondary}
            style={[styles.input, {color: theme.colors.defaultTextColor}]}
            cursorColor={theme.colors.primary}
            value={inputValue}
            onChange={e => {
              e.persist()
              setInputValue(e.nativeEvent.text)
            }}
            onSubmitEditing={({nativeEvent: {text}}) => handleEndEditing(text)}
          />
        </View>
        {/* emoji */}
        {!hiddenEmoji && (
          <Pressable
            style={{marginLeft: 6}}
            onPress={handleOpenEmoji}>
            <SLIcons
              name="emotsmile"
              size={30}
              color={theme.colors.secondary}
            />
          </Pressable>
        )}
      </View>
      {!hiddenEmoji && (
        <EmojiPicker
          open={openEmoji}
          onRequestClose={handleOpenEmoji}
          onClose={handleOpenEmoji}
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
          theme={{
            container: theme.colors.background,
            header: theme.colors.secondary,
            knob: theme.colors.secondary,
          }}
        />
      )}
    </View>
  )
})

interface EmojiProps {
  theme: Colors
  openEmoji: boolean
  handleOpenEmoji: () => void
  getEmoji: (emoji: string) => void
  handleKeyboard: () => void
}
const Emoji = React.memo((props: EmojiProps) => {
  const {theme, openEmoji, handleOpenEmoji, getEmoji, handleKeyboard} = props

  return (
    <View style={{paddingHorizontal: 10}}>
      <Pressable onPress={handleOpenEmoji}>
        <SLIcons
          name="emotsmile"
          size={30}
          color={theme.secondary}
        />
      </Pressable>

      {/* <EmojiPicker
        open={openEmoji}
        onRequestClose={handleOpenEmoji}
        onClose={handleOpenEmoji}
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
      /> */}
    </View>
  )
})
export default MyInput

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input_wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
    borderRadius: 18,
  },
  input: {
    fontSize: 16,
    flex: 1,
    padding: 6,
  },
})
