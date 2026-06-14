import { useEffect, useState } from 'react'

export function Stat({ label, value, icon: IconComponent, color = 'purple', trend = '+12% this week' }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const num = Number(value)
    if (value === null || value === undefined || isNaN(num)) {
      setDisplayValue(value ?? '')
      return
    }

    // Delay animation trigger by 500ms
    const startDelay = setTimeout(() => {
      const isFloat = num % 1 !== 0
      const duration = 800 // ms
      const startTime = performance.now()
      let animationFrameId

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const currentVal = progress * num

        if (isFloat) {
          setDisplayValue(currentVal.toFixed(1))
        } else {
          setDisplayValue(Math.floor(currentVal))
        }

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate)
        } else {
          setDisplayValue(value)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }, 500)

    return () => clearTimeout(startDelay)
  }, [value])

  return (
    <div className={`stat-card ${color}`}>
      <div className="card-top">
        <div>
          {IconComponent && (
            <div className="card-icon-box">
              <IconComponent size={16} />
            </div>
          )}
          <div className="card-label">{label}</div>
        </div>
        {trend && <span className="trend-badge">{trend}</span>}
      </div>
      <div className="card-bottom">
        <strong className="card-number">{displayValue}</strong>
      </div>
    </div>
  )
}
