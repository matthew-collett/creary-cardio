import { Modal } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import React from 'react'

import { Button, DateTimePicker, Textarea, TextInput } from '@/components/core'

export type BookingFormValues = {
  title: string
  description: string | null
  start: Date
  end: Date
  form?: string
}

export interface BookingModalProps {
  opened: boolean
  onClose: () => void
  form: UseFormReturnType<BookingFormValues>
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  loading: boolean
}

export const BookingModal: React.FC<BookingModalProps> = ({
  opened,
  onClose,
  form,
  onSubmit,
  loading,
}) => (
  <Modal radius="var(--radius)" opened={opened} onClose={onClose} title="New Booking" centered>
    <form className="space-y-4" onSubmit={onSubmit}>
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
        <Button variant="default" className="!w-fit" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="!w-fit" loading={loading}>
          Save
        </Button>
      </div>
    </form>
  </Modal>
)
