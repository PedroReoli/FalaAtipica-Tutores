export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          avatar_url: string | null
          user_type: "child" | "tutor" | "professional"
          email: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          avatar_url?: string | null
          user_type: "child" | "tutor" | "professional"
          email?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          avatar_url?: string | null
          user_type?: "child" | "tutor" | "professional"
          email?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tutors: {
        Row: {
          profile_id: string
          relationship_type: string | null
          active: boolean
        }
        Insert: {
          profile_id: string
          relationship_type?: string | null
          active?: boolean
        }
        Update: {
          profile_id?: string
          relationship_type?: string | null
          active?: boolean
        }
      }
      children: {
        Row: {
          profile_id: string
          birth_date: string | null
          diagnosis: string | null
          notes: string | null
          active: boolean
        }
        Insert: {
          profile_id: string
          birth_date?: string | null
          diagnosis?: string | null
          notes?: string | null
          active?: boolean
        }
        Update: {
          profile_id?: string
          birth_date?: string | null
          diagnosis?: string | null
          notes?: string | null
          active?: boolean
        }
      }
      tutor_children: {
        Row: {
          tutor_id: string
          child_id: string
          relationship: string | null
          is_primary: boolean
          created_at: string
        }
        Insert: {
          tutor_id: string
          child_id: string
          relationship?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          tutor_id?: string
          child_id?: string
          relationship?: string | null
          is_primary?: boolean
          created_at?: string
        }
      }
      game_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          icon_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color: string
          icon_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          icon_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      games: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          difficulty_level: number | null
          thumbnail_url: string | null
          instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description?: string | null
          difficulty_level?: number | null
          thumbnail_url?: string | null
          instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          difficulty_level?: number | null
          thumbnail_url?: string | null
          instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      game_progress: {
        Row: {
          id: string
          child_id: string
          game_id: string
          level_reached: number
          score: number
          completed: boolean
          last_played_at: string
          total_time_played: number
        }
        Insert: {
          id?: string
          child_id: string
          game_id: string
          level_reached?: number
          score?: number
          completed?: boolean
          last_played_at?: string
          total_time_played?: number
        }
        Update: {
          id?: string
          child_id?: string
          game_id?: string
          level_reached?: number
          score?: number
          completed?: boolean
          last_played_at?: string
          total_time_played?: number
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_url: string
          points: number
          game_id: string | null
          requirement_description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_url: string
          points?: number
          game_id?: string | null
          requirement_description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_url?: string
          points?: number
          game_id?: string | null
          requirement_description?: string | null
          created_at?: string
        }
      }
      child_achievements: {
        Row: {
          child_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          child_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          child_id?: string
          achievement_id?: string
          earned_at?: string
        }
      }
      access_requests: {
        Row: {
          id: string
          email: string
          name: string
          reason: string
          status: "pending" | "approved" | "rejected"
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          reason: string
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          reason?: string
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string | null
        }
      }
    }
  }
}
