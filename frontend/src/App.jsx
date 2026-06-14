import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import { AuthView } from './features/auth/AuthView'
import { login, signup } from './features/auth/authService'
import { RoleApp } from './features/RoleApp'
import { useApi } from './hooks/useApi'
import { useSession } from './hooks/useSession'
import './styles/app.css'

function App() {
  const [authMode, setAuthMode] = useState('login')
  const [message, setMessage] = useState(null)
  const { clearSession, saveSession, session, signedIn } = useSession()
  const api = useApi(session.token)
  
  const [activeView, setActiveView] = useState(() => {
    return session.role === 'USER' ? 'stores' : 'dashboard'
  })

  function showMessage(text, isError = false) {
    setMessage({ text, isError })
  }

  function logout() {
    clearSession()
    setActiveView('dashboard')
    setMessage(null)
  }

  async function handleLogin(event) {
    event.preventDefault()
    try {
      const auth = await login(api, event.currentTarget)
      saveSession(auth)
      setActiveView(auth.role === 'USER' ? 'stores' : 'dashboard')
      setMessage(null)
    } catch (error) {
      showMessage(error.message, true)
    }
  }

  async function handleSignup(event) {
    event.preventDefault()
    try {
      const result = await signup(api, event.currentTarget)
      event.currentTarget.reset()
      setAuthMode('login')
      showMessage(result)
    } catch (error) {
      showMessage(error.message, true)
    }
  }

  return (
    <AppShell
      message={message}
      onLogout={logout}
      session={session}
      signedIn={signedIn}
      activeView={activeView}
      setActiveView={setActiveView}
      api={api}
      showMessage={showMessage}
    >
      {!signedIn ? (
        <AuthView
          authMode={authMode}
          setAuthMode={setAuthMode}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      ) : (
        <RoleApp api={api} role={session.role} showMessage={showMessage} activeView={activeView} />
      )}
    </AppShell>
  )
}

export default App
