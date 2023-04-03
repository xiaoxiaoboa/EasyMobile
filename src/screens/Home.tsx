import React from 'react'
import {Text, View, StyleSheet, Pressable, FlatList, StatusBar} from 'react-native'
import {ThemeContext} from '../theme'
import Avatar from '../components/Avatar/Avatar'
import type {NativeStackScreenProps} from '@react-navigation/native-stack'
import FeedCard from '../components/FeedCard/FeedCard'
import 'react-native-get-random-values'
import {nanoid} from 'nanoid'
import {MyContext} from '../context/context'
import {ActionTypes} from '../types/reducer'
import Swiper from '../components/Swiper/Swiper'

type imagesType = {id: string; uri: string}
const images: imagesType[] = [
  {
    id: nanoid(),
    uri: 'https://images.pexels.com/photos/4041122/pexels-photo-4041122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: nanoid(),
    uri: `https://images.pexels.com/photos/15955850/pexels-photo-15955850.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load`,
  },
  {
    id: nanoid(),
    uri: `https://images.pexels.com/photos/15955859/pexels-photo-15955859.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load`,
  },
  {
    id: nanoid(),
    uri: `https://images.pexels.com/photos/15955945/pexels-photo-15955945.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load`,
  },
  // {
  //   id: nanoid(),
  //   uri: `https://images.pexels.com/photos/16157620/pexels-photo-16157620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`,
  // },
]

export const data = [images, images, images, images, images, images, images, images, images]

type Props = NativeStackScreenProps<any, 'home'>
const Home = ({navigation}: Props) => {
  const {theme, toggleTheme} = React.useContext(ThemeContext)
  const [swiperVisible, setSwiperVisible] = React.useState<boolean>(false)
  const targetIndexRef = React.useRef<any>()
  const sourceRef = React.useRef<any[]>([])

  const HeaderComponent = React.useMemo(() => {
    return (
      <View style={[styles.homeTop, {backgroundColor: theme.background}]}>
        <Avatar size={40} />
        <View style={[styles.postting, {borderColor: theme.secondary}]}>
          <Pressable
            style={[styles.topbtn]}
            android_ripple={{
              color: theme.divider,
              borderless: false,
              foreground: true,
            }}
            onPress={() => navigation.navigate('postting')}>
            <Text style={{color: theme.secondary}}>分享好瞬间~</Text>
          </Pressable>
        </View>
      </View>
    )
  }, [theme])

  const handleOpenSwiper = React.useCallback((targetIndex: any, source: any[]) => {
    targetIndexRef.current = targetIndex
    sourceRef.current = source
    setSwiperVisible(p => !p)
  }, [])

  return (
    <View style={[styles.container, {backgroundColor: theme.homebg}]}>
      <View style={{flex: 1, paddingTop: 100}}>
        <FlatList
          data={data}
          initialNumToRender={30}
          ListHeaderComponent={HeaderComponent}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <FeedCard
              key={index}
              images={item}
              handleOpenSwiper={handleOpenSwiper}
            />
          )}
        />
      </View>
      <Swiper
        source={sourceRef.current}
        targetIndex={targetIndexRef.current}
        visible={swiperVisible}
        setVisible={setSwiperVisible}
      />
    </View>
  )
}
export default Home

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  homeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    gap: 10,
  },
  topbtn: {
    height: 40,
    borderRadius: 26,
    justifyContent: 'center',
    paddingLeft: 10,
    overflow: 'hidden',
  },
  postting: {
    flex: 1,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: 'center',
  },
})
