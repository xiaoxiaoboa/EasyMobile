import React from 'react'
import reducer from './reducer'
import {createContextType, ReducerState} from '../types/reducer'
import { Animated } from 'react-native'

const initialValue: ReducerState = {
  homeOffset: new Animated.Value(0),
}

export const MyContext = React.createContext<createContextType>({
  state: initialValue,
  dispatch: () => null,
})

type MyContextProviderProps = {children: React.ReactNode}
export const MyContextProvider = ({children}: MyContextProviderProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialValue)

  return <MyContext.Provider value={{state, dispatch}}>{children}</MyContext.Provider>
}
