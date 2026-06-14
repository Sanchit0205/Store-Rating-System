import { useCallback, useEffect, useMemo, useState } from 'react'
import { Star, Store } from 'lucide-react'
import { DataTable } from '../../components/ui/DataTable'
import { Stat } from '../../components/ui/Stat'
import { formatRating } from '../../utils/formatters'

export function OwnerDashboard({ api, showMessage, activeView }) {
  const [dashboard, setDashboard] = useState(null)

  const loadDashboard = useCallback(async () => {
    setDashboard(await api('/api/owner/dashboard'))
  }, [api])

  useEffect(() => {
    loadDashboard().catch((error) => showMessage(error.message, true))
  }, [loadDashboard, showMessage])

  const rows = useMemo(
    () =>
      dashboard?.ratings?.map((item) => [
        <span className="name-cell">{item.name}</span>,
        item.email,
        item.address || '',
        formatRating(item.rating),
      ]) || [],
      [dashboard],
  )

  return (
    <div className="grid">
      <div className="span-12">
        <div className="stat-grid">
          <Stat label="Your store" value={dashboard?.storeName || 'Loading...'} icon={Store} color="light-blue" trend="Verified Store" />
          <Stat label="Average rating" value={dashboard?.averageRating} icon={Star} color="light-coral" trend="Out of 5 stars" />
        </div>
      </div>

      <div className="span-12">
        <div className="table-card">
          <div className="table-header-row">
            <h2>Customer reviews</h2>
          </div>
          <DataTable headers={['Customer Name', 'Email', 'Address', 'Rating Given']} rows={rows} />
          <div className="table-pagination">
            <span className="pagination-info">Showing {rows.length} store ratings</span>
            <div className="pagination-controls">
              <button className="pagination-btn" type="button" disabled>Prev</button>
              <button className="pagination-btn" type="button" disabled>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
