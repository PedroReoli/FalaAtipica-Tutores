import type React from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"

interface GameProgressCardProps {
  name: string
  thumbnailUrl?: string | null
  level: number
  score: number
  completed: boolean
  onPress?: () => void
}

export const GameProgressCard: React.FC<GameProgressCardProps> = ({
  name,
  thumbnailUrl,
  level,
  score,
  completed,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={thumbnailUrl ? { uri: thumbnailUrl } : require("@assets/images/game-placeholder.svg")}
        style={styles.thumbnail}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completed ? 100 : Math.min(level * 20, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>{completed ? "Completo" : `Nível ${level}`}</Text>
        </View>
        <Text style={styles.score}>{score} pontos</Text>
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
    flexDirection: "row",
    ...SHADOWS.small,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  progressContainer: {
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.xs,
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.green,
    borderRadius: BORDER_RADIUS.xs,
  },
  progressText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.grayDark,
  },
  score: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
    color: COLORS.blue,
  },
})
