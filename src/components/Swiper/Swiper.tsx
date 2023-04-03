import React from 'react'
import {Modal, View, Image, FlatList, Text, Dimensions} from 'react-native'

interface SwiperProps {
  targetIndex: any
  source: any[]
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
              source={{uri: item.uri}}
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
