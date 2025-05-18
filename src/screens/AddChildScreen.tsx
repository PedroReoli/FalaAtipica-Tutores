"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import { Feather } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/services/supabase"
import { ImageUploader } from "@/components/ImageUploader"
import { storageService } from "@/services/storageService"

export const AddChildScreen: React.FC = () => {
  const navigation = useNavigation()
  const { profile } = useAuth()

  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [notes, setNotes] = useState("")
  const [imageUri, setImageUri] = useState<string | null>(null)

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Erro", "O nome da criança é obrigatório")
      return
    }

    if (!profile?.tutor?.profile_id) {
      Alert.alert("Erro", "Perfil de tutor não encontrado")
      return
    }

    setLoading(true)
    try {
      // Criar um novo perfil para a criança
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            user_id: null, // Crianças não têm usuário associado
            full_name: fullName,
            user_type: "child",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()

      if (profileError) throw profileError
      if (!profileData || profileData.length === 0) throw new Error("Falha ao criar perfil")

      const childProfileId = profileData[0].id

      // Fazer upload da imagem se houver
      if (imageUri) {
        const result = await storageService.updateChildPhoto(childProfileId, imageUri)
        if (result.error) {
          console.error("Erro ao fazer upload da imagem:", result.error)
        } else if (result.url) {
          // Atualizar o perfil com a URL da imagem
          await supabase.from("profiles").update({ avatar_url: result.url }).eq("id", childProfileId)
        }
      }

      // Criar registro da criança
      const { error: childError } = await supabase.from("children").insert([
        {
          profile_id: childProfileId,
          birth_date: birthDate || null,
          diagnosis: diagnosis || null,
          notes: notes || null,
          active: true,
        },
      ])

      if (childError) throw childError

      // Associar a criança ao tutor
      const { error: relationError } = await supabase.from("tutor_children").insert([
        {
          tutor_id: profile.tutor.profile_id,
          child_id: childProfileId,
          relationship: "Tutor",
          is_primary: true,
          created_at: new Date().toISOString(),
        },
      ])

      if (relationError) throw relationError

      Alert.alert("Sucesso", "Criança adicionada com sucesso", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      console.error("Erro ao adicionar criança:", error)
      Alert.alert("Erro", "Não foi possível adicionar a criança. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelected = (uri: string) => {
    setImageUri(uri)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adicionar Criança</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <ImageUploader
              imageUrl={imageUri}
              onImageSelected={handleImageSelected}
              size={120}
              title="Toque para adicionar uma foto"
            />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nome da criança"
                placeholderTextColor={COLORS.gray}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Diagnóstico</Text>
              <TextInput
                style={styles.input}
                value={diagnosis}
                onChangeText={setDiagnosis}
                placeholder="Ex: TEA, TDAH, etc."
                placeholderTextColor={COLORS.gray}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <TextInput
                style={styles.input}
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Informações adicionais sobre a criança..."
                placeholderTextColor={COLORS.gray}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Adicionar Criança</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  imageContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  form: {
    width: "100%",
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
  textArea: {
    height: 100,
  },
  saveButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.md,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
})
