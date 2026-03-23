const extractChipDest = (chip) => {
  const clean = chip.replace(/^[\p{Emoji}\s]+/u, '').trim()
  const m = clean.match(/\bto\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i) ||
            clean.match(/\bin\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i) ||
            clean.match(/\bfor\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i)
  return m ? m[1] : ''
}

const WelcomeScreen = ({ chips, onChipClick, onOpenForm }) => {
  const destinations = [
    { flag: '🇯🇵', city: 'Tokyo',  country: 'Japan',     tag: 'Cherry Blossom',   temp: '18°C', icon: '☀️', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',  border: 'rgba(167,139,250,0.2)'  },
    { flag: '🇮🇹', city: 'Rome',   country: 'Italy',     tag: 'Spring Season',    temp: '22°C', icon: '🌤️', color: '#f9a8d4', bg: 'rgba(249,168,212,0.08)', border: 'rgba(249,168,212,0.18)' },
    { flag: '🇦🇪', city: 'Dubai',  country: 'UAE',       tag: 'Tax Free Shopping',temp: '32°C', icon: '🌞', color: '#fbbf24', bg: 'rgba(251,191,36,0.07)',  border: 'rgba(251,191,36,0.18)'  },
    { flag: '🇦🇺', city: 'Sydney', country: 'Australia', tag: 'Autumn Vibes',     temp: '24°C', icon: '⛅', color: '#48bb78', bg: 'rgba(72,187,120,0.07)',  border: 'rgba(72,187,120,0.18)'  },
  ]

  return (
    <div className="welcome-screen">

      {/* bg blobs */}
      <div className="welcome-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* main layout */}
      <div className="welcome-layout">

        {/* LEFT — centered hero */}
        <div className="welcome-hero">

          <div className="hero-title-wrap">
            <h1 className="welcome-title">
              Your AI Travel{' '}
              <span className="welcome-title-accent">Companion</span>
            </h1>
            <p className="hero-subtitle">
              Plan flights, hotels, itineraries and more
            </p>
          </div>

          {/* chips */}
          <div className="hero-chips">
            {chips.map((chip, i) => {
              const dest = extractChipDest(chip)
              return (
                <button
                  key={i}
                  className="hero-chip"
                  onClick={() => dest && onOpenForm
                    ? onOpenForm(dest)
                    : onChipClick(chip)
                  }
                >
                  {chip}
                </button>
              )
            })}
          </div>

        </div>

        {/* RIGHT — trending destinations */}
        <div className="welcome-right-panel">

          <p className="panel-label">🔥 Trending destinations</p>

          <div className="destination-grid">
            {destinations.map((d, i) => (
              <div
                key={i}
                className="dest-card"
                style={{ background: d.bg, borderColor: d.border }}
                onClick={() => onOpenForm ? onOpenForm(d.city) : onChipClick(`Plan a trip to ${d.city}`)}
              >
                <span className="dest-flag">{d.flag}</span>
                <p className="dest-city">{d.city}</p>
                <p className="dest-tag">{d.tag}</p>
                <span className="dest-weather" style={{ color: d.color, background: d.bg }}>
                  {d.temp} {d.icon}
                </span>
              </div>
            ))}
          </div>

          <div style={{ height: '0.5px', background: 'rgba(167,139,250,0.08)', margin: '4px 0' }} />

          <p className="panel-label">⚡ Quick actions</p>

          <div className="quick-actions">
            {[
              { emoji: '📋', label: 'Compare flight options',  prompt: 'Compare flight options for me' },
              { emoji: '🧳', label: 'Build a packing list',    prompt: 'Build a packing list for a business trip' },
              { emoji: '💰', label: 'Estimate trip budget',    prompt: 'Help me estimate the budget for my trip' },
            ].map((a, i) => (
              <button key={i} className="quick-action-btn" onClick={() => onChipClick(a.prompt)}>
                <span style={{ fontSize: '14px' }}>{a.emoji}</span>
                <span style={{ flex: 1, textAlign: 'left', fontSize: '11px' }}>{a.label}</span>
                <span style={{ fontSize: '10px', opacity: 0.35 }}>→</span>
              </button>
            ))}
          </div>

        </div>

      </div>

    </div>
  )
}

export default WelcomeScreen