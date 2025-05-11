import { Timestamp } from 'firebase/firestore'

export interface Resource {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type NewResource<T extends Resource> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export type UpdatedResource<T extends Resource> = Partial<NewResource<T>>

export type NewOrUpdatedResource<T extends Resource> = NewResource<T> | UpdatedResource<T>
