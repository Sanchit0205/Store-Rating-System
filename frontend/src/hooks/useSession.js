import { useState } from 'react'

const emptySession = {
  token: '',
  role: '',
  name: '',
  email: '',
}

function loadSession() {
  return {
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || '',
    name: localStorage.getItem('name') || '',
    email: localStorage.getItem('email') || '',
  }
}

export function useSession() {
  const [session, setSession] = useState(loadSession)

  function saveSession(auth) {
    localStorage.setItem('token', auth.token)
    localStorage.setItem('role', auth.role)
    localStorage.setItem('name', auth.name)
    localStorage.setItem('email', auth.email)
    setSession(auth)
  }

  function clearSession() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    localStorage.removeItem('email')
    setSession(emptySession)
  }

  return {
    session,
    signedIn: Boolean(session.token),
    saveSession,
    clearSession,
  }
}
