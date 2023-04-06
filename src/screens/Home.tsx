import React from 'react'
import {Text, View, StyleSheet, Pressable, FlatList, StatusBar} from 'react-native'
import {ThemeContext} from '../theme'
import Avatar from '../components/Avatar/Avatar'
import type {NativeStackScreenProps} from '@react-navigation/native-stack'
import FeedCard from '../components/FeedCard/FeedCard'
import 'react-native-get-random-values'
import {nanoid} from 'nanoid'
import MyModal from '../components/MyModal/MyModal'
import Postting from './Postting'
import { Colors} from '../theme/theme-types'
import {useNavigation, NavigationProp} from '@react-navigation/native'
import {RootStackParamList} from '../types/route'

type imagesType = {id: string; uri: string}
export const images: imagesType[] = [
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

const Home = () => {
  const {theme, toggleTheme} = React.useContext(ThemeContext)

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.homebg}]}>
      <View style={{flex: 1, paddingTop: 100}}>
        <FlatList
          data={Array(1000)
            .fill(0)
            .map(() => images)}
          initialNumToRender={3}
          ListHeaderComponent={() => <HeaderComponent theme={theme.colors} />}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <FeedCard
              key={index}
              images={item}
              index={index}
            />
          )}
        />
      </View>
    </View>
  )
}
interface HeaderComponentProps {
  theme: Colors
}
const HeaderComponent = (props: HeaderComponentProps) => {
  const {theme} = props
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()

  const handleModalVisible = React.useCallback((visible: boolean) => {
    setModalVisible(visible)
  }, [])

  return (
    <View>
      <View style={[styles.homeTop, {backgroundColor: theme.background}]}>
        <Avatar src={undefined} size={40} />
        <View style={[styles.postting, {borderColor: theme.secondary}]}>
          <Pressable
            style={[styles.topbtn]}
            android_ripple={{
              color: theme.divider,
              borderless: false,
              foreground: true,
            }}
            onPress={() => navigate.navigate('postting')}>
            <Text style={{color: theme.secondary}}>分享好瞬间~</Text>
          </Pressable>
        </View>
      </View>
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
