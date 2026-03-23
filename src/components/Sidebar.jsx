import { useState } from 'react'
import Logo from './Logo'

const getEmoji = (title = '') => {
  const t = title.toLowerCase()
  if (t.includes('nyc') || t.includes('new york'))     return '🗽'
  if (t.includes('london') || t.includes('uk'))        return '🇬🇧'
  if (t.includes('paris') || t.includes('france'))     return '🗼'
  if (t.includes('tokyo') || t.includes('japan'))      return '⛩️'
  if (t.includes('dubai'))                             return '🏙️'
  if (t.includes('singapore'))                         return '🦁'
  if (t.includes('sydney') || t.includes('australia')) return '🦘'
  if (t.includes('rome') || t.includes('italy'))       return '🏛️'
  if (t.includes('barcelona') || t.includes('spain'))  return '💃'
  if (t.includes('chicago'))                           return '🌬️'
  if (t.includes('sf') || t.includes('san francisco')) return '🌉'
  if (t.includes('miami'))                             return '🌴'
  if (t.includes('bali'))                              return '🌺'
  if (t.includes('hotel'))                             return '🏨'
  if (t.includes('pack') || t.includes('luggage'))     return '🧳'
  if (t.includes('visa'))                              return '📋'
  if (t.includes('flight') || t.includes('→') || t.includes('->')) return '✈️'
  return '🗺️'
}

const getTags = (messages = []) => {
  // read content text + structured type field + data JSON from every message
  const text = messages.map(m => {
    const parts = [m.content || '']
    if (m.type)  parts.push(m.type)
    if (m.data)  parts.push(JSON.stringify(m.data))
    return parts.join(' ')
  }).join(' ').toLowerCase()

  const tags = []
  if (text.includes('hotel')  || text.includes('"hotels"'))                  tags.push('Hotels')
  if (text.includes('flight') || text.includes('fly') || text.includes('"flights"')) tags.push('Flights')
  if (text.includes('pack')   || text.includes('"packing"'))                 tags.push('Packing')
  if (text.includes('visa'))                                                  tags.push('Visa')
  if (text.includes('weather'))                                               tags.push('Weather')
  if (text.includes('cost')   || text.includes('budget'))                    tags.push('Budget')
  if (text.includes('itinerary') || text.includes('"itinerary"'))            tags.push('Itinerary')
  if (text.includes('comparison') || text.includes('"comparison"'))          tags.push('Compare')
  if (text.includes('tips')   || text.includes('"tips"'))                    tags.push('Tips')
  return tags.slice(0, 3)
}

const Sidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewTrip,
  onDeleteChats,
  onClearAll,
  collapsed,
  onToggleCollapse,
  theme,
  onToggleTheme,
  onSearch,
  mobileOpen,
}) => {
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected]     = useState([])
  const [modal, setModal]           = useState(null)

  const enterSelectMode = () => {
  if (chats.length === 0) {
    setModal('empty')
    return
  }
  setSelectMode(true)
  setSelected([])
}
  function exitSelectMode() { setSelectMode(false); setSelected([]) }
  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const confirmDelete = (type) => {
    if (type === 'n') onDeleteChats(selected)
    else onClearAll()
    setModal(null)
    exitSelectMode()
  }

  return (
    <>
      <div
        className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}
      >

        {/* fixed top */}
        <div className="sidebar-top" style={{ flexShrink:0 }}>

          {/* gradient rainbow line at top */}
          {!collapsed && (
            <div style={{
              height: '2px',
              background: 'linear-gradient(90deg, #a78bfa, #f9a8d4, #fbbf24, #a78bfa)',
            }} />
          )}

          {/* header */}
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <Logo size={collapsed ? 22 : 26} />
              <div className="sidebar-brand-text">
                <h1>VOYA</h1>
                <span>AI Travel Companion</span>
              </div>
            </div>
            <button className="icon-btn" onClick={onToggleCollapse}>
              {collapsed
                ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="4,2 8,6 4,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                : <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="8,2 4,6 8,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              }
            </button>
          </div>

          {/* new trip */}
          <button className="new-trip-btn" onClick={onNewTrip}>
            <span className="plus">+</span>
            <span>New chat</span>
          </button>

          {!collapsed ? (
            <button className="search-btn" onClick={onSearch}>
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="12" y1="12" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Search trips & messages
            </button>
          ) : (
            <button className="icon-btn" onClick={onSearch} style={{ margin: '0 auto 6px' }} title="Search">
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="12" y1="12" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          {/* select mode bar */}
          {selectMode && !collapsed && (
            <div className="select-bar">
              <span>{selected.length} selected</span>
              <button className="cancel-btn" onClick={exitSelectMode}>Cancel</button>
            </div>
          )}
        </div>

        {/* scrollable chat list*/}
        <div className="chat-list" style={{ flex:'1 1 0', minHeight:0, overflowY:'auto', overflowX:'hidden' }}>

          {chats.length > 0 && !collapsed && (
            <p className="chat-list-label">Recent</p>
          )}

          {chats.length === 0 && !collapsed && (
            <div style={{ padding: '24px 8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px' }}>🗺️</span>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>No trips yet</p>
            </div>
          )}

          {chats.map(chat => {
            const emoji      = getEmoji(chat.title)
            const tags       = getTags(chat.messages)
            const isActive   = activeChatId === chat.id
            const isSelected = selected.includes(chat.id)

            return (
              <div
                key={chat.id}
                className={`chat-item ${isActive ? 'active' : ''} ${selectMode ? 'select-mode' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => selectMode ? toggleSelect(chat.id) : onSelectChat(chat.id)}
              >
                {/* checkbox in select mode */}
                {selectMode && (
                  <div className={`chat-checkbox ${isSelected ? 'checked' : ''}`}>
                    {isSelected && (
                      <svg width="8" height="8" viewBox="0 0 9 9" fill="none">
                        <polyline points="1.5,4.5 3.5,6.5 7.5,2.5" stroke="var(--danger)" strokeWidth="1.5"/>
                      </svg>
                    )}
                  </div>
                )}

                {/* emoji avatar — full sidebar */}
                {!selectMode && !collapsed && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isActive ? 'var(--accent-dim)' : 'var(--bg-card)',
                    border: isActive ? '0.5px solid var(--accent-border)' : '0.5px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '16px',
                  }}>
                    {emoji}
                  </div>
                )}

                {/* emoji avatar — collapsed */}
                {!selectMode && collapsed && (
                  <span style={{ fontSize: '16px' }}>{emoji}</span>
                )}

                {/* mini trip card text — all using CSS vars so light/dark both work */}
                <div className="chat-item-text">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--accent)' : 'var(--text-body)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1,
                    }}>
                      {chat.title}
                    </p>
                    {/* message count pill */}
                    <span style={{
                      fontSize: '10px',
                      background: isActive ? 'var(--accent-dim)' : 'var(--bg-card)',
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                      border: '0.5px solid var(--accent-border)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      flexShrink: 0,
                    }}>
                      {chat.messages.length}
                    </span>
                  </div>
                  {/* date + topic tags */}
                  <p style={{
                    margin: '2px 0 0',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {chat.date}{tags.length > 0 ? ` · ${tags.join(' · ')}` : ''}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* fixed bottom*/}
        <div className="sidebar-bottom" style={{ flexShrink:0 }}>

          {/* delete buttons in select mode */}
          {selectMode && !collapsed && (
            <div className="delete-btns">
              <button
                className="delete-n-btn"
                onClick={() => selected.length > 0 && setModal('n')}
                style={{ opacity: selected.length === 0 ? 0.4 : 1 }}
              >
                Delete ({selected.length})
              </button>
              <button className="delete-all-btn" onClick={() => setModal('all')}>
                Delete all
              </button>
            </div>
          )}

          {/* footer */}
          <div className="sidebar-footer">
            <button className="clear-btn" onClick={enterSelectMode}>
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <polyline points="1,4 13,4" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M3 4l1 8h6l1-8" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 4V2h4v2" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              <span>Delete chats</span>
            </button>
            <button className="theme-btn" onClick={onToggleTheme}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>

        </div>

      </div>

      {/* delete n modal */}
      {modal === 'n' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="var(--danger)" strokeWidth="1.2"/>
                <line x1="9" y1="5.5" x2="9" y2="9.5" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="12" r=".9" fill="var(--danger)"/>
              </svg>
            </div>
            <h3>Delete {selected.length} chat{selected.length > 1 ? 's' : ''}?</h3>
            <p>Only the {selected.length} selected conversation{selected.length > 1 ? 's' : ''} will be permanently removed.</p>
            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="modal-confirm" onClick={() => confirmDelete('n')}>Delete ({selected.length})</button>
            </div>
          </div>
        </div>
      )}

      {/* delete all modal */}
      {modal === 'all' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="var(--danger)" strokeWidth="1.2"/>
                <line x1="9" y1="5.5" x2="9" y2="9.5" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="12" r=".9" fill="var(--danger)"/>
              </svg>
            </div>
            <h3>Delete all chats?</h3>
            <p>All conversations will be permanently removed, including ones not selected.</p>
            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="modal-confirm" onClick={() => confirmDelete('all')}>Delete all</button>
            </div>
          </div>
        </div>
      )}
      {/* no chats modal */}
      {modal === 'empty' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="var(--accent)" strokeWidth="1.2"/>
                <line x1="9" y1="5.5" x2="9" y2="9.5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="12" r=".9" fill="var(--accent)"/>
              </svg>
            </div>
            <h3>No chats to delete</h3>
            <p>You don't have any saved trips yet. Start a new trip and it will appear here.</p>
            <div className="modal-btns" style={{ gridTemplateColumns: '1fr' }}>
              <button className="modal-cancel" onClick={() => setModal(null)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar