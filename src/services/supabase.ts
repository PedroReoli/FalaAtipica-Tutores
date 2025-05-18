import "react-native-url-polyfill/auto"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"
import { AppState } from "react-native"
import type { Database } from "@/types/supabase"

// Substitua com suas credenciais do Supabase
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Mantém a sessão atualizada quando o app está em primeiro plano
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

// Funções auxiliares para operações comuns
export const supabaseService = {
  // Perfis
  async fetchProfile(userId: string) {
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

    if (error) throw error
    return data
  },

  async fetchTutorProfile(profileId: string) {
    const { data, error } = await supabase.from("tutors").select("*").eq("profile_id", profileId).single()

    if (error) throw error
    return data
  },

  // Crianças
  async fetchChildren(tutorProfileId: string) {
    const { data, error } = await supabase
      .from("tutor_children")
      .select(`
        child_id,
        relationship,
        is_primary,
        children:child_id (
          profile_id,
          birth_date,
          diagnosis,
          notes,
          active,
          profile:profile_id (
            id,
            full_name,
            avatar_url
          )
        )
      `)
      .eq("tutor_id", tutorProfileId)

    if (error) throw error
    return data
  },

  async fetchChildDetails(childId: string) {
    const { data, error } = await supabase
      .from("children")
      .select(`
        profile_id,
        birth_date,
        diagnosis,
        notes,
        active,
        profile:profile_id (
          id,
          full_name,
          avatar_url,
          email,
          phone
        )
      `)
      .eq("profile_id", childId)
      .single()

    if (error) throw error
    return data
  },

  // Categorias
  async fetchCategories() {
    const { data, error } = await supabase.from("game_categories").select("*").order("name")

    if (error) throw error
    return data
  },

  async fetchCategoryItems(categoryId: string) {
    const { data, error } = await supabase.from("games").select("*").eq("category_id", categoryId).order("name")

    if (error) throw error
    return data
  },

  // Progresso
  async fetchGameProgress(childId: string) {
    const { data, error } = await supabase
      .from("game_progress")
      .select(`
        id,
        level_reached,
        score,
        completed,
        last_played_at,
        total_time_played,
        game:game_id (
          id,
          name,
          description,
          difficulty_level,
          thumbnail_url
        )
      `)
      .eq("child_id", childId)

    if (error) throw error
    return data
  },

  async fetchAchievements(childId: string) {
    const { data, error } = await supabase
      .from("child_achievements")
      .select(`
        earned_at,
        achievement:achievement_id (
          id,
          name,
          description,
          icon_url,
          points,
          requirement_description
        )
      `)
      .eq("child_id", childId)

    if (error) throw error
    return data
  },

  async fetchAllAchievements() {
    const { data, error } = await supabase.from("achievements").select("*")

    if (error) throw error
    return data
  },

  // Solicitações de acesso
  async createAccessRequest(email: string, name: string, reason: string) {
    const { data, error } = await supabase.from("access_requests").insert([
      {
        email,
        name,
        reason,
        status: "pending",
      },
    ])

    if (error) throw error
    return data
  },

  // Redefinição de senha
  async completePasswordReset(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
    return true
  },
}
