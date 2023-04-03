import React from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionPresets,
  TransitionSpecs,
} from '@react-navigation/stack'
import TopTabs from '../components/TopTabs/TopTabs'
import Postting from '../components/Postting/Postting'
import {ThemeContext} from '../theme'
import CommentModal from '../components/FeedCard/CommentModal'
import {RootStackParamList} from '../types/route'

const RootStack = createStackNavigator<RootStackParamList>()
const Routes = () => {
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
        />
        <RootStack.Screen
          name="commentModal"
          component={CommentModal}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default Routes
