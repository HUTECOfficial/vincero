'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, getUserProfile, User as UserProfile } from './supabase'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (user) {
      try {
        const userProfile = await getUserProfile(user.id)
        setProfile(userProfile)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
  }

  useEffect(() => {
    // Handle hash fragments from Supabase auth (email confirmation, password reset)
    const handleAuthHash = async () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')
        const error = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')

        // Handle errors
        if (error) {
          console.error('Auth error:', error, errorDescription)
          // Clear hash and show error
          window.history.replaceState(null, '', window.location.pathname)
          return
        }

        // Handle successful auth callback
        if (accessToken && refreshToken) {
          try {
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            if (sessionError) {
              console.error('Error setting session:', sessionError)
            } else if (data.session) {
              setUser(data.session.user)
              // Clear hash from URL
              window.history.replaceState(null, '', window.location.pathname)
              
              // Dispatch custom event to notify components
              window.dispatchEvent(new CustomEvent('emailConfirmed', { 
                detail: { type, user: data.session.user } 
              }))
            }
          } catch (err) {
            console.error('Error processing auth callback:', err)
          }
        }
      }
    }

    handleAuthHash()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getUserProfile(session.user.id)
          .then(setProfile)
          .catch(async (error) => {
            console.error('Error fetching profile:', error)
            // If profile doesn't exist, create it
            if (error.code === 'PGRST116') {
              try {
                await supabase.from('users').insert({
                  id: session.user.id,
                  email: session.user.email || '',
                  full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
                  phone: session.user.user_metadata?.phone || '',
                })
                const newProfile = await getUserProfile(session.user.id)
                setProfile(newProfile)
              } catch (createError) {
                console.error('Error creating profile:', createError)
                setProfile(null)
              }
            }
          })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          try {
            const userProfile = await getUserProfile(session.user.id)
            setProfile(userProfile)
          } catch (error: any) {
            console.error('Error fetching profile:', error)
            // If profile doesn't exist, create it
            if (error.code === 'PGRST116') {
              try {
                await supabase.from('users').insert({
                  id: session.user.id,
                  email: session.user.email || '',
                  full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
                  phone: session.user.user_metadata?.phone || '',
                })
                const newProfile = await getUserProfile(session.user.id)
                setProfile(newProfile)
              } catch (createError) {
                console.error('Error creating profile:', createError)
                setProfile(null)
              }
            } else {
              setProfile(null)
            }
          }
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      // Check if it's an email not confirmed error
      if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
        throw new Error('Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.')
      }
      throw error
    }
    setUser(data.user)
  }

  const handleSignUp = async (email: string, password: string, fullName: string, phone: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}`
      }
    })
    
    if (error) throw error
    
    // Create user profile
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        phone: phone,
      })
      
      // Only set user if email confirmation is not required
      // If confirmation is required, user will be null until they confirm
      if (data.session) {
        setUser(data.user)
      }
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
