export type SuccessResponse<T> = {
  success: true
  data: T
  error?: never
}

export type ErrorResponse = {
  success: false
  data?: never
  error: string
}

export type ServiceResponse<T> = SuccessResponse<T> | ErrorResponse
