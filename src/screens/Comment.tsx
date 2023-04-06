import React from 'react'
import {View, StyleSheet, Text, FlatList} from 'react-native'
import {ThemeContext} from '../theme'
import Divider from '../components/Divider/Divider'
import Message from '../components/Message/Message'
import ModalTop from '../components/ModalTop/ModalTop'
import MyInput from '../components/SearchInput/MyInput'
import type {NativeStackScreenProps} from '@react-navigation/native-stack'

type CommentProps = NativeStackScreenProps<any, 'comment'>
const Comment = React.memo((props: CommentProps) => {
  const {navigation} = props
  const {theme} = React.useContext(ThemeContext)
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
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ModalTop
        name={
          <Text style={[styles.title, {color: theme.colors.defaultTextColor}]}>
            评论 <Text style={{fontSize: 14}}>{123}条</Text>
          </Text>
        }
        btnDisabled={false}
        isBtnDisplay={false}
        onClose={() => navigation.goBack()}
      />
      <View style={[styles.comments]}>
        <FlatList
          data={data}
          renderItem={() => <Message />}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Divider />
      <View style={{padding: 10}}>
        <MyInput
          placeholder="写评论~"
          hiddenIcon
        />
      </View>
    </View>
  )
})

export default Comment

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
  },
  comments: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 10,
  },
})
