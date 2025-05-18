"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { NativeStackNavigationProp, RouteProp } from "@react-navigation/native-stack"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import type { RootStackParamList } from "@/navigation/types"
import { Feather } from "@expo/vector-icons"
import { storageService } from "@/services/storageService"
import { ImageUploader } from "@/components/ImageUploader"

type AddCategoryItemScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "AddCategoryItem">
type AddCategoryItemScreenRouteProp = RouteProp<RootStackParamList, "AddCategoryItem">

export const AddCategoryItemScreen: React.FC = () => {
  const navigation = useNavigation<AddCategoryItemScreenNavigationProp>()
  const route = useRoute<AddCategoryItemScreenRouteProp>()
  const { categoryId, categoryTitle } = route.params

  const [itemName, setItemName] = useState("")
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSaveItem = async () => {
    if (!itemName.trim()) {
      Alert.alert("Erro", "Por favor, informe um nome para o item")
      return
    }

    if (!imageBase64) {
      Alert.alert("Erro", "Por favor, selecione ou tire uma foto para o item")
      return
    }

    setLoading(true)
    try {
      const result = await storageService.uploadCategoryImage(categoryId, itemName, imageBase64)

      if (result.error) {
        Alert.alert("Erro", result.error)
      } else {
        // Aqui você faria uma chamada para o Supabase para salvar o item no banco de dados
        // com a URL da imagem retornada em result.url

        Alert.alert("Sucesso", "Item adicionado com sucesso", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ])
      }
    } catch (error) {
      console.error("Erro ao salvar item:", error)
      Alert.alert("Erro", "Não foi possível salvar o item")
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelected = (base64Image: string) => {
    setImageBase64(base64Image)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar à {categoryTitle}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Informações do Item</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Ex: Mamãe, Papai, Irmão..."
            placeholderTextColor={COLORS.gray}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Imagem</Text>
          <View style={styles.imageUploaderContainer}>
            <ImageUploader
              imageUrl={imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null}
              onImageSelected={handleImageSelected}
              size={150}
              showOptions={true}
              title="Toque para selecionar ou tirar uma foto"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, (loading || !itemName || !imageBase64) && styles.saveButtonDisabled]}
          onPress={handleSaveItem}
          disabled={loading || !itemName || !imageBase64}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <>
              <Feather name="save" size={20} color={COLORS.white} />
              <Text style={styles.saveButtonText}>Salvar Item</Text>
            </>
          )}
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
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.lg,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.backgroundDark,
  },
  imageUploaderContainer: {
    alignItems: "center",
    marginTop: SPACING.md,
  },
  saveButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xl,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    marginLeft: SPACING.sm,
  },
})
