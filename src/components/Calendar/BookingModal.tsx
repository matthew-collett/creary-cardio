import { Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Timestamp } from 'firebase/firestore'
import { useEffect } from 'react'

import { Alert, Button, DateTimePicker, Textarea, TextInput } from '@/components/core'
import { showSuccess } from '@/components/Notification'
import { useBookings } from '@/hooks'
import { addHours } from '@/lib/utils'
import { Booking, NewResource, ServiceResponse } from '@/types'

interface BookingModalProps {
  opened: boolean
  onClose: () => void
  onSubmit: (booking: NewResource<Booking>) => Promise<ServiceResponse<Booking>>
  userId: string
  initialDate: Date
  actionLoading: boolean
}

export const BookingModal = ({
  opened,
  onClose,
  onSubmit,
  userId,
  initialDate,
  actionLoading,
}: BookingModalProps) => {
  const { validateBooking } = useBookings()
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      start: initialDate,
      end: addHours(initialDate, 1),
    },
    validate: {
      title: v => (v.trim() ? null : 'Title is required'),
      start: v => (v ? null : 'Start is required'),
      end: (v, vals) =>
        v ? (v > vals.start ? null : 'End must be after start') : 'End is required',
    },
  })

  const { setValues } = form
  useEffect(() => {
    if (opened && initialDate) {
      const end = addHours(initialDate, 1)
      setValues({
        title: '',
        description: '',
        start: initialDate,
        end: end,
      })
    }
  }, [opened, initialDate, setValues])

  const handleSubmit = form.onSubmit(async vals => {
    const {
      success: vSuccess,
      data: isValid,
      error: vErr,
    } = await validateBooking(vals.start, vals.end)
    if (!vSuccess) {
      form.setErrors({ form: vErr })
      return
    }

    if (!isValid.allowed) {
      form.setErrors({ form: isValid.reason })
      return
    }

    const { success, error } = await onSubmit({
      userId,
      title: vals.title,
      start: Timestamp.fromDate(vals.start),
      end: Timestamp.fromDate(vals.end),
      description: vals.description || null,
      rrule: null,
    })

    if (!success) {
      form.setErrors({ form: error })
      return
    }

    showSuccess('Booking added!')

    onClose()
    form.reset()
  })

  return (
    <Modal.Root closeOnEscape closeOnClickOutside opened={opened} onClose={onClose} centered>
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
            {form.errors.form && <Alert error>{form.errors.form}</Alert>}
            <div className="flex justify-end gap-4">
              <Button className="!w-fit" variant="default" onClick={onClose}>
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
  )
}
