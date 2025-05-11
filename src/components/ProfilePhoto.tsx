import { IconUserFilled } from '@tabler/icons-react'
import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface ProfilePhotoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  src: string | null
  size?: number
  className?: string
  applyHover?: boolean
}

export const ProfilePhoto = ({
  src,
  size = 40,
  className = '',
  applyHover = false,
  ...props
}: ProfilePhotoProps) => {
  return (
    <button
      className={twMerge(
        'group relative flex items-center justify-center bg-background-alt text-accent rounded-full overflow-hidden',
        className,
      )}
      style={{ width: `${size}px`, height: `${size}px` }}
      {...props}
    >
      {src ? (
        <img src={src} alt="Profile Photo" className="w-full h-full object-cover" />
      ) : (
        <IconUserFilled size={size * 0.7} />
      )}
      {applyHover && (
        <div className="absolute inset-0 bg-black flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity duration-100">
          <span className="text-white font-medium text-sm">Update</span>
        </div>
      )}
    </button>
  )
}
