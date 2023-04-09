import React from 'react'
import {View, StyleSheet, Text, Pressable} from 'react-native'
import {ThemeContext} from '../theme'
import FIcons from 'react-native-vector-icons/Feather'
import Divider from '../components/Divider/Divider'
import Message from '../components/Message/Message'
import {FlatList} from 'react-native-gesture-handler'
import MyInput from '../components/MyInput/MyInput'

const text = [
  {
    me: false,
    text: `1杨家将是中国历史上著名的军事将领家族之一，起源于宋朝时期。最著名的代表人物为杨业、杨岐、杨坚等，以及杨家将团队的其他成员。杨家将的战功卓著，曾在历次战争中发挥重要作用。他们擅长火器战术和创新性地运用骑兵，并以强大的战斗力和组织能力著称。在宋金战争中，杨家将被派往南方，防守钦州、邕州等城池，保卫南宋国土。杨家将是中国军事史上的传奇之一，也是中国文化中具有重要地位的形象之一。`,
  },
  {
    me: true,
    text: `2杨家将是中国历史上著名的军事将领家族之一，起源于宋朝时期。最著名的代表人物为杨业、杨岐、杨坚等，以及杨家将团队的其他成员。杨家将的战功卓著，曾在历次战争中发挥重要作用。他们擅长火器战术和创新性地运用骑兵，并以强大的战斗力和组织能力著称。在宋金战争中，杨家将被派往南方，防守钦州、邕州等城池，保卫南宋国土。杨家将是中国军事史上的传奇之一，也是中国文化中具有重要地位的形象之一。`,
  },
]

const Chat = () => {
  const {theme} = React.useContext(ThemeContext)

  const handleGetInputValue = React.useCallback((value: string) => {
    // console.log(value)
  }, [])

  return (
    <View style={[styles.flex, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.top]}>
        <Pressable
          style={{padding: 6, borderRadius: 50, overflow: 'hidden'}}
          android_ripple={{
            color: theme.colors.clickbg,
            borderless: false,
            foreground: true,
          }}>
          <FIcons
            name="arrow-left"
            size={30}
            color={theme.colors.defaultTextColor}
          />
        </Pressable>
        <Text style={[styles.topText, {color: theme.colors.defaultTextColor}]}>
          原小新
        </Text>
      </View>
      <Divider />
      <View style={[styles.flex]}>
        <View style={[styles.messages_list]}>
          <FlatList
            data={Array(100)
              .fill(0)
              .map((item, index) => (index % 2 === 0 ? text[1] : text[0]))}
            inverted
            initialNumToRender={15}
            showsVerticalScrollIndicator={false}
            renderItem={({index, item}) => (
              <Message
                me={item.me}
                text={item.text}
              />
            )}
          />
        </View>
      </View>
      <Divider />
      <View style={[styles.bottom_input]}>
        <MyInput
          placeholder="输入消息"
          hiddenEmoji={false}
          getInputValue={handleGetInputValue}
          paddingHorizontal={10}
          paddingVertical={10}
        />
      </View>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 10,
  },
  topText: {
    fontSize: 20,
    marginLeft: 10,
  },
  messages_list: {
    padding: 10,
  },
  bottom_input: {
    // padding: 10,
    // flexDirection: 'row',
    // alignItems: 'center',
  },
})
