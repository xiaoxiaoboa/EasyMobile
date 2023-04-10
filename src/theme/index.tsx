import React from 'react'
import {ThemeContextType, Theme, Colors} from './theme-types'
import MyColors from './MyTheme'
import {useColorScheme, Appearance} from 'react-native'

const initValue = (): Theme => ({
  mode: 'auto',
  colors: Appearance.getColorScheme() === 'dark' ? MyColors.dark : MyColors.light,
})
export const ThemeContext = React.createContext<ThemeContextType>({
  theme: initValue(),
  toggleTheme: () => null,
})

type ThemeProviderType = {children: React.ReactNode}
export const ThemeProvider = ({children}: ThemeProviderType) => {
  const [theme, setTheme] = React.useState<Theme>(initValue)
  const modeCacheRef = React.useRef<'auto' | 'dark' | 'light'>(theme.mode)

  React.useEffect(() => {
    Appearance.addChangeListener(({colorScheme}) => {
      if (modeCacheRef.current === 'auto') {
        setTheme(p => ({
          ...p,
          colors: colorScheme === 'dark' ? MyColors.dark : MyColors.light,
        }))
      }
    })
  }, [])
  React.useEffect(() => {
    modeCacheRef.current = theme.mode
  }, [theme.mode])

  /* toggle theme */
  const toggleTheme = React.useCallback(
    (mode: 'auto' | 'dark' | 'light') => {
      switch (mode) {
        case 'auto':
          if (theme.mode !== 'auto') {
            setTheme({
              mode: 'auto',
              colors:
                Appearance.getColorScheme() === 'dark' ? MyColors.dark : MyColors.light,
            })
          }
          break
        case 'dark':
          setTheme({
            mode: 'dark',
            colors: MyColors.dark,
          })
          break
        case 'light':
          setTheme({
            mode: 'light',
            colors: MyColors.light,
          })
          break
        default:
          break
      }
    },
    [theme],
  )

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>{children}</ThemeContext.Provider>
  )
}
