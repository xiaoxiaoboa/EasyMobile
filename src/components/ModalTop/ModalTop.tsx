import React from 'react'
import {View, Pressable, Text, StyleSheet} from 'react-native'
import {ThemeContext} from '../../theme'
import FIcons from 'react-native-vector-icons/Feather'
import Divider from '../Divider/Divider'

interface ModalTop {
  name: string | React.ReactNode
  onClose: () => void
  buttonName?: string
  handleSubmit?: () => void
  btnDisabled?: boolean
  extraElement?: React.ReactNode
  isBtnDisplay?: boolean
}

const ModalTop: React.FC<ModalTop> = props => {
  const {
    name,
    buttonName,
    onClose,
    handleSubmit,
    btnDisabled,
    extraElement,
    isBtnDisplay = true,
  } = props
  const {theme, toggleTheme} = React.useContext(ThemeContext)
  return (
    <View style={[styles.top]}>
      <View style={[styles.flex, styles.backBtn]}>
        <Pressable
          style={{padding: 6}}
          android_ripple={{color: theme.divider, radius: 20, borderless: false}}
          onPress={onClose}>
          <FIcons
            name="arrow-left"
            size={30}
            color={theme.isDark ? '#FFFFFF' : '#000000'}
          />
        </Pressable>
        <Text style={[styles.topText, {color: theme.isDark ? '#FFFFFF' : '#000000'}]}>
          {name}
        </Text>
      </View>
      {extraElement}

      <View
        style={[
          styles.submit,
          {
            backgroundColor: btnDisabled ? theme.divider : theme.primary,
            display: isBtnDisplay ? 'flex' : 'none',
          },
        ]}>
        <Pressable
          onPress={handleSubmit}
          disabled={btnDisabled}>
          <Text style={[{fontWeight: '600', color: '#FFFFFF'}]}>{buttonName}</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default ModalTop

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingTop: 10,
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
})
