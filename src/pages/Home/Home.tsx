import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { DefaultProfilePhoto, PageTitle } from '@/components'
import { Calendar, ErrorCard, LoaderCard, BookingModal, ErrorModal } from '@/components/Calendar'
import { Button } from '@/components/core'
import { useAuth } from '@/context'
import { useBookings, useSettings, useUsers } from '@/hooks'
import { addDays, midnight, today } from '@/lib/utils'

const Home = () => {
  const { user } = useAuth()
  const { settings, initialLoading: sLoad } = useSettings()
  const { users, userMap, loading: uLoad } = useUsers()
  const { bookings, initialLoading: bLoad, actionLoading, createBooking, refetch } = useBookings()

  const loading = sLoad || uLoad || bLoad

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const advanceBookingDays = settings?.advanceBookingDays

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const openBookingModal = (date: Date) => {
    if (!advanceBookingDays || midnight(date) > addDays(midnight(today), advanceBookingDays)) {
      const errorMsg = advanceBookingDays
        ? `Bookings can only be made up to ${advanceBookingDays} days in advance`
        : 'Bookings can only be made up to the number of advance booking days configured in settings'
      setErrorMessage(errorMsg)
      setErrorModalOpen(true)
      return
    }
    setSelectedDate(date)
    setBookingModalOpen(true)
  }

  return (
    <>
      <PageTitle
        icon={
          user.photoURL ? (
            <img src={user.photoURL} alt="Profile Picture" />
          ) : (
            <DefaultProfilePhoto size={30} />
          )
        }
        title={`Hi ${user.displayName}!`}
      >
        <div className="flex items-center gap-2">
          <Button className="!w-fit" onClick={() => openBookingModal(today)}>
            <div className="flex items-center gap-1">
              <IconPlus size={20} />
              <span>Add</span>
            </div>
          </Button>
          <Button variant="default" className="!w-fit" onClick={refetch}>
            <div className="flex items-center gap-1">
              <IconRefresh size={20} />
              <span>Refresh</span>
            </div>
          </Button>
        </div>
      </PageTitle>
      {loading ? (
        <LoaderCard />
      ) : !settings ? (
        <ErrorCard message={'No calendar settings available'} />
      ) : (
        <>
          <Calendar
            settings={settings}
            users={users}
            userMap={userMap}
            bookings={bookings}
            onDateClick={date => openBookingModal(date)}
          />

          <BookingModal
            opened={bookingModalOpen}
            onClose={() => setBookingModalOpen(false)}
            onSubmit={async booking => await createBooking(booking)}
            userId={user.id}
            initialDate={selectedDate || today}
            actionLoading={actionLoading}
          />

          <ErrorModal
            opened={errorModalOpen}
            onClose={() => setErrorModalOpen(false)}
            message={errorMessage}
          />
        </>
      )}
    </>
  )
}

export default Home
