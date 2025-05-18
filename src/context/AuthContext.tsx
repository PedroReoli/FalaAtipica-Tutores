"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { supabase, supabaseService } from "@/services/supabase"
import type { Session } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type Tutor = Database["public"]["Tables"]["tutors"]["Row"]

type AuthContextData = {
  session: Session | null
  profile: (Profile & { tutor?: Tutor }) | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  completePasswordReset: (newPassword: string) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<(Profile & { tutor?: Tutor }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await supabaseService.fetchProfile(userId)

      if (profileData.user_type === "tutor") {
        const tutorData = await supabaseService.fetchTutorProfile(profileData.id)
        setProfile({ ...profileData, tutor: tutorData })
      } else {
        setProfile(profileData)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (session?.user.id) {
      await fetchProfile(session.user.id)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "falaatipica://reset-password",
    })
    return { error }
  }

  const completePasswordReset = async (newPassword: string) => {
    try {
      await supabaseService.completePasswordReset(newPassword)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        signIn,
        signOut,
        resetPassword,
        completePasswordReset,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
