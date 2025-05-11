import { useState, useEffect } from 'react'

import { settingsService } from '@/lib/services'
import { Settings, UpdatedResource } from '@/types'

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      setInitialLoading(true)
      try {
        const { success, data } = await settingsService.getSettings()
        if (success) {
          setSettings(data)
        }
      } finally {
        setInitialLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const updateSettings = async (settings: UpdatedResource<Settings>) => {
    setActionLoading(true)
    try {
      const response = await settingsService.updateSettings(settings)
      if (response.success) {
        setSettings(response.data)
      }
      return response
    } finally {
      setActionLoading(false)
    }
  }

  return {
    settings,
    initialLoading,
    actionLoading,
    updateSettings,
  }
}
