import { Tooltip as MantineTooltip, TooltipProps } from '@mantine/core'
import { ReactNode, forwardRef } from 'react'

export const Tooltip = forwardRef<HTMLDivElement, { children: ReactNode } & TooltipProps>(
  ({ children, ...props }, ref) => (
    <MantineTooltip
      {...props}
      classNames={{ tooltip: '!text-xs' }}
      className="!bg-white !text-text"
      withArrow
      withinPortal
      ref={ref}
    >
      {children}
    </MantineTooltip>
  ),
)

Tooltip.displayName = 'Tooltip'
