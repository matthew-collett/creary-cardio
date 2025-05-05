import { useState, useEffect } from 'react'

import { handleError } from '@/lib'
import { settingsService } from '@/lib/services'
import { Settings } from '@/types'

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [initialLoading, setInitialLoading] = useState<boolean>(true)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setInitialLoading(true)
        setError(null)
        const settings = await settingsService.getSettings()
        setSettings(settings)
      } catch (error) {
        setError(handleError(error))
      } finally {
        setInitialLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const updateSettings = async (newSettings: Partial<Omit<Settings, 'updatedAt'>>) => {
    try {
      setActionLoading(true)
      setError(null)
      const updatedSettings = await settingsService.updateSettings(newSettings)
      setSettings(updatedSettings)
      return updatedSettings
    } catch (error) {
      setError(handleError(error))
    } finally {
      setActionLoading(false)
    }
  }

  return {
    settings,
    initialLoading,
    actionLoading,
    error,
    updateSettings,
  }
}
