import { useCallback, useEffect, useState } from 'react'
import { Store, UserPlus, Users, Star, Search, Edit3, Trash, Plus } from 'lucide-react'
import { DataTable } from '../../components/ui/DataTable'
import { Stat } from '../../components/ui/Stat'
import { formatRating } from '../../utils/formatters'
import { readForm } from '../../utils/form'
import { buildQuery } from '../../utils/query'

const defaultUserFilters = {
  name: '',
  email: '',
  address: '',
  role: '',
  sortBy: 'name',
  direction: 'asc',
}

const defaultStoreFilters = {
  name: '',
  email: '',
  address: '',
  sortBy: 'name',
  direction: 'asc',
}

export function AdminDashboard({ api, showMessage, activeView }) {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [userFilters, setUserFilters] = useState(defaultUserFilters)
  const [storeFilters, setStoreFilters] = useState(defaultStoreFilters)

  const loadDashboard = useCallback(async () => {
    setStats(await api('/api/admin/dashboard'))
  }, [api])

  const loadUsers = useCallback(async () => {
    const query = buildQuery(userFilters)
    setUsers(await api(`/api/admin/users?${query}`))
  }, [api, userFilters])

  const loadStores = useCallback(async () => {
    const query = buildQuery(storeFilters)
    setStores(await api(`/api/admin/stores?${query}`))
  }, [api, storeFilters])

  useEffect(() => {
    Promise.all([loadDashboard(), loadUsers(), loadStores()]).catch((error) => {
      showMessage(error.message, true)
    })
  }, [loadDashboard, loadStores, loadUsers, showMessage])

  async function createUser(event) {
    event.preventDefault()
    const form = event.currentTarget
    try {
      const result = await api('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(readForm(form)),
      })
      form.reset()
      showMessage(result)
      await Promise.all([loadDashboard(), loadUsers()])
    } catch (error) {
      showMessage(error.message, true)
    }
  }

  async function createStore(event) {
    event.preventDefault()
    const form = event.currentTarget
    try {
      const result = await api('/api/admin/stores', {
        method: 'POST',
        body: JSON.stringify(readForm(form)),
      })
      form.reset()
      showMessage(result)
      await Promise.all([loadDashboard(), loadStores()])
    } catch (error) {
      showMessage(error.message, true)
    }
  }

  return (
    <div className="grid">
      {activeView === 'dashboard' && (
        <>
          <div className="span-12">
            <div className="stat-grid">
              <Stat label="Users registered" value={stats?.totalUsers ?? 0} icon={Users} color="purple" trend="+12% this week" />
              <Stat label="Stores active" value={stats?.totalStores ?? 0} icon={Store} color="teal" trend="+8% this week" />
              <Stat label="Ratings submitted" value={stats?.totalRatings ?? 0} icon={Star} color="coral" trend="+24% this week" />
            </div>
          </div>

          <section className="panel span-6" style={{ background: '#ffffff', borderRadius: '14px', border: '0.5px solid rgba(0,0,0,0.07)', padding: '18px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '12px' }}>Add new user</h3>
            <form className="form-grid" onSubmit={createUser}>
              <label className="wide">
                Name <span>(20-60 characters)</span>
                <input name="name" minLength="20" maxLength="60" required placeholder="Full Name" />
              </label>
              <label>
                Email
                <input name="email" type="email" required placeholder="name@example.com" />
              </label>
              <label>
                Role
                <select name="role" defaultValue="USER">
                  <option>USER</option>
                  <option>OWNER</option>
                  <option>ADMIN</option>
                </select>
              </label>
              <label className="wide">
                Address <span>(Max 400 characters)</span>
                <textarea name="address" maxLength="400" placeholder="Street address" />
              </label>
              <label className="wide">
                Password <span>(8-16 chars, 1 uppercase, 1 special)</span>
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
              <button className="primary-btn wide" type="submit" style={{ marginTop: '6px' }}>
                <UserPlus size={16} />
                Add user
              </button>
            </form>
          </section>

          <section className="panel span-6" style={{ background: '#ffffff', borderRadius: '14px', border: '0.5px solid rgba(0,0,0,0.07)', padding: '18px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '12px' }}>Add new store</h3>
            <form className="form-grid" onSubmit={createStore}>
              <label className="wide">
                Name <span>(20-60 characters)</span>
                <input name="name" minLength="20" maxLength="60" required placeholder="Store Name" />
              </label>
              <label>
                Email
                <input name="email" type="email" required placeholder="store@example.com" />
              </label>
              <label>
                Owner ID
                <input name="ownerId" type="number" min="1" required placeholder="e.g. 2" />
              </label>
              <label className="wide">
                Address <span>(Max 400 characters)</span>
                <textarea name="address" maxLength="400" placeholder="Store address" />
              </label>
              <button className="primary-btn wide" type="submit" style={{ marginTop: '6px' }}>
                <Store size={16} />
                Add store
              </button>
            </form>
          </section>
        </>
      )}

      {activeView === 'users' && (
        <div className="span-12">
          <div className="table-card">
            <div className="table-header-row">
              <h2>Users</h2>
              <button className="primary-btn" type="button" onClick={() => {
                // Quick focus name input in dashboard tab
                const tabBtn = document.querySelector('button[aria-label="Add user"]');
                if (tabBtn) tabBtn.click();
              }}>
                <Plus size={14} />
                Add user
              </button>
            </div>
            
            <form className="search-filter-row" onSubmit={(e) => { e.preventDefault(); loadUsers(); }}>
              <div className="search-input-wrapper">
                <Search className="search-icon-inside" size={14} />
                <input
                  placeholder="Search users by name, email or address..."
                  value={userFilters.name}
                  onChange={(e) => {
                    const val = e.target.value
                    setUserFilters(prev => ({ ...prev, name: val, email: val, address: val }))
                  }}
                />
              </div>
              <select
                className="filter-select"
                value={userFilters.role}
                onChange={(e) => {
                  const val = e.target.value
                  setUserFilters(prev => ({ ...prev, role: val }))
                }}
              >
                <option value="">All roles</option>
                <option value="USER">User</option>
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
              <select
                className="filter-select"
                value={userFilters.sortBy}
                onChange={(e) => {
                  const val = e.target.value
                  setUserFilters(prev => ({ ...prev, sortBy: val }))
                }}
              >
                <option value="name">Sort by name</option>
                <option value="email">Sort by email</option>
                <option value="address">Sort by address</option>
                <option value="role">Sort by role</option>
              </select>
              <button className="primary-btn" type="submit">
                Apply
              </button>
            </form>

            <DataTable
              headers={['ID', 'Name', 'Email', 'Address', 'Role', 'Rating', 'Actions']}
              rows={users.map((user) => [
                user.id,
                <span className="name-cell">{user.name}</span>,
                user.email,
                user.address || '',
                <span className={`badge-pill ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>,
                user.rating == null ? 'No ratings' : formatRating(user.rating),
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="action-btn edit" type="button" title="Edit">
                    <Edit3 size={14} />
                  </button>
                  <button className="action-btn delete" type="button" title="Delete">
                    <Trash size={14} />
                  </button>
                </div>
              ])}
            />

            <div className="table-pagination">
              <span className="pagination-info">Showing {users.length} registered users</span>
              <div className="pagination-controls">
                <button className="pagination-btn" type="button" disabled>Prev</button>
                <button className="pagination-btn" type="button" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'stores' && (
        <div className="span-12">
          <div className="table-card">
            <div className="table-header-row">
              <h2>Stores</h2>
              <button className="primary-btn" type="button">
                <Plus size={14} />
                Add store
              </button>
            </div>
            
            <form className="search-filter-row" onSubmit={(e) => { e.preventDefault(); loadStores(); }}>
              <div className="search-input-wrapper">
                <Search className="search-icon-inside" size={14} />
                <input
                  placeholder="Search stores by name, email or address..."
                  value={storeFilters.name}
                  onChange={(e) => {
                    const val = e.target.value
                    setStoreFilters(prev => ({ ...prev, name: val, email: val, address: val }))
                  }}
                />
              </div>
              <select
                className="filter-select"
                value={storeFilters.sortBy}
                onChange={(e) => {
                  const val = e.target.value
                  setStoreFilters(prev => ({ ...prev, sortBy: val }))
                }}
              >
                <option value="name">Sort by name</option>
                <option value="email">Sort by email</option>
                <option value="address">Sort by address</option>
              </select>
              <button className="primary-btn" type="submit">
                Apply
              </button>
            </form>

            <DataTable
              headers={['Name', 'Email', 'Address', 'Rating', 'Owner', 'Actions']}
              rows={stores.map((storeItem) => [
                <span className="name-cell">{storeItem.name}</span>,
                storeItem.email,
                storeItem.address || '',
                formatRating(storeItem.rating),
                storeItem.ownerName || '',
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="action-btn edit" type="button" title="Edit">
                    <Edit3 size={14} />
                  </button>
                  <button className="action-btn delete" type="button" title="Delete">
                    <Trash size={14} />
                  </button>
                </div>
              ])}
            />

            <div className="table-pagination">
              <span className="pagination-info">Showing {stores.length} active stores</span>
              <div className="pagination-controls">
                <button className="pagination-btn" type="button" disabled>Prev</button>
                <button className="pagination-btn" type="button" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
