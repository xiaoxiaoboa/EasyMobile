import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ListRenderItemInfo,
} from 'react-native'
import {ThemeContext} from '../theme'
import MyInput from '../components/SearchInput/MyInput'
import Avatar from '../components/Avatar/Avatar'
import MIcons from 'react-native-vector-icons/MaterialIcons'
import Divider from '../components/Divider/Divider'
import MyModal from '../components/MyModal/MyModal'
import {Colors} from '../theme/theme-types'
import Icons from 'react-native-vector-icons/Ionicons'
import Acons from 'react-native-vector-icons/AntDesign'
import {useNavigation} from '@react-navigation/native'

const Friends = () => {
  const {theme} = React.useContext(ThemeContext)
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* 顶部 */}
      <View style={[styles.top]}>
        <View>
          <Text style={[styles.title, {color: theme.colors.defaultTextColor}]}>好友</Text>
        </View>
        <View>
          <MyInput placeholder="搜索" />
        </View>
        <Pressable
          style={({pressed}) => [
            styles.request,
            {
              backgroundColor: theme.colors.clickbg,
              transform: [{scale: pressed ? 0.97 : 1}],
            },
          ]}>
          <Text
            style={{
              color: theme.colors.defaultTextColor,
              fontWeight: '500',
              fontSize: 16,
            }}>
            好友申请
          </Text>
        </Pressable>
        <Divider />
      </View>

      {/* 列表 */}
      <FlatList
        data={[
          ...Array(1000)
            .fill(0)
            .map((item, index) => item + index),
        ]}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={50}
        renderItem={params => (
          <RenderItem
            params={params}
            theme={theme.colors}
          />
        )}
      />
    </View>
  )
}

interface RenderItemProps {
  theme: Colors
  params: ListRenderItemInfo<any>
}
const RenderItem = (props: RenderItemProps) => {
  const {params, theme} = props
  const navigate = useNavigation()
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)

  const handleModalVisible = React.useCallback((visible: boolean) => {
    setModalVisible(visible)
  }, [])
  return (
    <>
      <Pressable
        style={[styles.user]}
        android_ripple={{color: theme.clickbg}}>
        <Avatar
          src={undefined}
          size={60}
        />
        <Text style={[styles.user_name, {color: theme.defaultTextColor}]}>
          原小新{params.index}
        </Text>
        <Pressable
          onPress={() => handleModalVisible(true)}
          style={[styles.user_btn]}
          hitSlop={15}
          android_ripple={{
            color: theme.clickbg,
            foreground: true,
            borderless: false,
          }}>
          <MIcons
            name="more-horiz"
            size={28}
            color={theme.defaultTextColor}
          />
        </Pressable>
      </Pressable>

      {/* modal */}
      <MyModal
        half
        modalVisible={modalVisible}
        setModalVisible={handleModalVisible}
        children={<ModalContent theme={theme} />}
      />
    </>
  )
}

interface ModalContentProps {
  theme: Colors
}
const ModalContent = React.memo((props: ModalContentProps) => {
  const {theme} = props
  return (
    <View>
      <View style={[styles.options_top]}>
        <Avatar
          src={undefined}
          size={56}
        />
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '500',
              color: theme.defaultTextColor,
            }}>
            原小新
          </Text>
          <Text style={{color: theme.secondary}}>从1998年1月1日成为好友 · 25年</Text>
        </View>
      </View>
      <Divider />
      <View style={[styles.options]}>
        <Pressable
          style={[styles.option]}
          android_ripple={{color: theme.clickbg}}>
          <Icons
            name="chatbubbles-outline"
            size={30}
            color={theme.secondary}
          />
          <Text style={{fontSize: 18, color: theme.defaultTextColor}}>
            发消息给<Text style={{fontWeight: '500'}}>原小新</Text>
          </Text>
        </Pressable>
        <Pressable
          style={[styles.option]}
          android_ripple={{color: theme.clickbg}}>
          <Acons
            name="deleteuser"
            size={30}
            color="#ff5757ed"
          />
          <View>
            <Text style={{fontSize: 18, color: '#ff5757', fontWeight: '500'}}>
              删除好友
            </Text>
            <Text style={[{color: theme.secondary}]}>
              永久删除好友<Text style={{fontWeight: '500'}}>原小新</Text>的全部相关信息
            </Text>
          </View>
        </Pressable>
        <View></View>
      </View>
    </View>
  )
})

export default Friends

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
  },
  top: {
    gap: 10,
    paddingHorizontal: 10,
  },
  title_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
  },
  user: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  user_name: {
    fontSize: 20,
    fontWeight: '500',
  },
  user_btn: {
    marginLeft: 'auto',
    borderRadius: 50,
    padding: 6,
    overflow: 'hidden',
  },
  request: {
    marginRight: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  options: {
    paddingTop: 10,
  },
  options_top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 10,
  },
})
