import { useState, useEffect, useRef } from 'react'
import Logo from './Logo'

const SearchModal = ({ chats, onSelectChat, onClose }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

  const getResults = () => {
    if (!query.trim()) return { trips: [], messages: [] }
    const q = query.toLowerCase()
    const trips = []
    const messages = []

    chats.forEach(chat => {
      if (chat.title.toLowerCase().includes(q)) {
        trips.push({ chatId: chat.id, title: chat.title, date: chat.date })
      }

      chat.messages.forEach((msg, idx) => {
        if (msg.content?.toLowerCase().includes(q)) {
          const text = msg.content
          const pos = text.toLowerCase().indexOf(q)
          const start = Math.max(0, pos - 40)
          const end = Math.min(text.length, pos + q.length + 60)
          const snippet = (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '')
          messages.push({
            chatId: chat.id,
            title: chat.title,
            snippet,
            keyword: query,
            msgIndex: idx + 1,
            date: chat.date,
            role: msg.role,
          })
        }
      })
    })

    return { trips, messages }
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const highlight = (text, keyword) => {
    if (!keyword) return text
    try {
      const parts = text.split(new RegExp(`(${escapeRegex(keyword)})`, 'gi'))
      return parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase()
          ? <mark key={i} style={{ background: 'rgba(167,139,250,0.3)', color: '#a78bfa', borderRadius: '3px', padding: '0 2px' }}>{part}</mark>
          : part
      )
    } catch {
      return text
    }
  }

  const { trips, messages } = getResults()
  const totalResults = trips.length + messages.length
  const hasQuery = query.trim().length > 0

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,9,20,0.75)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(560px, calc(100vw - 32px))',
          background: '#1a1826',
          border: '1.5px solid rgba(167,139,250,0.4)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >

        {/* search input row */}
        <div style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '0.5px solid rgba(167,139,250,0.12)',
        }}>
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="rgba(167,139,250,0.6)" strokeWidth="1.5"/>
            <line x1="12" y1="12" x2="16" y2="16" stroke="rgba(167,139,250,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search chats and messages..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#ede9fe',
              fontFamily: 'var(--font)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'rgba(167,139,250,0.1)',
                border: '0.5px solid rgba(167,139,250,0.2)',
                borderRadius: '4px',
                color: 'rgba(237,233,254,0.5)',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '2px 8px',
                fontFamily: 'var(--font)',
              }}
            >
                Clear
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(167,139,250,0.08)',
              border: '0.5px solid rgba(167,139,250,0.2)',
              borderRadius: '6px',
              color: 'rgba(237,233,254,0.45)',
              fontSize: '11px',
              cursor: 'pointer',
              padding: '4px 10px',
              fontFamily: 'var(--font)',
            }}
          >
            Close
          </button>
        </div>

        {/* body */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>

          {/* no query yet */}
          {!hasQuery && (
            <div style={{ padding: '36px 16px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(237,233,254,0.3)' }}>
                Type a keyword to search across all your trips and messages
              </p>
            </div>
          )}

          {/* no results */}
          {hasQuery && totalResults === 0 && (
            <div style={{ padding: '36px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <svg width="32" height="32" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="rgba(167,139,250,0.3)" strokeWidth="1.2"/>
                <line x1="12" y1="12" x2="16" y2="16" stroke="rgba(167,139,250,0.3)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(237,233,254,0.4)' }}>
                No results for <span style={{ color: '#a78bfa' }}>"{query}"</span>
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: 'rgba(237,233,254,0.2)' }}>Try a different keyword</p>
            </div>
          )}

          {/* trip results */}
          {trips.length > 0 && (
            <>
              <div style={{ padding: '10px 16px 4px' }}>
                <p style={{ margin: 0, fontSize: '9px', color: 'rgba(167,139,250,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Trips — {trips.length} result{trips.length > 1 ? 's' : ''}
                </p>
              </div>
              {trips.map((r, i) => (
                <div
                  key={`trip-${i}`}
                  onClick={() => { onSelectChat(r.chatId); onClose() }}
                  style={{ padding: '10px 16px', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', borderLeft: '2px solid transparent', transition: 'all 0.12s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.08)'; e.currentTarget.style.borderLeftColor = '#a78bfa' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeftColor = 'transparent' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Logo size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: 500, color: '#ede9fe', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {highlight(r.title, query)}
                    </p>
                    <p style={{ margin: 0, fontSize: '9px', color: 'rgba(237,233,254,0.3)' }}>{r.date}</p>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <polyline points="4,2 10,7 4,12" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* divider */}
          {trips.length > 0 && messages.length > 0 && (
            <div style={{ height: '0.5px', background: 'rgba(167,139,250,0.08)', margin: '4px 0' }} />
          )}

          {/* message results */}
          {messages.length > 0 && (
            <>
              <div style={{ padding: '10px 16px 4px' }}>
                <p style={{ margin: 0, fontSize: '9px', color: 'rgba(167,139,250,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Messages — {messages.length} result{messages.length > 1 ? 's' : ''}
                </p>
              </div>
              {messages.map((r, i) => (
                <div
                  key={`msg-${i}`}
                  onClick={() => { onSelectChat(r.chatId); onClose() }}
                  style={{ padding: '10px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', borderLeft: '2px solid transparent', transition: 'all 0.12s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.08)'; e.currentTarget.style.borderLeftColor = '#a78bfa' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeftColor = 'transparent' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(167,139,250,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Logo size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 3px', fontSize: '12px', fontWeight: 500, color: '#ede9fe' }}>{r.title}</p>
                    <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'rgba(237,233,254,0.4)', lineHeight: 1.5 }}>
                      {highlight(r.snippet, r.keyword)}
                    </p>
                    <p style={{ margin: 0, fontSize: '9px', color: 'rgba(167,139,250,0.4)' }}>
                      {r.date} · {r.role === 'user' ? 'You' : 'VOYA'} · Message {r.msgIndex}
                    </p>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: '4px' }}>
                    <polyline points="4,2 10,7 4,12" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              ))}
            </>
          )}

          {/* total count */}
          {hasQuery && totalResults > 0 && (
            <div style={{ padding: '8px 16px', borderTop: '0.5px solid rgba(167,139,250,0.08)' }}>
              <p style={{ margin: 0, fontSize: '10px', color: 'rgba(237,233,254,0.2)' }}>
                {totalResults} result{totalResults > 1 ? 's' : ''} for "{query}"
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default SearchModal