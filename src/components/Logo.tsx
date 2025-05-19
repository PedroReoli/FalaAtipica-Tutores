import type React from "react"
import { View, Image, StyleSheet } from "react-native"

interface LogoProps {
  size?: number
}

export const Logo: React.FC<LogoProps> = ({ size = 100 }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@assets/images/logo.svg")}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
})
