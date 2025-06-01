import { createClient } from "@supabase/supabase-js"

// Usar as variáveis de ambiente que já existem
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hajxzklpckalamtnwyez.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhanh6a2xwY2thbGFtdG53eWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1OTg4MjksImV4cCI6MjA2MzE3NDgyOX0.rG5uD-fyEUVrpLLYGWlJMVhuhHv1FwsKcPianDToKfg"

if (!supabaseUrl) {
  throw new Error("supabaseUrl is required")
}

if (!supabaseAnonKey) {
  throw new Error("supabaseAnonKey is required")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interfaces baseadas na estrutura real do banco
export interface Profile {
  id: string
  user_id: string
  full_name: string
  avatar_url?: string
  user_type: "tutor" | "child" | "professional"
  email?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Tutor {
  profile_id: string
  relationship_type?: string
  active: boolean
  profile: Profile
}

export interface Child {
  profile_id: string
  birth_date?: string
  diagnosis?: string
  notes?: string
  active: boolean
  profile: Profile
}

export interface Game {
  id: string
  category_id: string
  name: string
  description?: string
  difficulty_level?: number
  thumbnail_url?: string
  instructions?: string
  created_at: string
  updated_at: string
}

export interface GameProgress {
  id: string
  child_id: string
  game_id: string
  level_reached: number
  score: number
  completed: boolean
  last_played_at: string
  total_time_played: number
  game: Game
}

export interface Achievement {
  id: string
  name: string
  description?: string
  icon_url: string
  points: number
  game_id?: string
  requirement_description?: string
  created_at: string
}

export interface ChildAchievement {
  child_id: string
  achievement_id: string
  earned_at: string
  achievement: Achievement
}

export const supabaseService = {
  // Criar solicitação de acesso
  async createAccessRequest(email: string, name: string, reason: string) {
    try {
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
    } catch (error) {
      console.error("Erro ao criar solicitação de acesso:", error)
      throw error
    }
  },

  // Buscar crianças de um tutor
  async fetchChildren(tutorProfileId: string) {
    try {
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
              avatar_url,
              email
            )
          )
        `)
        .eq("tutor_id", tutorProfileId)

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erro ao buscar crianças:", error)
      throw error
    }
  },

  // Buscar detalhes de uma criança
  async fetchChildDetails(childProfileId: string) {
    try {
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
            email
          )
        `)
        .eq("profile_id", childProfileId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erro ao buscar detalhes da criança:", error)
      throw error
    }
  },

  // Buscar progresso dos jogos de uma criança
  async fetchGameProgress(childProfileId: string) {
    try {
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
            thumbnail_url,
            category_id
          )
        `)
        .eq("child_id", childProfileId)

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erro ao buscar progresso dos jogos:", error)
      throw error
    }
  },

  // Buscar conquistas de uma criança
  async fetchAchievements(childProfileId: string) {
    try {
      const { data, error } = await supabase
        .from("child_achievements")
        .select(`
          child_id,
          achievement_id,
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
        .eq("child_id", childProfileId)

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erro ao buscar conquistas:", error)
      throw error
    }
  },

  // Buscar todas as conquistas disponíveis
  async fetchAllAchievements() {
    try {
      const { data, error } = await supabase.from("achievements").select("*").order("name")

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erro ao buscar todas as conquistas:", error)
      throw error
    }
  },

  // Buscar categorias de jogos
  async fetchGameCategories() {
    try {
      const { data, error } = await supabase.from("game_categories").select("*").order("name")

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erro ao buscar categorias de jogos:", error)
      throw error
    }
  },

  // Buscar jogos por categoria
  async fetchGamesByCategory(categoryId: string) {
    try {
      const { data, error } = await supabase.from("games").select("*").eq("category_id", categoryId).order("name")

      if (error) throw error
      return data
    } catch (error) {
      console.error("Erro ao buscar jogos por categoria:", error)
      throw error
    }
  },

  // Testar conexão
  async testConnection() {
    try {
      console.log("Testando conexão com Supabase...")
      console.log("URL:", supabaseUrl)

      const { data, error } = await supabase.from("profiles").select("count").limit(1)

      if (error) {
        console.error("Erro na conexão:", error)
        return { success: false, error }
      }

      console.log("Conexão bem-sucedida!")
      return { success: true, data }
    } catch (error) {
      console.error("Erro ao testar conexão:", error)
      return { success: false, error }
    }
  },
}

// Manter os serviços existentes para compatibilidade
export interface BookItem {
  id: string
  title: string
  author: string
  link: string
  coverUrl?: string
}

export interface InstagramPage {
  id: string
  name: string
  handle: string
  link: string
  imageUrl?: string
}

export interface Reminder {
  id: string
  title: string
  content: string
  date?: string
}

export const tipsService = {
  async getRecommendedBooks(): Promise<BookItem[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      return [
        {
          id: "1",
          title: "Comunicação Alternativa",
          author: "Maria Silva",
          link: "https://example.com/book1",
          coverUrl: "https://example.com/covers/book1.jpg",
        },
        {
          id: "2",
          title: "Autismo e Educação",
          author: "João Santos",
          link: "https://example.com/book2",
          coverUrl: "https://example.com/covers/book2.jpg",
        },
        {
          id: "3",
          title: "Desenvolvimento Infantil",
          author: "Ana Oliveira",
          link: "https://example.com/book3",
          coverUrl: "https://example.com/covers/book3.jpg",
        },
        {
          id: "4",
          title: "Inclusão na Prática",
          author: "Carlos Mendes",
          link: "https://example.com/book4",
          coverUrl: "https://example.com/covers/book4.jpg",
        },
      ]
    } catch (error) {
      console.error("Erro ao buscar livros recomendados:", error)
      throw error
    }
  },

  async getInstagramPages(): Promise<InstagramPage[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      return [
        {
          id: "1",
          name: "Autismo em Foco",
          handle: "@autismoemfoco",
          link: "https://instagram.com/autismoemfoco",
          imageUrl: "https://example.com/instagram/autismoemfoco.jpg",
        },
        {
          id: "2",
          name: "Comunicação Inclusiva",
          handle: "@comunicacaoinclusiva",
          link: "https://instagram.com/comunicacaoinclusiva",
          imageUrl: "https://example.com/instagram/comunicacaoinclusiva.jpg",
        },
        {
          id: "3",
          name: "Desenvolvimento Atípico",
          handle: "@desenvolvimentoatipico",
          link: "https://instagram.com/desenvolvimentoatipico",
          imageUrl: "https://example.com/instagram/desenvolvimentoatipico.jpg",
        },
      ]
    } catch (error) {
      console.error("Erro ao buscar páginas do Instagram:", error)
      throw error
    }
  },

  async getReminders(): Promise<Reminder[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      return [
        {
          id: "1",
          title: "Lembrete",
          content: "Mantenha a consistência no uso do aplicativo para melhores resultados.",
          date: "2023-05-15",
        },
      ]
    } catch (error) {
      console.error("Erro ao buscar lembretes:", error)
      throw error
    }
  },
}
