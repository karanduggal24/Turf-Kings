import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthState, AUTH_STORE_CONFIG } from '@/app/constants/auth-types'

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        loading: false,
        error: null,

        // Actions
        setUser: (user) => set({ user }, false, 'setUser'),
        
        setLoading: (loading) => set({ loading }, false, 'setLoading'),
        
        setError: (error) => set({ error }, false, 'setError'),

        signUp: async (email: string, password: string, fullName?: string) => {
          set({ loading: true, error: null }, false, 'signUp/start')
          
          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName,
                },
              },
            })

            if (error) {
              set({ error: error.message, loading: false }, false, 'signUp/error')
            } else {
              set({ loading: false }, false, 'signUp/success')
            }

            return { data, error }
          } catch (error) {
            const errorMessage = 'An unexpected error occurred during sign up'
            set({ error: errorMessage, loading: false }, false, 'signUp/catch')
            return { data: null, error: error as AuthError }
          }
        },

        signIn: async (email: string, password: string) => {
          set({ loading: true, error: null }, false, 'signIn/start')
          
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            })

            if (error) {
              set({ error: error.message, loading: false }, false, 'signIn/error')
            } else {
              set({ user: data.user, loading: false }, false, 'signIn/success')
            }

            return { data, error }
          } catch (error) {
            const errorMessage = 'An unexpected error occurred during sign in'
            set({ error: errorMessage, loading: false }, false, 'signIn/catch')
            return { data: null, error: error as AuthError }
          }
        },

        signOut: async () => {
          set({ loading: true, error: null }, false, 'signOut/start')
          
          try {
            const { error } = await supabase.auth.signOut()
            
            if (error) {
              set({ error: error.message, loading: false }, false, 'signOut/error')
            } else {
              set({ user: null, loading: false }, false, 'signOut/success')
            }

            return { error }
          } catch (error) {
            const errorMessage = 'An unexpected error occurred during sign out'
            set({ error: errorMessage, loading: false }, false, 'signOut/catch')
            return { error: error as AuthError }
          }
        },

        resetPassword: async (email: string) => {
          set({ loading: true, error: null }, false, 'resetPassword/start')
          
          try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) {
              set({ error: error.message, loading: false }, false, 'resetPassword/error')
            } else {
              set({ loading: false }, false, 'resetPassword/success')
            }

            return { data, error }
          } catch (error) {
            const errorMessage = 'An unexpected error occurred during password reset'
            set({ error: errorMessage, loading: false }, false, 'resetPassword/catch')
            return { data: null, error: error as AuthError }
          }
        },

        initialize: async () => {
          const currentUser = useAuthStore.getState().user
          if (!currentUser) {
            set({ loading: true }, false, 'initialize/start')
          }
          
          try {
            // Get initial session
            const { data: { session } } = await supabase.auth.getSession()
            
            const newUser = session?.user ?? null
            if (JSON.stringify(currentUser) !== JSON.stringify(newUser)) {
              set({ user: newUser }, false, 'initialize/session')
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (event, session) => {
              const user = session?.user ?? null
              set({ user, loading: false }, false, `authStateChange/${event}`)
            })

            set({ loading: false }, false, 'initialize/complete')
          } catch (error) {
            console.error('Error initializing auth:', error)
            set({ 
              error: 'Failed to initialize authentication', 
              loading: false 
            }, false, 'initialize/error')
          }
        },
      }),
      {
        name: AUTH_STORE_CONFIG.persistName,
        partialize: (state) => ({ 
          user: state.user 
        }),
      }
    ),
    {
      name: AUTH_STORE_CONFIG.devtoolsName,
    }
  )
)
