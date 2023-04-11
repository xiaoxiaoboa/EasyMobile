import {FriendsListType, FriendType} from '../types/friend.type'

const findNoFriend = (data: FriendsListType): FriendType[] => {
  const {myFriends, friendToMe} = data

  if (myFriends.length === friendToMe.length) {
    return myFriends.map(i => ({...i, friendship: true}))
  } else {
    const newSet = new Set(friendToMe)

    return myFriends.map(i => {
      if (newSet.has(i.friend_id)) {
        return {...i, friendship: true}
      } else {
        return {...i, friendship: false}
      }
    })
  }
}

export default findNoFriend
