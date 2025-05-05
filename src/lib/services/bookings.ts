import {
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection as getCollection,
  query,
  where,
  Timestamp,
  DocumentData,
  getCountFromServer,
} from 'firebase/firestore'

import { db } from '@/lib'
import { Observable } from '@/lib'
import { Booking } from '@/types'

class BookingService extends Observable {
  private collection = getCollection(db, 'bookings')

  private resolveBooking(doc: DocumentData): Booking {
    return { id: doc.id, ...doc.data() } as Booking
  }

  async getBooking(id: string): Promise<Booking | null> {
    const snap = await getDoc(doc(db, 'bookings', id))
    if (snap.exists()) {
      return this.resolveBooking(snap)
    }
    return null
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const snap = await getDocs(query(this.collection, where('userId', '==', userId)))
    return snap.docs.map(this.resolveBooking)
  }

  async getUserPastBookingsCount(userId: string): Promise<number> {
    const q = query(
      this.collection,
      where('userId', '==', userId),
      where('end', '<', Timestamp.now()),
    )
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
  }

  async getUserUpcomingBookingsCount(userId: string): Promise<number> {
    const q = query(
      this.collection,
      where('userId', '==', userId),
      where('start', '>', Timestamp.now()),
    )
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
  }

  async getBookingsByDateRange(start: Date, end: Date): Promise<Booking[]> {
    const snap = await getDocs(
      query(
        this.collection,
        where('start', '>=', Timestamp.fromDate(start)),
        where('start', '<=', Timestamp.fromDate(end)),
      ),
    )
    return snap.docs.map(this.resolveBooking)
  }

  async getAllBookings(): Promise<Booking[]> {
    const snap = await getDocs(this.collection)
    return snap.docs.map(this.resolveBooking)
  }

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const snap = await addDoc(this.collection, {
      ...booking,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    this.notify()
    return snap.id
  }

  async updateBooking(
    id: string,
    data: Partial<Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Booking | null> {
    await updateDoc(doc(db, 'bookings', id), {
      ...data,
      updatedAt: Timestamp.now(),
    })

    this.notify()
    return await this.getBooking(id)
  }

  async deleteBooking(id: string): Promise<void> {
    await deleteDoc(doc(db, 'bookings', id))
    this.notify()
  }

  async isTimeAvailable(start: Date, end: Date): Promise<boolean> {
    const snap = await getDocs(
      query(
        this.collection,
        where('start', '<', Timestamp.fromDate(end)),
        where('end', '>', Timestamp.fromDate(start)),
      ),
    )
    return snap.empty
  }
}

export const bookingService = new BookingService()
