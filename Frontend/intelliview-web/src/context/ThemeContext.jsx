/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'intelliview-theme'
const ThemeContext = createContext(null)

function savedTheme() {
  try {
    const theme = localStorage.getItem(STORAGE_KEY)
    return theme === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(savedTheme)

  useEffect(() => {
    applyTheme(theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch { /* Storage can be unavailable in private contexts. */ }
  }, [theme])

  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark')
  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}