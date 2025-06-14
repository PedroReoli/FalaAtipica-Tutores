"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation()
  const { profile, refreshProfile } = useAuth()

  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [imageUri, setImageUri] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
      setEmail(profile.email || "")
      setPhone(profile.phone || "")
      setAvatarUrl(profile.avatar_url)
    }
  }, [profile])

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Erro", "O nome completo é obrigatório")
      return
    }

    setLoading(true)
    try {
      // Primeiro, faz o upload da imagem se houver uma nova
      let newAvatarUrl = avatarUrl
      if (imageUri && profile?.id) {
        const result = await storageService.updateProfilePhoto(profile.id, imageUri)
        if (result.error) {
          throw new Error(result.error)
        }
        if (result.url) {
          newAvatarUrl = result.url
        }
      }

      // Atualiza os dados do perfil
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile?.id)

      if (error) throw error

      // Atualiza o email se ele foi alterado
      if (email !== profile?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        })

        if (emailError) {
          Alert.alert(
            "Aviso",
            "Seus dados foram salvos, mas não foi possível atualizar o email. Verifique se o email é válido.",
          )
        }
      }

      // Atualiza o contexto de autenticação
      await refreshProfile()

      Alert.alert("Sucesso", "Perfil atualizado com sucesso", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      Alert.alert("Erro", "Não foi possível atualizar o perfil. Tente novamente.")
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
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <ImageUploader
              imageUrl={imageUri || avatarUrl}
              onImageSelected={handleImageSelected}
              size={120}
              title="Toque para alterar a foto"
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
                placeholder="Seu nome completo"
                placeholderTextColor={COLORS.gray}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="(00) 00000-0000"
                placeholderTextColor={COLORS.gray}
                keyboardType="phone-pad"
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
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
