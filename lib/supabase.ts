import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email: string, password: string, userData?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Subscription helpers
export const getSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const updateSubscription = async (userId: string, subscriptionData: any) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({ user_id: userId, ...subscriptionData })
  
  return { data, error }
}

// Usage tracking
export const trackTokenUsage = async (userId: string, tokensUsed: number) => {
  const { data, error } = await supabase
    .from('token_usage')
    .insert({
      user_id: userId,
      tokens_used: tokensUsed,
      used_at: new Date().toISOString()
    })
  
  return { data, error }
}

export const getUserTokenUsage = async (userId: string) => {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const { data, error } = await supabase
    .from('token_usage')
    .select('tokens_used')
    .eq('user_id', userId)
    .gte('used_at', startOfMonth.toISOString())
  
  const totalUsed = data?.reduce((sum, record) => sum + record.tokens_used, 0) || 0
  
  return { totalUsed, error }
}