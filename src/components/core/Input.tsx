import {
  TextInput as MantineTextInput,
  TextInputProps,
  PasswordInput as MantinePasswordInput,
  PasswordInputProps,
  Select as MantineSelect,
  SelectProps,
  Textarea as MantineTextarea,
  TextareaProps,
} from '@mantine/core'
import { DateTimePicker as MantineDateTimePicker, DateTimePickerProps } from '@mantine/dates'

export const TextInput = (props: TextInputProps) => <MantineTextInput {...props} size="md" />

export const Select = (props: SelectProps) => <MantineSelect {...props} size="md" />

export const PasswordInput = (props: PasswordInputProps) => (
  <MantinePasswordInput {...props} size="md" />
)

export const Textarea = (props: TextareaProps) => <MantineTextarea {...props} size="md" />

export const DateTimePicker = (props: DateTimePickerProps) => (
  <MantineDateTimePicker
    clearable
    valueFormat="MM/DD/YYYY h:mm A"
    {...props}
    size="md"
    firstDayOfWeek={0}
  />
)
