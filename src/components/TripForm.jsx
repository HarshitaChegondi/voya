import { useState, forwardRef, useImperativeHandle } from 'react'

const today = new Date().toISOString().split('T')[0]

const INCLUDE = [
  { val: 'flights',     icon: '✈️', label: 'Flights'     },
  { val: 'hotels',      icon: '🏨', label: 'Hotels'      },
  { val: 'restaurants', icon: '🍽️', label: 'Restaurants' },
]

const TripForm = forwardRef(({ onSubmit, onClose, initialFrom = '', initialTo = '' }, ref) => {
  const [from,    setFrom]    = useState(initialFrom)
  const [to,      setTo]      = useState(initialTo)
  const [depart,  setDepart]  = useState('')
  const [returnD, setReturnD] = useState('')
  const [include, setInclude] = useState(['flights', 'hotels'])
  const [errors,  setErrors]  = useState({})

  const clearErr = (key) => setErrors(p => ({ ...p, [key]: '' }))

  const toggle = (val) =>
    setInclude(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])

  const validate = () => {
    const e = {}
    if (!from.trim())  e.from   = 'Required'
    if (!to.trim())    e.to     = 'Required'
    if (!depart)       e.depart = 'Required'
    else if (depart < today) e.depart = 'Must be today or later'
    if (returnD && returnD < depart) e.returnD = 'Must be after depart date'
    if (include.length === 0) e.include = 'Pick at least one'
    return e
  }

  // exposed to parent via ref so the main send button can trigger it
  useImperativeHandle(ref, () => ({
    submit: () => {
      const e = validate()
      if (Object.keys(e).length) { setErrors(e); return null }

      const dateRange = returnD
        ? `from ${depart} to ${returnD}`
        : `on ${depart}`

      const query = `Plan a trip from ${from} to ${to} ${dateRange}. Include: ${include.join(', ')}.`
      onSubmit(query)
      return query
    }
  }))

  return (
    <div className="trip-form">
      <div className="trip-form-header">
        <span className="trip-form-title">✈️ Plan your trip</span>
        <button className="trip-form-close" onClick={onClose} aria-label="Close">
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* row 1: from → to */}
      <div className="tf-row">
        <div className="tf-field">
          <label>From</label>
          <input
            placeholder="City or airport"
            value={from}
            onChange={e => { setFrom(e.target.value); clearErr('from') }}
            className={errors.from ? 'tf-err' : ''}
          />
          {errors.from && <span className="tf-errmsg">{errors.from}</span>}
        </div>

        <div className="tf-arrow">→</div>

        <div className="tf-field">
          <label>To</label>
          <input
            placeholder="City or airport"
            value={to}
            onChange={e => { setTo(e.target.value); clearErr('to') }}
            className={errors.to ? 'tf-err' : ''}
          />
          {errors.to && <span className="tf-errmsg">{errors.to}</span>}
        </div>
      </div>

      {/* row 2: depart → return */}
      <div className="tf-row">
        <div className="tf-field">
          <label>Depart</label>
          <input
            type="date"
            min={today}
            value={depart}
            onChange={e => { setDepart(e.target.value); clearErr('depart') }}
            className={errors.depart ? 'tf-err' : ''}
          />
          {errors.depart && <span className="tf-errmsg">{errors.depart}</span>}
        </div>

        <div className="tf-arrow">→</div>

        <div className="tf-field">
          <label>Return <span className="tf-optional">(optional)</span></label>
          <input
            type="date"
            min={depart || today}
            value={returnD}
            onChange={e => { setReturnD(e.target.value); clearErr('returnD') }}
            className={errors.returnD ? 'tf-err' : ''}
          />
          {errors.returnD && <span className="tf-errmsg">{errors.returnD}</span>}
        </div>
      </div>

      {/* row 3: include chips */}
      <div className="tf-chips-row">
        <span className="tf-chips-label">Include</span>
        <div className="tf-chips">
          {INCLUDE.map(({ val, icon, label }) => (
            <button
              key={val}
              type="button"
              className={`tf-chip ${include.includes(val) ? 'on' : ''}`}
              onClick={() => { toggle(val); clearErr('include') }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
        {errors.include && <span className="tf-errmsg">{errors.include}</span>}
      </div>
    </div>
  )
})

TripForm.displayName = 'TripForm'
export default TripForm
