import { useState } from 'react'
import { LayoutDashboard, Users, Store, KeyRound, LogOut, Bell, Search, Menu } from 'lucide-react'
import { PasswordPanel } from '../../features/account/PasswordPanel'

export function AppShell({
  children,
  message,
  onLogout,
  session,
  signedIn,
  activeView,
  setActiveView,
  api,
  showMessage,
}) {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)

  if (!signedIn) {
    return (
      <div className="auth-container">
        <div style={{ width: '100%', maxWidth: '380px' }}>
          {message && (
            <div className={`message ${message.isError ? 'error' : ''}`} style={{ marginBottom: '16px' }}>
              {message.text}
            </div>
          )}
          {children}
        </div>
      </div>
    )
  }

  const role = session.role || 'USER'
  const name = session.name || 'User'
  
  // Get initials for avatar
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  // Get current date string
  const currentDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Get page title based on view
  let pageTitle = 'Dashboard'
  if (activeView === 'users') pageTitle = 'Users Directory'
  if (activeView === 'stores') pageTitle = 'Store Directory'

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">
            <div className="brand-logo">
              <Store size={16} />
            </div>
            <span className="brand-name">StoreRate</span>
          </div>

          <nav className="nav-menu">
            <span className="nav-label">Main</span>
            
            {role === 'ADMIN' && (
              <>
                <button
                  className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveView('dashboard')}
                  type="button"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>
                <button
                  className={`nav-item ${activeView === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveView('users')}
                  type="button"
                >
                  <Users size={16} />
                  Users
                </button>
                <button
                  className={`nav-item ${activeView === 'stores' ? 'active' : ''}`}
                  onClick={() => setActiveView('stores')}
                  type="button"
                >
                  <Store size={16} />
                  Stores
                </button>
              </>
            )}

            {role === 'OWNER' && (
              <button
                className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveView('dashboard')}
                type="button"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            )}

            {role === 'USER' && (
              <button
                className={`nav-item ${activeView === 'stores' ? 'active' : ''}`}
                onClick={() => setActiveView('stores')}
                type="button"
              >
                <Store size={16} />
                Explore Stores
              </button>
            )}

            <span className="nav-label">Account</span>
            <button
              className="nav-item"
              onClick={() => setIsPasswordOpen(true)}
              type="button"
            >
              <KeyRound size={16} />
              Update Password
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{initials}</div>
            <div className="user-details">
              <span className="name">{name}</span>
              <span className="role">{role}</span>
            </div>
          </div>
          <button
            className="nav-item"
            onClick={onLogout}
            type="button"
            style={{ margin: '8px 0 0', padding: '6px 8px', background: 'transparent' }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h1>{pageTitle}</h1>
            <span className="subtitle">{currentDateString}</span>
          </div>
          <div className="topbar-right">
            <button className="topbar-btn" type="button" aria-label="Search">
              <Search size={16} />
            </button>
            <button className="topbar-btn" type="button" aria-label="Notifications">
              <Bell size={16} />
              <div className="notification-dot" />
            </button>
            <button className="topbar-btn" type="button" aria-label="Menu">
              <Menu size={16} />
            </button>
          </div>
        </header>

        <main className="page-container">
          {message && (
            <div className={`message ${message.isError ? 'error' : ''}`}>
              {message.text}
            </div>
          )}
          {children}
        </main>
      </div>

      {isPasswordOpen && (
        <PasswordPanel
          api={api}
          showMessage={showMessage}
          onClose={() => setIsPasswordOpen(false)}
        />
      )}
    </div>
  )
}
