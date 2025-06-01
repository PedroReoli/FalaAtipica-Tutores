"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"
import type { RootStackParamList } from "@/navigation/types"
import { supabaseService } from "@/services/supabase"
import { progressService } from "@/services/progressService"

type ChildDetailsScreenRouteProp = RouteProp<RootStackParamList, "ChildDetails">

interface ChildDetails {
  id: string
  name: string
  diagnosis: string | null
  birth_date: string | null
  notes: string | null
  avatar_url: string | null
}

interface GameProgress {
  id: string
  game_id: string
  game_name: string
  level_reached: number
  score: number
  completed: boolean
  last_played_at: string
  thumbnail_url: string | null
}

interface Metric {
  id: string
  title: string
  value: string | number
  icon: string
  color: string
}

export const ChildDetailsScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<ChildDetailsScreenRouteProp>()
  const { childId, childName } = route.params
  const { profile } = useAuth()

  const [childDetails, setChildDetails] = useState<ChildDetails | null>(null)
  const [gameProgress, setGameProgress] = useState<GameProgress[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"progress" | "info" | "achievements">("progress")

  useEffect(() => {
    fetchChildDetails()
    fetchGameProgress()
    fetchMetrics()
  }, [childId])

  const fetchChildDetails = async () => {
    try {
      const data = await supabaseService.fetchChildDetails(childId)
      setChildDetails({
        id: data.profile_id,
        name: data.profile.full_name,
        diagnosis: data.diagnosis,
        birth_date: data.birth_date,
        notes: data.notes,
        avatar_url: data.profile.avatar_url,
      })
    } catch (error) {
      console.error("Erro ao buscar detalhes da criança:", error)
    }
  }

  const fetchGameProgress = async () => {
    try {
      const data = await supabaseService.fetchGameProgress(childId)
      const formattedProgress = data.map((item) => ({
        id: item.id,
        game_id: item.game.id,
        game_name: item.game.name,
        level_reached: item.level_reached,
        score: item.score,
        completed: item.completed,
        last_played_at: item.last_played_at,
        thumbnail_url: item.game.thumbnail_url,
      }))
      setGameProgress(formattedProgress)
    } catch (error) {
      console.error("Erro ao buscar progresso dos jogos:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMetrics = async () => {
    try {
      const data = await progressService.getProgressMetrics(childId)
      setMetrics(data)
    } catch (error) {
      console.error("Erro ao buscar métricas:", error)
    }
  }

  const handleEditChild = () => {
    navigation.navigate("EditChildProfile" as never, { childId })
  }

  const handleViewAchievements = () => {
    navigation.navigate("Achievements" as never, { childId, childName })
  }

  const handleGamePress = (gameId: string, gameName: string) => {
    navigation.navigate("GameProgress" as never, { gameId, gameName, childId })
  }

  const calculateAge = (birthDate: string | null): string => {
    if (!birthDate) return "Idade não informada"

    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return `${age} anos`
  }

  const renderProgressTab = () => (
    <View style={styles.tabContent}>
      {/* Metrics */}
      <View style={styles.metricsContainer}>
        {metrics.map((metric) => (
          <View key={metric.id} style={styles.metricItem}>
            <View style={[styles.metricIconContainer, { backgroundColor: `${metric.color}20` }]}>
              <Feather name={metric.icon as any} size={20} color={metric.color} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricTitle}>{metric.title}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Game Progress */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Progresso nos Jogos</Text>
      </View>

      {gameProgress.length > 0 ? (
        gameProgress.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameItem}
            onPress={() => handleGamePress(game.game_id, game.game_name)}
          >
            <View style={styles.gameImageContainer}>
              {game.thumbnail_url ? (
                <Image source={{ uri: game.thumbnail_url }} style={styles.gameImage} />
              ) : (
                <View style={styles.gameImagePlaceholder}>
                  <Feather name="play" size={24} color={COLORS.gray} />
                </View>
              )}
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameName}>{game.game_name}</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${game.completed ? 100 : Math.min(game.level_reached * 20, 100)}%` },
                  ]}
                />
              </View>
              <View style={styles.gameStats}>
                <Text style={styles.gameLevel}>{game.completed ? "Completo" : `Nível ${game.level_reached}`}</Text>
                <Text style={styles.gameScore}>{game.score} pontos</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum jogo iniciado</Text>
        </View>
      )}

      {/* View Achievements Button */}
      <TouchableOpacity style={styles.achievementsButton} onPress={handleViewAchievements}>
        <Text style={styles.achievementsButtonText}>Ver Conquistas</Text>
      </TouchableOpacity>
    </View>
  )

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      {/* Personal Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Informações Pessoais</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nome Completo</Text>
          <Text style={styles.infoValue}>{childDetails?.name || "-"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Idade</Text>
          <Text style={styles.infoValue}>{childDetails?.birth_date ? calculateAge(childDetails.birth_date) : "-"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Diagnóstico</Text>
          <Text style={styles.infoValue}>{childDetails?.diagnosis || "-"}</Text>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Observações</Text>
        <View style={styles.notesContainer}>
          <Text style={styles.notesText}>{childDetails?.notes || "Nenhuma observação registrada."}</Text>
        </View>
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton} onPress={handleEditChild}>
        <Feather name="edit-2" size={20} color={COLORS.white} />
        <Text style={styles.editButtonText}>Editar Informações</Text>
      </TouchableOpacity>
    </View>
  )

  const renderAchievementsTab = () => (
    <View style={styles.tabContent}>
      {/* Achievements Preview */}
      <View style={styles.achievementsPreview}>
        <Text style={styles.achievementsTitle}>Conquistas</Text>
        <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAchievements}>
          <Text style={styles.viewAllText}>Ver Todas</Text>
          <Feather name="chevron-right" size={16} color={COLORS.blue} />
        </TouchableOpacity>
      </View>

      {/* Achievement Cards will be here */}
      <View style={styles.achievementsContainer}>
        {/* This will be populated with actual achievements */}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Carregando conquistas...</Text>
        </View>
      </View>
    </View>
  )

  if (loading) {
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
        <View style={styles.profileSection}>
          <Image
            source={
              childDetails?.avatar_url
                ? { uri: childDetails.avatar_url }
                : require("@assets/images/child-placeholder.svg")
            }
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{childDetails?.name || childName}</Text>
            {childDetails?.diagnosis && <Text style={styles.profileDiagnosis}>{childDetails.diagnosis}</Text>}
          </View>
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditChild}>
            <Feather name="edit-2" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "progress" && styles.activeTabButton]}
          onPress={() => setActiveTab("progress")}
        >
          <Feather
            name="bar-chart-2"
            size={20}
            color={activeTab === "progress" ? COLORS.blue : COLORS.gray}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === "progress" && styles.activeTabText]}>Progresso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "info" && styles.activeTabButton]}
          onPress={() => setActiveTab("info")}
        >
          <Feather
            name="info"
            size={20}
            color={activeTab === "info" ? COLORS.blue : COLORS.gray}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>Informações</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "achievements" && styles.activeTabButton]}
          onPress={() => setActiveTab("achievements")}
        >
          <Feather
            name="award"
            size={20}
            color={activeTab === "achievements" ? COLORS.blue : COLORS.gray}
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === "achievements" && styles.activeTabText]}>Conquistas</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === "progress" && renderProgressTab()}
        {activeTab === "info" && renderInfoTab()}
        {activeTab === "achievements" && renderAchievementsTab()}
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
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  profileDiagnosis: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    opacity: 0.8,
  },
  editProfileButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blue,
  },
  tabIcon: {
    marginRight: SPACING.xs,
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.blue,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: SPACING.md,
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  metricItem: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.small,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    marginBottom: SPACING.xs / 2,
  },
  metricValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
  },
  gameItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.small,
  },
  gameImageContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.sm,
    overflow: "hidden",
    marginRight: SPACING.md,
  },
  gameImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gameImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.xs,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.grayLight,
    borderRadius: 4,
    marginBottom: SPACING.xs,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.green,
    borderRadius: 4,
  },
  gameStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gameLevel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  gameScore: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
    color: COLORS.blue,
  },
  emptyContainer: {
    padding: SPACING.lg,
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
  },
  achievementsButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  achievementsButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  infoSectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    paddingBottom: SPACING.xs,
  },
  infoItem: {
    marginBottom: SPACING.md,
  },
  infoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs / 2,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.backgroundDark,
  },
  notesContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
  },
  notesText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.backgroundDark,
    lineHeight: 22,
  },
  editButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    marginLeft: SPACING.sm,
  },
  achievementsPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  achievementsTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.blue,
    marginRight: SPACING.xs,
  },
  achievementsContainer: {
    marginBottom: SPACING.lg,
  },
})
