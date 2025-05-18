"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from "@/styles/variables"
import type { RootStackParamList } from "@/navigation/types"
import { useAuth } from "@/context/AuthContext"
import { Feather } from "@expo/vector-icons"
import { supabaseService } from "@/services/supabase"

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>

interface ChildItem {
  id: string
  name: string
  diagnosis: string
  avatar_url: string | null
}

interface MenuOption {
  id: string
  title: string
  icon: string
  onPress: () => void
}

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>()
  const { profile, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [children, setChildren] = useState<ChildItem[]>([])
  const [loadingChildren, setLoadingChildren] = useState(true)

  useEffect(() => {
    fetchChildren()
  }, [profile])

  const fetchChildren = async () => {
    if (!profile?.tutor?.profile_id) {
      setLoadingChildren(false)
      return
    }

    try {
      setLoadingChildren(true)
      const childrenData = await supabaseService.fetchChildren(profile.tutor.profile_id)

      const formattedChildren = childrenData.map((item) => ({
        id: item.children.profile_id,
        name: item.children.profile.full_name,
        diagnosis: item.children.diagnosis || "Não especificado",
        avatar_url: item.children.profile.avatar_url,
      }))

      setChildren(formattedChildren)
    } catch (error) {
      console.error("Erro ao buscar crianças:", error)
    } finally {
      setLoadingChildren(false)
    }
  }

  const handleEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  const handleEditChild = (childId: string) => {
    navigation.navigate("EditChildProfile", { childId })
  }

  const handleAddChild = () => {
    navigation.navigate("AddChild")
  }

  const generalOptions: MenuOption[] = [
    {
      id: "edit_profile",
      title: "Editar Perfil",
      icon: "edit",
      onPress: handleEditProfile,
    },
    {
      id: "change_password",
      title: "Alterar Senha",
      icon: "key",
      onPress: () => navigation.navigate("ResetPassword"),
    },
    {
      id: "about",
      title: "Sobre o App",
      icon: "info",
      onPress: () =>
        Alert.alert(
          "Sobre o App",
          "FalaAtipica v1.0.0\n\nUm aplicativo para apoiar a comunicação de crianças autistas não verbais.",
        ),
    },
    {
      id: "terms",
      title: "Termos e Privacidade",
      icon: "file-text",
      onPress: () => navigation.navigate("Terms"),
    },
    {
      id: "subscription",
      title: "Minha Assinatura",
      icon: "credit-card",
      onPress: () => navigation.navigate("Subscription"),
    },
  ]

  const renderMenuOption = (option: MenuOption) => (
    <TouchableOpacity key={option.id} style={styles.menuOption} onPress={option.onPress}>
      <View style={styles.menuOptionContent}>
        <Feather name={option.icon as any} size={20} color={COLORS.backgroundDark} style={styles.menuOptionIcon} />
        <Text style={styles.menuOptionText}>{option.title}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  )

  const renderChildItem = (child: ChildItem) => (
    <View key={child.id} style={styles.childItem}>
      <View style={styles.childInfo}>
        <Image
          source={child.avatar_url ? { uri: child.avatar_url } : require("@assets/images/child-placeholder.png")}
          style={styles.childAvatar}
        />
        <View style={styles.childTextInfo}>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.childDiagnosis}>{child.diagnosis}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleEditChild(child.id)}>
        <Feather name="settings" size={24} color={COLORS.gray} />
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Feather name="edit-2" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <Image
            source={profile?.avatar_url ? { uri: profile.avatar_url } : require("@assets/images/user-placeholder.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{profile?.full_name || "[NOME DO USUÁRIO]"}</Text>
          <Text style={styles.profileEmail}>{profile?.email || "EMAIL DO USUÁRIO"}</Text>
          {profile?.phone && <Text style={styles.profilePhone}>{profile.phone}</Text>}
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações Gerais</Text>
          <View style={styles.menuContainer}>{generalOptions.map(renderMenuOption)}</View>
        </View>

        {/* Children */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Crianças</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddChild}>
              <Feather name="plus" size={20} color={COLORS.blue} />
            </TouchableOpacity>
          </View>

          {loadingChildren ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.blue} />
            </View>
          ) : children.length > 0 ? (
            <View style={styles.childrenContainer}>{children.map(renderChildItem)}</View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma criança cadastrada</Text>
              <TouchableOpacity style={styles.addChildButton} onPress={handleAddChild}>
                <Text style={styles.addChildButtonText}>Adicionar Criança</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Feather name="log-out" size={20} color={COLORS.red} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
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
  profileSection: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    position: "relative",
  },
  editProfileButton: {
    position: "absolute",
    top: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.blue,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.md,
  },
  profileName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.backgroundDark,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  profilePhone: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  section: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  addButton: {
    padding: SPACING.xs,
  },
  menuContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  menuOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuOptionIcon: {
    marginRight: SPACING.md,
  },
  menuOptionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.backgroundDark,
  },
  childrenContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
  },
  childItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  childTextInfo: {
    flex: 1,
  },
  childName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
    color: COLORS.backgroundDark,
  },
  childDiagnosis: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
  },
  loadingContainer: {
    padding: SPACING.lg,
    alignItems: "center",
  },
  emptyContainer: {
    padding: SPACING.lg,
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  addChildButton: {
    backgroundColor: COLORS.blue,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  addChildButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.xl,
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  logoutText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.red,
    fontWeight: "500",
  },
})
