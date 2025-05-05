import { Button as MantineButton, ButtonProps, ElementProps } from '@mantine/core'
import { ButtonHTMLAttributes, ReactNode } from 'react'

type ExtendedButtonProps = ButtonProps & ElementProps<'button', keyof ButtonProps>

export const Button = (props: ExtendedButtonProps) => (
  <MantineButton {...props} radius="var(--radius)" color="primary" size="md" fullWidth />
)

export const LinkButton = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
  <button
    {...props}
    className="text-primary underline hover:cursor-pointer hover:text-accent transition-all duration-200"
  >
    {children}
  </button>
)
