import { TablerIcon } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export const PageTitle = ({
  className,
  children,
  icon: Icon,
  iconComponent,
  title,
}: {
  className?: string
  children?: ReactNode
  icon?: TablerIcon
  iconComponent?: ReactNode
  title: string
}) => (
  <div
    className={twMerge(
      className,
      'flex justify-between items-center py-4 gap-2 max-sm:flex-col max-sm:justify-center',
    )}
  >
    <div className="flex items-center gap-2 max-sm:text-2xl text-4xl font-light">
      {Icon ? <Icon size="1.25em" /> : iconComponent}
      <span>{title}</span>
    </div>
    {children}
  </div>
)
