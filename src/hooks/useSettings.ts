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
      const { success, data } = await settingsService.getSettings()
      if (success) {
        setSettings(data)
      }
      setInitialLoading(false)
    }

    fetchSettings()
  }, [])

  const updateSettings = async (settings: UpdatedResource<Settings>) => {
    setActionLoading(true)
    const response = await settingsService.updateSettings(settings)
    if (response.success) {
      setSettings(response.data)
    }
    setActionLoading(false)
    return response
  }

  return {
    settings,
    initialLoading,
    actionLoading,
    updateSettings,
  }
}
