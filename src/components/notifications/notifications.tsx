import { notifications } from '@mantine/notifications'
import { IconCheck, IconInfoCircle, IconExclamationCircle } from '@tabler/icons-react'

export type NotificationType = 'success' | 'error' | 'info'

export const showNotification = (message: string, type: NotificationType = 'success') => {
  const colorMap = {
    success: {
      border: 'var(--color-green-700)',
      background: '#CCE6D7',
      color: 'var(--color-green-700)',
    },
    error: {
      border: 'var(--color-red-700)',
      background: '#F9D7D7',
      color: 'var(--color-red-700)',
    },
    info: {
      border: 'var(--color-blue-700)',
      background: '#D7E5F9',
      color: 'var(--color-blue-700)',
    },
  }

  const colors = colorMap[type]

  const icons = {
    success: <IconCheck />,
    error: <IconExclamationCircle />,
    info: <IconInfoCircle />,
  }

  notifications.show({
    message,
    icon: icons[type],
    withBorder: true,
    autoClose: 5000,
    styles: {
      root: {
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.background,
      },
      description: {
        color: colors.color,
      },
      icon: {
        backgroundColor: 'transparent',
        color: colors.color,
      },
      closeButton: {
        color: colors.color,
        backgroundColor: 'transparent',
      },
    },
  })
}

export const showSuccess = (message: string) => showNotification(message, 'success')

export const showError = (message: string) => showNotification(message, 'error')

export const showInfo = (message: string) => showNotification(message, 'info')
