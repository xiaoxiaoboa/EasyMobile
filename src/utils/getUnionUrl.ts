import {BASE_URL} from '@env'

const getUnionUrl = (str: string | undefined) => {
  return str ? BASE_URL + str : str
}

export default getUnionUrl
