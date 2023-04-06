import React from 'react'
import {Image, Pressable,Dimensions} from 'react-native'
import Swiper from '../Swiper/Swiper'

interface AttachesProps {
  attaches: any[]
}
const Attaches: React.FC<AttachesProps> = props => {
  const {attaches} = props
  const [swiperVisible, setSwiperVisible] = React.useState<boolean>(false)
  const targetIndexRef = React.useRef<any>()
  const sourceRef = React.useRef<any[]>([])

  const windowWidth = React.useMemo(() => Dimensions.get('window').width, [])
  const [width, setWidth] = React.useState(windowWidth)
  const [height, setHeight] = React.useState(windowWidth)


  React.useEffect(() => {
    calculateImageSize()
  }, [])

  /* 计算图片尺寸 */
  const calculateImageSize = () => {
    const imageCount = attaches.length
    if (imageCount === 1) {
      const image = attaches[0]
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

  /* 查看图片 */
  const handleOpenSwiper = React.useCallback((targetIndex: any, source: any[]) => {
    targetIndexRef.current = targetIndex
    sourceRef.current = source
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
                onPress={() => handleOpenSwiper(index, attaches)}>
                <Image
                  source={{uri: item.uri}}
                  style={{
                    width: width,
                    height: height,
                    transform: [{translateX: windowWidth / 2 - width / 2}],
                  }}
                />
              </Pressable>
            )
          case 2:
            return (
              <Pressable
                key={index}
                onPress={() => handleOpenSwiper(index, attaches)}>
                <Image
                  source={{uri: item.uri}}
                  style={{width: width / 2, height}}
                />
              </Pressable>
            )
          case 3:
            index === 2 ? (
              <Pressable
                key={index}
                onPress={() => handleOpenSwiper(index, attaches)}>
                <Image
                  source={{uri: item.uri}}
                  style={{width, height: (height / 4) * 3}}
                />
              </Pressable>
            ) : (
              <Pressable
                key={index}
                onPress={() => handleOpenSwiper(index, attaches)}>
                <Image
                  source={{uri: item.uri}}
                  style={{width: width / 2, height: (height / 4) * 3}}
                />
              </Pressable>
            )
            return
          case 4:
            return (
              <Pressable
                key={index}
                onPress={() => handleOpenSwiper(index, attaches)}>
                <Image
                  source={{uri: item.uri}}
                  style={{width: width / 2, height: height / 2}}
                />
              </Pressable>
            )

          default:
            break
        }
      })}
      <Swiper
        source={sourceRef.current}
        targetIndex={targetIndexRef.current}
        visible={swiperVisible}
        setVisible={setSwiperVisible}
      />
    </>
  )
}

export default Attaches
