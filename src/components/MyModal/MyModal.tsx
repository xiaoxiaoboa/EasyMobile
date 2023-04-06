import React from 'react'
import {Modal, View, StyleSheet, Pressable, Text} from 'react-native'
import {ThemeContext} from '../../theme'

interface HalfModalProps {
  modalVisible: boolean
  children: React.ReactNode
  setModalVisible: (visible: boolean) => void
  half?: boolean
}
const HalfModal = (props: HalfModalProps) => {
  const {theme} = React.useContext(ThemeContext)
  const {modalVisible, setModalVisible, half = false, children} = props

  return (
    <>
      {/* 阴影部分 */}
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent
        statusBarTranslucent>
        <View style={[styles.modalContainer]} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        style={{flex: 1}}
        onRequestClose={() => setModalVisible(false)}>
        {/* 占位 */}
        {half && (
          <Pressable
            style={{flex: 1}}
            onPress={() => setModalVisible(false)}
          />
        )}

        <View
          style={[
            styles.modalContent,
            {height: 'auto', backgroundColor: theme.colors.background},
          ]}>
          <View style={{alignItems: 'center', paddingVertical: 4}}>
            <View
              style={{
                width: 50,
                height: 5,
                borderRadius: 3,
                backgroundColor: theme.colors.divider,
              }}
            />
          </View>
          {children}
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
})

export default HalfModal
