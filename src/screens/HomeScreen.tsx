"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { globalStyles } from "@/styles/globals"
import type { RootStackParamList } from "@/navigation/types"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/services/supabase"
import { Feather } from "@expo/vector-icons"
import { UserAvatar } from '../components/UserAvatar'

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>

interface Child {
  id: string
  name: string
  diagnosis: string
  avatar_url: string | null
}

interface FunctionalityItem {
  id: string
  title: string
  icon: React.ReactNode
  onPress: () => void
}

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const { profile, signOut } = useAuth()

  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (profile?.id) {
      fetchChildren()
    }
  }, [profile])

  const fetchChildren = async () => {
    try {
      if (!profile?.id) return

      const { data, error } = await supabase
        .from("tutor_children")
        .select(`
          child_id,
          children:child_id (
            profile_id,
            diagnosis,
            profile:profile_id (
              full_name,
              avatar_url
            )
          )
        `)
        .eq("tutor_id", profile.tutor?.profile_id)

      if (error) throw error

      if (data) {
        const formattedChildren = data.map((item) => ({
          id: item.children.profile_id,
          name: item.children.profile.full_name,
          diagnosis: item.children.diagnosis || "Não especificado",
          avatar_url: item.children.profile.avatar_url,
        }))
        setChildren(formattedChildren)
      }
    } catch (error) {
      console.error("Error fetching children:", error)
    } finally {
      setLoading(false)
    }
  }

  const functionalities: FunctionalityItem[] = [
    {
      id: "images",
      title: "Imagens e sons",
      icon: <Feather name="image" size={24} color={COLORS.blue} />,
      onPress: () => navigation.navigate("Images"),
    },
    {
      id: "progress",
      title: "Progresso",
      icon: <Feather name="bar-chart-2" size={24} color={COLORS.blue} />,
      onPress: () => navigation.navigate("Progress"),
    },
    {
      id: "support",
      title: "Suporte",
      icon: <Feather name="help-circle" size={24} color={COLORS.blue} />,
      onPress: () => navigation.navigate("Support"),
    },
    {
      id: "tips",
      title: "Dicas",
      icon: <Feather name="message-circle" size={24} color={COLORS.blue} />,
      onPress: () => navigation.navigate("Tips"),
    },
  ]

  const renderFunctionalityItem = ({ item }: { item: FunctionalityItem }) => (
    <TouchableOpacity style={styles.functionalityItem} onPress={item.onPress}>
      <View style={styles.functionalityIconContainer}>{item.icon}</View>
      <Text style={styles.functionalityTitle}>{item.title}</Text>
    </TouchableOpacity>
  )

  const renderChildItem = ({ item }: { item: Child }) => (
    <TouchableOpacity
      style={styles.childItem}
      onPress={() => navigation.navigate("ChildDetails", { childId: item.id, childName: item.name })}
    >
      <UserAvatar uri={item.avatar_url} size={40} />
      <View style={styles.childInfo}>
        <Text style={styles.childName}>{item.name}</Text>
        <Text style={styles.childDiagnosis}>{item.diagnosis}</Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={[globalStyles.container, globalStyles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <UserAvatar uri={profile?.avatar_url} size={48} />
          <Text style={styles.greeting}>
            Olá{"\n"}
            <Text style={styles.userName}>{profile?.full_name || "Tutor"}</Text>
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => navigation.navigate("Search")}
        activeOpacity={0.7}
      >
        <View style={styles.searchInput}>
          <Feather name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Procurar</Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Functionalities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          <View style={styles.functionalitiesContainer}>
            {functionalities.map((item) => renderFunctionalityItem({ item }))}
          </View>
        </View>

        {/* Progress and Achievements Button */}
        <TouchableOpacity style={styles.progressButton} onPress={() => navigation.navigate("Progress")}>
          <View style={styles.progressButtonContent}>
            <Feather name="award" size={24} color={COLORS.white} />
            <Text style={styles.progressButtonText}>Progresso e Conquistas</Text>
          </View>
          <Feather name="chevron-right" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {/* Tips Button */}
        <TouchableOpacity style={styles.tipsButton} onPress={() => navigation.navigate("Tips")}>
          <View style={styles.tipsButtonContent}>
            <Feather name="message-circle" size={24} color={COLORS.white} />
            <Text style={styles.tipsButtonText}>Dicas e Recursos</Text>
          </View>
          <Feather name="chevron-right" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {/* Children */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Crianças</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddChild")}>
              <Feather name="plus" size={20} color={COLORS.blue} />
            </TouchableOpacity>
          </View>
          {children.length > 0 ? (
            <FlatList
              data={children}
              renderItem={renderChildItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyChildrenContainer}>
              <Text style={styles.emptyText}>Nenhuma criança vinculada</Text>
              <TouchableOpacity style={styles.addChildButton} onPress={() => navigation.navigate("AddChild")}>
                <Text style={styles.addChildButtonText}>Adicionar Criança</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  header: {
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
  },
  userName: {
    fontWeight: "bold",
    fontSize: FONT_SIZE.md,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  searchInput: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchPlaceholder: {
    color: COLORS.gray,
    fontSize: FONT_SIZE.md,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    marginBottom: SPACING.md,
    color: COLORS.backgroundDark,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  functionalitiesContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    ...SHADOWS.small,
  },
  functionalityItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  functionalityIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  functionalityTitle: {
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    color: COLORS.backgroundDark,
  },
  progressButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...SHADOWS.medium,
  },
  progressButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    marginLeft: SPACING.md,
  },
  tipsButton: {
    backgroundColor: COLORS.green,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...SHADOWS.medium,
  },
  tipsButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipsButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    marginLeft: SPACING.md,
  },
  childItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.small,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
  },
  childDiagnosis: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  emptyChildrenContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: "center",
    ...SHADOWS.small,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  addChildButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  addChildButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: "500",
  },
})
