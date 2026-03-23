import { useState, useEffect } from 'react'
import Logo from './Logo'

// strip $ signs and parse price safely
const parsePrice = (val) =>
  parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0

// Hotel Cards
const HotelCards = ({ data }) => {
  const [selected, setSelected] = useState(null)
  if (!data || !Array.isArray(data) || data.length === 0) return null

  // lowest price = best value
  const prices  = data.map(h => parsePrice(h.price))
  const minPrice = Math.min(...prices)

  const openBooking = (h) => {
    const url = `https://www.google.com/travel/hotels?q=${encodeURIComponent(h.name + ' hotel')}`
    window.open(url, '_blank')
  }

  return (
    <div className="cards-wrapper">
      <p className="cards-label">🏨 Hotels found for you:</p>
      <div className="hotel-cards">
        {data.map((h, i) => {
          const price  = parsePrice(h.price)
          const isBest = price === minPrice
          const isSel  = selected === i
          return (
            <div
              key={i}
              className={`hotel-card ${isBest ? 'best' : ''} ${isSel ? 'selected-card' : ''}`}
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => setSelected(i)}
            >
              {isBest && <div className="best-badge">Best value</div>}
              <h4>{h.name}</h4>
              <p className="rating">⭐ {h.rating}</p>
              <p className="location">📍 {h.location}</p>
              <p className="amenities">{h.amenities}</p>
              <p className="price">${price}<span>/night</span></p>
              <button
                className="select-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelected(i)
                  openBooking(h)
                }}
              >
                {isSel ? 'Selected ✓' : 'Book →'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

//Flight Cards
const FlightCards = ({ data }) => {
  const [selected, setSelected] = useState(null)
  if (!data || !Array.isArray(data) || data.length === 0) return null

  // sort cheapest first so order is logical
  const sorted = [...data].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
  const minPrice = parsePrice(sorted[0].price)

  const openBooking = (f) => {
    const from  = (f.from  || '').replace(/\(.*?\)/g, '').trim()
    const to    = (f.to    || '').replace(/\(.*?\)/g, '').trim()
    const query = `flights from ${from} to ${to}`
    const url   = `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`
    window.open(url, '_blank')
  }

  return (
    <div className="cards-wrapper">
      <p className="cards-label">✈️ Flight options — cheapest first:</p>
      <div className="flight-cards">
        {sorted.map((f, i) => {
          const price  = parsePrice(f.price)
          const isBest = price === minPrice
          const isSel  = selected === i
          return (
            <div
              key={i}
              className={`flight-card ${isBest ? 'best' : ''} ${isSel ? 'selected-card' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelected(i)}
            >
              <div className="flight-time">
                <h4>{f.depart}</h4>
                <span>{f.from}</span>
              </div>

              <div className="flight-route">
                <span>{f.duration} · {f.stops}</span>
                <div className="route-line">
                  <div />
                  {/* plane always faces right */}
                  <svg width="12" height="12" viewBox="0 0 18 14" fill="none">
                    <path d="M18 7L4 2l3 5-3 5L18 7z" fill="var(--accent)"/>
                  </svg>
                  <div />
                </div>
                <span>{f.airline}</span>
              </div>

              <div className="flight-time" style={{ textAlign: 'right' }}>
                <h4>{f.arrive}</h4>
                <span>{f.to}</span>
              </div>

              <div className="flight-price">
                <h4>${price}</h4>
                <button
                  className="select-btn"
                  style={{ marginTop: '4px' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected(i)
                    openBooking(f)
                  }}
                >
                  {isBest ? 'Cheapest ✓' : isSel ? 'Selected ✓' : 'Book →'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

//Itinerary Cards
const ItineraryCards = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null
  return (
    <div className="cards-wrapper">
      <p className="cards-label">📅 Your itinerary:</p>
      <div className="itinerary-cards">
        {data.map((day, i) => (
          <div key={i} className="day-card">
            <div className="day-header">{day.label}</div>
            <div className="day-items">
              {(day.items || []).map((item, j) => (
                <div key={j} className="day-item">
                  <span className="time">{item.time}</span>
                  <span className="event">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

//Packing List
const PackingList = ({ data }) => {
  const [checked, setChecked] = useState([])
  if (!data || !Array.isArray(data) || data.length === 0) return null
  const toggle = (i) => setChecked(prev =>
    prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
  )
  return (
    <div className="cards-wrapper">
      <p className="cards-label">🧳 Packing list:</p>
      <div className="packing-list">
        {data.map((item, i) => (
          <div
            key={i}
            className={`packing-item ${checked.includes(i) ? 'checked' : ''}`}
            onClick={() => toggle(i)}
          >
            <div className={`packing-checkbox ${checked.includes(i) ? 'checked' : ''}`}>
              {checked.includes(i) && (
                <svg width="8" height="8" viewBox="0 0 9 9" fill="none">
                  <polyline points="1.5,4.5 3.5,6.5 7.5,2.5" stroke="white" strokeWidth="1.5"/>
                </svg>
              )}
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Tips
const TipsList = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null
  const colors = ['yellow', 'green', 'purple']
  return (
    <div className="cards-wrapper">
      <p className="cards-label">💡 Tips:</p>
      <div className="tips-list">
        {data.map((tip, i) => (
          <div key={i} className={`tip-item ${colors[i % 3]}`}>{tip}</div>
        ))}
      </div>
    </div>
  )
}

//Comparison Table
const ComparisonTable = ({ data }) => {
  if (!data || !data.options || !data.rows) return null
  return (
    <div className="cards-wrapper">
      <p className="cards-label">📋 Comparison:</p>
      <div className="comparison-table">
        <div className="ct-header">
          <div className="ct-cell head"></div>
          {data.options.map((o, i) => (
            <div key={i} className="ct-cell head">{o}</div>
          ))}
        </div>
        {data.rows.map((row, i) => (
          <div key={i} className="ct-row">
            <div className="ct-cell label">{row.label}</div>
            {(row.values || []).map((v, j) => (
              <div key={j} className={`ct-cell ${v.win ? 'win' : v.bad ? 'bad' : 'val'}`}>
                {v.text}
              </div>
            ))}
          </div>
        ))}
      </div>
      {data.recommendation && (
        <div className="comparison-rec">💡 {data.recommendation}</div>
      )}
    </div>
  )
}

// Weather Card
const WeatherCard = ({ data }) => {
  if (!data) return null
  return (
    <div className="weather-card">
      <div className="weather-main">
        <div>
          <div className="weather-icon">{data.icon}</div>
          <div className="weather-temp">{data.temp}°C</div>
        </div>
        <div className="weather-info" style={{ flex: 1 }}>
          <h4>{data.city}</h4>
          <p>{data.description}</p>
          <div className="weather-tags">
            {(data.tags || []).map((t, i) => (
              <span key={i} className="weather-tag">{t}</span>
            ))}
          </div>
        </div>
        {data.tip && <p className="weather-tip">{data.tip}</p>}
      </div>
      {data.forecast && (
        <div className="forecast">
          {data.forecast.map((d, i) => (
            <div key={i} className="forecast-day">
              <p className="f-day">{d.day}</p>
              <p className="f-icon">{d.icon}</p>
              <p className="f-temp">{d.temp}°C</p>
              <p className="f-desc">{d.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Loading Bubble — plane LEFT→RIGHT, text cycles every 1.8s
export const LoadingBubble = () => {
  const [frame, setFrame] = useState(0)
  const labels = ['On the way...', 'Boarding...', 'Cruising...', 'Almost there...']

  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % 4), 1800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="message assistant">
      <div className="message-row">
        <div className="avatar"><Logo size={22} /></div>
        <div className="loading-bubble">
          <div className="plane-track">
            <svg width="90" height="20" viewBox="0 0 90 20" fill="none">
              <circle cx="6" cy="14" r="3" fill="rgba(167,139,250,0.2)" stroke="rgba(167,139,250,0.4)" strokeWidth="1"/>
              <circle cx="84" cy="14" r="3" fill="rgba(167,139,250,0.2)" stroke="rgba(167,139,250,0.4)" strokeWidth="1"/>
              <path d="M9 14 Q45 2 81 14" stroke="rgba(167,139,250,0.2)" strokeWidth="0.8" strokeDasharray="3 2" fill="none"/>
            </svg>
            {/* plane faces RIGHT, CSS animates left→right */}
            <div className="plane-icon">
              <svg width="14" height="12" viewBox="0 0 18 14" fill="none">
                <path d="M18 7L4 2l3 5-3 5L18 7z" fill="var(--accent)"/>
              </svg>
            </div>
          </div>
          <span className="loading-text">{labels[frame]}</span>
        </div>
      </div>
    </div>
  )
}

// Error Bubble
export const ErrorBubble = ({ onRetry }) => (
  <div className="message assistant">
    <div className="message-row">
      <div className="avatar"><Logo size={22} /></div>
      <div className="error-bubble">
        <div className="error-title">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="var(--danger)" strokeWidth="1.2"/>
            <line x1="7" y1="4.5" x2="7" y2="7.5" stroke="var(--danger)" strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="7" cy="9.5" r=".7" fill="var(--danger)"/>
          </svg>
          Something went wrong
        </div>
        <p>{typeof onRetry === 'function' ? 'Unable to reach Claude. Check your connection.' : 'Unable to reach Claude.'}</p>
        <button className="retry-btn" onClick={onRetry}>Try again</button>
      </div>
    </div>
  </div>
)

// Main MessageBubble
const MessageBubble = ({ message, onEdit }) => {
  const { role, content, type, data, weather } = message
  const [hovering, setHovering] = useState(false)
  const [editing, setEditing]   = useState(false)
  const [editText, setEditText] = useState(content)

  const handleSaveEdit = () => {
    const trimmed = editText.trim()
    if (!trimmed || trimmed === content) { setEditing(false); return }
    setEditing(false)
    onEdit && onEdit(message, trimmed)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveEdit() }
    if (e.key === 'Escape') { setEditing(false); setEditText(content) }
  }

  if (role === 'user') {
    return (
      <div
        className="message user"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="message-row" style={{ alignItems: 'flex-end', gap: '8px' }}>
          {!editing && (
            <button
              onClick={() => { setEditing(true); setEditText(content) }}
              title="Edit message"
              style={{
                opacity: hovering ? 1 : 0,
                transition: 'opacity 0.15s',
                background: 'none',
                border: '0.5px solid var(--accent-border)',
                borderRadius: '6px',
                padding: '4px 6px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, maxWidth: '82%' }}>
              <textarea
                autoFocus
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={Math.min(editText.split('\n').length + 1, 5)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1.5px solid var(--accent)',
                  borderRadius: 'var(--radius)',
                  padding: '9px 12px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font)',
                  resize: 'none',
                  outline: 'none',
                  lineHeight: '1.6',
                  width: '100%',
                  boxShadow: '0 0 0 3px var(--accent-dim)',
                }}
              />
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => { setEditing(false); setEditText(content) }}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '0.5px solid var(--accent-border)',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: 'var(--accent)',
                    color: '#13121a',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                  }}
                >
                  Send ↵
                </button>
              </div>
            </div>
          ) : (
            <div className="bubble">{content}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="message assistant">
      <div className="message-row">
        <div className="avatar"><Logo size={22} /></div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {content && (
            <div className="bubble">
              <p className="bubble-label">VOYA</p>
              {content}
            </div>
          )}
          {type === 'hotels'     && data && <HotelCards data={data} />}
          {type === 'flights'    && data && <FlightCards data={data} />}
          {type === 'itinerary'  && data && <ItineraryCards data={data} />}
          {type === 'packing'    && data && <PackingList data={data} />}
          {type === 'tips'       && data && <TipsList data={data} />}
          {type === 'comparison' && data && <ComparisonTable data={data} />}
          {weather               && <WeatherCard data={weather} />}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
