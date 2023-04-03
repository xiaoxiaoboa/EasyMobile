import React from 'react'
import {View, StyleSheet} from 'react-native'
import LogoDark from '../../assets/logo-dark.svg'
import LogoLight from '../../assets/logo-light.svg'
import {ThemeContext} from '../../theme'
import Icons from 'react-native-vector-icons/Ionicons'

const Logo = () => {
  const {theme} = React.useContext(ThemeContext)
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoWrapper}>
        {theme.isDark ? <LogoDark /> : <LogoLight />}
      </View>
      <View style={[styles.search, {backgroundColor: theme.topsearchbg}]}>
        <Icons
          name="search"
          color={theme.topsearch}
          size={21}
        />
      </View>
    </View>
  )
}

export default Logo
const styles = StyleSheet.create({
  logoContainer: {
    flex:1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 0,
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
