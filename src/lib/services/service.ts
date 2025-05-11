import {
  addDoc,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query as fsQuery,
  Timestamp,
  updateDoc,
  QueryConstraint,
  collection as getCollection,
  getCountFromServer,
} from 'firebase/firestore'

import { db, Observable } from '@/lib'
import { handleError } from '@/lib/utils'
import {
  EmptyServiceResponse,
  NewResource,
  Resource,
  ServiceResponse,
  UpdatedResource,
} from '@/types'

export abstract class Service<T extends Resource> extends Observable {
  private collection: CollectionReference

  constructor(path: string) {
    super()
    this.collection = getCollection(db, path)
  }

  protected async executeOperation<R>(
    operation: () => Promise<ServiceResponse<R>>,
    notifyOnSuccess: boolean = false,
  ): Promise<ServiceResponse<R>> {
    try {
      const response = await operation()
      if (notifyOnSuccess) {
        this.notify()
      }
      return response
    } catch (error) {
      return {
        success: false,
        error: handleError(error),
      }
    }
  }

  async create(resource: NewResource<T>): Promise<ServiceResponse<T>> {
    return this.executeOperation(async () => {
      const snap = await addDoc(this.collection, {
        ...resource,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })

      const docRef = doc(this.collection, snap.id)
      const updatedSnap = await getDoc(docRef)

      return {
        success: true,
        data: this.make(updatedSnap),
      }
    }, true)
  }

  async get(id: string): Promise<ServiceResponse<T>> {
    return this.executeOperation(async () => {
      const snap = await getDoc(doc(db, this.collection.path, id))
      return {
        success: true,
        data: this.make(snap),
      }
    })
  }

  async update(id: string, resource: UpdatedResource<T>): Promise<ServiceResponse<T>> {
    return this.executeOperation(async () => {
      const docRef = doc(this.collection, id)
      await updateDoc(docRef, {
        ...resource,
        updatedAt: Timestamp.now(),
      })

      const updatedSnap = await getDoc(docRef)
      return {
        success: true,
        data: this.make(updatedSnap),
      }
    }, true)
  }

  async delete(id: string): Promise<EmptyServiceResponse> {
    return this.executeOperation(async () => {
      await deleteDoc(doc(this.collection, id))
      return {
        success: true,
        data: null,
      }
    }, true)
  }

  async list(): Promise<ServiceResponse<T[]>> {
    return this.executeOperation(async () => {
      const snap = await getDocs(this.collection)
      return {
        success: true,
        data: snap.docs.map(this.make),
      }
    })
  }

  async query(...constraints: QueryConstraint[]): Promise<ServiceResponse<T[]>> {
    return this.executeOperation(async () => {
      const snap = await getDocs(fsQuery(this.collection, ...constraints))
      return {
        success: true,
        data: snap.docs.map(this.make),
      }
    })
  }

  async queryOne(...constraints: QueryConstraint[]): Promise<ServiceResponse<T>> {
    return this.executeOperation(async () => {
      const snap = await getDocs(fsQuery(this.collection, ...constraints))
      return {
        success: true,
        data: snap.docs.map(this.make)[0],
      }
    })
  }

  async count(...constraints: QueryConstraint[]): Promise<ServiceResponse<number>> {
    return this.executeOperation(async () => {
      const snap = await getCountFromServer(fsQuery(this.collection, ...constraints))
      return {
        success: true,
        data: snap.data().count,
      }
    })
  }

  async exists(...constraints: QueryConstraint[]): Promise<ServiceResponse<boolean>> {
    return this.executeOperation(async () => {
      const snap = await getCountFromServer(fsQuery(this.collection, ...constraints))
      return {
        success: true,
        data: snap.data().count != 0,
      }
    })
  }

  async notExists(...constraints: QueryConstraint[]): Promise<ServiceResponse<boolean>> {
    return this.executeOperation(async () => {
      const snap = await getCountFromServer(fsQuery(this.collection, ...constraints))
      return {
        success: true,
        data: snap.data().count == 0,
      }
    })
  }

  protected make(doc: DocumentData): T {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as T
  }
}
