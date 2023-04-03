import React from 'react'
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  FlatList,
  TextInput,
} from 'react-native'
import {ThemeContext} from '../../theme'
import Divider from '../Divider/Divider'
import Message from '../Message/Message'
import {NativeStackScreenProps} from '@react-navigation/native-stack'
import {RootStackParamList} from '../../types/route'
import ModalTop from '../ModalTop/ModalTop'

type Props = NativeStackScreenProps<RootStackParamList, 'commentModal'>
const CommentModal = (props: Props) => {
  const {theme} = React.useContext(ThemeContext)
  const translateY = React.useRef(new Animated.Value(0)).current
  const windowHeight = React.useMemo(() => Dimensions.get('window').height, [])
  const data = [
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
    <Message />,
  ]
  return (
    <>
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <ModalTop
          name={
            <Text style={[styles.title, {color: theme.defaultTextColor}]}>
              评论 <Text style={{fontSize: 14}}>{123}条</Text>
            </Text>
          }
          btnDisabled={false}
          isBtnDisplay={false}
          onClose={() => props.navigation.goBack()}
        />
        <View style={[styles.comments]}>
          <FlatList
            data={data}
            renderItem={() => <Message />}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <Divider />
        <View>
          <TextInput
            placeholder="写评论~"
            placeholderTextColor={theme.secondary}
          />
        </View>
      </View>
    </>
  )
}

export default CommentModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
  },
  comments: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    gap: 10,
  },
})
