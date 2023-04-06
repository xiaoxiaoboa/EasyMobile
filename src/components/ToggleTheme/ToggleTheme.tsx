import React from 'react'
import {View, Pressable, Text, StyleSheet} from 'react-native'
import {ThemeContext} from '../../theme'
import Icons from 'react-native-vector-icons/Ionicons'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Theme, Colors} from '../../theme/theme-types'

const ToggleTheme = React.memo(() => {
  const {theme, toggleTheme} = React.useContext(ThemeContext)
  return (
    <View>
      <Text
        style={[
          {
            color: theme.colors.defaultTextColor,
            fontSize: 18,
            fontWeight: '500',
            marginLeft: 18,
          },
        ]}>
        主题
      </Text>
      <Pressable
        onPress={() => toggleTheme('auto')}
        style={[styles.modal_option]}
        android_ripple={{color: theme.colors.clickbg}}>
        <MCIcons
          name="moon-last-quarter"
          size={30}
          color={theme.colors.secondary}
        />
        <Text style={[styles.modal_option_text, {color: theme.colors.defaultTextColor}]}>
          自动
        </Text>
        <Radio
          theme={theme.colors}
          checked={theme.mode === 'auto'}
        />
      </Pressable>
      <Pressable
        onPress={() => toggleTheme('light')}
        style={[styles.modal_option]}
        android_ripple={{color: theme.colors.clickbg}}>
        <Icons
          name="ios-sunny"
          size={30}
          color={theme.colors.secondary}
        />
        <Text style={[styles.modal_option_text, {color: theme.colors.defaultTextColor}]}>
          明亮模式
        </Text>
        <Radio
          theme={theme.colors}
          checked={theme.mode === 'light'}
        />
      </Pressable>
      <Pressable
        onPress={() => toggleTheme('dark')}
        style={[styles.modal_option]}
        android_ripple={{color: theme.colors.clickbg}}>
        <Icons
          name="moon"
          size={30}
          color={theme.colors.secondary}
        />
        <Text style={[styles.modal_option_text, {color: theme.colors.defaultTextColor}]}>
          暗黑模式
        </Text>
        <Radio
          theme={theme.colors}
          checked={theme.mode === 'dark'}
        />
      </Pressable>
    </View>
  )
})

interface RadioProps {
  theme: Colors
  checked: boolean
}
const Radio = (props: RadioProps) => {
  const {theme, checked} = props
  return (
    <View
      style={[
        styles.radio,
        {
          borderColor: checked ? theme.primary : theme.secondary,
          backgroundColor: theme.background,
        },
      ]}>
      {checked && <View style={[styles.radio_thumb, {backgroundColor: theme.primary}]} />}
    </View>
  )
}
export default ToggleTheme

const styles = StyleSheet.create({
  modal_options: {
    flex: 1,
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
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 20,
  },
  radio_thumb: {
    width: 12,
    height: 12,
    borderRadius: 50,
  },
})
