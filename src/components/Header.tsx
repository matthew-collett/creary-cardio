import { Menu } from '@mantine/core'
import {
  IconCalendarClock,
  IconHistory,
  IconUserDown,
  IconLogout,
  IconUser,
  IconLoader2,
} from '@tabler/icons-react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Tooltip } from '@/components/core'
import { useAuth } from '@/context'
import { useBookings } from '@/hooks'

export const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { initialLoading, userBookingCounts } = useBookings()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="w-full flex justify-end items-center gap-8 max-md:mt-4 h-header">
      <Tooltip
        classNames={{ tooltip: '!text-xs' }}
        label="Past Bookings"
        position="bottom"
        className="!bg-white !text-text !text-sm"
        withArrow
        withinPortal
      >
        <div className="flex items-center gap-1">
          {initialLoading ? (
            <IconLoader2 size={20} className="animate-spin" />
          ) : (
            <IconHistory size={20} className="text-accent" />
          )}
          <span>{userBookingCounts.past}</span>
        </div>
      </Tooltip>

      <Tooltip
        classNames={{ tooltip: '!text-xs' }}
        label="Upcoming Bookings"
        position="bottom"
        className="!bg-white !text-text !text-sm"
        withArrow
        withinPortal
      >
        <div className="flex items-center gap-1">
          {initialLoading ? (
            <IconLoader2 size={20} className="animate-spin" />
          ) : (
            <IconCalendarClock size={20} className="text-accent" />
          )}
          <span>{userBookingCounts.upcoming}</span>
        </div>
      </Tooltip>

      <Menu position="bottom-end" shadow="md" width={200}>
        <Menu.Target>
          <div className="flex items-center cursor-pointer">
            <IconUserDown size={20} className="text-accent" />
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item className="!text-text !opacity-100 hover:!cursor-default" disabled>
            Hi {user.displayName}!
          </Menu.Item>
          <Menu.Divider className="!border-border" />
          <Menu.Item onClick={() => navigate('/account')}>
            <div className="flex items-center gap-1">
              <IconUser size={16} />
              <span>Account</span>
            </div>
          </Menu.Item>
          <Menu.Item color="accent" onClick={handleLogout}>
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
