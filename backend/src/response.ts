export interface ApiResponse<T = null> {
  success: boolean
  data: T | null
  error: string | null
}

export function ok<T = null>(data: T): ApiResponse<T> {
    return {
        success: true,
        data,
        error: null
    }
}

export function fail(message: string): ApiResponse {
    return {
        success: false,
        data: null,
        error: message
    }
}