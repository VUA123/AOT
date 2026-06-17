import { useState, useEffect } from 'react'
import FireAshes from './FireAshes'
import './DeploymentMap.css'

const LOCATIONS = [
  {
    id: 'shiganshina',
    name: 'SHIGANSHINA DISTRICT',
    threat: 'CRITICAL (BREACHED & SEALED)',
    sector: 'Southern Wall Maria Outpost',
    forces: 'Survey Corps Special Ops / Garrison 1st Division',
    casualties: 'High (250,000+ Civilians & 120+ Scouts)',
    coords: { x: 50, y: 92 }, // SVG 100x100 relative grid coordinates
    summary: 'The southern gateway of Wall Maria. In Year 845, this district became the first site of Titan invasion when the Colossal Titan kicked a hole in the outer gate. Humanity abandoned Shiganshina and lost 25% of their territory. Reclaimed and sealed in Year 850 during the costly Battle of Shiganshina using Eren\'s hardening ability.'
  },
  {
    id: 'trost',
    name: 'TROST DISTRICT',
    threat: 'HIGH (SECURE / RE-SEALED)',
    sector: 'Southern Wall Rose Outpost',
    forces: 'Garrison Regiment - Southern Division Vanguard',
    casualties: 'Medium-High (207 Cadet Recruits & 500+ Garrison)',
    coords: { x: 50, y: 72 },
    summary: 'An outpost city on the southern edge of Wall Rose. In Year 850, the Colossal Titan breached the outer gate. During the frantic struggle, Special Cadet Eren Yeager transformed into a Titan and carried a colossal boulder to seal the gate, securing humanity\'s first victory against the giants.'
  },
  {
    id: 'stohess',
    name: 'STOHESS DISTRICT',
    threat: 'MEDIUM (SECURE)',
    sector: 'Eastern Wall Sheena Outpost',
    forces: 'Military Police Brigade / Survey Corps Raid Unit',
    casualties: 'Low-Medium (100+ Civilians & 40+ Officers)',
    coords: { x: 78, y: 50 },
    summary: 'The eastern gateway of Wall Sheena. In Year 850, Stohess became a battlefield when the Survey Corps launched a covert operation to unmask the Female Titan (Annie Leonhart). The resulting clash destroyed the district cathedral and damaged the stone wall, revealing a giant titan face trapped inside the structure.'
  },
  {
    id: 'ragako',
    name: 'RAGAKO VILLAGE',
    threat: 'EXTREME (QUARANTINED / DEVASTATED)',
    sector: 'Interior Territory of Wall Rose',
    forces: 'None (Quarantined Zone)',
    casualties: 'Total (100% of Villagers transformed)',
    coords: { x: 38, y: 65 },
    summary: 'A quiet farming village in the interior of Wall Rose. Ragako suffered a mysterious incident when its entire population vanished, replaced by mindless Titans. Intelligence later confirmed Zeke Yeager (The Beast Titan) gassed the village with his spinal fluid to trigger a controlled outbreak.'
  },
  {
    id: 'mitras',
    name: 'MITRAS CAPITAL',
    threat: 'MINIMAL (ROYAL SECURE)',
    sector: 'Center of Wall Sheena (The Citadel)',
    forces: 'Royal Guard Elite / Military Police Headquarters',
    casualties: 'None (Secure Sanctuary)',
    coords: { x: 50, y: 50 },
    summary: 'The imperial capital of Eldia, protected by all three stone walls. Home to the royal palace, assembly hall, and the wealthy elite. Following the revolution of Year 850, the fake king was overthrown and Queen Historia Reiss took the throne, establishing a new military-backed regime.'
  }
]

