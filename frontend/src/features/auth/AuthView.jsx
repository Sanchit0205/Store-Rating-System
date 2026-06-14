import { LogIn, UserPlus, Store } from 'lucide-react'

export function AuthView({ authMode, onLogin, onSignup, setAuthMode }) {
  return (
    <section className="panel auth-panel">
      <div className="auth-brand">
        <div className="auth-brand-icon">
          <Store size={20} />
        </div>
        <h1>StoreRate</h1>
      </div>

      <div className="tabs" role="tablist" aria-label="Authentication">
        <button
          className={`tab ${authMode === 'login' ? 'active' : ''}`}
          type="button"
          onClick={() => setAuthMode('login')}
        >
          <LogIn size={16} />
          Login
        </button>
        <button
          className={`tab ${authMode === 'signup' ? 'active' : ''}`}
          type="button"
          onClick={() => setAuthMode('signup')}
        >
          <UserPlus size={16} />
          Sign Up
        </button>
      </div>

      {authMode === 'login' ? (
        <form className="form-grid" onSubmit={onLogin}>
          <label className="wide">
            Email
            <input name="email" type="email" required placeholder="name@example.com" />
          </label>
          <label className="wide">
            Password
            <input name="password" type="password" required placeholder="••••••••" />
          </label>
          <button className="auth-btn wide" type="submit">
            <LogIn size={18} />
            Login
          </button>
        </form>
      ) : (
        <form className="form-grid" onSubmit={onSignup}>
          <label className="wide">
            Name <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 'normal', marginLeft: '4px' }}>(20-60 characters)</span>
            <input name="name" minLength="20" maxLength="60" required placeholder="Full Name" />
          </label>
          <label className="wide">
            Email
            <input name="email" type="email" required placeholder="name@example.com" />
          </label>
          <label className="wide">
            Password <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 'normal', marginLeft: '4px' }}>(8-16 chars, 1 uppercase, 1 special)</span>
            <input
              name="password"
              type="password"
              minLength="8"
              maxLength="16"
              pattern="^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$"
              title="Password must be 8-16 characters and include at least one uppercase letter and one special character"
              required
              placeholder="••••••••"
            />
          </label>
          <label className="wide">
            Address <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 'normal', marginLeft: '4px' }}>(Max 400 characters)</span>
            <textarea name="address" maxLength="400" placeholder="Your street address" />
          </label>
          <button className="auth-btn wide" type="submit">
            <UserPlus size={18} />
            Create Account
          </button>
        </form>
      )}
    </section>
  )
}
