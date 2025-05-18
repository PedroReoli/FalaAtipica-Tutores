import type React from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"

interface AchievementCardProps {
  name: string
  description?: string
  iconUrl: string
  points: number
  earned?: boolean
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  name,
  description,
  iconUrl,
  points,
  earned = false,
}) => {
  return (
    <View style={[styles.card, !earned && styles.notEarned]}>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{points} pontos</Text>
        </View>
      </View>
      {!earned && <View style={styles.lockedOverlay} />}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.small,
  },
  notEarned: {
    opacity: 0.7,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grayDark,
    marginBottom: SPACING.xs,
  },
  pointsContainer: {
    backgroundColor: COLORS.green,
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  points: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: "500",
  },
  lockedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: BORDER_RADIUS.md,
  },
})
