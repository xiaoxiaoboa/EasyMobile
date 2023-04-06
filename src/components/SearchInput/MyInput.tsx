import React from 'react'
import {StyleSheet, View, TextInput} from 'react-native'
import FIcons from 'react-native-vector-icons/FontAwesome'
import {ThemeContext} from '../../theme'

interface MyInputProps {
  hiddenIcon?: boolean
  placeholder: string
}
const MyInput: React.FC<MyInputProps> = props => {
  const {hiddenIcon = false, placeholder} = props
  const {theme} = React.useContext(ThemeContext)
  return (
    <View style={[styles.container]}>
      <View style={[styles.input_wrapper, {backgroundColor: theme.colors.inputbg}]}>
        <FIcons
          name="search"
          size={20}
          color={theme.colors.secondary}
          style={{display: hiddenIcon ? 'none' : 'flex'}}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.colors.secondary}
          style={[styles.input]}
        />
      </View>
    </View>
  )
}

export default MyInput

const styles = StyleSheet.create({
  container: {},
  input_wrapper: {
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
