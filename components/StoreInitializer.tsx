'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { User } from '@supabase/supabase-js'

interface StoreInitializerProps {
  initialUser: User | null
}

export default function StoreInitializer({ initialUser }: StoreInitializerProps) {
  const hasInitialized = useRef(false)

  // Initialize store state BEFORE first render using useSyncExternalStore pattern
  if (!hasInitialized.current) {
    useAuthStore.setState({ 
      user: initialUser, 
      loading: false,
      error: null 
    })
    hasInitialized.current = true
  }

  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    // Initialize auth listener for future changes
    initialize()
  }, [initialize])

  return null // This component doesn't render anything
}