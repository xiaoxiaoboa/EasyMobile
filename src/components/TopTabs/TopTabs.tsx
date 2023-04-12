import React from 'react'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationProp,
} from '@react-navigation/material-top-tabs'
import {View, StyleSheet, Animated, Text} from 'react-native'
import Home from '../../screens/Home'
import {ThemeContext} from '../../theme'
import {MyContext} from '../../context/context'
import MyTabBar from './MyTabBar'
import Logo from '../Logo/Logo'
import Divider from '../Divider/Divider'
import Friends from '../../screens/Friends'
import Conversation from '../../screens/Conversation'
import Notice from '../../screens/Notice'
import MyProfile from '../../screens/MyProfile'
import {TabBarParams} from '../../types/route'

const {Navigator, Screen} = createMaterialTopTabNavigator<TabBarParams>()
const TopTabs = () => {
  const {state} = React.useContext(MyContext)
  const {theme} = React.useContext(ThemeContext)
  const [visible, setVisible] = React.useState<boolean>(true)
  const translateY = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -46,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [visible])

  return (
    <View style={{flex: 1}}>
      <Navigator
        tabBar={props => (
          <Animated.View
            style={[
              styles.tabBar,
              {
                backgroundColor: theme.colors.background,
                transform: [{translateY}],
              },
            ]}>
            <Logo />
            <MyTabBar
              {...props}
              setVisible={setVisible}
            />
            <Divider />
          </Animated.View>
        )}>
        <Screen
          name="home"
          component={Home}
        />
        {state.user && (
          <>
            <Screen
              name="conversation"
              component={Conversation}
              options={{lazy: true}}
            />
            <Screen
              name="friends"
              component={Friends}
              options={{lazy: true}}
            />
            <Screen
              name="profile"
              component={MyProfile}
              options={{lazy: true}}
            />
            <Screen
              name="notice"
              component={Notice}
              options={{lazy: true}}
            />
          </>
        )}
      </Navigator>
    </View>
  )
}

export default TopTabs

const styles = StyleSheet.create({
  tabBar: {
    height: 100,
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  logoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  logoWrapper: {
    flex: 1,
  },
  search: {
    width: 34,
    height: 34,
    padding: 6,
    borderRadius: 50,
  },
})
