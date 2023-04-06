import React from 'react'
import {StyleSheet, View, Pressable, Text} from 'react-native'
import {ThemeContext} from '../../theme'
import Avatar from '../Avatar/Avatar'
import MIcons from 'react-native-vector-icons/MaterialIcons'
import FIcons from 'react-native-vector-icons/FontAwesome'
import OIcons from 'react-native-vector-icons/Octicons'
import AIcons from 'react-native-vector-icons/AntDesign'
import Divider from '../Divider/Divider'
import Attaches from './Attaches'
import MyModal from '../MyModal/MyModal'
import {useNavigation, NavigationProp} from '@react-navigation/native'
import {RootStackParamList} from '../../types/route'

interface FeedCardProps {
  images: any[]
  index: number
}
const FeedCard = React.memo((props: FeedCardProps) => {
  const {images, index} = props
  const {theme} = React.useContext(ThemeContext)
  const [menuModalVisible, setMenuModalVisible] = React.useState<boolean>(false)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()

  /* 控制菜单modal */
  const handleMenuModalVisible = React.useCallback((visible: boolean) => {
    setMenuModalVisible(visible)
  }, [])

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.wrapper]}>
        {/* 顶部 */}
        <View style={[styles.top]}>
          {/* 头像 */}
          <View style={[styles.top_avatar]}>
            <Avatar
              src={undefined}
              size={40}
            />
            <View>
              <Text style={[styles.top_name, {color: theme.colors.defaultTextColor}]}>
                小新
              </Text>
              <Text style={[styles.top_timestamp, {color: theme.colors.secondary}]}>
                1天前
              </Text>
            </View>
          </View>
          {/* 菜单按钮 */}
          <Pressable
            hitSlop={10}
            onPress={() => handleMenuModalVisible(true)}
            style={{marginLeft: 'auto', padding: 4, borderRadius: 50, overflow: 'hidden'}}
            android_ripple={{
              color: theme.colors.clickbg,
              borderless: false,
              foreground: true,
            }}>
            <MIcons
              name="more-horiz"
              size={30}
              color={theme.colors.secondary}
            />
          </Pressable>
        </View>
        {/* 中部 */}
        <View style={[styles.middle, {backgroundColor: theme.colors.divider}]}>
          <Attaches attaches={images} />
        </View>
        {/* 底部 */}
        <View style={[styles.bottom]}>
          <View style={[styles.bootom_count]}>
            <Text style={{color: theme.colors.secondary}}>2个万赞</Text>
            <Text style={{color: theme.colors.secondary}}>·</Text>
            <Text style={{color: theme.colors.secondary}}>1,500条评论</Text>
          </View>
          <Divider />
          <View style={[styles.bottom_btns]}>
            {/* 点赞 */}
            <Pressable
              style={[styles.bottom_btn]}
              android_ripple={{
                color: theme.colors.divider,
                borderless: false,
              }}>
              <FIcons
                size={24}
                name="thumbs-o-up"
                color={theme.colors.secondary}
              />
              <Text style={{color: theme.colors.secondary}}>赞</Text>
              {/* <FIcons
                size={24}
                name="thumbs-up"
                color={theme.secondary}
              /> */}
            </Pressable>
            {/* 评论 */}
            <Pressable
              style={[styles.bottom_btn]}
              onPress={() => navigate.navigate('comment')}
              android_ripple={{
                color: theme.colors.divider,
                borderless: false,
              }}>
              <OIcons
                size={22}
                name="comment"
                color={theme.colors.secondary}
              />
              <Text style={{color: theme.colors.secondary}}>评论</Text>
            </Pressable>
            {/* 分享 */}
            <Pressable
              style={[styles.bottom_btn]}
              android_ripple={{
                color: theme.colors.divider,
                borderless: false,
              }}>
              <OIcons
                size={22}
                name="share-android"
                color={theme.colors.secondary}
              />
              <Text style={{color: theme.colors.secondary}}>分享</Text>
            </Pressable>
          </View>
        </View>

        {/* 菜单modal */}
        <MyModal
          half
          modalVisible={menuModalVisible}
          setModalVisible={handleMenuModalVisible}
          children={
            <View style={[styles.options]}>
              <Pressable
                style={[styles.option, {paddingLeft: 22}]}
                android_ripple={{color: theme.colors.clickbg}}>
                <OIcons
                  name="bookmark"
                  size={30}
                  color={theme.colors.secondary}
                />
                <Text
                  style={[
                    styles.option_text,
                    {marginLeft: 4, color: theme.colors.defaultTextColor},
                  ]}>
                  收藏这个帖子
                </Text>
              </Pressable>
              <Pressable
                style={[styles.option, {paddingLeft: 18}]}
                android_ripple={{color: theme.colors.clickbg}}>
                <AIcons
                  name="delete"
                  size={28}
                  color={theme.colors.secondary}
                />
                <View>
                  <Text
                    style={[styles.option_text, {color: theme.colors.defaultTextColor}]}>
                    删除这个帖子
                  </Text>
                  <Text style={{color: theme.colors.secondary}}>
                    永久删除帖子所有信息
                  </Text>
                </View>
              </Pressable>
            </View>
          }
        />
      </View>
    </View>
  )
})

export default FeedCard

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    marginTop: 10,
  },
  wrapper: {},
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  top_avatar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  top_name: {
    fontSize: 18,
    fontWeight: '500',
  },
  top_timestamp: {
    fontSize: 12,
  },
  middle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottom: {
    padding: 10,
  },
  bootom_count: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bottom_btns: {
    flexDirection: 'row',
    marginTop: 6,
  },
  bottom_btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '33.3%',
    paddingVertical: 4,
  },
  options: {
    justifyContent: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 20,
  },
  option_text: {
    fontSize: 18,
  },
})
