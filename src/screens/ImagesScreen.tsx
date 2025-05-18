"use client"

import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import type { RootStackParamList } from "@/navigation/types"

type ImagesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>

interface CategoryItem {
  id: string
  title: string
  icon: string
  isPremium?: boolean
}

export const ImagesScreen: React.FC = () => {
  const navigation = useNavigation<ImagesScreenNavigationProp>()

  const categories: CategoryItem[] = [
    {
      id: "comidas",
      title: "Comidas",
      icon: "coffee",
    },
    {
      id: "animais",
      title: "Animais",
      icon: "home",
    },
    {
      id: "roupas",
      title: "Roupas",
      icon: "shopping-bag",
    },
    {
      id: "brinquedos",
      title: "Brinquedos",
      icon: "tool",
    },
    {
      id: "acoes",
      title: "Ações",
      icon: "activity",
    },
    {
      id: "familia",
      title: "Família",
      icon: "users",
    },
  ]

  const handleCategoryPress = (category: CategoryItem) => {
    navigation.navigate("CategoryDetail", {
      categoryId: category.id,
      categoryTitle: category.title,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Imagens e Sons</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(category)}
            >
              <View style={styles.categoryIconContainer}>
                <Feather name={category.icon as any} size={32} color={COLORS.blue} />
                {category.isPremium && (
                  <View style={styles.premiumBadge}>
                    <Feather name="star" size={12} color={COLORS.white} />
                  </View>
                )}
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>VER MAIS ( PREMIUM )</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.lg,
  },
  categoryItem: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: "center",
    ...SHADOWS.small,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(30, 136, 229, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    position: "relative",
  },
  premiumBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.yellow,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.backgroundDark,
    textAlign: "center",
  },
  premiumButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  premiumButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
})
