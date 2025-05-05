import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection as getCollection,
  query,
  where,
  Timestamp,
  DocumentData,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

import { db, storage } from '@/lib'
import { User } from '@/types'

class UserService {
  private collection = getCollection(db, 'users')

  private resolveUser(doc: DocumentData): User {
    return { uid: doc.id, ...doc.data() } as User
  }

  async getUser(uid: string): Promise<User | null> {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) {
      return this.resolveUser(snap)
    }
    return null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const snap = await getDocs(query(this.collection, where('email', '==', email)))
    if (!snap.empty) {
      return this.resolveUser(snap.docs[0].data())
    }
    return null
  }

  async getAllUsers(): Promise<User[]> {
    const snap = await getDocs(this.collection)
    return snap.docs.map(this.resolveUser)
  }

  private async _updateUser(uid: string, data: Partial<User>): Promise<User | null> {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: Timestamp.now(),
    })
    return await this.getUser(uid)
  }

  async updateUser(uid: string, data: Omit<Partial<User>, 'photoURL'>): Promise<User | null> {
    return this._updateUser(uid, data)
  }

  async uploadProfilePicture(uid: string, file: File): Promise<User | null> {
    const storageRef = ref(storage, `profile_pictures/${uid}/profile.jpg`)
    await uploadBytes(ref(storage, `profile_pictures/${uid}/profile.jpg`), file)
    const downloadURL = await getDownloadURL(storageRef)
    return await this._updateUser(uid, { photoURL: downloadURL })
  }

  async deleteProfilePicture(uid: string): Promise<void> {
    const user = await this.getUser(uid)
    if (!user || !user.photoURL) {
      return
    }

    const storageRef = ref(storage, `profile_pictures/${uid}/profile.jpg`)
    await deleteObject(storageRef)
    await this._updateUser(uid, { photoURL: null })
  }
}

export const userService = new UserService()
