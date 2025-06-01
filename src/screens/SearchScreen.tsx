"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { supabase } from "@/services/supabase"

interface SearchResult {
  id: string
  type: "child" | "game" | "category" | "image"
  title: string
  subtitle?: string
  imageUrl?: string | null
  navigationParams?: any
}

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    loadRecentSearches()
  }, [])

  const loadRecentSearches = async () => {
    try {
      // Em uma implementação real, você buscaria do AsyncStorage
      // Por enquanto, vamos usar dados mockados
      setRecentSearches(["autismo", "comunicação", "jogos", "imagens"])
    } catch (error) {
      console.error("Erro ao carregar buscas recentes:", error)
    }
  }

  const saveRecentSearch = async (query: string) => {
    try {
      // Evitar duplicatas
      if (!recentSearches.includes(query)) {
        const updatedSearches = [query, ...recentSearches].slice(0, 5) // Manter apenas as 5 mais recentes
        setRecentSearches(updatedSearches)
        // Em uma implementação real, você salvaria no AsyncStorage
      }
    } catch (error) {
      console.error("Erro ao salvar busca recente:", error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      // Salvar a busca nas recentes
      saveRecentSearch(searchQuery.trim())

      // Buscar crianças
      const { data: childrenData, error: childrenError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("user_type", "child")
        .ilike("full_name", `%${searchQuery}%`)
        .limit(5)

      if (childrenError) throw childrenError

      // Buscar categorias de jogos
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("game_categories")
        .select("id, name, description, icon_url")
        .ilike("name", `%${searchQuery}%`)
        .limit(5)

      if (categoriesError) throw categoriesError

      // Buscar jogos
      const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select("id, name, description, thumbnail_url, category_id")
        .ilike("name", `%${searchQuery}%`)
        .limit(5)

      if (gamesError) throw gamesError

      // Formatar os resultados
      const formattedResults: SearchResult[] = [
        ...childrenData.map((child) => ({
          id: `child-${child.id}`,
          type: "child" as const,
          title: child.full_name,
          subtitle: "Criança",
          imageUrl: child.avatar_url,
          navigationParams: { childId: child.id, childName: child.full_name },
        })),
        ...categoriesData.map((category) => ({
          id: `category-${category.id}`,
          type: "category" as const,
          title: category.name,
          subtitle: category.description || "Categoria",
          imageUrl: category.icon_url,
          navigationParams: { categoryId: category.id, categoryTitle: category.name },
        })),
        ...gamesData.map((game) => ({
          id: `game-${game.id}`,
          type: "game" as const,
          title: game.name,
          subtitle: game.description || "Jogo",
          imageUrl: game.thumbnail_url,
          navigationParams: { gameId: game.id, gameName: game.name },
        })),
      ]

      setResults(formattedResults)
    } catch (error) {
      console.error("Erro na busca:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResultPress = (result: SearchResult) => {
    switch (result.type) {
      case "child":
        navigation.navigate("ChildDetails" as never, result.navigationParams)
        break
      case "category":
        navigation.navigate("CategoryDetail" as never, result.navigationParams)
        break
      case "game":
        navigation.navigate("GameProgress" as never, result.navigationParams)
        break
      case "image":
        // Navegar para detalhes da imagem
        break
    }
  }

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query)
    handleSearch()
  }

  const renderResultItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleResultPress(item)}>
      <View style={styles.resultImageContainer}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.resultImage}
            defaultSource={require("@assets/images/image-placeholder.svg")}
          />
        ) : (
          <View style={styles.resultImagePlaceholder}>
            <Feather
              name={
                item.type === "child"
                  ? "user"
                  : item.type === "category"
                    ? "grid"
                    : item.type === "game"
                      ? "play"
                      : "image"
              }
              size={24}
              color={COLORS.gray}
            />
          </View>
        )}
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        {item.subtitle && <Text style={styles.resultSubtitle}>{item.subtitle}</Text>}
      </View>
      <Feather name="chevron-right" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  )

  const renderRecentSearch = (item: string, index: number) => (
    <TouchableOpacity key={index} style={styles.recentSearchItem} onPress={() => handleRecentSearchPress(item)}>
      <Feather name="clock" size={16} color={COLORS.gray} style={styles.recentSearchIcon} />
      <Text style={styles.recentSearchText}>{item}</Text>
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
        <Text style={styles.headerTitle}>Buscar</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar crianças, jogos, categorias..."
          placeholderTextColor={COLORS.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Feather name="search" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.blue} />
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            renderItem={renderResultItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultsList}
          />
        ) : searchQuery ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum resultado encontrado para "{searchQuery}"</Text>
          </View>
        ) : (
          <View style={styles.recentSearchesContainer}>
            <Text style={styles.recentSearchesTitle}>Buscas Recentes</Text>
            <View style={styles.recentSearchesList}>
              {recentSearches.map((item, index) => renderRecentSearch(item, index))}
            </View>
          </View>
        )}
      </View>
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
  searchContainer: {
    flexDirection: "row",
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.backgroundDark,
  },
  searchButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsList: {
    padding: SPACING.md,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  resultImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: SPACING.md,
  },
  resultImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  resultImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.xs,
  },
  resultSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: "center",
  },
  recentSearchesContainer: {
    padding: SPACING.md,
  },
  recentSearchesTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.md,
  },
  recentSearchesList: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  recentSearchIcon: {
    marginRight: SPACING.md,
  },
  recentSearchText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.backgroundDark,
  },
})
