import { StyleSheet } from "react-native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, FONT_WEIGHT, SHADOWS } from "./variables"

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryButton,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    width: "100%",
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  linkText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: SPACING.sm,
    textDecorationLine: "underline",
  },
  infoText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.md,
  },
  bulletPointText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  cardTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  cardText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.grayDark,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
})
