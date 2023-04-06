import {ActionsType, ActionTypes, ReducerState} from '../types/reducer'
import actions from './actions'

const reducer = (state: ReducerState, action: ActionsType) => {
  const {type, payload} = action
  switch (type) {
    case ActionTypes.TEST:
      return state
    default:
      return state
  }
}

export default reducer
