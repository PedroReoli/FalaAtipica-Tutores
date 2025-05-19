"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { supabase } from "@/services/supabase"

interface BookItem {
  id: string
  title: string
  author: string
  link: string
  cover_url?: string | null
  description?: string | null
}

interface InstagramPage {
  id: string
  name: string
  handle: string
  link: string
  image_url?: string | null
  description?: string | null
}

interface ArticleItem {
  id: string
  title: string
  summary: string
  link: string
  image_url?: string | null
  published_at: string
}

interface TipCategory {
  id: string
  name: string
  icon: string
}

export const TipsScreen: React.FC = () => {
  const navigation = useNavigation()

  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("books")
  const [books, setBooks] = useState<BookItem[]>([])
  const [instagramPages, setInstagramPages] = useState<InstagramPage[]>([])
  const [articles, setArticles] = useState<ArticleItem[]>([])

  useEffect(() => {
    fetchTipsData()
  }, [])

  const fetchTipsData = async () => {
    try {
      setLoading(true)

      // Buscar livros
      const { data: booksData, error: booksError } = await supabase.from("recommended_books").select("*").order("title")

      if (booksError) throw booksError
      setBooks(booksData || [])

      // Buscar páginas do Instagram
      const { data: instagramData, error: instagramError } = await supabase
        .from("instagram_pages")
        .select("*")
        .order("name")

      if (instagramError) throw instagramError
      setInstagramPages(instagramData || [])

      // Buscar artigos
      const { data: articlesData, error: articlesError } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false })

      if (articlesError) throw articlesError
      setArticles(articlesData || [])
    } catch (error) {
      console.error("Erro ao buscar dicas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenLink = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      } else {
        Alert.alert("Erro", "Não foi possível abrir este link")
      }
    })
  }

  const categories: TipCategory[] = [
    { id: "books", name: "Livros", icon: "book" },
    { id: "instagram", name: "Instagram", icon: "instagram" },
    { id: "articles", name: "Artigos", icon: "file-text" },
  ]

  const renderCategoryTab = (category: TipCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryTab, activeCategory === category.id && styles.categoryTabActive]}
      onPress={() => setActiveCategory(category.id)}
    >
      <Feather
        name={category.icon as any}
        size={20}
        color={activeCategory === category.id ? COLORS.blue : COLORS.gray}
      />
      <Text style={[styles.categoryTabText, activeCategory === category.id && styles.categoryTabTextActive]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  )

  const renderBookItem = ({ item }: { item: BookItem }) => (
    <TouchableOpacity style={styles.bookCard} onPress={() => handleOpenLink(item.link)}>
      <Image
        source={item.cover_url ? { uri: item.cover_url } : require("@assets/images/image-placeholder.svg")}
        style={styles.bookCover}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        {item.description && (
          <Text style={styles.bookDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )

  const renderInstagramItem = ({ item }: { item: InstagramPage }) => (
    <TouchableOpacity style={styles.instagramItem} onPress={() => handleOpenLink(item.link)}>
      <View style={styles.instagramHeader}>
        <View style={styles.instagramIconContainer}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.instagramIcon} />
          ) : (
            <Feather name="instagram" size={24} color="#FF9F43" />
          )}
        </View>
        <View style={styles.instagramInfo}>
          <Text style={styles.instagramName}>{item.name}</Text>
          <Text style={styles.instagramHandle}>{item.handle}</Text>
        </View>
      </View>
      {item.description && <Text style={styles.instagramDescription}>{item.description}</Text>}
    </TouchableOpacity>
  )

  const renderArticleItem = ({ item }: { item: ArticleItem }) => (
    <TouchableOpacity style={styles.articleItem} onPress={() => handleOpenLink(item.link)}>
      {item.image_url && <Image source={{ uri: item.image_url }} style={styles.articleImage} />}
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleSummary} numberOfLines={2}>
          {item.summary}
        </Text>
        <Text style={styles.articleDate}>{new Date(item.published_at).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.blue} />
        </View>
      )
    }

    switch (activeCategory) {
      case "books":
        return (
          <FlatList
            data={books}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum livro disponível</Text>
              </View>
            }
          />
        )
      case "instagram":
        return (
          <FlatList
            data={instagramPages}
            renderItem={renderInstagramItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma página do Instagram disponível</Text>
              </View>
            }
          />
        )
      case "articles":
        return (
          <FlatList
            data={articles}
            renderItem={renderArticleItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum artigo disponível</Text>
              </View>
            }
          />
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dicas</Text>
        <Image source={require("@assets/images/logo.svg")} style={styles.headerLogo} />
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>{categories.map(renderCategoryTab)}</View>

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>
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
  headerLogo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  categoryTabs: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  categoryTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },
  categoryTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.blue,
  },
  categoryTabText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  categoryTabTextActive: {
    color: COLORS.blue,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: SPACING.md,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
  },
  bookCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
  },
  bookInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  bookTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.xs,
  },
  bookAuthor: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
  },
  bookDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grayDark,
  },
  instagramItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  instagramHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  instagramIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 159, 67, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
    overflow: "hidden",
  },
  instagramIcon: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  instagramInfo: {
    flex: 1,
  },
  instagramName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.backgroundDark,
  },
  instagramHandle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  instagramDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grayDark,
  },
  articleItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: "hidden",
    ...SHADOWS.small,
  },
  articleImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  articleContent: {
    padding: SPACING.md,
  },
  articleTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.xs,
  },
  articleSummary: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.grayDark,
    marginBottom: SPACING.sm,
  },
  articleDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    alignSelf: "flex-end",
  },
})
