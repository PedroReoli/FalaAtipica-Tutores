"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import { useAuth } from "@/context/AuthContext"
import { notificationsService } from "@/services/notificationsService"
import { useNavigation } from "@react-navigation/native"

interface NotificationIconProps {
  size?: number
  color?: string
  style?: any
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ size = 24, color = COLORS.white, style }) => {
  const navigation = useNavigation()
  const { profile } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (profile?.id) {
      fetchUnreadCount()
    }
  }, [profile])

  const fetchUnreadCount = async () => {
    if (!profile?.id) return

    try {
      const count = await notificationsService.getUnreadCount(profile.id)
      setUnreadCount(count)
    } catch (error) {
      console.error("Erro ao buscar contagem de notificações não lidas:", error)
    }
  }

  const handlePress = () => {
    navigation.navigate("Notifications")
  }

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handlePress}>
      <Feather name="bell" size={size} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: SPACING.xs,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.red,
    borderRadius: BORDER_RADIUS.round,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: "bold",
  },
})
