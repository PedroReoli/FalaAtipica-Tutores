"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import { Feather } from "@expo/vector-icons"
import { COLORS } from "../styles/variables"
import { useAuth } from "../context/AuthContext"
import { favoritesService } from "../services/favoritesService"

interface FavoriteButtonProps {
  itemId: string
  itemType: "game" | "category" | "image" | "article" | "book"
  size?: number
  style?: any
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ itemId, itemType, size = 24, style }) => {
  const { profile } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkFavoriteStatus()
  }, [itemId, itemType, profile])

  const checkFavoriteStatus = async () => {
    if (!profile?.id) {
      setLoading(false)
      return
    }

    try {
      const result = await favoritesService.checkIsFavorite(profile.id, itemId, itemType)
      setIsFavorite(result.isFavorite)
      setFavoriteId(result.favoriteId)
    } catch (error) {
      console.error("Erro ao verificar status de favorito:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!profile?.id || loading) return

    setLoading(true)
    try {
      if (isFavorite && favoriteId) {
        // Remover dos favoritos
        const result = await favoritesService.removeFavorite(favoriteId)
        if (result.success) {
          setIsFavorite(false)
          setFavoriteId(null)
        }
      } else {
        // Adicionar aos favoritos
        const result = await favoritesService.addFavorite(profile.id, itemId, itemType)
        if (result.success) {
          // Buscar o ID do favorito recém-criado
          await checkFavoriteStatus()
        }
      }
    } catch (error) {
      console.error("Erro ao alternar favorito:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={toggleFavorite} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.blue} />
      ) : (
        <Feather name={isFavorite ? "heart" : "heart"} size={size} color={isFavorite ? COLORS.red : COLORS.gray} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
})
