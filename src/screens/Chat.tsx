import React from 'react'
import {Text, View, Button, FlatList, StyleSheet, Pressable} from 'react-native'
import {ThemeContext} from '../theme'

const Chat = () => {
  const {theme, toggleTheme} = React.useContext(ThemeContext)
  const testRef = React.useRef<any[]>([])
  const texts = [
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
    'KDBFKABFLAHBGAJBJDHBGJHFAW',
  ]
  return (
    <View
      style={[styles.container, {backgroundColor: 'lightgray', paddingHorizontal: 10}]}>
      <Text style={[{color: theme.primary}]}>Settings!!!</Text>
      <Button
        title="点我点我点我"
        onPress={toggleTheme}
      />
      <FlatList
        data={texts}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index, separators}) => (
          <Pressable
            style={({pressed}) =>
              testRef.current.includes(index) && {
                borderWidth: 1,
              }
            }
            onPress={() => {
              testRef.current = testRef.current.includes(index)
                ? testRef.current.filter(i => i !== index)
                : [...testRef.current, index]
            }}>
            <Text
              style={{fontSize: 30}}
              key={index}>
              {item}
            </Text>
          </Pressable>
        )}
      />
    </View>
  )
}

export default Chat
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 0,
    bottom: 0,
    left: 0,
  },
})
