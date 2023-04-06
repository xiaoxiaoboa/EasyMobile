import React from 'react'
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack'
import TopTabs from '../components/TopTabs/TopTabs'
import Postting from '../screens/Postting'
import {RootStackParamList} from '../types/route'
import Comment from '../screens/Comment'
import {TransitionSpec} from '@react-navigation/stack/lib/typescript/src/types'
import ProfileDrawer from '../screens/ProfileDrawer'

const RootStack = createStackNavigator<RootStackParamList>()
const Routes = () => {
  const verticalConfig: TransitionSpec = {
    animation: 'spring',
    config: {
      stiffness: 2000,
      damping: 700,
      mass: 5,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.2,
    },
  }
  const RightConfig: TransitionSpec = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
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
        }}>
        <RootStack.Screen
          name="postting"
          component={Postting}
          options={{
            transitionSpec: {
              open: verticalConfig,
              close: verticalConfig,
            },
          }}
        />
        <RootStack.Screen
          name="comment"
          component={Comment}
          options={{
            transitionSpec: {
              open: verticalConfig,
              close: verticalConfig,
            },
          }}
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
          name="profile_drawer"
          component={ProfileDrawer}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default Routes
