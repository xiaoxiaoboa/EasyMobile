import {base_url} from '../utils/request'

const getUnionUrl = (str: string | undefined) => {
  return str ? base_url + str : str
}

export default getUnionUrl
