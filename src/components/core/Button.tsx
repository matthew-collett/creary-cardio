import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
  ElementProps,
} from '@mantine/core'
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'

type ButtonProps = MantineButtonProps & ElementProps<'button', keyof MantineButtonProps>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <MantineButton {...props} radius="var(--radius)" size="md" fullWidth ref={ref} />
))

Button.displayName = 'Button'

type LinkButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }

export const LinkButton = forwardRef<HTMLButtonElement, LinkButtonProps>((props, ref) => (
  <button
    {...props}
    ref={ref}
    className="text-primary underline hover:cursor-pointer hover:text-accent transition-all duration-100"
  >
    {props.children}
  </button>
))

LinkButton.displayName = 'LinkButton'
