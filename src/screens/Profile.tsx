import React from 'react'
import {View, StyleSheet, FlatList, Image, Text, Pressable} from 'react-native'
import Avatar from '../components/Avatar/Avatar'
import {ThemeContext} from '../theme'
import Icons from 'react-native-vector-icons/Ionicons'
import EIcons from 'react-native-vector-icons/Entypo'
import Divider from '../components/Divider/Divider'
import FeedCard from '../components/FeedCard/FeedCard'
import {data} from './Home'

const Profile = () => {
  const {theme} = React.useContext(ThemeContext)
  return (
    <View style={[{flex: 1, backgroundColor: theme.homebg}]}>
      <FlatList
        data={data}
        ListHeaderComponent={Header}
        renderItem={({index, item}) => (
          <FeedCard
            key={index}
            handleOpenSwiper={() => {}}
            images={item}
          />
        )}
      />
    </View>
  )
}
const Header = () => {
  const {theme} = React.useContext(ThemeContext)

  return (
    <View style={[styles.top, {backgroundColor: theme.background}]}>
      {/* 背景图 */}
      <View>
        <Image
          style={{width: '100%', height: 300}}
          source={require('../assets/2.png')}
        />
      </View>
      {/* 头像和名字 */}
      <View style={[styles.avatar]}>
        <Avatar
          src={undefined}
          size={150}
          borderRadius={120}
        />
        <Text style={[styles.name, {color: theme.defaultTextColor}]}>原小新</Text>

        <MyPhototBtn
          b={40}
          r={-10}
          secondary={theme.secondary}
          divider={theme.divider}
        />
      </View>
      {/* 更换背景图按钮 */}
      <MyPhototBtn
        b={90}
        r={16}
        secondary={theme.secondary}
        divider={theme.divider}
      />
      {/* 按钮 */}
      <MyButton
        primary={theme.primary}
        btn_name="添加好友"
        icon={
          <EIcons
            name="plus"
            size={20}
            color="#FFFFFF"
          />
        }
      />
      {/* <MyButton
        primary={theme.primary}
        btn_name="发消息"
        icon={
          <Icons
            name="chatbubble-outline"
            size={20}
            color="#FFFFFF"
          />
        }
      /> */}
    </View>
  )
}

interface MyButtonProps {
  primary: string
  icon: React.ReactNode
  btn_name: string
}
const MyButton: React.FC<MyButtonProps> = React.memo(props => {
  const {icon, primary, btn_name} = props
  return (
    <Pressable
      style={({pressed}) => [
        styles.friend_btn,
        {
          backgroundColor: primary,
          transform: [{scale: pressed ? 0.97 : 1}],
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      {icon}
      <Text style={{color: '#FFFFFF', fontSize: 16}}>{btn_name}</Text>
    </Pressable>
  )
})
interface MyPhototBtnProps {
  divider: string
  secondary: string
  t?: number
  b?: number
  l?: number
  r?: number
}
const MyPhototBtn: React.FC<MyPhototBtnProps> = React.memo(props => {
  const {divider, secondary, b, l, r, t} = props
  return (
    <Pressable
      style={({pressed}) => [
        styles.background_btn,
        {
          backgroundColor: divider,
          bottom: b,
          right: r,
          left: l,
          top: t,
          transform: [{scale: pressed ? 0.97 : 1}],
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      <Icons
        name="camera"
        size={30}
        color={secondary}
      />
    </Pressable>
  )
})

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    height: 380,
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
  friend_btn: {
    position: 'absolute',
    right: 30,
    bottom: 10,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
})
