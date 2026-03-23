import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import MessageBubble, { LoadingBubble, ErrorBubble } from './components/MessageBubble'
import CostEstimator from './components/CostEstimator'
import WelcomeScreen from './components/WelcomeScreen'
import SearchModal from './components/Searchmodal'
import TripForm from './components/TripForm'

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY

const CHIPS = [
  '✈️ Find me flights to NYC next week',
  '🏨 Hotels near Midtown under $300',
  '🧳 Packing list for a 3-day business trip',
  '📋 Compare flying vs train to Chicago',
  '💡 Travel tips for first time in Tokyo',
]

const SYSTEM_PROMPT = `You are VOYA, an elegant AI travel companion for corporate travelers.

Always respond in valid JSON with this structure:
{
  "message": "your conversational response here",
  "type": "text | hotels | flights | itinerary | packing | tips | comparison",
  "data": [...],
  "cost": { "label": "...", "amount": 000 }
}

For hotels type, data should be an array of: { name, rating, location, amenities, price, best }
For flights type, data should be an array of: { from, to, depart, arrive, duration, stops, airline, price, best }
For itinerary type, data should be an array of: { label, items: [{ time, event }] }
For packing type, data is an array of strings
For tips type, data is an array of strings
For comparison type, data should be: { options: [...], rows: [{ label, values: [{ text, win, bad }] }], recommendation }
For text type, data is null

cost is optional - only include when a specific bookable item is mentioned (hotel, flight, meal).
Keep responses warm, concise and helpful. You are talking to busy corporate travelers.
IMPORTANT: Never ask follow-up questions. When given a destination or trip request, immediately respond with relevant structured data (flights, hotels, itinerary, etc.). Make reasonable assumptions for any missing details.`

const extractCity = (text) => {
  if (!text) return null
  const matches = text.match(/\b(New York|NYC|London|Tokyo|Chicago|San Francisco|Los Angeles|Paris|Dubai|Singapore|Sydney|Miami|Boston|Seattle|Austin|Denver)\b/i)
  return matches ? matches[0] : null
}

