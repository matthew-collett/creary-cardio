import { useForm } from '@mantine/form'
import { IconSettings } from '@tabler/icons-react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import { Loader, PageTitle } from '@/components'
import { Button, Card, TextInput, Alert, TimePicker } from '@/components/core'
import { showSuccess } from '@/components/notifications'
import { useAuth } from '@/context'
import { useSettings } from '@/hooks'

const Settings = () => {
  const { user } = useAuth()
  const { settings, initialLoading, actionLoading, updateSettings } = useSettings()

  const form = useForm<{
    opening: string
    closing: string
    maxDuration: number
    advanceDays: number
  }>({
    initialValues: {
      opening: '',
      closing: '',
      maxDuration: 0,
      advanceDays: 0,
    },

    validate: {
      maxDuration: val =>
        !val ? 'Max duration is required' : val > 0 ? null : 'Cannot be negative',
      advanceDays: val =>
        !val ? 'Advance booking days is required' : val >= 0 ? null : 'Cannot be negative',
      opening: v => (v ? null : 'Opening is required'),
      closing: (v, vals) =>
        v ? (v > vals.opening ? null : 'Closing must be before opening') : 'Closing is required',
    },
  })

  const { setValues } = form

  useEffect(() => {
    if (settings) {
      setValues({
        opening: settings.openingTime,
        closing: settings.closingTime,
        maxDuration: settings.maxDurationMinutes,
        advanceDays: settings.advanceBookingDays,
      })
    }
  }, [settings, setValues])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleSubmit = form.onSubmit(
    async ({ opening, closing, maxDuration, advanceDays }): Promise<void> => {
      const { success, error } = await updateSettings({
        openingTime: opening,
        closingTime: closing,
        maxDurationMinutes: maxDuration,
        advanceBookingDays: advanceDays,
      })

      if (!success) {
        form.setErrors({ form: error })
        return
      }

      showSuccess('Settings updated!')
    },
  )

  return (
    <>
      <PageTitle icon={IconSettings} title="Calendar Settings" />
      <Card className="bg-white">
        <div className="min-h-[315px] flex items-center justify-center">
          {initialLoading ? (
            <Loader />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <TimePicker
                disabled={!user.isAdmin}
                withAsterisk
                label="Opening"
                {...form.getInputProps(`opening`)}
              />
              <TimePicker
                disabled={!user.isAdmin}
                withAsterisk
                label="Closing"
                {...form.getInputProps(`closing`)}
              />
              <TextInput
                disabled={!user.isAdmin}
                withAsterisk
                label="Maximum Duration (minutes)"
                placeholder="120"
                {...form.getInputProps('maxDuration')}
              />
              <TextInput
                disabled={!user.isAdmin}
                withAsterisk
                label="Advance Booking Days"
                placeholder="7"
                {...form.getInputProps('advanceDays')}
              />
              {form.errors.form && <Alert error>{form.errors.form}</Alert>}
              <Button
                className="disabled:!bg-primary-light disabled:!text-white"
                disabled={!user.isAdmin}
                type="submit"
                loading={actionLoading}
              >
                Save Settings
              </Button>
            </form>
          )}
        </div>
      </Card>
    </>
  )
}

export default Settings
