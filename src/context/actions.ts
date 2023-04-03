import { Animated } from 'react-native'
import {ActionTypes, ReducerState} from '../types/reducer'

export const homeOffset = (state: ReducerState, payload: Animated.Value) => {
  return {
    ...state,
    homeOffset: payload,
  }
}

const actions = {
  [ActionTypes.HOMEOFFSET]: homeOffset,
}
export default actions
