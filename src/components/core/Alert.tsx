import { IconCheck, IconExclamationCircle } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export const Alert = ({ children, error = false }: { children: ReactNode; error?: boolean }) => {
  const bgColorClass = error ? 'bg-red-700/20' : 'bg-green-700/20'
  const textColorClass = error ? 'text-red-700' : 'text-green-700'
  const borderColorClass = error ? 'border-red-700' : 'border-green-700'
  const Icon = error ? IconExclamationCircle : IconCheck

  return (
    <div
      className={twMerge(
        'flex items-center gap-1 mb-4 p-2 rounded-radius border',
        bgColorClass,
        borderColorClass,
      )}
    >
      <Icon className={textColorClass} />
      <p className={twMerge('text-sm', textColorClass)}>{children}</p>
    </div>
  )
}
