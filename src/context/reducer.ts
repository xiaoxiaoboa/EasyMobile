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
    case ActionTypes.SOCKETTONOTICE:
      return actions.socketToNotice(state, payload)
    case ActionTypes.DELFRIEND:
      return actions.delFriend(state, payload)
    case ActionTypes.CONVERSATIONS:
      return actions.conversations(state, payload)
    case ActionTypes.DELCONVERSATION:
      return actions.delConversation(state, payload)
    case ActionTypes.ADDFRIEND:
      return actions.addFriend(state, payload)
    case ActionTypes.READNOTICE:
      return actions.readNotice(state, payload)
    case ActionTypes.UNREADMESSAGES:
      return actions.unread_messages(state, payload)
    case ActionTypes.ADDUNREADMESSAGE:
      return actions.addUnReadMessage(state, payload)
    case ActionTypes.NEWCONVERSATION:
      return actions.newConversation(state, payload)
    case ActionTypes.CONVERSATIONTOTOP:
      return actions.conversationToTop(state, payload)
    case ActionTypes.UPDATECONVERSATIONMSGLENGTH:
      return actions.updateConversationMsgLength(state, payload)
    case ActionTypes.CURRENTTALK:
      return actions.current_talk(state, payload)
    case ActionTypes.UPDATEUNREADMESSAGE:
      return actions.updateUnReadMessage(state, payload)
    default:
      return state
  }
}

export default reducer
