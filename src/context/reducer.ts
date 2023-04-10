import {ActionsType, ActionTypes, ReducerState} from '../types/reducer'
import actions from './actions'

const reducer = (state: ReducerState, action: ActionsType) => {
  const {type, payload} = action
  switch (type) {
    case ActionTypes.USER:
      return actions.user(state, payload)
    case ActionTypes.GETHOMEFEEDS:
      return actions.getHomeFeeds(state, payload)
    case ActionTypes.DELFEED:
      return actions.delFeed(state, payload)
    case ActionTypes.POSTTING:
      return actions.postting(state, payload)
    case ActionTypes.FRIENDS:
      return actions.friends(state, payload)
    case ActionTypes.PROFILEFEEDS:
      return actions.profileFeeds(state, payload)
    case ActionTypes.NOTICE:
      return actions.notice(state, payload)
    case ActionTypes.DELNOTICE:
      return actions.delNotice(state, payload)
    default:
      return state
  }
}

export default reducer
