import { User, AuthError } from '@supabase/supabase-js'

// User Role Type
export type UserRole = 'user' | 'turf_owner' | 'admin'

// Extended User Type with Role
export interface UserWithRole extends User {
  role?: UserRole
}

// Auth Store State Interface
export interface AuthState {
  // State
  user: User | null
  loading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  signUp: (email: string, password: string, fullName?: string, phone?: string, location?: string) => Promise<{ data: any; error: AuthError | null }>
  signIn: (identifier: string, password: string) => Promise<{ data: any; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ data: any; error: AuthError | null }>
  initialize: () => Promise<void>
}

// Auth Store Configuration
export const AUTH_STORE_CONFIG = {
  persistName: 'auth-storage',
  devtoolsName: 'auth-store',
} as const