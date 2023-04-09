import {ToastAndroid} from 'react-native'
const myToast = (msg: string) => {
  ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER)
}

export default myToast
