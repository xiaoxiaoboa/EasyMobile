import React from 'react'
import {Image, Pressable, Dimensions} from 'react-native'
import Swiper from '../Swiper/Swiper'
import {Feed_attachType} from '../../types/feed.type'
import getUnionUrl from '../../utils/getUnionUrl'

interface AttachesProps {
  attaches: Feed_attachType[]
}
const Attaches: React.FC<AttachesProps> = props => {
  const {attaches} = props
  const [swiperVisible, setSwiperVisible] = React.useState<boolean>(false)
  const targetIndexRef = React.useRef<any>()

  const width = React.useMemo(() => Dimensions.get('window').width, [])
  const height = React.useRef(360).current
  const [singleHeight, setSingleHeight] = React.useState<number>(0)

  /* 当只有一张照片时，控制其高度 */
  React.useEffect(() => {
    if (attaches.length === 1) {
      Image.getSize(getUnionUrl(attaches[0].attach_link)!, (singleWidth, height) => {
        const getHeight = (width / singleWidth) * height
        setSingleHeight(getHeight < 360 ? getHeight : 360)
      })
    }
  }, [])

  /* 查看图片 */
  const handleOpenSwiper = React.useCallback((targetIndex: number) => {
    targetIndexRef.current = targetIndex
    setSwiperVisible(p => !p)
  }, [])
  return (
    <>
      {attaches.map((item, index) => {
        switch (attaches.length) {
          case 1:
            return (
              <Pressable
                key={index}
                onPress={() => handleOpenSwiper(index)}>
                <Image
                  source={{uri: getUnionUrl(item.attach_link)}}
                  style={{
                    width: width,
                    height: singleHeight,
                  }}
                />
              </Pressable>
            )
          case 2:
            return (
              <Pressable
                key={index}
                onPress={() => handleOpenSwiper(index)}>
                <Image
                  source={{uri: getUnionUrl(item.attach_link)}}
                  style={{width: width, height: height / 2}}
                />
              </Pressable>
            )
          case 3:
            return index === 0 ? (
              <Pressable
                key={index}
                onPress={() => handleOpenSwiper(index)}>
                <Image
                  source={{uri: getUnionUrl(item.attach_link)}}
                  style={{width: width, height: height / 2}}
                />
              </Pressable>
            ) : (
              <Pressable
                key={index}
                onPress={() => handleOpenSwiper(index)}>
                <Image
                  source={{uri: getUnionUrl(item.attach_link)}}
                  style={{width: width / 2, height: height / 2}}
                />
              </Pressable>
            )
          case 4:
            return (
              <Pressable
                key={index}
                onPress={() => handleOpenSwiper(index)}>
                <Image
                  source={{uri: getUnionUrl(item.attach_link)}}
                  style={{width: width / 2, height: height / 2}}
                />
              </Pressable>
            )

          default:
            break
        }
      })}
      <Swiper
        source={attaches}
        targetIndex={targetIndexRef.current}
        visible={swiperVisible}
        setVisible={setSwiperVisible}
      />
    </>
  )
}

export default Attaches
