import { useForm } from '@mantine/form'
import { IconSettings } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { Loader, PageTitle } from '@/components'
import { Button, Alert, Card, TextInput, Select } from '@/components/core'
import { useAuth } from '@/context'
import { useSettings } from '@/hooks'
import { formatTime12, formatTime24, Time12, timeToMinutes } from '@/lib'

const timeRegex = /^([1-9]|1[0-2]):[0-5]\d$/

const Settings = () => {
  const { user } = useAuth()
  const { settings, initialLoading, actionLoading, error, updateSettings } = useSettings()
  const [saved, setSaved] = useState(false)

  const form = useForm<{
    opening: Time12
    closing: Time12
    maxDuration: number
    advanceDays: number
  }>({
    initialValues: {
      opening: { time: '', period: 'AM' },
      closing: { time: '', period: 'PM' },
      maxDuration: settings?.maxDurationMinutes ?? 0,
      advanceDays: settings?.advanceBookingDays ?? 0,
    },

    validate: {
      opening: {
        time: val =>
          !val ? 'Opening time is required' : timeRegex.test(val) ? null : 'Invalid (e.g. 9:00)',
        period: val => (val ? null : 'Required'),
      },
      closing: {
        time: val =>
          !val ? 'Closing time is required' : timeRegex.test(val) ? null : 'Invalid (e.g. 5:00)',
        period: val => (val ? null : 'Required'),
      },
      maxDuration: val => (!val ? 'Max duration is required' : val > 0 ? null : 'Must be > 0'),
      advanceDays: val =>
        !val ? 'Advance booking days is required' : val >= 0 ? null : 'Cannot be negative',
    },
  })

  const { setValues, getInputProps, onSubmit, setErrors } = form

  useEffect(() => {
    if (settings) {
      setValues({
        opening: formatTime12(settings.openingTime),
        closing: formatTime12(settings.closingTime),
        maxDuration: settings.maxDurationMinutes,
        advanceDays: settings.advanceBookingDays,
      })
    }
  }, [settings, setValues])

  if (!user) return <Navigate to="/login" replace />

  const handleSubmit = onSubmit(async values => {
    const openMin = timeToMinutes(
      formatTime24({ time: values.opening.time, period: values.opening.period }),
    )
    const closeMin = timeToMinutes(
      formatTime24({ time: values.closing.time, period: values.closing.period }),
    )
    if (closeMin <= openMin) {
      setErrors({
        closing: 'Must be after opening time',
      })
      return
    }

    const ok = await updateSettings({
      openingTime: formatTime24({ time: values.opening.time, period: values.opening.period }),
      closingTime: formatTime24({ time: values.closing.time, period: values.closing.period }),
      maxDurationMinutes: values.maxDuration,
      advanceBookingDays: values.advanceDays,
    })

    if (ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  })

  return (
    <>
      <PageTitle icon={<IconSettings size="1.25em" />} title="Calendar Settings" />
      <Card className="bg-white">
        {error && <Alert error>{error}</Alert>}
        {saved && <Alert>Settings saved!</Alert>}
        <div className="min-h-[315px] flex items-center justify-center">
          {initialLoading ? (
            <Loader />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              {(['opening', 'closing'] as const).map(field => (
                <div key={field} className="flex items-center gap-1">
                  <TextInput
                    withAsterisk
                    label={field === 'opening' ? 'Opening Time' : 'Closing Time'}
                    placeholder={field === 'opening' ? '7:00' : '9:00'}
                    className="flex-1"
                    {...getInputProps(`${field}.time`)}
                  />
                  <Select
                    withAsterisk
                    className="mt-6 w-20"
                    data={[
                      { value: 'AM', label: 'AM' },
                      { value: 'PM', label: 'PM' },
                    ]}
                    {...getInputProps(`${field}.period`)}
                  />
                </div>
              ))}

              <TextInput
                withAsterisk
                label="Maximum Duration (minutes)"
                placeholder="120"
                {...getInputProps('maxDuration')}
              />

              <TextInput
                withAsterisk
                label="Advance Booking Days"
                placeholder="7"
                {...getInputProps('advanceDays')}
              />

              <Button type="submit" loading={actionLoading}>
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
