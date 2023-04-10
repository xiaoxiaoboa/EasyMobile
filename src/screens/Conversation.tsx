import React from 'react'
import {Text, View, FlatList, StyleSheet, Pressable} from 'react-native'
import {ThemeContext} from '../theme'
import MyInput from '../components/MyInput/MyInput'
import Avatar from '../components/Avatar/Avatar'
import {Colors} from '../theme/theme-types'
import MyModal from '../components/MyModal/MyModal'
import AIcons from 'react-native-vector-icons/AntDesign'

import {RootStackParamList} from '../types/route'
import {useNavigation, NavigationProp} from '@react-navigation/native'

const Conversation = () => {
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  const {theme} = React.useContext(ThemeContext)

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.wrapper]}>
        <MyInput
          placeholder="搜索"
          paddingHorizontal={10}
        />
        <FlatList
          data={Array(1)
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
        <View>
          <Text style={[styles.user_name, {color: theme.defaultTextColor}]}>原小新</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.user_message, {color: theme.secondary}]}>
            hellokajbflabglakjbrg.masndbgljahbgaksb.dbvmcbvjhbd
          </Text>
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
                删除与<Text style={{fontWeight: '500'}}>原小新</Text>的聊天
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  )
}

export default Conversation
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
    gap: 10,
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
