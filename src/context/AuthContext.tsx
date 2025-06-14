"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { supabase } from "../services/supabase"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Database } from "../types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type Tutor = Database["public"]["Tables"]["tutors"]["Row"]

// Definindo o tipo Professional manualmente já que não está no tipo Database
type Professional = {
  profile_id: string
  specialty?: string | null
  license_number?: string | null
  active?: boolean
  is_admin?: boolean
}

type UserData = Profile & {
  tutor?: Tutor
  professional?: Professional
}

type AuthContextData = {
  user: UserData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

// Chaves para o AsyncStorage
const USER_STORAGE_KEY = "@FalaAtipica:user"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Testar conexão com banco ao iniciar
  useEffect(() => {
    async function testDatabaseConnection() {
      try {
        console.log("🔍 Testando conexão com banco de dados...")

        // Teste simples de conexão
        const { data, error } = await supabase.from("profiles").select("id, email, full_name, user_type").limit(5)

        if (error) {
          console.error("❌ Erro na conexão com banco:", error)
        } else {
          console.log("✅ Conexão com banco funcionando!")
          console.log("👥 Usuários encontrados no banco:", data || [])
        }
      } catch (error) {
        console.error("❌ Erro geral na conexão:", error)
      }
    }

    testDatabaseConnection()
    loadStoredUser()
  }, [])

  // Carregar usuário do AsyncStorage ao iniciar
  async function loadStoredUser() {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY)

      if (storedUser) {
        const userData = JSON.parse(storedUser) as UserData
        setUser(userData)

        // Verificar se os dados do usuário ainda são válidos
        fetchUserProfile(userData.id)
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error)
    } finally {
      setLoading(false)
    }
  }

  // Buscar perfil completo do usuário
  const fetchUserProfile = async (profileId: string): Promise<UserData | null> => {
    try {
      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single()

      if (profileError) throw profileError

      let userData: UserData = profileData

      if (profileData.user_type === "tutor") {
        // Buscar dados do tutor
        const { data: tutorData, error: tutorError } = await supabase
          .from("tutors")
          .select("*")
          .eq("profile_id", profileData.id)
          .single()

        if (!tutorError && tutorData) {
          userData = { ...profileData, tutor: tutorData }
        }
      } else if (profileData.user_type === "professional") {
        // Buscar dados do profissional
        const { data: professionalData, error: professionalError } = await supabase
          .from("professionals")
          .select("*")
          .eq("profile_id", profileData.id)
          .single()

        if (!professionalError && professionalData) {
          userData = { ...profileData, professional: professionalData }
        }
      }

      // Salvar no estado e no AsyncStorage
      setUser(userData)
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))

      return userData
    } catch (error) {
      console.error("Erro ao buscar perfil:", error)
      return null
    }
  }

  const refreshProfile = async (): Promise<void> => {
    if (user && user.id) {
      await fetchUserProfile(user.id)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log("🔐 Tentando login com:", email)
      setLoading(true)

      // Primeiro, fazer login com o Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password.trim()
      })

      if (authError) {
        console.log("❌ Erro na autenticação:", authError)
        setLoading(false)
        return { error: { message: "Email ou senha incorretos" } }
      }

      if (!authData.user) {
        console.log("❌ Usuário não encontrado")
        setLoading(false)
        return { error: { message: "Usuário não encontrado" } }
      }

      console.log("✅ Login bem-sucedido:", authData.user.email)

      // Buscar dados adicionais do usuário
      const userData = await fetchUserProfile(authData.user.id)

      if (!userData) {
        setLoading(false)
        return { error: { message: "Erro ao carregar dados do usuário" } }
      }

      setLoading(false)
      return { error: null }
    } catch (error) {
      console.error("❌ Erro geral no login:", error)
      setLoading(false)
      return { error: { message: "Erro ao fazer login" } }
    }
  }

  const signOut = async () => {
    await AsyncStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    try {
      // Verificar se o email existe
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.toLowerCase().trim())
        .single()

      if (error || !data) {
        return { error: { message: "Email não encontrado" } }
      }

      // Em um sistema real, aqui você enviaria um email com um link para redefinir a senha
      // Como estamos simplificando, apenas retornamos sucesso

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
