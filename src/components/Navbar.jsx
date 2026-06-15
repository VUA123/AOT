import { useEffect, useRef, useState } from 'react'
import './Navbar.css'

const LINKS = [
  { label: 'Story',    href: '#story'    },
  { label: 'Titans',   href: '#titans'   },
  { label: 'Soldiers', href: '#soldiers' },
  { label: 'Walls',    href: '#walls'    },
  { label: 'Chronicle',href: '#chronicle'},
  { label: 'Training', href: '#training' },
]

const Navbar = ({ onStoryClick, onTitansClick, onScoutsClick, onWallsClick, onChronicleClick, onTrainingClick }) => {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [activeLink,  setActiveLink]  = useState(null)
  const indicatorRef = useRef(null)
  const linksRef     = useRef([])

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
          {LINKS.map((link, i) => (
            <li key={link.label}>
              <a
                ref={el => linksRef.current[i] = el}
                href={(link.label === 'Story' || link.label === 'Titans' || link.label === 'Soldiers' || link.label === 'Walls' || link.label === 'Chronicle' || link.label === 'Training') ? 'javascript:void(0)' : link.href}
                className={`navbar__link ${activeLink === i ? 'navbar__link--active' : ''}`}
                onMouseEnter={() => { setActiveLink(i); moveIndicator(i) }}
                onClick={(e) => {
                  if (link.label === 'Story') {
                    e.preventDefault();
                    if (onStoryClick) onStoryClick();
                  } else if (link.label === 'Titans') {
                    e.preventDefault();
                    if (onTitansClick) onTitansClick();
                  } else if (link.label === 'Soldiers') {
                    e.preventDefault();
                    if (onScoutsClick) onScoutsClick();
                  } else if (link.label === 'Walls') {
                    e.preventDefault();
                    if (onWallsClick) onWallsClick();
                  } else if (link.label === 'Chronicle') {
                    e.preventDefault();
                    if (onChronicleClick) onChronicleClick();
                  } else if (link.label === 'Training') {
                    e.preventDefault();
                    if (onTrainingClick) onTrainingClick();
                  }
                }}
              >
                <span className="navbar__link-num">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
          <div className="navbar__indicator" ref={indicatorRef} />
        </ul>

        <a href="#watch" className="navbar__cta">
          <span className="navbar__cta-inner">
            <span>Watch Now</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="navbar__cta-bg" />
        </a>

        <div className="navbar__rule navbar__rule--right" />

        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

      </nav>

      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}>
        <div className="navbar__drawer-inner">
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              href={(link.label === 'Story' || link.label === 'Titans' || link.label === 'Soldiers' || link.label === 'Walls' || link.label === 'Chronicle' || link.label === 'Training') ? 'javascript:void(0)' : link.href}
              className="navbar__drawer-link"
              style={{ '--i': i }}
              onClick={(e) => {
                setMenuOpen(false);
                if (link.label === 'Story') {
                  e.preventDefault();
                  if (onStoryClick) onStoryClick();
                } else if (link.label === 'Titans') {
                  e.preventDefault();
                  if (onTitansClick) onTitansClick();
                } else if (link.label === 'Soldiers') {
                  e.preventDefault();
                  if (onScoutsClick) onScoutsClick();
                } else if (link.label === 'Walls') {
                  e.preventDefault();
                  if (onWallsClick) onWallsClick();
                } else if (link.label === 'Chronicle') {
                  e.preventDefault();
                  if (onChronicleClick) onChronicleClick();
                } else if (link.label === 'Training') {
                  e.preventDefault();
                  if (onTrainingClick) onTrainingClick();
                }
              }}
            >
              <span className="navbar__drawer-num">0{i + 1}</span>
              {link.label}
            </a>
          ))}
          <a href="#watch" className="navbar__drawer-cta" onClick={() => setMenuOpen(false)}>
            Watch Now
          </a>
        </div>
      </div>
    </>
  )
}

export default Navbar