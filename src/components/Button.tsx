import type React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type TouchableOpacityProps } from "react-native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"

interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: "primary" | "secondary"
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({ title, variant = "primary", loading = false, style, ...rest }) => {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "primary" ? styles.primaryButton : styles.secondaryButton, style]}
      disabled={loading}
      {...rest}
    >
      {loading ? <ActivityIndicator color={COLORS.white} size="small" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryButton,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondaryButton,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
})
