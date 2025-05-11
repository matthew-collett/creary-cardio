import { ModalProps, Modal as MantineModal, ModalStackProps } from '@mantine/core'
import { IconX, TablerIcon } from '@tabler/icons-react'
import { ReactNode, createContext, useContext } from 'react'

type ModalContextType = {
  onClose?: () => void
}

const ModalContext = createContext<ModalContextType>({})

export const ActionButton = ({
  icon: Icon,
  onClick,
  color,
}: {
  icon: TablerIcon
  onClick: () => void
  color?: string
}) => (
  <button
    className="p-2 hover:bg-background hover:cursor-pointer rounded-radius transition-colors duration-100"
    onClick={onClick}
  >
    <Icon className={color ? `text-${color}` : ''} />
  </button>
)

const CloseButton = () => {
  const { onClose } = useContext(ModalContext)

  if (!onClose) {
    return null
  }

  return <ActionButton icon={IconX} onClick={onClose} />
}

const Header = ({ title, children }: { title: string; children?: ReactNode }) => (
  <MantineModal.Header>
    <MantineModal.Title className="!text-lg">{title}</MantineModal.Title>
    <div className="ms-auto flex items-center gap-2">
      {children}
      <CloseButton />
    </div>
  </MantineModal.Header>
)

const Body = ({ children }: { children: ReactNode }) => (
  <MantineModal.Body className="!px-6 !pb-8">{children}</MantineModal.Body>
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Root = ({ children, stackId, ...props }: ModalProps & { children: ReactNode }) => (
  <ModalContext.Provider value={{ onClose: props.onClose }}>
    <MantineModal.Root {...props} closeOnEscape closeOnClickOutside centered>
      <MantineModal.Overlay />
      <MantineModal.Content className="!p-2">{children}</MantineModal.Content>
    </MantineModal.Root>
  </ModalContext.Provider>
)

const Stack = ({ children }: ModalStackProps) => <MantineModal.Stack>{children}</MantineModal.Stack>

export const Modal = {
  Root,
  Header,
  Body,
  ActionButton,
  Stack,
}
