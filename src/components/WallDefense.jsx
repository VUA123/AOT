import { useState, useEffect } from 'react'
import FireAshes from './FireAshes'
import './WallDefense.css'

const WALLS_DATA = [
  {
    id: 'maria',
    name: 'WALL MARIA',
    title: 'THE OUTER BOUNDARY',
    radius: '100 km (Radius of Protection)',
    height: '50 Meters',
    status: 'Breached (Year 845) · Retaken & Sealed (Year 850)',
    garrison: '1st Division - Outer Guard Elite',
    lore: 'Wall Maria is the outermost defensive wall protecting humanity. In Year 845, after a century of quiet security, the Colossal Titan kicked a breach into the gate of Shiganshina District, allowing Pure Titans to flood the territory. Humanity lost 25% of its land and was forced to retreat behind Wall Rose. It was successfully reclaimed and sealed in Year 850 during the legendary Battle of Shiganshina.',
    blueprint: {
      thickness: '10 - 12 Meters (Base)',
      weapons: 'Double-track mounted artillery cannons, hoist platforms, and defensive parapets.',
      titanDensity: 'Approximately 580 Wall Titans per 100km stretch.',
      vulnerability: 'The outer gate of Shiganshina and the main inner gate connecting to the interior.'
    }
  },
  {
    id: 'rose',
    name: 'WALL ROSE',
    title: 'THE MIDDLE CRUCIBLE',
    radius: '380 km (Radius of Protection)',
    height: '50 Meters',
    status: 'Breached & Sealed (Year 850)',
    garrison: '2nd Division - Trost Vanguard',
    lore: 'Wall Rose is the middle shield. In Year 850, five years after the fall of Wall Maria, the Colossal Titan reappeared and breached Trost District. Humanity stood on the brink of total extinction until Eren Yeager, in his newly awakened Attack Titan form, lifted a colossal boulder to seal the breach. This marked humanity\'s first successful counterattack and a turning point in the war.',
    blueprint: {
      thickness: '8 - 10 Meters (Base)',
      weapons: 'High-density heavy cannons, quick-reload grapple anchors, and oil fire traps.',
      titanDensity: 'Approximately 2,200 Wall Titans spanning the entire circumference.',
      vulnerability: 'Trost District gate, Klorva District gate, and southern outer sectors.'
    }
  },
  {
    id: 'sheena',
    name: 'WALL SHEENA',
    title: 'THE INNER SANCTUARY',
    radius: '250 km (Radius of Protection)',
    height: '50 Meters',
    status: 'Secure · Pristine Condition',
    garrison: 'Military Police Brigade / Royal Guard',
    lore: 'Wall Sheena is the innermost circle protecting the capital, Mitras, the royal palace, and the aristocratic elite. Built with rich golden limestone, it represents absolute safety—or absolute class division. The Military Police govern this territory, living in luxury far removed from the terror of the Titans, blissfully ignorant of the horrific secrets built into the very bricks they stand upon.',
    blueprint: {
      thickness: '15 Meters (Reinforced Base)',
      weapons: 'Ornate watchtowers, automated inner gates, and elite Royal Guard garrisons.',
      titanDensity: 'Approximately 1,450 Wall Titans standing in silent sleep.',
      vulnerability: 'Highly vulnerable to political coup d\'état or internal rebellion.'
    }
  }
]

