import React from 'react'
import reducer from './reducer'
import {createContextType, ReducerState} from '../types/reducer'
import {DataType} from '../types'
import {getLocalData} from '../utils/getLocalData'

const initialValue: ReducerState = {
  user: getLocalData('user'),
  homeFeeds: [],
  friends: [],
}

export const MyContext = React.createContext<createContextType>({
  state: initialValue,
  dispatch: () => null,
})

type MyContextProviderProps = {children: React.ReactNode}
export const MyContextProvider = ({children}: MyContextProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialValue)

  React.useEffect(() => {
    // console.log(state.homeFeeds)
  }, [state.homeFeeds])

  return <MyContext.Provider value={{state, dispatch}}>{children}</MyContext.Provider>
}
