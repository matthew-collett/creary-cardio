import { IconCheck, IconExclamationCircle } from '@tabler/icons-react'
import { ReactNode } from 'react'

export const Alert = ({ children, error = false }: { children: ReactNode; error?: boolean }) => {
  const bgColorClass = error ? 'bg-accent' : 'bg-green-700/20'
  const textColorClass = error ? 'text-accent' : 'text-green-700'
  const Icon = error ? IconExclamationCircle : IconCheck

  return (
    <div className={`flex items-center gap-1 mb-4 p-3 ${bgColorClass} rounded-radius`}>
      <Icon className={textColorClass} />
      <p className={`text-sm ${textColorClass}`}>{children}</p>
    </div>
  )
}
