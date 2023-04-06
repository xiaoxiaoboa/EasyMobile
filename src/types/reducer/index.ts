import {Animated} from 'react-native'
import {GlobalModalType} from '..'

export interface createContextType {
  state: ReducerState
  dispatch: React.Dispatch<ActionsType>
}

export interface ReducerState {
  test: boolean
}

export enum ActionTypes {
  TEST = 'test',
}

export type ActionMap<M extends {[index: string]: any}> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export interface ReducerPaylodType {
  [ActionTypes.TEST]: boolean
}

export type ActionsType = ActionMap<ReducerPaylodType>[keyof ActionMap<ReducerPaylodType>]
