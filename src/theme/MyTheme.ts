import {Light, Dark} from './theme-types'

interface MyTheme {
  light: Light
  dark: Dark
}

const MyTheme: MyTheme = {
  light: {
    isDark: false,
    primary: '#1A73E3',
    secondary: '#66676B',
    background: '#FFFFFF',
    topsearch: '#040404',
    topsearchbg: '#F1F2F6',
    divider: '#cfcfd2',
    defaultTextColor: 'black',
    homebg: '#dcdcdc',
    messagebg: '#f1f2f6',
  },
  dark: {
    isDark: true,
    primary: '#1A73E3',
    secondary: '#A9AAAF',
    background: '#242527',
    topsearch: '#E5E6EB',
    topsearchbg: '#393A3C',
    divider: '#4d4d51',
    defaultTextColor: 'white',
    homebg: '#313131',
    messagebg: '#343537',
  },
}

export default MyTheme
