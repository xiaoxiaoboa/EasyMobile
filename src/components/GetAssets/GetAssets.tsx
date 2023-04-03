import React from 'react'
import {
  Modal,
  StyleSheet,
  View,
  Image,
  FlatList,
  Pressable,
  Text,
  ViewToken,
  ListRenderItemInfo,
  GestureResponderEvent,
  ScrollView,
  VirtualizedList,
} from 'react-native'
import {CameraRoll, PhotoIdentifier} from '@react-native-camera-roll/camera-roll'
import {ThemeContext} from '../../theme'
import ModalTop from '../ModalTop/ModalTop'
import Divider from '../Divider/Divider'

interface GetAssetsProps {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  setSelected: React.Dispatch<React.SetStateAction<PhotoIdentifier[]>>
}
const GetAssets: React.FC<GetAssetsProps> = props => {
  const {visible, setVisible, setSelected} = props
  const {theme} = React.useContext(ThemeContext)
  const [assets, setAssets] = React.useState<PhotoIdentifier[]>([])
  const cursorRef = React.useRef<string | undefined>(undefined)
  const [picked, setPicked] = React.useState<number[]>([])

  React.useEffect(() => {
    if (visible) {
      getGallery()
    }
  }, [visible])

  /* 获取本地相册 */
  const getGallery = async () => {
    const data = await CameraRoll.getPhotos({
      first: 30,
      after: cursorRef.current,
      assetType: 'All',
    })
    if (data.page_info.has_next_page) {
      cursorRef.current = data.page_info.end_cursor
    } else {
      cursorRef.current = undefined
    }
    setAssets(p => [...p, ...data.edges])
  }

  /* 选中图片 */
  const onHandlePick = (index: number) => {
    if (picked.includes(index)) {
      setPicked(p => p.filter(i => i !== index))
    } else if (picked.length < 4) {
      setPicked(p => [...p, index])
    }
  }

  const renderItem = ({item, index}: ListRenderItemInfo<PhotoIdentifier>) => {
    return (
      <View
        key={index}
        style={[
          styles.imgWrapper,
          index % 3 === 1 && styles.paddingHorizontal,
          styles.paddingTop,
        ]}>
        <View
          style={[
            styles.flex,
            {
              position: 'relative',
              backgroundColor: theme.divider,
            },
          ]}>
          <Pressable
            onPress={() => onHandlePick(index)}
            style={() => [
              styles.flex,
              styles.badgeWrapper,
              {
                borderColor: theme.primary,
                opacity: picked.includes(index) ? 1 : 0,
              },
            ]}>
            <View style={[styles.badge, {backgroundColor: theme.primary}]}>
              <Text style={{color: 'white'}}>{picked.indexOf(index) + 1}</Text>
            </View>
          </Pressable>

          <Image
            style={styles.flex}
            source={{
              uri: item.node.image.uri,
            }}
          />
        </View>
      </View>
    )
  }

  /* 提交 */
  const handleSubmit = React.useCallback(() => {
    // setSelected(p => {
    //   const canShow = 4 - p.length
    //   return [...p, ...picked.filter((item, index) => index < canShow)]
    // })
    setVisible(false)
    handleQuite()
  }, [picked])

  /* 退出 */
  const handleQuite = React.useCallback(() => {
    // setPicked([])
    setAssets([])

    setVisible(false)
  }, [picked])

  const pickedCount = React.useMemo(() => {
    return (
      <View style={{marginRight: 10}}>
        <Text
          style={{
            fontSize: 16,
            color: theme.secondary,
          }}>{`${picked.length} / 4`}</Text>
      </View>
    )
  }, [picked])

  return (
    <Modal
      visible={visible}
      onRequestClose={handleQuite}
      animationType="slide"
      hardwareAccelerated={true}>
      <View style={[styles.flex, {backgroundColor: theme.background}]}>
        <ModalTop
          name="选择媒体"
          buttonName="确定"
          onClose={() => setVisible(false)}
          handleSubmit={handleSubmit}
          btnDisabled={picked.length === 0}
          extraElement={pickedCount}
        />
        <Divider />
        <FlatList
          data={assets}
          numColumns={3}
          onEndReachedThreshold={0.3}
          onEndReached={getGallery}
          renderItem={renderItem}
          extraData={picked}
          showsVerticalScrollIndicator={false}
          getItemLayout={(item, index) => ({length: 184, offset: 184 * index, index})}
        />
      </View>
    </Modal>
  )
}

export default GetAssets

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  imgWrapper: {
    width: '33.3%',
    height: 180,
  },
  paddingTop: {
    paddingTop: 4,
  },
  paddingHorizontal: {
    paddingHorizontal: 4,
  },
  badgeWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 2,
    borderWidth: 3,
  },
  badge: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 50,
    alignItems: 'center',
    top: 6,
    right: 8,
  },
})
