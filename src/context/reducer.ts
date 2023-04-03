import {ActionsType, ActionTypes, ReducerState} from '../types/reducer'
import actions from './actions'

const reducer = (state: ReducerState, action: ActionsType) => {
  const {type, payload} = action
  switch (type) {
    case ActionTypes.HOMEOFFSET:
      return actions.homeOffset(state, payload)

    default:
      return state
  }
}

export default reducer
