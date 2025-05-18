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
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"
import { favoritesService, type FavoriteItem } from "@/services/favoritesService"

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation()
  const { profile } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  useEffect(() => {
    if (profile?.id) {
      fetchFavorites()
    }
  }, [profile])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const data = await favoritesService.getFavorites(profile?.id || "")
      setFavorites(data)
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error)
      Alert.alert("Erro", "Não foi possível carregar seus favoritos")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (favoriteId: string) => {
    Alert.alert(
      "Remover dos Favoritos",
      "Tem certeza que deseja remover este item dos favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await favoritesService.removeFavorite(favoriteId)
              if (result.success) {
                // Atualizar a lista localmente
                setFavorites((prev) => prev.filter((item) => item.id !== favoriteId))
              } else {
                Alert.alert("Erro", result.error || "Não foi possível remover dos favoritos")
              }
            } catch (error) {
              console.error("Erro ao remover favorito:", error)
              Alert.alert("Erro", "Não foi possível remover dos favoritos")
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  const handleItemPress = (item: FavoriteItem) => {
    switch (item.type) {
      case "game":
        navigation.navigate("GameProgress", { gameId: item.id, gameName: item.title, childId: "all" })
        break
      case "category":
        navigation.navigate("CategoryDetail", { categoryId: item.id, categoryTitle: item.title })
        break
      case "image":
        // Navegar para detalhes da imagem
        break
      case "article":
        // Abrir artigo
        break
      case "book":
        // Abrir livro
        break
    }
  }

  const filters = [
    { id: "all", label: "Todos", icon: "grid" },
    { id: "game", label: "Jogos", icon: "play" },
    { id: "category", label: "Categorias", icon: "folder" },
    { id: "image", label: "Imagens", icon: "image" },
    { id: "article", label: "Artigos", icon: "file-text" },
    { id: "book", label: "Livros", icon: "book" },
  ]

  const filteredFavorites = activeFilter === "all" ? favorites : favorites.filter((item) => item.type === activeFilter)

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

  const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity style={styles.favoriteItem} onPress={() => handleItemPress(item)}>
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteImageContainer}>
          {item.thumbnail_url ? (
            <Image source={{ uri: item.thumbnail_url }} style={styles.favoriteImage} />
          ) : (
            <View style={styles.favoriteImagePlaceholder}>
              <Feather
                name={
                  item.type === "game"
                    ? "play"
                    : item.type === "category"
                      ? "folder"
                      : item.type === "image"
                        ? "image"
                        : item.type === "article"
                          ? "file-text"
                          : "book"
                }
                size={24}
                color={COLORS.gray}
              />
            </View>
          )}
        </View>
        <View style={styles.favoriteInfo}>
          <Text style={styles.favoriteTitle}>{item.title}</Text>
          {item.description && <Text style={styles.favoriteDescription}>{item.description}</Text>}
          <View style={styles.favoriteTypeContainer}>
            <Text style={styles.favoriteType}>
              {item.type === "game"
                ? "Jogo"
                : item.type === "category"
                  ? "Categoria"
                  : item.type === "image"
                    ? "Imagem"
                    : item.type === "article"
                      ? "Artigo"
                      : "Livro"}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFavorite(item.id)}>
        <Feather name="trash-2" size={20} color={COLORS.red} />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
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
      ) : filteredFavorites.length > 0 ? (
        <FlatList
          data={filteredFavorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.favoritesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={50} color={COLORS.gray} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>
            {activeFilter === "all"
              ? "Você ainda não tem favoritos"
              : `Você ainda não tem ${
                  activeFilter === "game"
                    ? "jogos"
                    : activeFilter === "category"
                      ? "categorias"
                      : activeFilter === "image"
                        ? "imagens"
                        : activeFilter === "article"
                          ? "artigos"
                          : "livros"
                } favoritos`}
          </Text>
          <Text style={styles.emptySubtext}>Adicione itens aos favoritos para acessá-los rapidamente mais tarde</Text>
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
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
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
  favoritesList: {
    padding: SPACING.md,
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  favoriteContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteImageContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    marginRight: SPACING.md,
  },
  favoriteImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favoriteImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.xs,
  },
  favoriteDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  favoriteTypeContainer: {
    backgroundColor: COLORS.backgroundLight,
    paddingVertical: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: "flex-start",
  },
  favoriteType: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.backgroundDark,
  },
  removeButton: {
    padding: SPACING.sm,
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
