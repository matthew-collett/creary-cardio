import {
  TextInput as MantineTextInput,
  TextInputProps,
  PasswordInput as MantinePasswordInput,
  PasswordInputProps,
  Select as MantineSelect,
  SelectProps,
  Textarea as MantineTextarea,
  TextareaProps,
  ColorInput as MantineColorInput,
  ColorInputProps,
} from '@mantine/core'
import {
  DateTimePicker as MantineDateTimePicker,
  DateTimePickerProps,
  TimePicker as MantineTimePicker,
  TimePickerProps,
} from '@mantine/dates'

export const TextInput = (props: TextInputProps) => <MantineTextInput {...props} size="md" />

export const Select = (props: SelectProps) => <MantineSelect {...props} size="md" />

export const PasswordInput = (props: PasswordInputProps) => (
  <MantinePasswordInput {...props} size="md" />
)

export const Textarea = (props: TextareaProps) => <MantineTextarea {...props} size="md" />

export const DateTimePicker = (props: DateTimePickerProps) => (
  <MantineDateTimePicker
    {...props}
    timePickerProps={{
      withDropdown: true,
      popoverProps: { withinPortal: false },
      format: '12h',
    }}
    valueFormat="MM/DD/YYYY h:mm A"
    firstDayOfWeek={0}
    size="md"
    clearable
  />
)

export const TimePicker = (props: TimePickerProps) => (
  <MantineTimePicker
    {...props}
    popoverProps={{ withinPortal: false }}
    format="12h"
    size="md"
    clearable
    withDropdown
  />
)

export const ColorInput = (props: ColorInputProps) => (
  <MantineColorInput
    {...props}
    swatches={['#01418e', '#96afd6', '#e75134', '#f7b9b1', '#f4d8d4', '#f2f0ea']}
    withEyeDropper
    styles={{
      saturationOverlay: {
        borderRadius: 'var(--radius)',
      },
    }}
    size="md"
  />
)
