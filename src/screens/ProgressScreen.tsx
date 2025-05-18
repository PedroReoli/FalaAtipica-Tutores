"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"
import { supabaseService } from "@/services/supabase"

interface ProgressMetric {
  id: string
  title: string
  value: string | number
  progress: number
  icon: string
  color: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon_url: string
  earned: boolean
  date?: string
  points: number
}

export const ProgressScreen: React.FC = () => {
  const navigation = useNavigation()
  const { profile } = useAuth()

  const [metrics, setMetrics] = useState<ProgressMetric[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [children, setChildren] = useState<any[]>([])

  useEffect(() => {
    if (profile?.id) {
      fetchChildren()
    }
  }, [profile])

  useEffect(() => {
    if (selectedChildId) {
      fetchProgressData(selectedChildId)
    }
  }, [selectedChildId])

  const fetchChildren = async () => {
    try {
      if (!profile?.tutor?.profile_id) return

      const childrenData = await supabaseService.fetchChildren(profile.tutor.profile_id)

      if (childrenData && childrenData.length > 0) {
        setChildren(childrenData)
        // Selecionar a primeira criança por padrão
        setSelectedChildId(childrenData[0].children.profile_id)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error("Erro ao buscar crianças:", error)
      setLoading(false)
    }
  }

  const fetchProgressData = async (childId: string) => {
    try {
      setLoading(true)

      // Buscar progresso dos jogos
      const gameProgressData = await supabaseService.fetchGameProgress(childId)

      // Buscar conquistas
      const achievementsData = await supabaseService.fetchAchievements(childId)

      // Buscar todas as conquistas disponíveis
      const allAchievements = await supabaseService.fetchAllAchievements()

      // Calcular métricas de progresso
      const totalGames = gameProgressData.length
      const completedGames = gameProgressData.filter((item) => item.completed).length
      const totalScore = gameProgressData.reduce((sum, item) => sum + item.score, 0)

      // Encontrar categoria mais usada
      const categoryCounts: Record<string, number> = {}
      gameProgressData.forEach((item) => {
        const categoryId = item.game.category_id
        if (categoryId) {
          categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1
        }
      })

      let mostUsedCategory = "Nenhuma"
      let maxCount = 0

      for (const [categoryId, count] of Object.entries(categoryCounts)) {
        if (count > maxCount) {
          maxCount = count
          // Aqui você precisaria buscar o nome da categoria pelo ID
          // Por enquanto, vamos usar o ID
          mostUsedCategory = categoryId
        }
      }

      // Calcular tempo total jogado (em minutos)
      const totalTimePlayed = Math.round(gameProgressData.reduce((sum, item) => sum + item.total_time_played, 0) / 60)

      // Criar métricas
      const progressMetrics: ProgressMetric[] = [
        {
          id: "completed_games",
          title: "Jogos completados",
          value: `${completedGames}/${totalGames}`,
          progress: totalGames > 0 ? completedGames / totalGames : 0,
          icon: "check-circle",
          color: "#5A67F2",
        },
        {
          id: "total_score",
          title: "Pontuação total",
          value: totalScore,
          progress: totalScore > 0 ? Math.min(totalScore / 1000, 1) : 0, // Normalizar para um máximo de 1000 pontos
          icon: "award",
          color: "#FF9F43",
        },
        {
          id: "total_time",
          title: "Tempo total jogado",
          value: `${totalTimePlayed} min`,
          progress: totalTimePlayed > 0 ? Math.min(totalTimePlayed / 120, 1) : 0, // Normalizar para 2 horas
          icon: "clock",
          color: "#5A67F2",
        },
        {
          id: "most_used",
          title: "Categoria mais usada",
          value: mostUsedCategory,
          progress: maxCount > 0 ? Math.min(maxCount / 10, 1) : 0, // Normalizar para 10 jogos
          icon: "pie-chart",
          color: "#FF9F43",
        },
      ]

      // Processar conquistas
      const earnedAchievementIds = new Set(achievementsData.map((item) => item.achievement.id))

      const formattedAchievements: Achievement[] = allAchievements.slice(0, 6).map((achievement) => ({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description || "",
        icon_url: achievement.icon_url,
        points: achievement.points,
        earned: earnedAchievementIds.has(achievement.id),
        date: achievementsData.find((item) => item.achievement.id === achievement.id)?.earned_at,
      }))

      setMetrics(progressMetrics)
      setAchievements(formattedAchievements)
    } catch (error) {
      console.error("Erro ao buscar dados de progresso:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    if (selectedChildId) {
      fetchProgressData(selectedChildId)
    } else {
      setRefreshing(false)
    }
  }

  const renderProgressBar = (progress: number, color: string) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  )

  const renderMetricItem = (metric: ProgressMetric) => (
    <View key={metric.id} style={styles.metricItem}>
      <View style={[styles.metricIconContainer, { backgroundColor: `${metric.color}20` }]}>
        <Feather name={metric.icon as any} size={20} color={metric.color} />
      </View>
      <View style={styles.metricContent}>
        <View style={styles.metricHeader}>
          <Text style={styles.metricTitle}>{metric.title}</Text>
          <Text style={styles.metricValue}>{metric.value}</Text>
        </View>
        {renderProgressBar(metric.progress, metric.color)}
      </View>
    </View>
  )

  const renderAchievementItem = (achievement: Achievement) => (
    <TouchableOpacity
      key={achievement.id}
      style={[styles.achievementItem, !achievement.earned && styles.achievementItemLocked]}
      disabled={!achievement.earned}
    >
      <View style={[styles.achievementIconContainer, !achievement.earned && styles.achievementIconLocked]}>
        <Image
          source={{ uri: achievement.icon_url }}
          style={styles.achievementIcon}
          defaultSource={require("@assets/images/image-placeholder.png")}
        />
      </View>
      {!achievement.earned && (
        <View style={styles.lockIconContainer}>
          <Feather name="lock" size={12} color={COLORS.white} />
        </View>
      )}
    </TouchableOpacity>
  )

  const renderChildSelector = () => {
    if (children.length <= 1) return null

    return (
      <View style={styles.childSelectorContainer}>
        <Text style={styles.childSelectorLabel}>Selecione a criança:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.childSelector}>
          {children.map((child) => (
            <TouchableOpacity
              key={child.children.profile_id}
              style={[styles.childItem, selectedChildId === child.children.profile_id && styles.childItemSelected]}
              onPress={() => setSelectedChildId(child.children.profile_id)}
            >
              <Image
                source={
                  child.children.profile.avatar_url
                    ? { uri: child.children.profile.avatar_url }
                    : require("@assets/images/child-placeholder.png")
                }
                style={styles.childAvatar}
              />
              <Text
                style={[styles.childName, selectedChildId === child.children.profile_id && styles.childNameSelected]}
                numberOfLines={1}
              >
                {child.children.profile.full_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progresso</Text>
        <Image source={require("@assets/images/logo.png")} style={styles.headerLogo} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.blue]} />}
      >
        {/* Child Selector */}
        {renderChildSelector()}

        {children.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma criança cadastrada</Text>
            <TouchableOpacity style={styles.addChildButton} onPress={() => navigation.navigate("Profile")}>
              <Text style={styles.addChildButtonText}>Adicionar Criança</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Metrics */}
            <View style={styles.metricsContainer}>{metrics.map((metric) => renderMetricItem(metric))}</View>

            {/* Achievements */}
            <View style={styles.achievementsSection}>
              <Text style={styles.sectionTitle}>Broches</Text>
              <View style={styles.achievementsGrid}>
                {achievements.map((achievement) => renderAchievementItem(achievement))}
              </View>
            </View>

            {/* View All Achievements Button */}
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() =>
                navigation.navigate("Achievements", { childId: selectedChildId || "all", childName: "Todos" })
              }
            >
              <Text style={styles.viewAllButtonText}>Ver Todos os Broches</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
  },
  headerLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  childSelectorContainer: {
    marginBottom: SPACING.lg,
  },
  childSelectorLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grayDark,
    marginBottom: SPACING.xs,
  },
  childSelector: {
    flexDirection: "row",
  },
  childItem: {
    alignItems: "center",
    marginRight: SPACING.md,
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    width: 80,
  },
  childItemSelected: {
    backgroundColor: `${COLORS.blue}20`,
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: SPACING.xs,
  },
  childName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.grayDark,
    textAlign: "center",
  },
  childNameSelected: {
    color: COLORS.blue,
    fontWeight: "bold",
  },
  metricsContainer: {
    marginBottom: SPACING.lg,
  },
  metricItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  metricContent: {
    flex: 1,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  metricTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.backgroundDark,
  },
  metricValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.backgroundDark,
    fontWeight: "bold",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  achievementsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.md,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  achievementItem: {
    width: 80,
    height: 80,
    margin: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: "#FFF5EB",
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.small,
    position: "relative",
  },
  achievementItemLocked: {
    backgroundColor: "#F0F0F0",
    opacity: 0.7,
  },
  achievementIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(30, 136, 229, 0.1)",
    justifyContent: "center",
    alignItems: "center",
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
  lockIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  viewAllButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  viewAllButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginBottom: SPACING.lg,
  },
  addChildButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  addChildButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
})
