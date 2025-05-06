import { where } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

import { storage } from '@/lib'
import { Service } from '@/lib/services/service'
import { User } from '@/types'

class UserService extends Service<User> {
  constructor() {
    super('users')
  }

  getUserByEmail = async (email: string) => this.queryOne(where('email', '==', email))

  uploadProfilePicture = async (id: string, file: File) => {
    const storageRef = ref(storage, `profile_pictures/${id}/profile.jpg`)
    await uploadBytes(ref(storage, `profile_pictures/${id}/profile.jpg`), file)
    const downloadURL = await getDownloadURL(storageRef)
    return this.update(id, { photoURL: downloadURL })
  }

  deleteProfilePicture = async (id: string) => {
    const response = await this.get(id)
    if (!response.success || !response.data.photoURL) {
      return
    }
    const storageRef = ref(storage, `profile_pictures/${id}/profile.jpg`)
    await deleteObject(storageRef)
    await this.update(id, { photoURL: null })
  }
}

export const userService = new UserService()
