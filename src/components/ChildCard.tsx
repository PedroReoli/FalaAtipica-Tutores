import type React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"

interface ChildCardProps {
  name: string
  avatarUrl?: string | null
  age?: string | null
  onPress?: () => void
}

export const ChildCard: React.FC<ChildCardProps> = ({ name, avatarUrl, age, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : require("@assets/images/child-placeholder.svg")}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          {age && <Text style={styles.age}>{age} anos</Text>}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  age: {
    fontSize: FONT_SIZE.md,
    color: COLORS.grayDark,
  },
})
