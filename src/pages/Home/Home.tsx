import { Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { Timestamp } from 'firebase/firestore'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { DefaultProfilePhoto, PageTitle } from '@/components'
import { Calendar, ErrorCard, LoaderCard } from '@/components/Calendar'
import { Button, DateTimePicker, Textarea, TextInput } from '@/components/core'
import { useAuth } from '@/context'
import { useBookings, useSettings, useUsers } from '@/hooks'
import { addHours } from '@/lib'

const Home = () => {
  const { user } = useAuth()
  const { settings, initialLoading: sLoad, error: sErr } = useSettings()
  const { users, userLookup, loading: uLoad, error: uErr } = useUsers()
  const {
    bookings,
    initialLoading: bLoad,
    actionLoading,
    error: bErr,
    createBooking,
    validateBooking,
    refetch,
  } = useBookings()

  const loading = sLoad || uLoad || bLoad
  const error = sErr || uErr || bErr

  const [opened, { open, close }] = useDisclosure(false)
  const [slot, setSlot] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: addHours(new Date(), 1),
  })
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      start: slot.start,
      end: slot.end,
    },
    validate: {
      title: v => (v.trim() ? null : 'Title is required'),
      start: v => (v ? null : 'Start is required'),
      end: (v, vals) =>
        v ? (v > vals.start ? null : 'End must be after start') : 'End is required',
    },
  })

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const openFor = (date: Date) => {
    const end = addHours(date, 1)
    setSlot({ start: date, end })
    form.setValues({ ...form.values, start: date, end })
    open()
  }

  const handleSubmit = form.onSubmit(async vals => {
    const isAllowed = await validateBooking(vals.start, vals.end)
    if (!isAllowed.allowed) {
      form.setFieldError('form', isAllowed.reason)
      return
    }

    await createBooking({
      userId: user.uid,
      title: vals.title,
      start: Timestamp.fromDate(vals.start),
      end: Timestamp.fromDate(vals.end),
      description: vals.description || null,
      rrule: null,
    })
    close()
    form.reset()
  })

  return (
    <>
      <PageTitle
        icon={
          user.photoURL ? (
            <img src={user.photoURL} alt="Profile Picture" />
          ) : (
            <DefaultProfilePhoto size={30} />
          )
        }
        title={`Hi ${user.displayName}!`}
      >
        <div className="flex items-center gap-2">
          <Button className="!w-fit" onClick={() => openFor(new Date())}>
            <div className="flex items-center gap-1">
              <IconPlus size={20} />
              <span>Add</span>
            </div>
          </Button>
          <Button variant="default" className="!w-fit" onClick={refetch}>
            <div className="flex items-center gap-1">
              <IconRefresh size={20} />
              <span>Refresh</span>
            </div>
          </Button>
        </div>
      </PageTitle>

      <Modal.Root
        closeOnEscape
        closeOnClickOutside
        radius="var(--radius)"
        opened={opened}
        onClose={close}
        centered
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title className="!text-lg">New Booking</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <TextInput
                withAsterisk
                label="Title"
                data-autofocus
                placeholder="Enter a title"
                {...form.getInputProps('title')}
              />
              <Textarea
                label="Description"
                placeholder="Optional details"
                {...form.getInputProps('description')}
              />
              <DateTimePicker
                withAsterisk
                label="Start"
                value={form.values.start}
                {...form.getInputProps('start')}
              />
              <DateTimePicker
                withAsterisk
                label="End"
                value={form.values.end}
                {...form.getInputProps('end')}
              />
              {form.errors.form && <div className="text-red-500 mt-2">{form.errors.form}</div>}
              <div className="flex justify-end gap-4">
                <Button className="!w-fit" variant="default" onClick={close}>
                  Cancel
                </Button>
                <Button className="!w-fit" type="submit" loading={actionLoading}>
                  Save
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      {loading ? (
        <LoaderCard />
      ) : error || !settings ? (
        <ErrorCard message={error || 'No calendar settings available'} />
      ) : (
        <Calendar
          settings={settings}
          users={users}
          userLookup={userLookup}
          bookings={bookings}
          onSlotClick={openFor}
        />
      )}
    </>
  )
}

export default Home
