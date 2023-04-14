export interface ThemeContextType {
  theme: Theme
  toggleTheme: (mode: 'auto' | 'dark' | 'light') => void
}


export interface Theme {
  mode: 'auto' | 'dark' | 'light'
  colors: Colors
}
export interface Colors {
  isDark: boolean

  primary: string
  secondary: string
  background: string
  topsearch: string
  topsearchbg: string
  divider: string
  defaultTextColor: string
  homebg: string
  messagebg: string
  inputbg: string
  clickbg: string
  unreadNotice:string
  listdivder:string
}

export type Light = Colors
export type Dark = Colors
