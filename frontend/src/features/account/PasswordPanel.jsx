import { Save, X } from 'lucide-react'
import { readForm } from '../../utils/form'

export function PasswordPanel({ api, showMessage, onClose }) {
  async function updatePassword(event) {
    event.preventDefault()
    try {
      const result = await api('/api/account/password', {
        method: 'PATCH',
        body: JSON.stringify(readForm(event.currentTarget)),
      })
      event.currentTarget.reset()
      showMessage(result)
      if (onClose) onClose()
    } catch (error) {
      showMessage(error.message, true)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-slide-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Update password</h3>
          <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        
        <form className="form-grid" onSubmit={updatePassword}>
          <label className="wide">
            Current password
            <input name="currentPassword" type="password" required placeholder="••••••••" />
          </label>
          <label className="wide">
            New password <span>(8-16 chars, 1 uppercase, 1 special)</span>
            <input
              name="newPassword"
              type="password"
              minLength="8"
              maxLength="16"
              pattern="^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$"
              title="Password must be 8-16 characters and include at least one uppercase letter and one special character"
              required
              placeholder="••••••••"
            />
          </label>
          <button className="primary-btn wide" type="submit" style={{ marginTop: '12px' }}>
            <Save size={16} />
            Save changes
          </button>
        </form>
      </div>
    </div>
  )
}
