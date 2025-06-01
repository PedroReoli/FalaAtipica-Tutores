// src/components/ImageUploader.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { storageService } from "@/services/storageService"
import { allowsEditing } from "@/utils/constants"

interface ImageUploaderProps {
  imageUrl: string | null
  onImageSelected: (uri: string) => void
  onUploadComplete?: (url: string | null) => void
  size?: number
  showOptions?: boolean
  title?: string
  shape?: "circle" | "square"
  allowEditing?: boolean // Corrigido: renomeado de allowEditingProp para allowEditing
  aspect?: [number, number]
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onImageSelected,
  onUploadComplete,
  size = 100,
  showOptions = true,
  title,
  shape = "circle",
  allowEditing = allowsEditing, // Corrigido: renomeado para corresponder à prop
  aspect = [1, 1],
}) => {
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleSelectImage = async () => {
    if (loading) return

    if (showOptions) {
      Alert.alert(
        "Selecionar imagem",
        "Escolha uma opção",
        [
          {
            text: "Câmera",
            onPress: () => takePhoto(),
          },
          {
            text: "Galeria",
            onPress: () => pickImage(),
          },
          {
            text: "Cancelar",
            style: "cancel",
          },
        ],
        { cancelable: true },
      )
    } else {
      pickImage()
    }
  }

  const pickImage = async () => {
    try {
      setLoading(true)
      const result = await storageService.pickImage({
        allowsEditing: allowEditing, // Corrigido: usando a prop correta
        aspect,
        quality: 0.7,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0]
        onImageSelected(asset.uri)
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar a imagem")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const takePhoto = async () => {
    try {
      setLoading(true)
      const result = await storageService.takePhoto({
        allowsEditing: allowEditing, // Corrigido: usando a prop correta
        aspect,
        quality: 0.7,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0]
        onImageSelected(asset.uri)
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível tirar a foto")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const borderRadius = shape === "circle" ? size / 2 : BORDER_RADIUS.md

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TouchableOpacity
        style={[styles.imageContainer, { width: size, height: size, borderRadius }]}
        onPress={handleSelectImage}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.blue} />
            {uploadProgress > 0 && <Text style={styles.progressText}>{Math.round(uploadProgress * 100)}%</Text>}
          </View>
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={[styles.image, { borderRadius }]} />
        ) : (
          <View style={[styles.placeholder, { borderRadius }]}>
            <Feather name="camera" size={size / 3} color={COLORS.gray} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  imageContainer: {
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    color: COLORS.blue,
  },
})
