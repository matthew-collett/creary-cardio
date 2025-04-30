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
} from 'firebase/firestore'

import { db } from '@/lib'
import { Booking } from '@/types'

const collection = getCollection(db, 'bookings')

const resolveBooking = (doc: DocumentData): Booking => ({ id: doc.id, ...doc.data() }) as Booking

export const bookingService = {
  async getBooking(id: string): Promise<Booking | null> {
    const bookingDoc = await getDoc(doc(db, 'bookings', id))
    if (bookingDoc.exists()) {
      return resolveBooking(bookingDoc)
    }
    return null
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    const snapshot = await getDocs(query(collection, where('userId', '==', userId)))
    return snapshot.docs.map(resolveBooking)
  },

  async getBookingsByDateRange(start: Date, end: Date): Promise<Booking[]> {
    const snapshot = await getDocs(
      query(
        collection,
        where('start', '>=', Timestamp.fromDate(start)),
        where('start', '<=', Timestamp.fromDate(end)),
      ),
    )
    return snapshot.docs.map(resolveBooking)
  },

  async getAllBookings(): Promise<Booking[]> {
    const snapshot = await getDocs(collection)
    return snapshot.docs.map(resolveBooking)
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const bookingDoc = await addDoc(collection, {
      ...booking,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return bookingDoc.id
  },

  async updateBooking(
    id: string,
    data: Partial<Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Booking | null> {
    await updateDoc(doc(db, 'bookings', id), {
      ...data,
      updatedAt: Timestamp.now(),
    })
    return await this.getBooking(id)
  },

  async deleteBooking(id: string): Promise<void> {
    await deleteDoc(doc(db, 'bookings', id))
  },

  async isTimeAvailable(start: Date, end: Date): Promise<boolean> {
    const snapshot = await getDocs(
      query(
        collection,
        where('start', '<', Timestamp.fromDate(end)),
        where('end', '>', Timestamp.fromDate(start)),
      ),
    )
    return snapshot.empty
  },
}
