import { where } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

import { storage } from '@/lib'
import { Service } from '@/lib/services/service'
import { ServiceResponse, User } from '@/types'

class UserService extends Service<User> {
  constructor() {
    super('users')
  }

  getUserByEmail = async (email: string): Promise<ServiceResponse<User>> =>
    this.queryOne(where('email', '==', email))

  uploadProfilePicture = async (id: string, file: File): Promise<ServiceResponse<User>> => {
    const storageRef = ref(storage, `profile_pictures/${id}/profile.jpg`)
    await uploadBytes(ref(storage, `profile_pictures/${id}/profile.jpg`), file)
    const downloadURL = await getDownloadURL(storageRef)
    return this.update(id, { photoURL: downloadURL })
  }

  deleteProfilePicture = async (id: string): Promise<ServiceResponse<User>> => {
    const { success, data, error } = await this.get(id)
    if (!success || !data.photoURL) {
      return {
        success: false,
        error: error || 'No photo to delete',
      }
    }
    const storageRef = ref(storage, `profile_pictures/${id}/profile.jpg`)
    await deleteObject(storageRef)
    return await this.update(id, { photoURL: null })
  }
}

export const userService = new UserService()