export default function DeploymentMap({ isOpen, onClose }) {
  const [activeLoc, setActiveLoc] = useState('shiganshina')

  // Block body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const selectedLoc = LOCATIONS.find(l => l.id === activeLoc) || LOCATIONS[0]

  return (
    <div className="tm-overlay animate-fade-in" onClick={onClose}>
      <div className="tm-backdrop" />
      <FireAshes />

      <div className="tm-modal" onClick={e => e.stopPropagation()}>
        
        {/* Top Close Banner */}
        <div className="tm-top-banner" onClick={onClose}>
          <span className="tm-banner-anchor">⚔</span>
          <span className="tm-banner-text">CLOSE TACTICAL MAP</span>
          <span className="tm-banner-anchor">⚔</span>
        </div>

        <div className="tm-container">
          {/* Header section matching the gold/cinzel style */}
          <div className="tm-header">
            <span className="tm-header-rule" />
            <div className="tm-header-title-box">
              <p className="tm-eyebrow">TERRITORIAL CONTROL</p>
              <h2 className="tm-title">TACTICAL MAP</h2>
            </div>
            <span className="tm-header-rule" />
          </div>

          <div className="tm-content">
            
            {/* LEFT COLUMN: LOCATION SELECT MODULE */}
            <div className="tm-left-col">

            <div className="tm-menu">
              {LOCATIONS.map((loc) => {
                const isActive = activeLoc === loc.id
                return (
                  <div
                    key={loc.id}
                    className={`tm-menu-item ${isActive ? 'tm-menu-item--active' : ''}`}
                    onClick={() => setActiveLoc(loc.id)}
                  >
                    <span className="tm-item-bullet">✦</span>
                    <div className="tm-item-info">
                      <span className="tm-item-name">{loc.name}</span>
                      <span className="tm-item-sub">{loc.sector}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE SVG MAP & REGIMENT SUMMARY */}
          <div className="tm-right-col">
            
            {/* 1. INTERACTIVE VECTOR MAP PANEL */}
            <div className="tm-map-panel">
              <p className="tm-panel-tag">PARADIS MILITARY blueprINT (WALL CROSS-SECTION)</p>
              
              <div className="tm-svg-wrapper">
                <svg viewBox="0 0 100 100" className="tm-map-svg">
                  {/* Outer Grid lines */}
                  <line x1="50" y1="5" x2="50" y2="95" className="tm-grid-line" />
                  <line x1="5" y1="50" x2="95" y2="50" className="tm-grid-line" />

                  {/* Concentric Walls Representation */}
                  {/* 1. Wall Maria (Outer) - Radius 42% */}
                  <circle cx="50" cy="50" r="42" className="tm-wall-circle tm-wall-circle--maria" />
                  <text x="50" y="6" className="tm-wall-text">WALL MARIA</text>

                  {/* 2. Wall Rose (Middle) - Radius 25% */}
                  <circle cx="50" cy="50" r="25" className="tm-wall-circle tm-wall-circle--rose" />
                  <text x="50" y="23" className="tm-wall-text">WALL ROSE</text>

                  {/* 3. Wall Sheena (Inner) - Radius 10% */}
                  <circle cx="50" cy="50" r="10" className="tm-wall-circle tm-wall-circle--sheena" />
                  <text x="50" y="38" className="tm-wall-text">WALL SHEENA</text>

                  {/* Connecting lines between walls */}
                  <line x1="50" y1="92" x2="50" y2="50" className="tm-district-axial" />
                  <line x1="50" y1="50" x2="78" y2="50" className="tm-district-axial" />

                  {/* Active District Pins */}
                  {LOCATIONS.map((loc) => {
                    const isActive = activeLoc === loc.id
                    return (
                      <g 
                        key={loc.id} 
                        className={`tm-pin-group ${isActive ? 'tm-pin-group--active' : ''}`}
                        onClick={() => setActiveLoc(loc.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Outer pulsing ring */}
                        <circle cx={loc.coords.x} cy={loc.coords.y} r="3" className="tm-pin-pulse" />
                        {/* Solid inner pin dot */}
                        <circle cx={loc.coords.x} cy={loc.coords.y} r="1.5" className="tm-pin-dot" />
                      </g>
                    )
                  })}
                </svg>
                <div className="laser-scanner-line" />
              </div>
            </div>

            {/* 2. SPECIFIC REGIMENT DISPATCH DISPATCH DOSSIER CARD */}
            <div className="tm-dossier-panel">
              <div className="tm-stamp-confidential">TAC-OPS DIRECTIVE</div>

              <div className="tm-dossier-details">
                <span className="tm-loc-sector">{selectedLoc.sector}</span>
                <h3 className="tm-loc-name">{selectedLoc.name}</h3>
                <div className="tm-loc-divider" />

                <div className="tm-meta-grid">
                  <div className="tm-meta-block">
                    <span className="tm-meta-lbl">ESTIMATED THREAT LEVEL</span>
                    <span className="tm-meta-val tm-meta-val--threat">{selectedLoc.threat}</span>
                  </div>
                  <div className="tm-meta-block">
                    <span className="tm-meta-lbl">RECOGNIZED FORCES & GARRISON</span>
                    <span className="tm-meta-val">{selectedLoc.forces}</span>
                  </div>
                  <div className="tm-meta-block">
                    <span className="tm-meta-lbl">CASUALTIES SUMMARY</span>
                    <span className="tm-meta-val tm-meta-val--danger">{selectedLoc.casualties}</span>
                  </div>
                </div>

                <div className="tm-summary-block">
                  <span className="tm-meta-lbl">OPERATIONAL ANALYSIS SUMMARY</span>
                  <p className="tm-summary-paragraph">{selectedLoc.summary}</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  </div>
  )
}
