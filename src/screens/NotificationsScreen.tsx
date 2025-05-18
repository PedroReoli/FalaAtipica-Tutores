"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"
import { notificationsService, type Notification } from "@/services/notificationsService"

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation()
  const { profile } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (profile?.id) {
      fetchNotifications()
    }
  }, [profile])

  const fetchNotifications = async () => {
    if (!profile?.id) return

    try {
      setLoading(true)
      const data = await notificationsService.getNotifications(profile.id)
      setNotifications(data)
    } catch (error) {
      console.error("Erro ao buscar notificações:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchNotifications()
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const success = await notificationsService.markAsRead(notificationId)
      if (success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, read: true } : notification,
          ),
        )
      }
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!profile?.id) return

    try {
      const success = await notificationsService.markAllAsRead(profile.id)
      if (success) {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      }
    } catch (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error)
    }
  }

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      "Excluir Notificação",
      "Tem certeza que deseja excluir esta notificação?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await notificationsService.deleteNotification(notificationId)
              if (success) {
                setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
              }
            } catch (error) {
              console.error("Erro ao excluir notificação:", error)
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  const handleNotificationPress = (notification: Notification) => {
    // Marcar como lida
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }

    // Navegar com base no tipo de notificação
    if (notification.data?.type === "child_progress") {
      navigation.navigate("ChildDetails", {
        childId: notification.data.childId,
        childName: notification.data.childName || "Criança",
      })
    } else if (notification.data?.type === "achievement") {
      navigation.navigate("Achievements", {
        childId: notification.data.childId,
        childName: notification.data.childName || "Criança",
      })
    } else if (notification.data?.type === "game") {
      navigation.navigate("GameProgress", {
        gameId: notification.data.gameId,
        gameName: notification.data.gameName || "Jogo",
        childId: notification.data.childId || "all",
      })
    }
  }

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, item.read && styles.notificationItemRead]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.notificationDot, item.read && styles.notificationDotRead]} />
        <View style={styles.notificationTextContainer}>
          <Text style={[styles.notificationTitle, item.read && styles.notificationTitleRead]}>{item.title}</Text>
          <Text style={[styles.notificationBody, item.read && styles.notificationBodyRead]}>{item.body}</Text>
          <Text style={styles.notificationDate}>
            {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteNotification(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="trash-2" size={18} color={COLORS.red} />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="bell" size={50} color={COLORS.gray} style={styles.emptyIcon} />
      <Text style={styles.emptyText}>Nenhuma notificação</Text>
      <Text style={styles.emptySubtext}>
        Você receberá notificações sobre o progresso das crianças e outras atualizações
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        {notifications.some((notification) => !notification.read) && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllText}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.blue} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  markAllButton: {
    padding: SPACING.xs,
  },
  markAllText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    textDecorationLine: "underline",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationsList: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  notificationItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.blue,
    ...SHADOWS.small,
  },
  notificationItemRead: {
    borderLeftColor: COLORS.grayLight,
    backgroundColor: COLORS.backgroundLight,
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.blue,
    marginRight: SPACING.sm,
    marginTop: SPACING.xs,
  },
  notificationDotRead: {
    backgroundColor: COLORS.grayLight,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.xs,
  },
  notificationTitleRead: {
    fontWeight: "normal",
  },
  notificationBody: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.backgroundDark,
    marginBottom: SPACING.xs,
  },
  notificationBodyRead: {
    color: COLORS.gray,
  },
  notificationDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyIcon: {
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: "center",
  },
})
