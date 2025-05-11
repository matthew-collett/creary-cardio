import { ModalProps } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { Timestamp } from 'firebase/firestore'
import { useState } from 'react'

import { ProfilePhoto } from '@/components'
import { Alert, Button, DateTimePicker, Textarea, TextInput, Modal } from '@/components/core'
import { showSuccess } from '@/components/notifications'
import { useBookings } from '@/hooks'
import { addHours, formatDatePretty, safeDate } from '@/lib/utils'
import { Booking, User } from '@/types'

type BookingFormValues = {
  title: string
  description: string
  start: Date
  end: Date
}

export const BookingModal = {
  Create: ({ user, selectedDate, ...props }: { user: User; selectedDate: Date } & ModalProps) => {
    const { createBooking, validateBooking, actionLoading } = useBookings()

    const form = useForm<BookingFormValues>({
      initialValues: {
        title: '',
        description: '',
        start: selectedDate,
        end: addHours(selectedDate, 1),
      },
      validate: {
        title: v => (v.trim() ? null : 'Title is required'),
        start: v => (v ? null : 'Start is required'),
        end: (v, vals) => {
          if (!v) {
            return 'End is required'
          }

          if (safeDate(v).getTime() <= safeDate(vals.start).getTime()) {
            return 'End must be after start'
          }

          return null
        },
      },
      transformValues: values => ({
        ...values,
        start: safeDate(values.start),
        end: safeDate(values.end),
      }),
    })

    const handleSubmit = form.onSubmit(async ({ start, end, title, description }) => {
      const { success, data, error } = await validateBooking(start, end)

      if (!success) {
        form.setErrors({ form: error })
        return
      }

      if (!data.allowed) {
        form.setErrors({ form: data.reason })
        return
      }

      const { success: submitSuccess, error: submitError } = await createBooking({
        userId: user.id,
        userDisplayName: user.displayName,
        title: title,
        description: description || null,
        start: Timestamp.fromDate(start),
        end: Timestamp.fromDate(end),
      })

      if (!submitSuccess) {
        form.setErrors({ form: submitError })
        return
      }

      showSuccess('Booking added!')
      props.onClose()
      form.reset()
    })

    return (
      <Modal.Root {...props}>
        <Modal.Header title="New Booking" />
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
            <DateTimePicker withAsterisk label="Start" {...form.getInputProps('start')} />
            <DateTimePicker withAsterisk label="End" {...form.getInputProps('end')} />
            {form.errors.form && <Alert error>{form.errors.form}</Alert>}
            <div className="flex justify-end gap-4">
              <Button className="!w-fit" variant="default" type="button" onClick={props.onClose}>
                Cancel
              </Button>
              <Button className="!w-fit" type="submit" loading={actionLoading}>
                Save
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Root>
    )
  },

  Update: ({
    booking,
    user,
    onCancel,
    ...props
  }: { booking: Booking; onCancel: () => void; user: User } & ModalProps) => {
    const { updateBooking, validateBooking, actionLoading } = useBookings()
    const form = useForm<BookingFormValues>({
      initialValues: {
        title: booking.title,
        description: booking.description || '',
        start: booking.start.toDate(),
        end: booking.end.toDate(),
      },
      validate: {
        title: v => (v.trim() ? null : 'Title is required'),
        start: v => (v ? null : 'Start is required'),
        end: (v, vals) => {
          if (!v) {
            return 'End is required'
          }

          if (safeDate(v).getTime() <= safeDate(vals.start).getTime()) {
            return 'End must be after start'
          }

          return null
        },
      },
      transformValues: values => ({
        ...values,
        start: safeDate(values.start),
        end: safeDate(values.end),
      }),
    })

    const handleSubmit = form.onSubmit(async ({ start, end, title, description }) => {
      if (user.id !== booking.userId) {
        form.setErrors({ form: 'Cannot update other user bookings' })
        return
      }
      const { success, data, error } = await validateBooking(start, end, booking.id)

      if (!success) {
        form.setErrors({ form: error })
        return
      }

      if (!data.allowed) {
        form.setErrors({ form: data.reason })
        return
      }

      const result = await updateBooking(booking.id, {
        title: title,
        start: Timestamp.fromDate(start),
        end: Timestamp.fromDate(end),
        description: description || null,
      })

      if (!result.success) {
        form.setErrors({ form: result.error })
        return
      }

      showSuccess('Booking updated!')
      props.onClose()
    })

    return (
      <Modal.Root {...props} onClose={onCancel}>
        <Modal.Header title="Update Booking" />
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
            <DateTimePicker withAsterisk label="Start" {...form.getInputProps('start')} />
            <DateTimePicker withAsterisk label="End" {...form.getInputProps('end')} />
            {form.errors.form && <Alert error>{form.errors.form}</Alert>}
            <div className="flex justify-end gap-4">
              <Button className="!w-fit" variant="default" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button className="!w-fit" type="submit" loading={actionLoading}>
                Update
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Root>
    )
  },
  Info: ({
    onClickUpdate,
    onClickDelete,
    booking,
    user,
    ...props
  }: {
    onClickUpdate: () => void
    onClickDelete: () => void
    booking: Booking
    user: User
  } & ModalProps) => (
    <Modal.Root {...props}>
      <Modal.Header title={booking.title}>
        {user.id === booking.userId && (
          <div className="flex gap-2">
            <Modal.ActionButton color="primary" icon={IconEdit} onClick={onClickUpdate} />
            <Modal.ActionButton color="red-700" icon={IconTrash} onClick={onClickDelete} />
          </div>
        )}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-200">
            <ProfilePhoto src={user.photoURL} size={50} />
            <div>
              <div className="text-sm text-gray-500">Runner</div>
              <div className="font-medium">{booking.userDisplayName}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Start</div>
              <div>{formatDatePretty(booking.start.toDate())}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">End</div>
              <div>{formatDatePretty(booking.end.toDate())}</div>
            </div>
          </div>
          <div className="pt-2">
            <div className="text-sm text-gray-500">Description</div>
            <div>{booking.description || 'N/A'}</div>
          </div>
          <div className="pt-3 mt-2 border-t-2 border-gray-200 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-500">Created</div>
              <div>{formatDatePretty(booking.createdAt.toDate())}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Updated</div>
              <div>{formatDatePretty(booking.updatedAt.toDate())}</div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal.Root>
  ),
  Error: ({ message, ...props }: { message: string } & ModalProps) => (
    <Modal.Root {...props}>
      <Modal.Header title="Booking Not Available" />
      <Modal.Body>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <Button className="!w-fit" onClick={props.onClose}>
            Close
          </Button>
        </div>
      </Modal.Body>
    </Modal.Root>
  ),
  Delete: ({
    booking,
    onCancel,
    ...props
  }: { booking: Booking; onCancel: () => void } & ModalProps) => {
    const { deleteBooking, actionLoading } = useBookings()
    const [error, setError] = useState<string>('')

    const handleClick = async () => {
      const { success, error } = await deleteBooking(booking.id)
      if (!success) {
        setError(error)
        return
      }
      showSuccess('Booking deleted!')
      props.onClose()
    }

    return (
      <Modal.Root {...props} onClose={onCancel}>
        <Modal.Header title="Delete Booking" />
        <Modal.Body>
          <p className="mb-4">
            Are you sure you would like to delete booking&nbsp;
            <span className="italic">{booking.title}</span>?
          </p>
          {error && <Alert error>{error}</Alert>}
          <div className="flex justify-end gap-4">
            <Button variant="default" className="!w-fit" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              className="!w-fit !bg-red-700 hover:!bg-red-800 !transition-colors !duration-100"
              loading={actionLoading}
              onClick={handleClick}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal.Root>
    )
  },
}
