import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection as getCollection,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'

import { db } from '@/lib'
import { User } from '@/types'

const collection = getCollection(db, 'users')

export const userService = {
  async getUser(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', uid))

    if (userDoc.exists()) {
      return userDoc.data() as User
    }

    return null
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const snapshot = await getDocs(query(collection, where('email', '==', email)))

    if (!snapshot.empty) {
      return snapshot.docs[0].data() as User
    }

    return null
  },

  async getAllUsers(): Promise<User[]> {
    const snapshot = await getDocs(collection)
    return snapshot.docs.map(doc => doc.data() as User)
  },

  async updateUser(uid: string, data: Partial<User>): Promise<User | null> {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: Timestamp.now(),
    })
    return await this.getUser(uid)
  },
}
