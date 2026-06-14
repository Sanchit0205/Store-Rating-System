import { useCallback } from 'react'
import { httpRequest } from '../api/httpClient'

export function useApi(token) {
  return useCallback(
    (path, options = {}) =>
      httpRequest(path, {
        ...options,
        token,
      }),
    [token],
  )
}
