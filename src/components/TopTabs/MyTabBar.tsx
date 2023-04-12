import React from 'react'
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs/lib/typescript/src/types'

import {View, StyleSheet, Text} from 'react-native'
import {TouchableOpacity} from 'react-native-gesture-handler'
import Icons from 'react-native-vector-icons/Ionicons'
import {ThemeContext} from '../../theme'
import {MyContext} from '../../context/context'
import {TabBarParams} from '../../types/route'

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
            }}>
            <View style={styles.icon}>{getIcons()}</View>
            {route.name === 'conversation' && <Badge />}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const Badge = React.memo(() => {
  const {state} = React.useContext(MyContext)
  // const total = React.useRef(
  //   state.unread_messages.map(i => i.total).reduce((prev, curr) => prev + curr, 0),
  // )
  const total = React.useMemo(
    () => state.unread_messages.map(i => i.total).reduce((prev, curr) => prev + curr, 0),
    [state.unread_messages],
  )
  return (
    <>
      {total > 9 && total < 98 && (
        <View style={[styles.badge, styles.middleNumber]}>
          <Text style={{fontSize: 12, color: '#FFFFFF'}}>{total}</Text>
        </View>
      )}
      {total > 98 && (
        <View style={[styles.badge, styles.largeNumber]}>
          <Text style={{fontSize: 10, color: '#FFFFFF'}}>{total}+</Text>
        </View>
      )}
      {total < 10 && total > 0 && (
        <View style={[styles.badge, styles.smallNumber]}>
          <Text style={{fontSize: 14, color: '#FFFFFF'}}>{total}</Text>
        </View>
      )}
    </>
  )
})

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
  badge: {
    position: 'absolute',
    top: 0,
    right: 10,
    flexDirection: 'row',
    backgroundColor: '#ff5757',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  middleNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  smallNumber: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
})
