import { useEffect, useRef, useState } from 'react'
import './Navbar.css'

const LINKS = [
  { label: 'Story',    href: '#story'    },
  { label: 'Titans',   href: '#titans'   },
  { label: 'Soldiers', href: '#soldiers' },
  { label: 'Walls',    href: '#walls'    },
  { label: 'Chronicle',href: '#chronicle'},
  { label: 'Training', href: '#training' },
  { label: 'Timeline', href: '#timeline' },
]

const Navbar = ({ 
  onStoryClick, 
  onTitansClick, 
  onScoutsClick, 
  onWallsClick, 
  onChronicleClick, 
  onTrainingClick, 
  onTimelineClick, 
  onLogout, 
  onSelectGame,
  onMenuToggle,
  user 
}) => {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [activeLink,  setActiveLink]  = useState(null)
  const [gamesOpen,   setGamesOpen]   = useState(false)
  
  const indicatorRef = useRef(null)
  const linksRef     = useRef([])

  useEffect(() => {
    if (onMenuToggle) {
      onMenuToggle(menuOpen)
    }
  }, [menuOpen, onMenuToggle])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const moveIndicator = (i) => {
    const el  = linksRef.current[i]
    const bar = indicatorRef.current
    if (!el || !bar) return
    const rect = el.getBoundingClientRect()
    const parentRect = el.closest('.navbar__links').getBoundingClientRect()
    bar.style.width = `${rect.width}px`
    bar.style.transform = `translateX(${rect.left - parentRect.left}px)`
    bar.style.opacity = '1'
  }

  const hideIndicator = () => {
    if (indicatorRef.current) indicatorRef.current.style.opacity = '0'
    setActiveLink(null)
  }

  // Filter links for desktop view (first 4 links)
  const desktopLinks = LINKS.slice(0, 4)

  // Filter links for drawer/sidebar view (remaining links)
  const drawerLinks = LINKS.filter(link => 
    !['Story', 'Titans', 'Soldiers', 'Walls', 'Training'].includes(link.label)
  )

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--open' : ''}`}>

        <div className="navbar__rule navbar__rule--left" />

        <a href="#" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo-wings">⸸</span>
          <span className="navbar__logo-text">
            <span className="navbar__logo-main">ATTACK</span>
            <span className="navbar__logo-sub">ON TITAN</span>
          </span>
          <span className="navbar__logo-wings">⸸</span>
        </a>

        <ul className="navbar__links" onMouseLeave={hideIndicator}>
          {desktopLinks.map((link, i) => (
            <li key={link.label}>
              <a
                ref={el => linksRef.current[i] = el}
                href="javascript:void(0)"
                className={`navbar__link ${activeLink === i ? 'navbar__link--active' : ''}`}
                onMouseEnter={() => { setActiveLink(i); moveIndicator(i) }}
                onClick={(e) => {
                  e.preventDefault()
                  if (link.label === 'Story') if (onStoryClick) onStoryClick()
                  if (link.label === 'Titans') if (onTitansClick) onTitansClick()
                  if (link.label === 'Soldiers') if (onScoutsClick) onScoutsClick()
                  if (link.label === 'Walls') if (onWallsClick) onWallsClick()
                }}
              >
                <span className="navbar__link-num">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
          <div className="navbar__indicator" ref={indicatorRef} />
        </ul>

        <div className="navbar__right">
          <div className="navbar__rule navbar__rule--right" />

          <button
            className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

      </nav>

      {/* Slide-out Right Sidebar */}
      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="navbar__drawer-inner" onClick={(e) => e.stopPropagation()}>
          
          {/* Close trigger for sidebar */}
          <button className="navbar__drawer-close" onClick={() => setMenuOpen(false)}>✕</button>

          {/* Premium Scout Profile Card */}
          {user && (
            <div className="navbar__profile">
              <div className="navbar__profile-avatar">
                <span className="navbar__profile-wings">⸸</span>
              </div>
              <div className="navbar__profile-info">
                <div className="navbar__profile-header">SCOUT REGIMENT ID CARD</div>
                <div className="navbar__profile-name">{user.name.toUpperCase()}</div>
                <div className="navbar__profile-details">
                  <span>ID: #{user.id || '1'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Drawer Links (Chronicle and Timeline) */}
          <div className="navbar__drawer-links-group">
            {drawerLinks.map((link, i) => (
              <a
                key={link.label}
                href="javascript:void(0)"
                className="navbar__drawer-link"
                style={{ '--i': i }}
                onClick={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                  if (link.label === 'Chronicle') if (onChronicleClick) onChronicleClick()
                  if (link.label === 'Timeline') if (onTimelineClick) onTimelineClick()
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Play Game Accordion Menu */}
          <div className="navbar__drawer-accordion">
            <button 
              className={`navbar__drawer-accordion-trigger ${gamesOpen ? 'navbar__drawer-accordion-trigger--open' : ''}`}
              onClick={() => setGamesOpen(v => !v)}
            >
              <span>🎮 PLAY GAME</span>
              <span className="navbar__accordion-arrow">{gamesOpen ? '▲' : '▼'}</span>
            </button>
            
            {gamesOpen && (
              <div className="navbar__drawer-accordion-content">
                <button className="navbar__game-link" onClick={() => { setMenuOpen(false); onSelectGame('training'); }}>
                  01 Target Practice
                </button>
                <button className="navbar__game-link" onClick={() => { setMenuOpen(false); onSelectGame('cannon'); }}>
                  02 Trost Cannon Defense
                </button>
                <button className="navbar__game-link" onClick={() => { setMenuOpen(false); onSelectGame('odm'); }}>
                  03 ODM Gear Reflexes
                </button>
                <button className="navbar__game-link" onClick={() => { setMenuOpen(false); onSelectGame('match'); }}>
                  04 Titan Memory Match
                </button>
              </div>
            )}
          </div>

          {/* Logout Action at the very bottom */}
          {onLogout && (
            <button 
              className="navbar__drawer-cta navbar__drawer-cta--logout" 
              onClick={() => { setMenuOpen(false); onLogout(); }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
