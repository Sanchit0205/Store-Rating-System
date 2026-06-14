import { AdminDashboard } from './admin/AdminDashboard'
import { OwnerDashboard } from './owner/OwnerDashboard'
import { UserStores } from './user/UserStores'

export function RoleApp({ api, role, showMessage, activeView }) {
  if (role === 'ADMIN') {
    return <AdminDashboard api={api} showMessage={showMessage} activeView={activeView} />
  }

  if (role === 'OWNER') {
    return <OwnerDashboard api={api} showMessage={showMessage} activeView={activeView} />
  }

  return <UserStores api={api} showMessage={showMessage} activeView={activeView} />
}
