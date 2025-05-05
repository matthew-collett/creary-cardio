import { HoverCard, Menu } from '@mantine/core'
import {
  IconCalendarClock,
  IconHistory,
  IconUserDown,
  IconLogout,
  IconUser,
  IconLoader2,
} from '@tabler/icons-react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '@/context'
import { useBookings } from '@/hooks/useBookings'

export const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { initialLoading, counts } = useBookings()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="w-full flex justify-end items-center gap-8 pb-4 max-md:pt-4">
      <HoverCard>
        <HoverCard.Target>
          <div className="flex items-center gap-1">
            {initialLoading ? (
              <IconLoader2 size={20} className="animate-spin" />
            ) : (
              <IconHistory size={20} className="text-accent" />
            )}

            <span>{counts.past}</span>
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown className="!rounded-radius !py-1">
          <p className="text-xs">Past Bookings</p>
        </HoverCard.Dropdown>
      </HoverCard>
      <HoverCard>
        <HoverCard.Target>
          <div className="flex items-center gap-1">
            {initialLoading ? (
              <IconLoader2 size={20} className="animate-spin" />
            ) : (
              <IconCalendarClock size={20} className="text-accent" />
            )}
            <span>{counts.upcoming}</span>
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown className="!rounded-radius !py-1">
          <p className="text-xs">Upcoming Bookings</p>
        </HoverCard.Dropdown>
      </HoverCard>
      <Menu position="bottom-end" shadow="md" width={200}>
        <Menu.Target>
          <div className="flex items-center cursor-pointer">
            <IconUserDown size={20} className="text-accent" />
          </div>
        </Menu.Target>
        <Menu.Dropdown className="!rounded-radius">
          <Menu.Item className="!text-text !opacity-100 hover:!cursor-default" disabled>
            Hi {user.displayName}!
          </Menu.Item>
          <Menu.Divider className="!border-border" />
          <Menu.Item
            className="hover:!rounded-radius"
            color="text"
            onClick={() => navigate('/account')}
          >
            <div className="flex items-center gap-1">
              <IconUser size={16} />
              <span>Account</span>
            </div>
          </Menu.Item>
          <Menu.Item className="hover:!rounded-radius" color="accent" onClick={handleLogout}>
            <div className="flex items-center gap-1">
              <IconLogout size={16} />
              <span>Logout</span>
            </div>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  )
}
