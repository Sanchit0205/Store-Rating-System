import { API_BASE_URL } from './config'

function parseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function httpRequest(path, { token, ...options } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const text = await response.text()
  const body = text ? parseJson(text) : null

  if (!response.ok) {
    throw new Error(body?.message || body?.error || text || 'Request failed')
  }

  return body ?? text
}
