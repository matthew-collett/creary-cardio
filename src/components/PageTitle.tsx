import { TablerIcon } from '@tabler/icons-react'
import { ReactNode } from 'react'

export const PageTitle = ({
  children,
  icon: Icon,
  iconComponent,
  title,
}: {
  children?: ReactNode
  icon?: TablerIcon
  iconComponent?: ReactNode
  title: string
}) => (
  <div className="flex justify-between items-center py-4 gap-2 max-sm:flex-col h-page-title max-sm:h-page-title-sm">
    <div className="flex items-center gap-2 max-sm:text-3xl text-4xl font-light">
      {Icon ? <Icon size="1.25em" /> : iconComponent}
      <span>{title}</span>
    </div>
    {children}
  </div>
)
