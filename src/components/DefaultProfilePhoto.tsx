import { IconUserFilled } from '@tabler/icons-react'

export const DefaultProfilePhoto = ({ size }: { size?: number }) => (
  <span className="p-2 bg-background-alt text-accent rounded-full">
    {size ? <IconUserFilled size={size} /> : <IconUserFilled />}
  </span>
)
