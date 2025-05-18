import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import { supabase } from "./supabase"

export interface Notification {
  id: string
  title: string
  body: string
  data?: any
  read: boolean
  created_at: string
}

export const notificationsService = {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      return false
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    return true
  },

  async registerForPushNotifications(profileId: string): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions()
      if (!hasPermission) {
        return null
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data

      // Salvar o token no banco de dados
      const { error } = await supabase.from("notification_tokens").upsert(
        {
          profile_id: profileId,
          token,
          device_type: Platform.OS,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "profile_id" },
      )

      if (error) {
        console.error("Erro ao salvar token de notificação:", error)
        return null
      }

      return token
    } catch (error) {
      console.error("Erro ao registrar para notificações push:", error)
      return null
    }
  },

  async getNotifications(profileId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error("Erro ao buscar notificações:", error)
      return []
    }
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

      if (error) throw error

      return true
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error)
      return false
    }
  },

  async markAllAsRead(profileId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("profile_id", profileId)
        .eq("read", false)

      if (error) throw error

      return true
    } catch (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error)
      return false
    }
  },

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

      if (error) throw error

      return true
    } catch (error) {
      console.error("Erro ao excluir notificação:", error)
      return false
    }
  },

  async getUnreadCount(profileId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact" })
        .eq("profile_id", profileId)
        .eq("read", false)

      if (error) throw error

      return count || 0
    } catch (error) {
      console.error("Erro ao buscar contagem de notificações não lidas:", error)
      return 0
    }
  },

  // Função para enviar uma notificação local (para testes)
  async scheduleLocalNotification(title: string, body: string, data?: any): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: null, // Enviar imediatamente
    })
  },
}
