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
  Image,
  ActivityIndicator,
  StatusBar,
  Linking,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { supabase } from "@/services/supabase"
import { FavoriteButton } from "@/components/FavoriteButton"

interface Resource {
  id: string
  title: string
  description: string
  type: "video" | "article" | "guide" | "tool"
  url: string
  thumbnail_url: string | null
  created_at: string
}

export const ResourcesScreen: React.FC = () => {
  const navigation = useNavigation()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("educational_resources")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setResources(data || [])
    } catch (error) {
      console.error("Erro ao buscar recursos educacionais:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResourcePress = (resource: Resource) => {
    Linking.canOpenURL(resource.url).then((supported) => {
      if (supported) {
        Linking.openURL(resource.url)
      } else {
        Alert.alert("Erro", "Não foi possível abrir este link")
      }
    })
  }

  const filters = [
    { id: "all", label: "Todos", icon: "grid" },
    { id: "video", label: "Vídeos", icon: "video" },
    { id: "article", label: "Artigos", icon: "file-text" },
    { id: "guide", label: "Guias", icon: "book" },
    { id: "tool", label: "Ferramentas", icon: "tool" },
  ]

  const filteredResources =
    activeFilter === "all" ? resources : resources.filter((resource) => resource.type === activeFilter)

  const renderFilterItem = ({ item }: { item: { id: string; label: string; icon: string } }) => (
    <TouchableOpacity
      style={[styles.filterItem, activeFilter === item.id && styles.filterItemActive]}
      onPress={() => setActiveFilter(item.id)}
    >
      <Feather
        name={item.icon as any}
        size={16}
        color={activeFilter === item.id ? COLORS.white : COLORS.backgroundDark}
      />
      <Text style={[styles.filterLabel, activeFilter === item.id && styles.filterLabelActive]}>{item.label}</Text>
    </TouchableOpacity>
  )

  const renderResourceItem = ({ item }: { item: Resource }) => (
    <TouchableOpacity style={styles.resourceItem} onPress={() => handleResourcePress(item)}>
      <View style={styles.resourceImageContainer}>
        {item.thumbnail_url ? (
          <Image source={{ uri: item.thumbnail_url }} style={styles.resourceImage} />
        ) : (
          <View style={styles.resourceImagePlaceholder}>
            <Feather
              name={
                item.type === "video"
                  ? "video"
                  : item.type === "article"
                    ? "file-text"
                    : item.type === "guide"
                      ? "book"
                      : "tool"
              }
              size={24}
              color={COLORS.gray}
            />
          </View>
        )}
      </View>
      <View style={styles.resourceInfo}>
        <Text style={styles.resourceTitle}>{item.title}</Text>
        <Text style={styles.resourceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.resourceMeta}>
          <View style={styles.resourceTypeContainer}>
            <Text style={styles.resourceType}>
              {item.type === "video"
                ? "Vídeo"
                : item.type === "article"
                  ? "Artigo"
                  : item.type === "guide"
                    ? "Guia"
                    : "Ferramenta"}
            </Text>
          </View>
          <FavoriteButton itemId={item.id} itemType={item.type === "guide" ? "book" : (item.type as any)} size={20} />
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recursos Educacionais</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          renderItem={renderFilterItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.blue} />
        </View>
      ) : filteredResources.length > 0 ? (
        <FlatList
          data={filteredResources}
          renderItem={renderResourceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resourcesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="book-open" size={50} color={COLORS.gray} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>Nenhum recurso encontrado</Text>
        </View>
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
  },
  headerRight: {
    width: 24, // Para manter o título centralizado
  },
  filtersContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  filtersList: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundLight,
  },
  filterItemActive: {
    backgroundColor: COLORS.blue,
  },
  filterLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.backgroundDark,
    marginLeft: SPACING.xs,
  },
  filterLabelActive: {
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resourcesList: {
    padding: SPACING.md,
  },
  resourceItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  resourceImageContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    marginRight: SPACING.md,
  },
  resourceImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  resourceImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.xs,
  },
  resourceDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
  },
  resourceMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resourceTypeContainer: {
    backgroundColor: COLORS.backgroundLight,
    paddingVertical: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  resourceType: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.backgroundDark,
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
  },
})
