import {MMKV} from 'react-native-mmkv'

export const storage = new MMKV()

export const getLocalData = (key: string) => {
  const jsonData = storage.getString(key)
  return jsonData ? JSON.parse(jsonData) : undefined
}
