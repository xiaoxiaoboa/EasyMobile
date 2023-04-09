import React from 'react'
import {Modal, View, Image, FlatList, Text, Dimensions} from 'react-native'
import {Feed_attachType} from '../../types/feed.type'
import getUnionUrl from '../../utils/getUnionUrl'

interface SwiperProps {
  targetIndex: number
  source: Feed_attachType[]
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}
const Swiper: React.FC<SwiperProps> = props => {
  const {source, targetIndex, visible, setVisible} = props
  const windowWidth = React.useMemo(() => Dimensions.get('window').width, [])

  return (
    <Modal
      visible={visible}
      onRequestClose={() => setVisible(false)}
      animationType="fade"
      statusBarTranslucent
      hardwareAccelerated>
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000',
          alignItems: 'center',
        }}>
        <FlatList
          data={source}
          horizontal
          initialNumToRender={1}
          initialScrollIndex={targetIndex}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          getItemLayout={(item, index) => ({
            length: windowWidth,
            offset: windowWidth * index,
            index,
          })}
          renderItem={({index, item, separators}) => (
            <Image
              source={{uri: getUnionUrl(item.attach_link)}}
              style={{width: windowWidth}}
              resizeMode="contain"
            />
          )}
        />
        {/* <Image
          source={{uri: target?.uri}}
          style={{flex: 1}}
          resizeMode="contain"
        /> */}
      </View>
    </Modal>
  )
}

export default Swiper
