import { useCallback, useEffect, useState } from 'react'
import { Search, Award, Coffee, Flame, Sparkles, TrendingUp, MessageSquare, Star, Check, X, Store } from 'lucide-react'
import { buildQuery } from '../../utils/query'
import { RatingRow } from './RatingRow'
import { Stat } from '../../components/ui/Stat'
import { formatRating } from '../../utils/formatters'

const defaultFilters = {
  name: '',
  address: '',
  sortBy: 'name',
  direction: 'asc',
}

// Curation pools (mirrored from RatingRow for consistency in images)
const cafeImages = [
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=400&q=80',
]

const foodImages = [
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
]

const boutiqueImages = [
  'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1481437156560-3205fa6ae26f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1567401893930-7becd1120414?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=400&q=80',
]

const bookImages = [
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80',
]

const generalImages = [
  'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580793241553-e9f1cde1d394?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?auto=format&fit=crop&w=400&q=80',
]

const getStoreImage = (name, id) => {
  const n = name.toLowerCase()
  let pool = generalImages
  if (n.includes('coffee') || n.includes('cafe') || n.includes('espresso') || n.includes('bakery')) {
    pool = cafeImages
  } else if (n.includes('pizza') || n.includes('restaurant') || n.includes('food') || n.includes('kitchen') || n.includes('grill') || n.includes('burger')) {
    pool = foodImages
  } else if (n.includes('fashion') || n.includes('boutique') || n.includes('clothing') || n.includes('apparel') || n.includes('store') || n.includes('shop')) {
    pool = boutiqueImages
  } else if (n.includes('book') || n.includes('library')) {
    pool = bookImages
  }
  const idx = Math.abs(id) % pool.length
  return pool[idx]
}

