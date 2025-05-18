"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"
import { COLORS } from "@/styles/variables"

type Theme = "light" | "dark"

interface ThemeContextData {
  theme: Theme
  colors: typeof COLORS & {
    background: string
    text: string
    card: string
    cardText: string
  }
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark")

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  const colors = {
    ...COLORS,
    background: theme === "light" ? COLORS.backgroundLight : COLORS.backgroundDark,
    text: theme === "light" ? COLORS.black : COLORS.white,
    card: theme === "light" ? COLORS.white : COLORS.grayDark,
    cardText: theme === "light" ? COLORS.black : COLORS.white,
  }

  return <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
