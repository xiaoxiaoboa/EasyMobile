import React from 'react'
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack'
import TopTabs from '../components/TopTabs/TopTabs'
import Postting from '../screens/Postting'
import {RootStackParamList} from '../types/route'
import Comment from '../screens/Comment'
import {TransitionSpec} from '@react-navigation/stack/lib/typescript/src/types'
import Chat from '../screens/Chat'
import Login, {Register} from '../screens/Login'
import UserProfile from '../screens/UserProfile'
import CheckNotice from '../screens/CheckNotice'

const RootStack = createStackNavigator<RootStackParamList>()
const Routes = () => {
  const verticalConfig: TransitionSpec = {
    animation: 'spring',
    config: {
      stiffness: 1700,
      damping: 200,
      mass: 5,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.2,
    },
  }
  const RightConfig: TransitionSpec = {
    animation: 'spring',
    config: {
      stiffness: 1700,
      damping: 300,
      mass: 5,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  }
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen
        name="root"
        component={TopTabs}
      />
      <RootStack.Group
        screenOptions={{
          presentation: 'modal',
          transitionSpec: {
            open: verticalConfig,
            close: verticalConfig,
          },
        }}>
        <RootStack.Screen
          name="postting"
          component={Postting}
        />
        <RootStack.Screen
          name="comment"
          component={Comment}
        />
      </RootStack.Group>

      <RootStack.Group
        screenOptions={{
          transitionSpec: {
            open: RightConfig,
            close: RightConfig,
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <RootStack.Screen
          name="chat"
          component={Chat}
        />
        <RootStack.Screen
          name="login"
          component={Login}
        />
        <RootStack.Screen
          name="register"
          component={Register}
        />
        <RootStack.Screen
          name="user_profile"
          component={UserProfile}
        />
        <RootStack.Screen
          name="checkNotice"
          component={CheckNotice}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default Routes