export function UserStores({ api, showMessage, activeView }) {
  const [stores, setStores] = useState([])
  const [filters, setFilters] = useState(defaultFilters)
  const [selectedCompare, setSelectedCompare] = useState([])
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)

  const loadStores = useCallback(async () => {
    const query = buildQuery(filters)
    setStores(await api(`/api/user/stores?${query}`))
  }, [api, filters])

  useEffect(() => {
    loadStores().catch((error) => showMessage(error.message, true))
  }, [loadStores, showMessage])

  async function saveRating(storeId, rating) {
    try {
      await api(`/api/user/stores/${storeId}/rating`, {
        method: 'PUT',
        body: JSON.stringify({ rating: Number(rating) }),
      })
      showMessage('Rating saved')
      await loadStores()
    } catch (error) {
      showMessage(error.message, true)
    }
  }

  function handleCompareToggle(store) {
    setSelectedCompare(prev => {
      const exists = prev.find(item => item.id === store.id)
      if (exists) {
        return prev.filter(item => item.id !== store.id)
      }
      if (prev.length >= 3) {
        showMessage('You can compare a maximum of 3 stores.', true)
        return prev
      }
      return [...prev, store]
    })
  }

  // Calculate live statistics for user
  const userReviewsCount = stores.filter(s => s.userRating).length
  const totalStoresCount = stores.length
  const ratedStores = stores.filter(s => s.userRating)
  const averageScore = ratedStores.length
    ? (ratedStores.reduce((acc, s) => acc + s.userRating, 0) / ratedStores.length).toFixed(1)
    : '0.0'

  return (
    <div className="grid">
      {/* Top Banner & Critique Profile */}
      <div className="span-8" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text)', marginBottom: '6px' }}>
          Discover local favorites
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: '1.4' }}>
          Find, rate, and review the best coffee shops, restaurants, boutiques, and bookstores in your city. Unlocking achievements and guide status as you review!
        </p>
      </div>
      
      <div className="span-4">
        <div className="profile-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '11px' }}>LG</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '12px', color: 'var(--text)', fontWeight: '500', margin: 0 }}>Reviewer Level 3</h3>
              <span style={{ fontSize: '9px', color: 'var(--muted)' }}>Local Taste Guide</span>
            </div>
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: '65%' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--muted)' }}>
            <span>650 / 1000 XP</span>
            <span>350 XP to Level 4</span>
          </div>
          <div className="badges-row">
            <div className="badge-item" title="First Reviewer"><Award size={14} /></div>
            <div className="badge-item" title="Cafe Enthusiast"><Coffee size={14} /></div>
            <div className="badge-item" title="Trending Contributor"><Flame size={14} /></div>
            <div className="badge-item" title="Active Critic" style={{ opacity: 0.4 }}><Sparkles size={14} /></div>
          </div>
        </div>
      </div>

      {/* Light-colored Stats Cards Row (Not Dark, for User Login) */}
      <div className="span-12">
        <div className="stat-grid" style={{ marginBottom: '8px' }}>
          <Stat label="My reviews" value={userReviewsCount} icon={MessageSquare} color="light-purple" trend="Level 3 Critic" />
          <Stat label="Stores explored" value={totalStoresCount} icon={Store} color="light-blue" trend="All local spots" />
          <Stat label="Your avg rating" value={averageScore} icon={Star} color="light-coral" trend="Out of 5 stars" />
        </div>
      </div>

      {/* Full Width Search & Filter */}
      <div className="span-12">
        <form className="search-filter-row" onSubmit={(e) => { e.preventDefault(); loadStores(); }} style={{ background: '#ffffff', borderRadius: '14px', border: '0.5px solid rgba(0,0,0,0.07)', marginBottom: '4px' }}>
          <div className="search-input-wrapper">
            <Search className="search-icon-inside" size={14} />
            <input
              placeholder="Search stores by name or address..."
              value={filters.name}
              onChange={(e) => {
                const val = e.target.value
                setFilters(prev => ({ ...prev, name: val, address: val }))
              }}
            />
          </div>
          <select
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) => {
              const val = e.target.value
              setFilters(prev => ({ ...prev, sortBy: val }))
            }}
          >
            <option value="name">Sort by name</option>
            <option value="address">Sort by address</option>
            <option value="email">Sort by email</option>
          </select>
          <button className="primary-btn" type="submit">
            Apply
          </button>
        </form>
      </div>

      {/* Main Content Splitted */}
      <div className="span-8">
        <div className="store-cards-grid">
          {stores.length ? (
            stores.map((storeItem) => (
              <RatingRow
                key={storeItem.id}
                storeItem={storeItem}
                onSave={saveRating}
                onCompareToggle={handleCompareToggle}
                isComparing={!!selectedCompare.find(item => item.id === storeItem.id)}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '12px', gridColumn: 'span 2' }}>
              No stores found.
            </div>
          )}
        </div>
      </div>

      <div className="span-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Trending Stores Widget */}
        <div className="trending-panel">
          <h3 style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={12} style={{ color: '#D85A30' }} />
            Trending Stores
          </h3>
          <div className="trending-item">
            <img className="trending-thumb" src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=80&q=80" alt="Cafe" />
            <div className="trending-details">
              <div className="trending-name">The Espresso Club</div>
              <div className="trending-cat">Coffee Shop • 0.8 miles</div>
            </div>
            <div className="trending-rating">
              <Star size={10} fill="currentColor" />
              4.8
            </div>
          </div>
          <div className="trending-item">
            <img className="trending-thumb" src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=80&q=80" alt="Pizza" />
            <div className="trending-details">
              <div className="trending-name">Pizzeria Rustica</div>
              <div className="trending-cat">Italian • 1.4 miles</div>
            </div>
            <div className="trending-rating">
              <Star size={10} fill="currentColor" />
              4.7
            </div>
          </div>
          <div className="trending-item">
            <img className="trending-thumb" src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=80&q=80" alt="Boutique" />
            <div className="trending-details">
              <div className="trending-name">Vogue Galleria</div>
              <div className="trending-cat">Fashion Boutique • 2.1 miles</div>
            </div>
            <div className="trending-rating">
              <Star size={10} fill="currentColor" />
              4.5
            </div>
          </div>
        </div>

        {/* Live Community Feed Widget */}
        <div className="feed-panel">
          <h3 style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={12} style={{ color: '#534AB7' }} />
            Community Activity
          </h3>
          <div className="feed-item">
            <div className="feed-avatar">AM</div>
            <div className="feed-content">
              <span className="feed-user">Aman</span> <span className="feed-action">rated</span> <span className="feed-store">The Espresso Club</span>
              <span className="feed-comment">"The caramel macchiato is absolute heaven!"</span>
            </div>
          </div>
          <div className="feed-item">
            <div className="feed-avatar">KP</div>
            <div className="feed-content">
              <span className="feed-user">Karan</span> <span className="feed-action">rated</span> <span className="feed-store">Pizzeria Rustica</span>
              <span className="feed-comment">"Crispy wood-fired base, fresh mozzarella."</span>
            </div>
          </div>
          <div className="feed-item">
            <div className="feed-avatar">RD</div>
            <div className="feed-content">
              <span className="feed-user">Rhea</span> <span className="feed-action">rated</span> <span className="feed-store">Bookworm Sanctuary</span>
              <span className="feed-comment">"Found a rare first-edition copy today."</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Compare Action Shelf */}
      {selectedCompare.length > 0 && (
        <div className="compare-bar">
          <div className="compare-bar-content">
            <div className="compare-bar-info">
              <span className="compare-count">{selectedCompare.length}</span>
              <span className="compare-bar-text">stores chosen to compare (max 3)</span>
            </div>
            <div className="compare-bar-stores">
              {selectedCompare.map(store => (
                <div key={store.id} className="compare-bar-pill">
                  <span>{store.name}</span>
                  <button type="button" className="compare-pill-remove" onClick={() => handleCompareToggle(store)}>
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
            <div className="compare-bar-actions">
              <button type="button" className="compare-clear-btn" onClick={() => setSelectedCompare([])}>
                Clear
              </button>
              <button
                type="button"
                className="primary-btn compare-btn-trigger"
                disabled={selectedCompare.length < 2}
                onClick={() => setIsCompareModalOpen(true)}
              >
                Compare & Diff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-side Store Comparison Diff Modal */}
      {isCompareModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCompareModalOpen(false)}>
          <div className="compare-modal-card animate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ color: '#534AB7' }} />
                <h3 style={{ margin: 0 }}>Store Feature Comparison & Diff</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsCompareModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="compare-modal-body">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Attributes</th>
                    {selectedCompare.map(store => (
                      <th key={store.id} style={{ width: `${80 / selectedCompare.length}%` }}>
                        <div className="compare-th-content">
                          <img className="compare-store-thumb" src={getStoreImage(store.name, store.id)} alt="" />
                          <div className="compare-store-title">{store.name}</div>
                          <button type="button" className="compare-remove-link" onClick={() => handleCompareToggle(store)}>
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="compare-attr-name">Overall Rating</td>
                    {selectedCompare.map(store => {
                      const isWinner = selectedCompare.every(other => (other.rating || 0) <= (store.rating || 0))
                      return (
                        <td key={store.id} className={isWinner ? 'compare-winner-cell' : ''}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: isWinner ? 500 : 400 }}>
                            <Star size={12} fill="currentColor" style={{ color: '#D85A30' }} />
                            <span>{formatRating(store.rating)}</span>
                            {isWinner && <span className="winner-badge">Best</span>}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td className="compare-attr-name">Address</td>
                    {selectedCompare.map(store => (
                      <td key={store.id}>{store.address || 'No address provided'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="compare-attr-name">Price Category</td>
                    {selectedCompare.map(store => (
                      <td key={store.id}>
                        <span className="price-tag" style={{ color: store.id % 2 === 0 ? '#0F6E56' : '#534AB7', fontWeight: 500 }}>
                          {store.id % 2 === 0 ? '$$ (Moderate)' : '$$$ (Premium)'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="compare-attr-name">Opening Hours</td>
                    {selectedCompare.map(store => (
                      <td key={store.id}>{store.id % 2 === 0 ? '08:00 AM - 09:00 PM' : '07:00 AM - 10:00 PM'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="compare-attr-name">Free Wi-Fi</td>
                    {selectedCompare.map(store => {
                      const hasWifi = store.id % 3 !== 0
                      return (
                        <td key={store.id} className={hasWifi ? 'diff-highlight-positive' : 'diff-highlight-negative'}>
                          {hasWifi ? <Check size={14} style={{ color: '#0F6E56' }} /> : <X size={14} style={{ color: '#993556' }} />}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td className="compare-attr-name">Parking Available</td>
                    {selectedCompare.map(store => {
                      const hasParking = store.id % 2 === 0
                      return (
                        <td key={store.id} className={hasParking ? 'diff-highlight-positive' : 'diff-highlight-negative'}>
                          {hasParking ? <Check size={14} style={{ color: '#0F6E56' }} /> : <X size={14} style={{ color: '#993556' }} />}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td className="compare-attr-name">Outdoor Seating</td>
                    {selectedCompare.map(store => {
                      const hasSeating = store.id % 4 !== 2
                      return (
                        <td key={store.id} className={hasSeating ? 'diff-highlight-positive' : 'diff-highlight-negative'}>
                          {hasSeating ? <Check size={14} style={{ color: '#0F6E56' }} /> : <X size={14} style={{ color: '#993556' }} />}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>

              <div className="diff-insight-panel">
                <h4>Diff Insights</h4>
                <p>
                  Highlights: The selected stores differ primarily in Wi-Fi availability and outdoor seating options.{' '}
                  {selectedCompare.length > 1 && (
                    <>
                      <strong>{selectedCompare.slice().sort((a,b) => (b.rating || 0) - (a.rating || 0))[0]?.name}</strong> holds the highest rating at{' '}
                      <strong>{formatRating(selectedCompare.slice().sort((a,b) => (b.rating || 0) - (a.rating || 0))[0]?.rating)}</strong>.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
