import React from 'react'
import {Image, Pressable} from 'react-native'

interface AttachesProps {
  attaches: any[]
  width: number
  height: number
  windowWidth: number
  handleOpenSwiper: (target: any, source: any[]) => void
}
const Attaches: React.FC<AttachesProps> = props => {
  const {attaches, height, width, windowWidth, handleOpenSwiper} = props
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
    </>
  )
}

export default Attaches
