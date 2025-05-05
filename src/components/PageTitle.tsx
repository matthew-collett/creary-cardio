import { ReactNode } from 'react'

export const PageTitle = ({
  children,
  icon,
  title,
}: {
  children?: ReactNode
  icon: ReactNode
  title: string
}) => (
  <div className="flex justify-between items-center max-sm:flex-col py-4 gap-2">
    <div className="flex items-center gap-2 max-sm:text-2xl text-4xl font-light">
      {icon}
      <span>{title}</span>
    </div>
    {children}
  </div>
)
