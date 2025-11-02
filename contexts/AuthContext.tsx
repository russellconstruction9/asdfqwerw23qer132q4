import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { SubscriptionTier, TokenUsage, UserProfile } from '../types'

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  subscriptionTier: SubscriptionTier
  tokenUsage: TokenUsage
  loading: boolean
  signUp: (email: string, password: string, userData?: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  updateProfile: (profile: UserProfile) => Promise<void>
  updateTokenUsage: (tokensUsed: number) => Promise<void>
  refreshSubscription: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('Free')
  const [tokenUsage, setTokenUsage] = useState<TokenUsage>({
    used: 0,
    resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserData(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadUserData(session.user.id)
      } else {
        setUserProfile(null)
        setSubscriptionTier('Free')
        setTokenUsage({
          used: 0,
          resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        })
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (profile) {
        setUserProfile({
          name: profile.name || '',
          role: profile.role || '',
          children: profile.children || []
        })
      }

      // Load subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (subscription && subscription.status === 'active') {
        setSubscriptionTier(subscription.tier)
      } else {
        setSubscriptionTier('Free')
      }

      // Load token usage
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      
      const { data: tokenData } = await supabase
        .from('token_usage')
        .select('tokens_used')
        .eq('user_id', userId)
        .gte('used_at', startOfMonth.toISOString())
      
      const totalUsed = tokenData?.reduce((sum, record) => sum + record.tokens_used, 0) || 0
      
      setTokenUsage({
        used: totalUsed,
        resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
      })

    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData }
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const updateProfile = async (profile: UserProfile) => {
    if (!user) return

    const { error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email!,
        name: profile.name,
        role: profile.role,
        children: profile.children,
        updated_at: new Date().toISOString()
      })

    if (!error) {
      setUserProfile(profile)
    }
  }

  const updateTokenUsage = async (tokensUsed: number) => {
    if (!user) return

    setTokenUsage(prev => ({ ...prev, used: prev.used + tokensUsed }))
    
    // Track in database
    await supabase
      .from('token_usage')
      .insert({
        user_id: user.id,
        tokens_used: tokensUsed,
        used_at: new Date().toISOString()
      })
  }

  const refreshSubscription = async () => {
    if (!user) return
    
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (subscription && subscription.status === 'active') {
      setSubscriptionTier(subscription.tier)
    } else {
      setSubscriptionTier('Free')
    }
  }

  const value = {
    user,
    session,
    userProfile,
    subscriptionTier,
    tokenUsage,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateTokenUsage,
    refreshSubscription
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}