import React from 'react'
import {ThemeContextType, Theme} from './theme-types'
import MyTheme from './MyTheme'
import {useColorScheme} from 'react-native'

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: MyTheme.light,
  toggleTheme: () => null,
})

type ThemeProviderType = {children: React.ReactNode}
export const ThemeProvider = ({children}: ThemeProviderType) => {
  const [theme, setTheme] = React.useState<Theme>(MyTheme.light)
  const isDarkRef = React.useRef<boolean>(false)
  const colorScheme = useColorScheme()

  React.useEffect(() => {
    setTheme(colorScheme === 'dark' ? MyTheme.dark : MyTheme.light)
  }, [colorScheme])

  /* toggle theme */
  const toggleTheme = React.useCallback(() => {
    isDarkRef.current = !isDarkRef.current
    setTheme(isDarkRef.current ? MyTheme.dark : MyTheme.light)
  }, [theme])

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>{children}</ThemeContext.Provider>
  )
}
