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
  const [currentTab, setCurrentTab] = useState('intelligence') // 'intelligence', 'blueprint', 'simulator'

  // Simulator states
  const [simState, setSimState] = useState('idle') // 'idle', 'active', 'resolving', 'complete'
  const [simLog, setSimLog] = useState([])
  const [simIntegrity, setSimIntegrity] = useState(100)
  const [simResult, setSimResult] = useState(null)

  const handleWallSelect = (wallId) => {
    setSelectedWall(wallId)
    setSimState('idle')
    setSimLog([])
    setSimIntegrity(100)
    setSimResult(null)
  }

  const runSiegeSimulation = (decision) => {
    setSimState('resolving')
    setSimIntegrity(100)
    setSimLog([])

    // Logs timeline
    const steps = []
    let finalIntegrity = 100
    let outcomeTitle = ""
    let outcomeDesc = ""

    if (decision === 'cannons') {
      steps.push(`[00:01] 🚨 Cannons loaded. Southern battery batteries initiating barrage on approaching Pure Titans.`)
      steps.push(`[00:15] 💥 Shell impact confirmed. Titan frontline decimated, but cannon reload speeds are lagging.`)
      
      if (selectedWall === 'maria') {
        steps.push(`[00:30] ⚠️ WARNING: Armored Titan spotted. Shrapnel rounds bouncing off structural plating!`)
        steps.push(`[00:45] 💥 IMPACT! The Armored Titan rammed the gateway before the heavy cannons could re-aim.`)
        finalIntegrity = 25
        outcomeTitle = "TACTICAL BREACH - SYSTEM FAILED"
        outcomeDesc = "Wall Maria's outer gate was shattered by the Armored Titan. Heavy artillery was insufficient to stop a hardened charging titan. Casualty rates: 85% of Garrison squads lost."
      } else if (selectedWall === 'rose') {
        steps.push(`[00:30] 🛡️ Heavy caliber shells successfully tracking targets. Outpost garrison maintaining defensive lines.`)
        steps.push(`[00:45] ✅ Abnormal vanguard wiped out before breaching inner perimeter.`)
        finalIntegrity = 80
        outcomeTitle = "SECURE DEFENSE - SYSTEM SECURED"
        outcomeDesc = "Wall Rose outpost defended successfully! Cannon fire held the horde at bay with minimal structure damage. Casualty rates: 15%."
      } else { // sheena
        steps.push(`[00:30] 💎 Elite Royal artillery firing specialized cluster flares, stunning all incoming abnormal threats.`)
        steps.push(`[00:45] ✅ Total annihilation of threat vectors. No titans breached outer gate bounds.`)
        finalIntegrity = 100
        outcomeTitle = "IMPERIAL VICTORY - IMMACULATE"
        outcomeDesc = "Wall Sheena remains pristine. The royal forces easily vaporized the minor titan intrusion. Casualty rates: 0%."
      }
    } else if (decision === 'scouts') {
      steps.push(`[00:01] ⚔️ Survey Corps launching off gate parapets! Scout squadrons executing high-velocity flanking orbits.`)
      steps.push(`[00:15] 🩸 Blades confirmed slicing! Captain Levi's elite vanguard is shredding Titan napes rapidly.`)

      if (selectedWall === 'maria') {
        steps.push(`[00:30] ⚔️ Scout blades cracking on Colossal steam vents, but scouts maintain strategic distraction.`)
        steps.push(`[00:45] ✅ Tactical withdrawal. Gate preserved by heroic sacrifice of Survey Corps vanguard!`)
        finalIntegrity = 60
        outcomeTitle = "HEROIC STALEMATE - PRESERVED"
        outcomeDesc = "Wall Maria held! While scout casualties were extremely severe (50% loss), their high-velocity maneuver defense distracted the titans long enough to secure the gateway."
      } else if (selectedWall === 'rose') {
        steps.push(`[00:30] 🦅 Squad leader Armin coordinates a flanking pincer, trapping abnormal titans in the narrow streets.`)
        steps.push(`[00:45] ✅ Flawless sweep complete. No gate damage recorded.`)
        finalIntegrity = 95
        outcomeTitle = "ELITE STRATEGIC TRIUMPH"
        outcomeDesc = "Wall Rose was defended with masterclass tactical maneuver warfare. Scouts dominated the airspace. Casualty rates: 8%."
      } else { // sheena
        steps.push(`[00:30] ⚔️ Elite Survey Corps squad easily maneuvers around the central district structures.`)
        steps.push(`[00:45] ✅ All titan threat vectors neutralized within seconds of detection.`)
        finalIntegrity = 100
        outcomeTitle = "ABSOLUTE INTERIOR SWEEP"
        outcomeDesc = "Sheena walls held with flawless coordination. The scouts protected the inner crown. Casualty rates: 1%."
      }
    } else { // gate
      steps.push(`[00:01] ⚙️ Heavy gears groaning. emergency gate locking protocols.`)
      steps.push(`[00:15] 🧱 Iron portcullis lowered. Citizens trapped behind the barrier screaming, but gate is secured.`)

      if (selectedWall === 'maria') {
        steps.push(`[00:30] ⚠️ WARNING: Massive pure Titan force piling up against the outer iron portcullis. Structure buckling!`)
        steps.push(`[00:45] 🚨 BREACH! The gate failed under pure physical pressure. Titans are pouring into the district.`)
        finalIntegrity = 0
        outcomeTitle = "TOTAL CATASTROPHIC BREACH"
        outcomeDesc = "Wall Maria gate collapsed completely. Locking the gate only clustered the titans, leading to structural buckling. Shiganshina is lost."
      } else if (selectedWall === 'rose') {
        steps.push(`[00:30] ⚙️ Support struts holding. Titans banging on the iron gate but unable to penetrate the thick alloys.`)
        steps.push(`[00:45] ✅ Gate held, though external structural components suffered moderate buckling.`)
        finalIntegrity = 50
        outcomeTitle = "COMPROMISED STABILITY - HELD"
        outcomeDesc = "Wall Rose gate held, but at a terrible moral cost: hundreds of outer district refugees were locked outside. Gate requires immediate reinforcement."
      } else { // sheena
        steps.push(`[00:30] 💎 Double-layered gold-alloy interior gates sealed. Impenetrable barrier.`)
        steps.push(`[00:45] ✅ Complete structural immunity. Gate completely unscathed.`)
        finalIntegrity = 90
        outcomeTitle = "IMPERIAL SECLUSION SECURED"
        outcomeDesc = "Wall Sheena gate sealed perfectly. The inner nobility is safe. However, outer-wall populations suffer morale drops."
      }
    }

    // Play logs step by step with timeouts
    let i = 0
    const logInterval = setInterval(() => {
      if (i < steps.length) {
        setSimLog(prev => [...prev, steps[i]])
        // Lower gate integrity progressively
        if (i === 1) {
          setSimIntegrity(Math.floor(100 - (100 - finalIntegrity) * 0.4))
        } else if (i === 3) {
          setSimIntegrity(finalIntegrity)
        }
        i++
      } else {
        clearInterval(logInterval)
        setSimState('complete')
        setSimResult({
          title: outcomeTitle,
          desc: outcomeDesc,
          integrity: finalIntegrity
        })
      }
    }, 1200)
  }

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
              <div className="wd-graphic-scroll-content">
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
                          onClick={() => handleWallSelect(wall.id)}
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
                  <button 
                    className={`wd-tab-btn ${currentTab === 'simulator' ? 'wd-tab-btn--active' : ''}`}
                    onClick={() => setCurrentTab('simulator')}
                  >
                    🚨 SIEGE SIMULATOR
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

                {/* Tab Content: SIEGE SIMULATOR */}
                {currentTab === 'simulator' && (
                  <div className="wd-tab-content wd-sim-content animate-fade-in">
                    <p className="wd-console-eyebrow">TACTICAL OPERATION</p>
                    <h3 className="wd-console-wall-name">SIEGE SIMULATOR</h3>
                    <div className="wd-console-divider" />

                    {simState === 'idle' && (
                      <div className="wd-sim-idle animate-fade-in">
                        <p className="wd-sim-description">
                          Initialize a real-time defense scenario on **{activeWall.name}** to test tactical outcome projections against sudden Titan invasions.
                        </p>
                        <button className="wd-sim-start-btn" onClick={() => setSimState('active')}>
                          INITIALIZE SIEGE RADAR
                          <span className="wd-sim-btn-glow" />
                        </button>
                      </div>
                    )}

                    {(simState === 'active' || simState === 'resolving' || simState === 'complete') && (
                      <div className="wd-sim-active-board">
                        
                        {/* Status bar */}
                        <div className="wd-sim-status-header">
                          <div className="wd-sim-integrity-block">
                            <span className="wd-sim-lbl">GATE STRUCTURAL INTEGRITY</span>
                            <div className="wd-sim-bar-track">
                              <div 
                                className={`wd-sim-bar-fill ${simIntegrity < 40 ? 'wd-sim-bar-fill--danger' : simIntegrity < 75 ? 'wd-sim-bar-fill--warning' : ''}`}
                                style={{ width: `${simIntegrity}%` }}
                              />
                            </div>
                            <span className="wd-sim-integrity-val">{simIntegrity}% INTEGRITY</span>
                          </div>
                        </div>

                        {/* Interactive Decision buttons */}
                        {simState === 'active' && (
                          <div className="wd-sim-decisions animate-fade-in">
                            <p className="wd-sim-decisions-title">SELECT TACTICAL RESPONSE:</p>
                            <div className="wd-sim-decision-grid">
                              <button className="wd-sim-decision-btn" onClick={() => runSiegeSimulation('cannons')}>
                                💥 DEPLOY GARRISON CANNONS
                              </button>
                              <button className="wd-sim-decision-btn" onClick={() => runSiegeSimulation('scouts')}>
                                🦅 ORDER SURVEY CORPS COUNTER-CHARGE
                              </button>
                              <button className="wd-sim-decision-btn" onClick={() => runSiegeSimulation('gate')}>
                                ⚙️ EMERGENCY SEAL DISTRICT GATE
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Log viewer */}
                        {(simState === 'resolving' || simState === 'complete') && (
                          <div className="wd-sim-log-viewer">
                            <p className="wd-sim-log-title">REAL-TIME RADAR TELEMETRY LOG:</p>
                            <div className="wd-sim-log-box">
                              {simLog.map((log, index) => (
                                <p key={index} className="wd-sim-log-line animate-fade-in">{log}</p>
                              ))}
                              {simState === 'resolving' && (
                                <div className="wd-sim-log-loading">📡 ANALYZING DEFENSE VECTORS...</div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Final Result Card */}
                        {simState === 'complete' && simResult && (
                          <div className="wd-sim-result-card animate-fade-in">
                            <p className="wd-sim-result-title">🛡️ {simResult.title}</p>
                            <p className="wd-sim-result-desc">{simResult.desc}</p>
                            <button className="wd-sim-reset-btn" onClick={() => {
                              setSimState('idle')
                              setSimLog([])
                              setSimIntegrity(100)
                              setSimResult(null)
                            }}>
                              RESET SIMULATOR DECK
                            </button>
                          </div>
                        )}
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