export default function WallDefense({ isOpen, onClose }) {
  const [selectedWall, setSelectedWall] = useState('maria')
  const [exposeTitan, setExposeTitan] = useState(false)
  const [currentTab, setCurrentTab] = useState('intelligence') // 'intelligence', 'blueprint'

  // Block background scroll when archives pop-up is active
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

  const activeWall = WALLS_DATA.find(w => w.id === selectedWall)

  return (
    <div className="wd-overlay animate-fade-in" onClick={onClose}>
      <div className="wd-backdrop" />
      <FireAshes />

      <div className="wd-modal" onClick={e => e.stopPropagation()}>
        
        {/* Top Gold Close Banner */}
        <div className="wd-top-banner" onClick={onClose}>
          <span className="wd-banner-anchor">⚔</span>
          <span className="wd-banner-text">CLOSE WALL BLUEPRINTS</span>
          <span className="wd-banner-anchor">⚔</span>
        </div>

        <div className="wd-container">
          {/* Header section matching the gold/cinzel style */}
          <div className="wd-header">
            <span className="wd-header-rule" />
            <div className="wd-header-title-box">
              <p className="wd-eyebrow">TERRITORIAL BLUEPRINTS</p>
              <h2 className="wd-title">WALL DEFENSE SYSTEM</h2>
            </div>
            <span className="wd-header-rule" />
          </div>

          {/* Interactive Layout: Left is the graphical wall interface, right is the military console */}
          <div className="wd-content-grid">
            
            {/* LEFT: THE INTERACTIVE GRAPHIC */}
            <div className="wd-graphic-panel">
              <p className="wd-panel-tag">SCHEMATIC CROSS-SECTION</p>
              
              <div className="wd-walls-visualizer">
                {/* Concentric / Layered Walls representation */}
                <div className="wd-visual-layers">
                  {WALLS_DATA.map((wall, i) => {
                    const isActive = selectedWall === wall.id
                    const zIndex = 10 - i
                    return (
                      <div
                        key={wall.id}
                        className={`wd-wall-layer wd-wall-layer--${wall.id} ${isActive ? 'wd-wall-layer--active' : ''} ${exposeTitan ? 'wd-wall-layer--cracked' : ''}`}
                        style={{ zIndex }}
                        onClick={() => setSelectedWall(wall.id)}
                      >
                        {/* Brick Texture and Battlements */}
                        <div className="wd-wall-bricks">
                          <div className="wd-battlements">
                            <span></span><span></span><span></span><span></span><span></span>
                          </div>
                          <div className="wd-wall-label-overlay">
                            <span className="wd-wall-roman">{i === 0 ? 'I' : i === 1 ? 'II' : 'III'}</span>
                            <span className="wd-wall-name-lbl">{wall.name}</span>
                          </div>

                          {/* Gate details */}
                          {wall.id === 'maria' && (
                            <div className={`wd-gate wd-gate--maria ${exposeTitan ? 'wd-gate--broken' : ''}`}>
                              <div className="wd-gate-arch" />
                              <div className="wd-gate-wood" />
                            </div>
                          )}
                          {wall.id === 'rose' && (
                            <div className="wd-gate wd-gate--rose">
                              <div className="wd-gate-arch" />
                              <div className="wd-boulder" title="Sealing Boulder" />
                            </div>
                          )}
                          {wall.id === 'sheena' && (
                            <div className="wd-gate wd-gate--sheena">
                              <div className="wd-gate-arch" />
                              <div className="wd-royal-banners">
                                <span className="wd-banner-strip" />
                                <span className="wd-banner-strip" />
                              </div>
                            </div>
                          )}

                          {/* Hidden Wall Titan overlay */}
                          <div className={`wd-wall-titan-core ${exposeTitan ? 'wd-wall-titan-core--visible' : ''}`}>
                            <div className="wd-titan-glow-eye" />
                            <div className="wd-titan-skinless-face">
                              {/* Visual muscle strands and skull outline in CSS */}
                              <div className="wd-muscle-fiber" />
                              <div className="wd-teeth-row" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* The Grounds / Foundation */}
                <div className="wd-visual-ground">
                  <span className="wd-ground-rock" />
                </div>
              </div>

              {/* Protocol Controls */}
              <div className="wd-controls">
                <button 
                  className={`wd-titan-toggle-btn ${exposeTitan ? 'wd-titan-toggle-btn--active' : ''}`}
                  onClick={() => setExposeTitan(!exposeTitan)}
                >
                  <span className="wd-btn-icon">💀</span>
                  <span className="wd-btn-text">
                    {exposeTitan ? 'DEACTIVATE EXPOSURE PROTOCOL' : 'EXPOSE WALL TITAN COVENANT'}
                  </span>
                  <span className="wd-btn-glow" />
                </button>
                <p className="wd-controls-warning">
                  ⚠️ WARNING: SENSITIVE INTEL. REVEALS THE FORBIDDEN TRUTH OF THE WALLS' COMPOSITION.
                </p>
              </div>
            </div>

            {/* RIGHT: THE MILITARY CONSOLE */}
            <div className="wd-console-panel">
              <div className="wd-dossier-frame">
                
                {/* Gold/Red Stamp of Active Wall */}
                <div className={`wd-stamp ${exposeTitan ? 'wd-stamp--danger' : ''}`}>
                  {exposeTitan ? 'S-LEVEL BREACH' : 'CONFIDENTIAL'}
                </div>

                {/* Console Tabs */}
                <div className="wd-console-tabs">
                  <button 
                    className={`wd-tab-btn ${currentTab === 'intelligence' ? 'wd-tab-btn--active' : ''}`}
                    onClick={() => setCurrentTab('intelligence')}
                  >
                    ⚔️ MILITARY INTEL
                  </button>
                  <button 
                    className={`wd-tab-btn ${currentTab === 'blueprint' ? 'wd-tab-btn--active' : ''}`}
                    onClick={() => setCurrentTab('blueprint')}
                  >
                    📐 BLUEPRINT SPECS
                  </button>
                </div>

                {/* Tab Content: MILITARY INTEL */}
                {currentTab === 'intelligence' && (
                  <div className="wd-tab-content animate-fade-in">
                    <p className="wd-console-eyebrow">{activeWall.title}</p>
                    <h3 className="wd-console-wall-name">{activeWall.name}</h3>
                    <div className="wd-console-divider" />

                    <div className="wd-meta-row">
                      <div className="wd-meta-col">
                        <span className="wd-meta-lbl">HEIGHT & SCALE</span>
                        <span className="wd-meta-val">{activeWall.height}</span>
                      </div>
                      <div className="wd-meta-col">
                        <span className="wd-meta-lbl">PROTECTION RADIUS</span>
                        <span className="wd-meta-val">{activeWall.radius}</span>
                      </div>
                    </div>

                    <div className="wd-meta-block">
                      <span className="wd-meta-lbl">CURRENT OPERATIONAL STATUS</span>
                      <span className="wd-meta-val wd-meta-val--status">{activeWall.status}</span>
                    </div>

                    <div className="wd-meta-block">
                      <span className="wd-meta-lbl">ASSIGNED GARRISON DIVISION</span>
                      <span className="wd-meta-val">{activeWall.garrison}</span>
                    </div>

                    <div className="wd-lore-block">
                      <span className="wd-meta-lbl">TACTICAL HISTORICAL FILE</span>
                      <p className="wd-lore-paragraph">{activeWall.lore}</p>
                    </div>
                  </div>
                )}

                {/* Tab Content: BLUEPRINT SPECS */}
                {currentTab === 'blueprint' && (
                  <div className="wd-tab-content animate-fade-in">
                    <p className="wd-console-eyebrow">STRUCTURAL ANATOMY</p>
                    <h3 className="wd-console-wall-name">{activeWall.name} ANALYTICS</h3>
                    <div className="wd-console-divider" />

                    <div className="wd-meta-block">
                      <span className="wd-meta-lbl">WALL THICKNESS</span>
                      <span className="wd-meta-val">{activeWall.blueprint.thickness}</span>
                    </div>

                    <div className="wd-meta-block">
                      <span className="wd-meta-lbl">DEFENSIVE WEAPONRY SYSTEMS</span>
                      <span className="wd-meta-val">{activeWall.blueprint.weapons}</span>
                    </div>

                    <div className="wd-meta-block">
                      <span className="wd-meta-lbl">WALL TITAN POPULATION DENSITY</span>
                      <span className="wd-meta-val">{activeWall.blueprint.titanDensity}</span>
                    </div>

                    <div className="wd-meta-block">
                      <span className="wd-meta-lbl">KNOWN TACTICAL VULNERABILITY</span>
                      <span className="wd-meta-val wd-meta-val--danger">{activeWall.blueprint.vulnerability}</span>
                    </div>

                    {exposeTitan && (
                      <div className="wd-forbidden-warning animate-pulse-fast">
                        <p className="wd-forbidden-title">⚠️ CLASSIFIED ANOMALY DETECTED</p>
                        <p className="wd-forbidden-desc">
                          Spectrographic scans confirm Wall is entirely composed of crystallization-bound skinless Titans, standing shoulder-to-shoulder. They must not receive direct sunlight, or they will wake.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Panel */}
                <div className="wd-console-footer">
                  <span className="wd-wings-symbol">⸸</span>
                  <span className="wd-footer-text">SURVEY CORPS TAC-OPS ENGINE v4.81</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
