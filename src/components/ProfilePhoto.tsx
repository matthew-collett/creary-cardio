import { IconUserFilled } from '@tabler/icons-react'
import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

import { useAuth } from '@/context'

interface ProfilePhotoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  applyHover?: boolean
}

export const ProfilePhoto = ({
  size = 'md',
  className = '',
  applyHover = false,
  ...props
}: ProfilePhotoProps) => {
  const { user } = useAuth()

  const sizes = {
    'xs': {
      container: 'w-6 h-6 sm:w-8 sm:h-8',
      icon: 'w-4 h-4 sm:w-5 sm:h-5',
    },
    'sm': {
      container: 'w-8 h-8 sm:w-10 sm:h-10',
      icon: 'w-5 h-5 sm:w-6 sm:h-6',
    },
    'md': {
      container: 'w-10 h-10 sm:w-12 sm:h-12',
      icon: 'w-6 h-6 sm:w-7 sm:h-7',
    },
    'lg': {
      container: 'w-12 h-12 sm:w-16 sm:h-16',
      icon: 'w-7 h-7 sm:w-10 sm:h-10',
    },
    'xl': {
      container: 'w-16 h-16 sm:w-20 sm:h-20',
      icon: 'w-10 h-10 sm:w-12 sm:h-12',
    },
    '2xl': {
      container: 'w-20 h-20 sm:w-28 sm:h-28',
      icon: 'w-12 h-12 sm:w-16 sm:h-16',
    },
  }

  const { container, icon } = sizes[size]

  return (
    <button
      className={twMerge(
        'group relative flex items-center justify-center bg-background-alt text-accent rounded-full overflow-hidden',
        container,
        className,
      )}
      {...props}
    >
      {user && user.photoURL ? (
        <img src={user.photoURL} alt="Profile Photo" className="w-full h-full object-cover" />
      ) : (
        <IconUserFilled className={icon} />
      )}
      {applyHover && (
        <div className="absolute opacity-0 inset-0 flex items-center justify-center group-hover:opacity-100 group-hover:bg-black/50 transition-all duration-100">
          <span className="text-white font-medium text-xs sm:text-sm">Update</span>
        </div>
      )}
    </button>
  )
}
