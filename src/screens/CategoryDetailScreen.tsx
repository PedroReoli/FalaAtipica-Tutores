"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import type { RootStackParamList } from "@/navigation/types"

type CategoryDetailScreenRouteProp = RouteProp<RootStackParamList, "CategoryDetail">

interface CategoryItem {
  id: string
  title: string
  icon: string
  isPremium?: boolean
  imageUrl?: string
}

export const CategoryDetailScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<CategoryDetailScreenRouteProp>()
  const { categoryId, categoryTitle } = route.params

  const [items, setItems] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados
    const fetchItems = async () => {
      try {
        // Aqui você faria uma chamada para o Supabase para buscar os itens da categoria
        // Por enquanto, vamos usar dados mockados baseados na categoria
        let mockItems: CategoryItem[] = []

        switch (categoryId) {
          case "comidas":
            mockItems = [
              { id: "1", title: "água", icon: "droplet" },
              { id: "2", title: "suco", icon: "coffee" },
              { id: "3", title: "maçã", icon: "shopping-bag" },
              { id: "4", title: "banana", icon: "shopping-bag" },
              { id: "5", title: "pão", icon: "shopping-cart" },
              { id: "6", title: "arroz", icon: "package" },
              { id: "7", title: "feijão", icon: "package", isPremium: true },
              { id: "8", title: "carne", icon: "shopping-bag", isPremium: true },
            ]
            break
          case "animais":
            mockItems = [
              { id: "1", title: "cachorro", icon: "github" },
              { id: "2", title: "gato", icon: "github" },
              { id: "3", title: "pássaro", icon: "feather" },
              { id: "4", title: "peixe", icon: "anchor" },
              { id: "5", title: "coelho", icon: "github" },
              { id: "6", title: "tartaruga", icon: "shield" },
            ]
            break
          case "roupas":
            mockItems = [
              { id: "1", title: "camiseta", icon: "shopping-bag" },
              { id: "2", title: "calça", icon: "shopping-bag" },
              { id: "3", title: "vestido", icon: "shopping-bag" },
              { id: "4", title: "sapato", icon: "shopping-bag" },
              { id: "5", title: "chapéu", icon: "shopping-bag" },
              { id: "6", title: "meias", icon: "shopping-bag" },
            ]
            break
          case "familia":
            mockItems = [
              { id: "1", title: "Mamãe", icon: "user", imageUrl: "https://example.com/mamae.jpg" },
              { id: "2", title: "Papai", icon: "user", imageUrl: "https://example.com/papai.jpg" },
              { id: "3", title: "Irmão", icon: "user", imageUrl: "https://example.com/irmao.jpg" },
            ]
            break
          default:
            mockItems = [
              { id: "1", title: "Item 1", icon: "box" },
              { id: "2", title: "Item 2", icon: "box" },
              { id: "3", title: "Item 3", icon: "box" },
              { id: "4", title: "Item 4", icon: "box" },
              { id: "5", title: "Item 5", icon: "box" },
              { id: "6", title: "Item 6", icon: "box" },
            ]
        }

        setTimeout(() => {
          setItems(mockItems)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error("Erro ao carregar itens:", error)
        setLoading(false)
      }
    }

    fetchItems()
  }, [categoryId])

  const handleAddItem = () => {
    navigation.navigate("AddCategoryItem", { categoryId, categoryTitle })
  }

  const renderItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity style={[styles.itemCard, item.isPremium && styles.premiumItemCard]} disabled={item.isPremium}>
      <View style={styles.iconContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
        ) : (
          <Feather name={item.icon as any} size={32} color={COLORS.blue} />
        )}
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Feather name="lock" size={12} color={COLORS.white} />
          </View>
        )}
      </View>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  )

  const canAddCustomItems = categoryId === "familia"

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryTitle}</Text>
        {canAddCustomItems && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Feather name="plus" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
        {!canAddCustomItems && <View style={styles.headerRight} />}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.blue} />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <TouchableOpacity style={styles.viewMoreButton}>
              <Text style={styles.viewMoreButtonText}>VER MAIS</Text>
            </TouchableOpacity>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum item encontrado</Text>
            </View>
          }
        />
      )}

      {/* Add Custom Item Button (for Family category) */}
      {canAddCustomItems && (
        <TouchableOpacity style={styles.floatingAddButton} onPress={handleAddItem}>
          <Feather name="plus" size={24} color={COLORS.white} />
        </TouchableOpacity>
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
  addButton: {
    padding: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: SPACING.md,
  },
  itemCard: {
    flex: 1,
    margin: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    ...SHADOWS.small,
  },
  premiumItemCard: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(30, 136, 229, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
    position: "relative",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  premiumBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.backgroundDark,
    textAlign: "center",
  },
  viewMoreButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.xs,
  },
  viewMoreButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
  },
  floatingAddButton: {
    position: "absolute",
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.blue,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.medium,
  },
})
