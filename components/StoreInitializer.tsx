'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export default function StoreInitializer() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return null // This component doesn't render anything
}