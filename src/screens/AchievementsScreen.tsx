"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"
import type { RootStackParamList } from "@/navigation/types"
import { supabaseService } from "@/services/supabase"

type AchievementsScreenRouteProp = RouteProp<RootStackParamList, "Achievements">

interface Achievement {
  id: string
  name: string
  description: string
  icon_url: string
  points: number
  earned: boolean
  date?: string
}

export const AchievementsScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<AchievementsScreenRouteProp>()
  const { profile } = useAuth()
  const { childId, childName } = route.params

  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [totalPoints, setTotalPoints] = useState(0)
  const [earnedCount, setEarnedCount] = useState(0)
  const [childProfile, setChildProfile] = useState<any>(null)

  useEffect(() => {
    fetchChildProfile()
    fetchAchievements()
  }, [childId])

  const fetchChildProfile = async () => {
    if (childId === "all") return

    try {
      const childData = await supabaseService.fetchChildDetails(childId)
      setChildProfile(childData)
    } catch (error) {
      console.error("Erro ao buscar perfil da criança:", error)
    }
  }

  const fetchAchievements = async () => {
    try {
      setLoading(true)

      // Buscar todas as conquistas disponíveis
      const allAchievements = await supabaseService.fetchAllAchievements()

      // Buscar conquistas da criança
      const childAchievements = childId !== "all" ? await supabaseService.fetchAchievements(childId) : []

      // Criar um conjunto com os IDs das conquistas obtidas
      const earnedAchievementIds = new Set(childAchievements.map((item) => item.achievement.id))

      // Formatar as conquistas
      const formattedAchievements: Achievement[] = allAchievements.map((achievement) => ({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description || "",
        icon_url: achievement.icon_url,
        points: achievement.points,
        earned: earnedAchievementIds.has(achievement.id),
        date: childAchievements.find((item) => item.achievement.id === achievement.id)?.earned_at,
      }))

      setAchievements(formattedAchievements)

      // Calcular pontos totais e conquistas obtidas
      const earned = formattedAchievements.filter((a) => a.earned)
      const points = earned.reduce((sum, a) => sum + a.points, 0)

      setTotalPoints(points)
      setEarnedCount(earned.length)
    } catch (error) {
      console.error("Erro ao buscar conquistas:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchAchievements()
  }

  const renderAchievementItem = ({ item }: { item: Achievement }) => (
    <View style={[styles.achievementItem, !item.earned && styles.achievementItemLocked]}>
      <View style={[styles.achievementIconContainer, !item.earned && styles.achievementIconLocked]}>
        <Image
          source={{ uri: item.icon_url }}
          style={styles.achievementIcon}
          defaultSource={require("@assets/images/image-placeholder.png")}
        />
      </View>
      <View style={styles.achievementContent}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementName}>{item.name}</Text>
          <Text style={styles.achievementPoints}>{item.points} pts</Text>
        </View>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        {item.earned && item.date && (
          <Text style={styles.achievementDate}>Conquistado em {new Date(item.date).toLocaleDateString()}</Text>
        )}
      </View>
      {!item.earned && (
        <View style={styles.lockIconContainer}>
          <Feather name="lock" size={16} color={COLORS.white} />
        </View>
      )}
    </View>
  )

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Content */}
      <View style={styles.content}>
        {/* Child Profile */}
        {childProfile && (
          <View style={styles.childProfileContainer}>
            <Image
              source={
                childProfile.profile.avatar_url
                  ? { uri: childProfile.profile.avatar_url }
                  : require("@assets/images/child-placeholder.png")
              }
              style={styles.childAvatar}
            />
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{childProfile.profile.full_name}</Text>
              {childProfile.diagnosis && <Text style={styles.childDiagnosis}>{childProfile.diagnosis}</Text>}
            </View>
          </View>
        )}

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{earnedCount}</Text>
            <Text style={styles.summaryLabel}>Conquistados</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{achievements.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalPoints}</Text>
            <Text style={styles.summaryLabel}>Pontos</Text>
          </View>
        </View>

        {/* Achievements List */}
        <FlatList
          data={achievements}
          renderItem={renderAchievementItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.achievementsList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.blue]} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma conquista disponível</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  childProfileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SPACING.md,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
  },
  childDiagnosis: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grayDark,
  },
  summaryContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.white,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: SPACING.sm,
  },
  achievementsList: {
    paddingBottom: SPACING.lg,
  },
  achievementItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
    position: "relative",
  },
  achievementItemLocked: {
    opacity: 0.7,
  },
  achievementIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(30, 136, 229, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
    overflow: "hidden",
  },
  achievementIcon: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  achievementIconLocked: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  achievementName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
  },
  achievementPoints: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "bold",
    color: COLORS.blue,
  },
  achievementDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grayDark,
    marginBottom: SPACING.xs,
  },
  achievementDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    fontStyle: "italic",
  },
  lockIconContainer: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.gray,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
  },
})
