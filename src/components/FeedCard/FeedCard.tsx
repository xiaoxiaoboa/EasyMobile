import React from 'react'
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Image,
  Dimensions,
  PermissionsAndroid,
} from 'react-native'
import {ThemeContext} from '../../theme'
import Avatar from '../Avatar/Avatar'
import MIcons from 'react-native-vector-icons/MaterialIcons'
import FIcons from 'react-native-vector-icons/FontAwesome'
import OIcons from 'react-native-vector-icons/Octicons'
import Divider from '../Divider/Divider'
import Attaches from './Attaches'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {RootStackParamList} from '../../types/route'

interface FeedCardProps {
  images: any[]
  handleOpenSwiper: (target: any, source: any[]) => void
}

const FeedCard: React.FC<FeedCardProps> = props => {
  const {images, handleOpenSwiper} = props
  const {theme} = React.useContext(ThemeContext)
  const windowWidth = React.useMemo(() => Dimensions.get('window').width, [])
  const [width, setWidth] = React.useState(windowWidth)
  const [height, setHeight] = React.useState(windowWidth)
  const [visible, setVisible] = React.useState<boolean>(false)
  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

  React.useEffect(() => {
    calculateImageSize()
  }, [width])

  const calculateImageSize = () => {
    const imageCount = images.length
    if (imageCount === 1) {
      const image = images[0]
      Image.getSize(image.uri, (width, height) => {
        const aspectRatio = width / height
        if (aspectRatio >= 1) {
          setHeight(width / aspectRatio)
        } else {
          setWidth(height * aspectRatio)
        }
      })
    } else if (imageCount === 2) {
      setHeight(width / 2)
    } else if (imageCount === 3) {
      setHeight(width * 0.75)
    } else if (imageCount >= 4) {
      setHeight(width / 1.2)
    }
  }

  const handleOpenComment = () => {
    navigate.navigate('commentModal')
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={[styles.wrapper]}>
        {/* 顶部 */}
        <View style={[styles.top]}>
          {/* 头像 */}
          <View style={[styles.top_avatar]}>
            <Avatar
              src={require('../../assets/avatar.jpg')}
              size={40}
            />
            <View>
              <Text style={[styles.top_name, {color: theme.defaultTextColor}]}>小新</Text>
              <Text style={[styles.top_timestamp, {color: theme.secondary}]}>1天前</Text>
            </View>
          </View>
          {/* 菜单按钮 */}
          <Pressable
            style={{marginLeft: 'auto', padding: 4}}
            android_ripple={{color: theme.divider, radius: 18, borderless: false}}>
            <MIcons
              name="more-horiz"
              size={30}
            />
          </Pressable>
        </View>
        {/* 中部 */}
        <View style={[styles.middle, {backgroundColor: theme.divider}]}>
          <Attaches
            attaches={images}
            width={width}
            height={height}
            windowWidth={windowWidth}
            handleOpenSwiper={handleOpenSwiper}
          />
        </View>
        {/* 底部 */}
        <View style={[styles.bottom]}>
          <View style={[styles.bootom_count]}>
            <Text style={{color: theme.secondary}}>2个万赞</Text>
            <Text style={{color: theme.secondary}}>·</Text>
            <Text style={{color: theme.secondary}}>1,500条评论</Text>
          </View>
          <Divider />
          <View style={[styles.bottom_btns]}>
            {/* 点赞 */}
            <Pressable
              style={[styles.bottom_btn]}
              android_ripple={{
                color: theme.divider,
                borderless: false,
              }}>
              <FIcons
                size={24}
                name="thumbs-o-up"
                color={theme.secondary}
              />
              <Text style={{color: theme.secondary}}>赞</Text>
              {/* <FIcons
                size={24}
                name="thumbs-up"
                color={theme.secondary}
              /> */}
            </Pressable>
            {/* 评论 */}
            <Pressable
              style={[styles.bottom_btn]}
              onPress={handleOpenComment}
              android_ripple={{
                color: theme.divider,
                borderless: false,
              }}>
              <OIcons
                size={22}
                name="comment"
                color={theme.secondary}
              />
              <Text style={{color: theme.secondary}}>评论</Text>
            </Pressable>
            {/* 分享 */}
            <Pressable
              style={[styles.bottom_btn]}
              android_ripple={{
                color: theme.divider,
                borderless: false,
              }}>
              <OIcons
                size={22}
                name="share-android"
                color={theme.secondary}
              />
              <Text style={{color: theme.secondary}}>分享</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

export default FeedCard

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    // height: 500,
    marginTop: 10,
  },
  wrapper: {
    // backgroundColor: 'lightblue',
  },
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
})
