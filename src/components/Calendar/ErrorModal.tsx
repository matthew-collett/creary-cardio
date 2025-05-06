import { Modal } from '@mantine/core'

import { Button } from '@/components/core'

interface ErrorModalProps {
  opened: boolean
  onClose: () => void
  message: string
}

export const ErrorModal = ({ opened, onClose, message }: ErrorModalProps) => {
  return (
    <Modal.Root closeOnEscape closeOnClickOutside opened={opened} onClose={onClose} centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title className="!text-lg">Booking Not Available</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <p className="mb-4">{message}</p>
          <div className="flex justify-end">
            <Button className="!w-fit" onClick={onClose}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}
