import { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={twMerge(
        'bg-background rounded-radius shadow-md w-full p-4 border border-gray-400/50',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
