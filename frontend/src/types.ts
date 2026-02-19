export interface ApiResponse<T = null> {
  success: boolean
  data: T | null
  error: string | null
}

export interface FaucetFunding {
    hash: string
}

export interface FaucetTransaction {
    status: string,
    blockNum: string
}