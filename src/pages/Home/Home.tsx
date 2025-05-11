import { useModalsStack } from '@mantine/core'
import { CalendarEvent } from '@schedule-x/calendar'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import {
  Calendar,
  ErrorCard,
  LoaderCard,
  BookingModal,
  PageTitle,
  ProfilePhoto,
} from '@/components'
import { Button, Modal, Tooltip } from '@/components/core'
import { showError, showSuccess } from '@/components/notifications'
import { useAuth } from '@/context'
import { useBookings, useSettings, useUsers } from '@/hooks'
import {
  addDays,
  fromScheduleXDate,
  fromScheduleXDateTime,
  midnight,
  safeDate,
  today,
} from '@/lib/utils'
import { Booking } from '@/types'

const Home = () => {
  const { user } = useAuth()
  const { settings, initialLoading: sLoad } = useSettings()
  const { users, loading: uLoad } = useUsers()
  const {
    events,
    initialLoading: bLoad,
    actionLoading: bActionLoad,
    refetch,
    getBooking,
    validateBooking,
    updateBooking,
  } = useBookings()
  const modalStack = useModalsStack(['create', 'info', 'update', 'delete', 'error'])

  const loading = sLoad || uLoad || bLoad || bActionLoad

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const advanceBookingDays = settings?.advanceBookingDays

  useEffect(() => {
    if (selectedEventId && !bLoad) {
      const booking = getBooking(selectedEventId)
      if (booking) {
        setSelectedBooking(booking)
        modalStack.open('info')
      }
      setSelectedEventId(null)
    }
  }, [selectedEventId, bLoad, getBooking, modalStack])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleClickDate = (date: Date): void => {
    if (!advanceBookingDays || midnight(date) > addDays(midnight(today), advanceBookingDays)) {
      const errorMsg = advanceBookingDays
        ? `Bookings can only be made up to ${advanceBookingDays} days in advance`
        : 'Bookings can only be made up to the number of advance booking days configured in settings'
      setErrorMessage(errorMsg)
      modalStack.open('error')
      return
    }
    setSelectedDate(date)
    modalStack.open('create')
  }

  const onClickDate = (ds: string): void => handleClickDate(fromScheduleXDate(ds))

  const onClickDateTime = (ds: string): void => handleClickDate(fromScheduleXDateTime(ds))

  const onEventClick = (event: CalendarEvent): void => {
    setSelectedEventId(event.id.toString())
  }

  const onEventUpdate = async (event: CalendarEvent): Promise<void> => {
    const booking = getBooking(event.id.toString())
    if (!booking) {
      showError('Could not find booking to update')
      return
    }

    const { success, error } = await updateBooking(booking.id, {
      start: Timestamp.fromDate(safeDate(event.start)),
      end: Timestamp.fromDate(safeDate(event.end)),
    })

    if (!success) {
      showError(error)
      return
    }

    showSuccess('Booking updated successfully!')
  }

  const onBeforeEventUpdate = (oldEvent: CalendarEvent, newEvent: CalendarEvent): boolean => {
    if (oldEvent.start === newEvent.start && oldEvent.end === newEvent.end) {
      return false
    }

    const newBooking = getBooking(newEvent.id.toString())
    if (!newBooking) {
      return false
    }

    ;(async () => {
      const { success, data, error } = await validateBooking(
        safeDate(newEvent.start),
        safeDate(newEvent.end),
        newBooking.id,
      )

      if (!success) {
        showError(error)
        return
      }

      if (!data.allowed) {
        showError(data.reason)
        return
      }

      onEventUpdate(newEvent)
    })()

    return false
  }

  return (
    <>
      <PageTitle
        className="h-page-title max-sm:h-page-title-sm"
        iconComponent={<ProfilePhoto size="md" />}
        title={`Hi ${user.displayName}!`}
      >
        <div className="flex items-center gap-2">
          <Tooltip label="Add" position="top">
            <Button className="!w-fit" onClick={() => handleClickDate(today)}>
              <IconPlus size={20} />
            </Button>
          </Tooltip>

          <Tooltip label="Refresh" position="top">
            <Button variant="default" className="!w-fit" onClick={refetch}>
              <IconRefresh size={20} />
            </Button>
          </Tooltip>
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
            events={events}
            callbacks={{
              onClickDate,
              onClickDateTime,
              onEventClick,
              onEventUpdate,
              onBeforeEventUpdate,
            }}
          />

          <Modal.Stack>
            {selectedDate && (
              <BookingModal.Create
                {...modalStack.register('create')}
                key={`create-${selectedDate.getTime()}`}
                selectedDate={selectedDate}
                user={user}
              />
            )}

            {selectedBooking && (
              <BookingModal.Info
                {...modalStack.register('info')}
                key={`info-${selectedBooking.id}`}
                booking={selectedBooking}
                user={user}
                onClickUpdate={() => {
                  modalStack.close('info')
                  modalStack.open('update')
                }}
                onClickDelete={() => {
                  modalStack.close('info')
                  modalStack.open('delete')
                }}
              />
            )}

            {selectedBooking && (
              <BookingModal.Update
                {...modalStack.register('update')}
                key={`update-${selectedBooking}`}
                booking={selectedBooking}
                user={user}
                onClose={() => modalStack.close('update')}
                onCancel={() => {
                  modalStack.close('update')
                  modalStack.open('info')
                }}
              />
            )}

            {selectedBooking && (
              <BookingModal.Delete
                {...modalStack.register('delete')}
                key={`delete-${selectedBooking}`}
                booking={selectedBooking}
                onClose={() => modalStack.close('delete')}
                onCancel={() => {
                  modalStack.close('delete')
                  modalStack.open('info')
                }}
              />
            )}

            <BookingModal.Error
              {...modalStack.register('error')}
              onClose={() => modalStack.close('error')}
              message={errorMessage}
            />
          </Modal.Stack>
        </>
      )}
    </>
  )
}

export default Home
