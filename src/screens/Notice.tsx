import React from 'react'
import {View, StyleSheet, FlatList, Pressable, Text} from 'react-native'
import {ThemeContext} from '../theme'
import MyInput from '../components/MyInput/MyInput'
import {Colors} from '../theme/theme-types'
import {NavigationProp, useNavigation} from '@react-navigation/native'
import {RootStackParamList} from '../types/route'
import AIcons from 'react-native-vector-icons/AntDesign'
import Avatar from '../components/Avatar/Avatar'
import MyModal from '../components/MyModal/MyModal'

const Notice = () => {
  const {theme} = React.useContext(ThemeContext)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.wrapper]}>
        <MyInput
          placeholder="搜索"
          paddingHorizontal={10}
        />
        <FlatList
          data={Array(100)
            .fill(0)
            .map((item, index) => index + 1)}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          renderItem={() => (
            <RenderItem
              theme={theme.colors}
              navigation={navigate}
            />
          )}
        />
      </View>
    </View>
  )
}

interface RenderItemProps {
  theme: Colors
  navigation: NavigationProp<RootStackParamList>
}
const RenderItem = (props: RenderItemProps) => {
  const {theme, navigation} = props
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const handleModalVisible = React.useCallback(() => {
    setModalVisible(p => !p)
  }, [])
  return (
    <View>
      <Pressable
        onPress={() => navigation.navigate('chat')}
        onLongPress={handleModalVisible}
        style={[styles.user]}
        android_ripple={{color: theme.clickbg}}>
        <Avatar
          src={undefined}
          size={60}
        />
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={[styles.user_name, {color: theme.defaultTextColor}]}>原小新</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.user_message, {color: theme.secondary, width: '100%'}]}>
            hellokajbfl
          </Text>
        </View>
        <View style={{marginLeft: 'auto', paddingRight: 10}}>
          <Text>1天前</Text>
        </View>
      </Pressable>
      <MyModal
        half
        modalVisible={modalVisible}
        setModalVisible={handleModalVisible}
        children={
          <View>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 20,
                paddingLeft: 18,
              }}
              android_ripple={{color: theme.clickbg}}>
              <AIcons
                name="delete"
                size={28}
                color={theme.secondary}
              />
              <Text style={{color: theme.defaultTextColor, fontSize: 18}}>
                删除这条消息
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  )
}

export default Notice

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
  },
  wrapper: {
    paddingTop: 10,
    gap: 10,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  user_name: {
    fontSize: 20,
    fontWeight: '500',
  },
  user_message: {
    width: '80%',
  },
})
