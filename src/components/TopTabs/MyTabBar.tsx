import React from 'react'
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs/lib/typescript/src/types'

import {View, StyleSheet} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import Icons from 'react-native-vector-icons/Ionicons'
import {ThemeContext} from '../../theme'

type MyTabBarProps = MaterialTopTabBarProps & {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const MyTabBar = (props: MyTabBarProps) => {
  const {state, descriptors, navigation, setVisible} = props
  const {theme} = React.useContext(ThemeContext)

  React.useEffect(() => {
    const currentName = state.routeNames[state.index]
    const [home, ...args] = state.routeNames
    if (args.includes(currentName)) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }, [state])

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key]
        const isFocused = state.index === index
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }


        /* get icons */
        const getIcons = () => {
          let iconName = ''
          switch (route.name) {
            case 'home':
              iconName = isFocused ? 'home' : 'home-outline'
              break
            case 'conversation':
              iconName = isFocused ? 'chatbubbles-sharp' : 'chatbubbles-outline'
              break
            case 'friends':
              iconName = isFocused ? 'people-sharp' : 'people-outline'
              break
            case 'profile':
              iconName = isFocused ? 'md-person' : 'md-person-outline'
              break
            case 'notice':
              iconName = isFocused ? 'notifications-sharp' : 'notifications-outline'
              break
            default:
              break
          }
          return (
            <Icons
              name={iconName}
              color={isFocused ? '#1A73E3' : theme.colors.secondary}
              size={26}
            />
          )
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            activeOpacity={1}
            style={{
              flex: 1,
              paddingHorizontal: 26,
              paddingVertical: 5,
              // paddingTop:5,
              // paddingBottom:10
            }}>
            <View style={styles.icon}>{getIcons()}</View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default MyTabBar
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
})