const fetchWeather = async (city) => {
  if (!WEATHER_KEY || !city) return null
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_KEY}&units=metric&cnt=3`
    )
    const data = await res.json()
    if (data.cod !== '200') return null

    const iconMap = { Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Snow: '❄️', Thunderstorm: '⛈️', Drizzle: '🌦️' }
    const current = data.list[0]
    const main = current.weather[0].main

    return {
      city: data.city.name,
      temp: Math.round(current.main.temp),
      icon: iconMap[main] || '🌤️',
      description: `${current.weather[0].description} · feels like ${Math.round(current.main.feels_like)}°C`,
      tags: [
        `💧 ${current.main.humidity}% humidity`,
        `💨 ${Math.round(current.wind.speed * 3.6)} km/h`,
      ],
      tip: main === 'Rain' ? 'Pack an umbrella 🌂' : main === 'Snow' ? 'Pack warm layers 🧥' : 'Comfortable weather 😊',
      forecast: data.list.slice(0, 3).map(d => ({
        day: new Date(d.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
        icon: iconMap[d.weather[0].main] || '🌤️',
        temp: Math.round(d.main.temp),
        desc: d.weather[0].description,
      }))
    }
  } catch (e) {
    console.log('weather fetch failed', e)
    return null
  }
}

const makeTitle = (text) => {
  if (!text) return 'New trip'
  const cleaned = text
    .replace(/^(hey|hi|hello|can you|could you|please|i want to|i need to|help me|find me|show me)\s+/i, '')
    .replace(/\?$/, '')
    .trim()
  return cleaned.length > 38 ? cleaned.slice(0, 38) + '...' : cleaned
}

const TRAVEL_RE = /\b(trip|travel|fly|flight|flights|hotel|hotels|visit|going to|heading to|plan|book|restaurant|restaurants)\b/i

const extractTravelIntent = (text) => {
  const t = text.toLowerCase()
  if (!TRAVEL_RE.test(t)) return null
  const toMatch   = t.match(/\bto\s+([a-z][a-z\s]{1,24})(?:\s+from|\s+on|\s+in|[,.]|$)/)
  const fromMatch = t.match(/\bfrom\s+([a-z][a-z\s]{1,24})(?:\s+to|\s+on|[,.]|$)/)
  return {
    to:   toMatch   ? toMatch[1].trim()   : '',
    from: fromMatch ? fromMatch[1].trim() : '',
  }
}

const makeDate = () => {
  const now = new Date()
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (now.toDateString() === today.toDateString()) return 'Today'
  if (now.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return now.toLocaleDateString('en', { weekday: 'short' })
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('voya_theme') || 'dark')
  const [chats, setChats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('voya_chats')) || [] }
    catch { return [] }
  })
  const [activeChatId, setActiveChatId] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [costItems, setCostItems] = useState([])
  const [toast, setToast] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showTripForm, setShowTripForm] = useState(false)
  const [tripFormPrefill, setTripFormPrefill] = useState({ from: '', to: '' })

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const abortRef = useRef(null)
  const tripFormRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('voya_theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('voya_chats', JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, loading])


  const activeChat = chats.find(c => c.id === activeChatId)
  const msgs = activeChat?.messages || []

  const startNewTrip = () => {
    setActiveChatId(null)
    setCostItems([])
    setError(false)
    setInput('')
    inputRef.current?.focus()
  }

  const selectChat = (id) => {
    setActiveChatId(id)
    setError(false)
    const chat = chats.find(c => c.id === id)
    if (chat) {
      const costs = chat.messages
        .filter(m => m.cost)
        .map(m => ({ ...m.cost, isNew: false }))
      setCostItems(costs)
    }
  }

  const stopLoading = () => {
    abortRef.current?.abort()
    setLoading(false)
  }

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return

    // intercept vague travel queries → open form pre-filled
    // skip if form is already open (user is adding extra context)
    if (!text && !showTripForm) {
      const intent = extractTravelIntent(trimmed)
      if (intent) {
        setTripFormPrefill(intent)
        setShowTripForm(true)
        setInput('')
        return
      }
    }

    setInput('')
    setError(false)

    const userMsg = { role: 'user', content: trimmed }

    let chatId = activeChatId
    let updatedChats

    if (!chatId) {
      chatId = Date.now().toString()
      const newChat = {
        id: chatId,
        title: makeTitle(trimmed),
        date: makeDate(),
        messages: [userMsg],
      }
      updatedChats = [newChat, ...chats]
      setChats(updatedChats)
      setActiveChatId(chatId)
    } else {
      updatedChats = chats.map(c =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, userMsg] }
          : c
      )
      setChats(updatedChats)
    }

    setLoading(true)

    try {
      const currentChat = updatedChats.find(c => c.id === chatId)
      const history = currentChat.messages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      // create abort controller for this request
      abortRef.current = new AbortController()

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: abortRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      })

      const raw = await res.json()
      if (!res.ok) {
        const errMsg = raw.error?.message || `API error ${res.status}`
        console.log('anthropic error:', errMsg)
        throw new Error(errMsg)
      }

      const text = raw.content?.[0]?.text || ''

      // extract all JSON blocks from the response
      const blocks = []
      const fenceRe = /```json\s*([\s\S]*?)```/g
      let m
      while ((m = fenceRe.exec(text)) !== null) {
        try { blocks.push(JSON.parse(m[1].trim())) } catch (err) { console.log('block parse error', err) }
      }
      // fallback: try the whole text as one JSON object
      if (blocks.length === 0) {
        try {
          const stripped = text.replace(/```json\s*/g, '').replace(/```/g, '').trim()
          const match = stripped.match(/\{[\s\S]*\}/)
          blocks.push(JSON.parse(match ? match[0] : stripped))
        } catch {
          blocks.push({ message: text, type: 'text', data: null, cost: null })
        }
      }

      // only fetch weather if user explicitly asked
      const askedForWeather = /weather|forecast|temperature|climate|rain|snow|hot|cold|packing|what to wear/i.test(trimmed)
      const city = askedForWeather ? extractCity(blocks[0]?.message || '') : null
      const weather = await fetchWeather(city)

      const assistantMsgs = blocks.map((parsed, idx) => ({
        role: 'assistant',
        content: parsed.message || '',
        type: parsed.type || 'text',
        data: parsed.data || null,
        weather: idx === 0 ? weather : null,
        cost: parsed.cost || null,
      }))

      for (const parsed of blocks) {
        if (parsed.cost) {
          setCostItems(prev => [
            ...prev.map(i => ({ ...i, isNew: false })),
            { ...parsed.cost, isNew: true },
          ])
        }
      }

      setChats(prev => prev.map(c =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, ...assistantMsgs] }
          : c
      ))

        } catch (e) {
      if (e.name === 'AbortError') {
        // user cancelled - silently stop
      } else {
        console.log('claude api error', e)
        setError(e.message || true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => {
    if (loading) { stopLoading(); return }
    if (showTripForm) { tripFormRef.current?.submit(); return }
    sendMessage()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const deleteChats = (ids) => {
    const deleted = chats.filter(c => ids.includes(c.id))
    const remaining = chats.filter(c => !ids.includes(c.id))
    setChats(remaining)
    if (ids.includes(activeChatId)) startNewTrip()
    showToast(`${ids.length} chat${ids.length > 1 ? 's' : ''} deleted`, () => {
      setChats(prev => [...deleted, ...prev])
    })
  }

  const clearAll = () => {
    const backup = [...chats]
    setChats([])
    startNewTrip()
    showToast('All chats deleted', () => setChats(backup))
  }

  const showToast = (message, undoFn) => {
    setToast({ message, undoFn })
    setTimeout(() => setToast(null), 5000)
  }

  const editMessage = (message, newText) => {
    // find the message index in active chat
    const chat = chats.find(c => c.id === activeChatId)
    if (!chat) return
    const msgIndex = chat.messages.findIndex(m => m === message)
    if (msgIndex === -1) return

    // keep all messages up to (not including) the edited one
    const trimmedMessages = chat.messages.slice(0, msgIndex)

    // update chat with truncated history
    setChats(prev => prev.map(c =>
      c.id === activeChatId
        ? { ...c, messages: trimmedMessages }
        : c
    ))

    // re-send with new text - this appends the edited message and gets a new response
    setTimeout(() => sendMessage(newText), 50)
  }


  return (
    <div className="app">

      {/* mobile overlay backdrop */}
      <div
        className={`sidebar-overlay ${mobileSidebarOpen ? 'active' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* hamburger — mobile only */}
      <button className="mobile-menu-btn" onClick={() => {
  setMobileSidebarOpen(p => !p)
  if (collapsed) setCollapsed(false)
}}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <line x1="1" y1="4" x2="15" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="1" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => { selectChat(id); setMobileSidebarOpen(false) }}
        onNewTrip={() => { startNewTrip(); setMobileSidebarOpen(false) }}
        onDeleteChats={deleteChats}
        onClearAll={clearAll}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(p => !p)}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onSearch={() => setShowSearch(true)}
        mobileOpen={mobileSidebarOpen}
      />

      <div className="chat-area">

        {/* topbar - back button left, PDF button right */}
        {activeChat && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '18px',
            right: '18px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}>
            <button
              onClick={startNewTrip}
              style={{
                pointerEvents: 'all',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: 'var(--radius)',
                border: '0.5px solid var(--accent)',
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.color = 'var(--accent)' }}
            >
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <line x1="12" y1="7" x2="2" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <polyline points="6,3 2,7 6,11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Back
            </button>

          </div>
        )}

        {/* messages or welcome screen */}
        {msgs.length === 0 ? (
          <WelcomeScreen
            chips={CHIPS}
            onChipClick={(text) => {
              setInput(text)
              setTripFormPrefill({ from: '', to: extractTravelIntent(text)?.to || '' })
              setShowTripForm(true)
              setTimeout(() => inputRef.current?.focus(), 50)
            }}
            onOpenForm={(city) => {
              setInput(`Plan a trip to ${city}`)
              setTripFormPrefill({ from: '', to: city })
              setShowTripForm(true)
              setTimeout(() => inputRef.current?.focus(), 50)
            }}
          />
        ) : (
          <div className="messages">
            {msgs.map((msg, i) => (
              <MessageBubble key={i} message={msg} onEdit={editMessage} />
            ))}
            {loading && <LoadingBubble />}
            {error && (
              <ErrorBubble
                message={typeof error === 'string' ? error : 'Unable to reach Claude. Check your connection.'}
                onRetry={() => { setError(false); sendMessage(msgs[msgs.length - 1]?.content) }}
              />
            )}<div ref={messagesEndRef} />
          </div>
        )}

        {/* trip form */}
        {showTripForm && (
          <TripForm
            ref={tripFormRef}
            onSubmit={(query) => {
              const extra = input.trim()
              const combined = extra ? `${query}. ${extra}` : query
              setInput('')
              setShowTripForm(false)
              setTripFormPrefill({ from: '', to: '' })
              sendMessage(combined)
            }}
            onClose={() => { setShowTripForm(false); setTripFormPrefill({ from: '', to: '' }) }}
            initialFrom={tripFormPrefill.from}
            initialTo={tripFormPrefill.to}
          />
        )}

        {/* input bar */}
        <div className="input-bar">
          <div className="input-wrap">
            <button
              className={`trip-form-trigger ${showTripForm ? 'active' : ''}`}
              onClick={() => setShowTripForm(p => !p)}
              title="Plan a trip"
            >
              ✈️
            </button>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask VOYA anything about your trip..."
              disabled={loading}
            />
            <button
              className={`send-btn ${!showTripForm && !input.trim() && !loading ? 'disabled' : loading ? 'loading' : 'active'}`}
              onClick={handleSend}
              disabled={!showTripForm && !input.trim() && !loading}
            >
              {loading ? (
                // stop square - clickable to cancel
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="2" y="2" width="6" height="6" rx="1.5" fill="var(--accent)" opacity="0.9"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <line x1="2" y1="7" x2="12" y2="7" stroke={(!input.trim() && !showTripForm) ? 'var(--accent)' : 'var(--bg-deep)'} strokeWidth="1.8"/>
                  <polyline points="8,3 12,7 8,11" stroke={(!input.trim() && !showTripForm) ? 'var(--accent)' : 'var(--bg-deep)'} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* undo toast */}
        {toast && (
          <div className="toast">
            <span>{toast.message}</span>
            <button className="undo-btn" onClick={() => { toast.undoFn(); setToast(null) }}>
              Undo
            </button>
            <div className="toast-bar" />
          </div>
        )}
      </div>

      {showSearch && (
      <SearchModal
      chats={chats}
      onSelectChat={(id) => { selectChat(id); setShowSearch(false) }}
      onClose={() => setShowSearch(false)}
      />
      )}

      {/* cost estimator panel */}
      {costItems.length > 0 && <CostEstimator items={costItems} />}
    </div>
  )
}