import {Platform, PermissionsAndroid} from 'react-native'

const checkPermission = async () => {
  const permission =
    Platform.Version >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE

  const hasPermission = await PermissionsAndroid.check(permission)
  if (hasPermission) {
    return true
  }
  const status = await PermissionsAndroid.request(permission)
  return status === 'granted'
}

export default checkPermission
