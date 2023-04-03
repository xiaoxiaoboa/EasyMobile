import { Animated } from "react-native"

export interface createContextType {
  state: ReducerState
  dispatch: React.Dispatch<ActionsType>
}

export interface ReducerState {
  homeOffset: Animated.Value
}

export enum ActionTypes {
  HOMEOFFSET = 'homeOffset',
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
  [ActionTypes.HOMEOFFSET]: Animated.Value
}

export type ActionsType = ActionMap<ReducerPaylodType>[keyof ActionMap<ReducerPaylodType>]
