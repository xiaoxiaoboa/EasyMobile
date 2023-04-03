export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export interface Theme {
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
}

export type Light = Theme
export type Dark = Theme
