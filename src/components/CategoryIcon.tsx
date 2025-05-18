import type React from "react"
import { View, StyleSheet } from "react-native"
import { COLORS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"

interface CategoryIconProps {
  name: string
  size?: number
  color?: string
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, size = 32, color = COLORS.blue }) => {
  const getIconComponent = () => {
    switch (name) {
      case "comidas":
        return <Feather name="coffee" size={size} color={color} />
      case "animais":
        return <Feather name="home" size={size} color={color} />
      case "roupas":
        return <Feather name="power" size={size} color={color} />
      case "brinquedos":
        return <Feather name="tool" size={size} color={color} />
      case "acoes":
        return <Feather name="trash-2" size={size} color={color} />
      case "familia":
        return <Feather name="edit" size={size} color={color} />
      default:
        return <Feather name="image" size={size} color={color} />
    }
  }

  return <View style={styles.container}>{getIconComponent()}</View>
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
})
