import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { RATING_VALUES } from '../../constants/ratings'
import { formatRating } from '../../utils/formatters'

// Curation pools for diverse, high-quality images
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

const getStoreDetails = (name) => {
  const n = name.toLowerCase()
  if (n.includes('coffee') || n.includes('cafe') || n.includes('espresso') || n.includes('bakery')) {
    return {
      desc: 'Artisanal coffee house serving freshly roasted single-origin espresso, home-baked sweet pastries, and light breakfast in a cozy ambient space.',
      tags: ['Cafe', 'Coffee', 'Workspace', 'Pastries']
    }
  }
  if (n.includes('pizza') || n.includes('restaurant') || n.includes('food') || n.includes('kitchen') || n.includes('grill') || n.includes('burger')) {
    return {
      desc: 'Experience fine casual dining with chef-inspired gourmet dishes, farm-to-table organic ingredients, and local craft beers.',
      tags: ['Restaurant', 'Foodie', 'Casual', 'Gourmet']
    }
  }
  if (n.includes('book') || n.includes('library')) {
    return {
      desc: 'Charming neighborhood independent bookstore hosting weekly author signings, rare editions, and comfortable window reading benches.',
      tags: ['Books', 'Community', 'Retail', 'Cozy']
    }
  }
  return {
    desc: 'Premium local boutique featuring hand-crafted goods, sustainable fashion designs, lifestyle accessories, and custom home gifts.',
    tags: ['Boutique', 'Lifestyle', 'Shopping', 'Curated']
  }
}

export function RatingRow({ onSave, storeItem, onCompareToggle, isComparing }) {
  const [rating, setRating] = useState(storeItem.userRating || 1)
  const [hoverRating, setHoverRating] = useState(0)
  const [clickedStar, setClickedStar] = useState(null)

  useEffect(() => {
    setRating(storeItem.userRating || 1)
  }, [storeItem.userRating])

  const displayRating = hoverRating || rating
  const imageUrl = getStoreImage(storeItem.name, storeItem.id)
  const details = getStoreDetails(storeItem.name)

  return (
    <div className={`store-detail-card ${isComparing ? 'comparing-active' : ''}`}>
      <div className="store-image-banner">
        <img
          src={imageUrl}
          alt={storeItem.name}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80'
          }}
        />
        {onCompareToggle && (
          <div
            className={`store-compare-overlay-badge ${isComparing ? 'checked' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCompareToggle(storeItem)
            }}
          >
            <input
              type="checkbox"
              checked={isComparing}
              readOnly
              style={{
                cursor: 'pointer',
                width: '12px',
                height: '12px',
                accentColor: '#534AB7',
                margin: 0,
              }}
            />
            <span>Compare</span>
          </div>
        )}
        <div className="store-rating-overlay-badge">
          <Star className="star-icon" size={10} fill="currentColor" />
          <span>{formatRating(storeItem.rating)}</span>
        </div>
      </div>
      
      <div className="store-card-body">
        <h3 className="store-card-title" title={storeItem.name}>{storeItem.name}</h3>
        <p className="store-card-address">{storeItem.address || 'No address provided'}</p>
        <p className="store-card-description">{details.desc}</p>
        
        <div className="store-card-tags">
          {details.tags.map((tag) => (
            <span key={tag} className="tag-badge">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="store-card-footer">
          <form
            className="store-rate-action-row"
            onSubmit={(event) => {
              event.preventDefault()
              onSave(storeItem.id, rating)
            }}
          >
            <div className="store-user-rating-info">
              <span className="rating-label">Your rating</span>
              <span className="rating-val">
                {storeItem.userRating ? `${storeItem.userRating} / 5` : 'Not rated'}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="stars-row" onMouseLeave={() => setHoverRating(0)}>
                {RATING_VALUES.map((val) => {
                  const isFilled = val <= displayRating
                  const isPopped = clickedStar === val

                  return (
                    <button
                      key={val}
                      type="button"
                      className={`star-btn ${isFilled ? 'filled' : ''} ${isPopped ? 'active-pop' : ''}`}
                      onMouseEnter={() => setHoverRating(val)}
                      onClick={() => {
                        setRating(val)
                        setClickedStar(val)
                        setTimeout(() => setClickedStar(null), 300)
                      }}
                    >
                      <Star size={16} fill={isFilled ? 'currentColor' : 'none'} />
                    </button>
                  )
                })}
              </div>
              <button
                className="primary-btn"
                type="submit"
                style={{
                  minHeight: '28px',
                  padding: '0 8px',
                  fontSize: '11px',
                  borderRadius: '6px',
                }}
              >
                Rate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
