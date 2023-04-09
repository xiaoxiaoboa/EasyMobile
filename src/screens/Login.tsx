import React from 'react'
import {View, StyleSheet, TextInput, Text, Pressable} from 'react-native'
import FIcons from 'react-native-vector-icons/Feather'
import {sign_in, sing_up} from '../api/user.api'
import {MyContext} from '../context/context'
import {ActionTypes} from '../types/reducer'
import {useNavigation, NavigationProp} from '@react-navigation/native'
import {RootStackParamList} from '../types/route'
import {storage} from '../utils/getLocalData'

const Login = () => {
  const {state, dispatch} = React.useContext(MyContext)
  const [focus, setFocus] = React.useState<'email' | 'passwd' | undefined>(undefined)
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  const emailRef = React.useRef<string>()
  const passwdRef = React.useRef<string>()

  const handleLogin = async () => {
    if (emailRef.current && passwdRef.current) {
      sign_in(emailRef.current, passwdRef.current).then(val => {
        if (val.code === 1) {
          storage.set('user', JSON.stringify(val.data))
          dispatch({type: ActionTypes.USER, payload: val.data})
          navigate.navigate('root')
        }
      })
    }
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.wrapper}>
        <View style={[styles.my_input, focus === 'email' && {borderColor: '#1A73E3'}]}>
          <TextInput
            style={[styles.input]}
            placeholder="123456@hh.com"
            placeholderTextColor="#66676B"
            onFocus={() => setFocus('email')}
            keyboardType="email-address"
            onChange={e => {
              e.persist()
              emailRef.current = e.nativeEvent.text
            }}
            onSubmitEditing={() => console.log()}
            cursorColor="#1A73E3"
          />
          <View style={[styles.my_label]}>
            <Text style={[styles.label_text, focus === 'email' && {color: '#1A73E3'}]}>
              邮箱
            </Text>
          </View>
        </View>
        <View style={[styles.my_input, focus === 'passwd' && {borderColor: '#1A73E3'}]}>
          <TextInput
            style={[styles.input]}
            onFocus={() => setFocus('passwd')}
            secureTextEntry
            onChange={e => {
              e.persist()
              passwdRef.current = e.nativeEvent.text
            }}
            onSubmitEditing={() => console.log()}
            cursorColor="#1A73E3"
          />
          <View style={[styles.my_label]}>
            <Text style={[styles.label_text, focus === 'passwd' && {color: '#1A73E3'}]}>
              密码
            </Text>
          </View>
        </View>

        <View style={{alignItems: 'flex-end', width: '100%', paddingRight: 30}}>
          <Pressable
            onPress={handleLogin}
            android_ripple={{foreground: true, color: '#2186ef'}}
            style={({pressed}) => [
              styles.next_btn,
              {transform: [{scale: pressed ? 0.95 : 1}]},
            ]}>
            <FIcons
              name="arrow-right"
              size={30}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default Login

export const Register = () => {
  const [focus, setFocus] = React.useState<'nick_name' | 'email' | 'passwd' | undefined>(
    undefined,
  )
  const navigate = useNavigation<NavigationProp<RootStackParamList>>()
  const nickRef = React.useRef<string>()
  const emailRef = React.useRef<string>()
  const passwdRef = React.useRef<string>()

  const handleRegister = () => {
    if (nickRef.current && emailRef.current && passwdRef.current) {
      sing_up(nickRef.current, emailRef.current, passwdRef.current).then(val => {
        if (val.code === 1) {
          navigate.navigate('login')
        }
      })
    }
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.wrapper}>
        <View
          style={[styles.my_input, focus === 'nick_name' && {borderColor: '#1A73E3'}]}>
          <TextInput
            autoFocus
            style={[styles.input]}
            placeholder="动感超人!biu~biu~"
            placeholderTextColor="#66676B"
            onFocus={() => setFocus('nick_name')}
            onChange={e => {
              e.persist()
              nickRef.current = e.nativeEvent.text
            }}
            onSubmitEditing={() => console.log()}
            cursorColor="#1A73E3"
          />
          <View style={[styles.my_label]}>
            <Text
              style={[styles.label_text, focus === 'nick_name' && {color: '#1A73E3'}]}>
              昵称
            </Text>
          </View>
        </View>
        <View style={[styles.my_input, focus === 'email' && {borderColor: '#1A73E3'}]}>
          <TextInput
            style={[styles.input]}
            placeholder="123456@hh.com"
            placeholderTextColor="#66676B"
            onFocus={() => setFocus('email')}
            keyboardType="email-address"
            onChange={e => {
              e.persist()
              emailRef.current = e.nativeEvent.text
            }}
            onSubmitEditing={() => console.log()}
            cursorColor="#1A73E3"
          />
          <View style={[styles.my_label]}>
            <Text style={[styles.label_text, focus === 'email' && {color: '#1A73E3'}]}>
              邮箱
            </Text>
          </View>
        </View>
        <View style={[styles.my_input, focus === 'passwd' && {borderColor: '#1A73E3'}]}>
          <TextInput
            style={[styles.input]}
            onFocus={() => setFocus('passwd')}
            secureTextEntry
            onChange={e => {
              e.persist()
              passwdRef.current = e.nativeEvent.text
            }}
            onSubmitEditing={() => console.log()}
            cursorColor="#1A73E3"
          />
          <View style={[styles.my_label]}>
            <Text style={[styles.label_text, focus === 'passwd' && {color: '#1A73E3'}]}>
              密码
            </Text>
          </View>
        </View>

        <View style={{alignItems: 'flex-end', width: '100%', paddingRight: 30}}>
          <Pressable
            onPress={handleRegister}
            android_ripple={{foreground: true, color: '#2186ef'}}
            style={({pressed}) => [
              styles.next_btn,
              {transform: [{scale: pressed ? 0.95 : 1}]},
            ]}>
            <FIcons
              name="arrow-right"
              size={30}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 220,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
  },
  my_input: {
    position: 'relative',
    borderWidth: 2,
    width: '80%',
    borderRadius: 10,
    borderColor: '#b4b4b4',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#000000',
  },
  my_label: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: '#FFFFFF',
  },
  label_text: {
    paddingHorizontal: 4,
    color: '#b4b4b4',
  },
  next_btn: {
    backgroundColor: '#1A73E3',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
})
