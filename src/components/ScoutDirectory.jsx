import { useState, useEffect } from 'react'
import FireAshes from './FireAshes'
import './ScoutDirectory.css'

const SCOUT_LIST = [
  {
    id: 'eren',
    name: 'EREN YEAGER',
    rankLabel: 'Special Cadet / Eldian Savior',
    sub: 'Special Cadet',
    image: '/images/Eren yeager.jpg',
    iconChar: '⚔',
    quote: '"If we win, we live. If we lose, we die. If we don\'t fight, we can\'t win. Fight! Fight!"',
    report: 'Born and raised in Shiganshina, Eren Yeager is the core driving force of humanity. After witnessing his mother being devoured, he enlisted in the 104th Cadet Corps, graduating 5th in his class. Eren possesses the powers of the Attack Titan, War Hammer Titan, and Founding Titan. His journey is a tragic descent from a desperate, freedom-seeking boy into a cold, uncompromising entity willing to trample the world to protect his home.',
    armory: {
      rigName: 'DUAL-BLADE VERTICAL MANEUVERING SETUP',
      desc: 'Equipped with custom high-pressure gas cylinders and double-reel steel-wire launchers. Specially reinforced to withstand the extreme gravitational G-forces of Eren\'s high-velocity, highly aggressive combat style. Modified to integrate quick-release emergency straps that automatically shed VME plates before Titan transformation.',
      stats: {
        gasCapacity: 7.5,
        reelVelocity: 8.5,
        chassisReinforcement: 9.0
      },
      specs: {
        bladeType: 'Ultra-Hard Steel / Semi-rigid alloy',
        primaryUtility: 'High-momentum frontal assaults and sudden tactical disengagement',
        ordnanceLoadout: 'None (Relies primarily on Titan offensive-form shift)'
      }
    }
  },
  {
    id: 'mikasa',
    name: 'MIKASA ACKERMAN',
    rankLabel: 'Elite Soldier / Special Ops Officer',
    sub: 'Elite Soldier',
    image: '/images/Mikasa Ackerman.jpg',
    iconChar: '🧣',
    quote: '"This world is cruel, and it\'s also very beautiful. I am strong, stronger than all of you. Extremely strong!"',
    report: 'Mikasa Ackerman is the top graduate of the 104th Training Corps, possessing peerless, near-superhuman physical combat capabilities due to her Ackerman heritage. Bound by deep-seated devotion to Eren Yeager, who rescued her in childhood, she joined the Survey Corps solely to keep him safe. Calm under pressure but fiercely lethal in battle, Mikasa is equivalent to an entire brigade of elite soldiers.',
    armory: {
      rigName: 'ELITE VME & FOREARM THUNDER SPEAR RIG',
      desc: 'Featuring specialized titanium-alloy brace scaffolding and high-pressure fuel-injection nozzles. Mikasa\'s rig is heavily modified to carry up to eight Thunder Spear rocket-propelled armor-piercing detonation rods mounted directly onto her forearm brackets. Optimized to complement her peerless tactical movement speeds.',
      stats: {
        gasCapacity: 8.0,
        reelVelocity: 9.5,
        chassisReinforcement: 8.5
      },
      specs: {
        bladeType: 'Ultra-Hard Steel (Standard dual-sheath)',
        primaryUtility: 'Heavy defensive armor penetration and joint-severing maneuvers',
        ordnanceLoadout: '8x Forearm-mounted Thunder Spears (Detonator core)'
      }
    }
  },
  {
    id: 'levi',
    name: 'LEVI ACKERMAN',
    rankLabel: 'Captain / Humanity\'s Strongest Soldier',
    sub: 'Captain',
    image: '/images/Levi Ackerman.jpg',
    iconChar: '⸸',
    quote: '"The only thing we\'re allowed to do... is to believe that we won\'t regret the choice we made."',
    report: 'Levi Ackerman is the Captain of the Special Operations Squad inside the Survey Corps, universally feared and revered as Humanity\'s Strongest Soldier. Raised in the brutal Underground District, he possesses unmatched maneuver gear mastery, allowing him to slice through multiple titans single-handedly. Despite his cold, clean-freak exterior, Levi cares deeply about the survival of his subordinates and carries the burden of their memory.',
    armory: {
      rigName: 'HUMANITY\'S STRONGEST VME CUSTOM ASSEMBLY',
      desc: 'Ultra-lightened custom-welded chassis designed specifically to support Levi\'s unique combat mechanics. Features custom reverse-grip blade triggers and micro-roller bearings in the wire coils. This allows Levi to perform his signature, supersonic spinning orbit, shredding multiple Titan napes in seconds.',
      stats: {
        gasCapacity: 8.5,
        reelVelocity: 10.0,
        chassisReinforcement: 9.5
      },
      specs: {
        bladeType: 'Ultra-Hard Steel / Custom thin-profile (Reverse grip)',
        primaryUtility: 'Multi-directional high-speed rotation nape-slicing patterns',
        ordnanceLoadout: 'None (Relies exclusively on pure dual-blade blade mastery)'
      }
    }
  },
  {
    id: 'erwin',
    name: 'ERWIN SMITH',
    rankLabel: '13th Commander / Master Strategist',
    sub: '13th Commander',
    image: '/images/Erwin smith.jpg',
    iconChar: '✝',
    quote: '"My soldiers, rage! My soldiers, scream! My soldiers, fight!"',
    report: 'As the 13th Commander of the Survey Corps, Erwin Smith was a complex, brilliant, and ruthless leader. He possessed unyielding determination, willing to sacrifice hundreds of soldiers—and his own humanity—to uncover the truth about the world. Highly analytical, Erwin formulated the Long-Distance Scouting Formation, drastically increasing expedition survival rates. He died leading a legendary suicidal charge to retake Wall Maria.',
    armory: {
      rigName: 'COMMAND-VARR DIVISION STANDARD SCAFFOLDING',
      desc: 'Standard-issue, heavily reinforced structural VME. Designed for maximum environmental resilience and extended operational range during multi-week scouting expeditions. Features integrated quick-access leather pouches for tactical flares, tactical map rolls, and signal communication cartridges.',
      stats: {
        gasCapacity: 9.5,
        reelVelocity: 7.0,
        chassisReinforcement: 9.0
      },
      specs: {
        bladeType: 'Ultra-Hard Steel / Rigid heavy profile',
        primaryUtility: 'Extended range defensive navigation and regiment fleet signaling',
        ordnanceLoadout: 'Multi-color Tactical Signal Gun (Flare cartridge system)'
      }
    }
  },
  {
    id: 'armin',
    name: 'ARMIN ARLERT',
    rankLabel: '15th Commander / The Tactical Mind',
    sub: '15th Commander',
    image: '/images/Armin Arlert.jpg',
    iconChar: '🐚',
    quote: '"A person who cannot sacrifice anything, cannot change anything. To defeat a monster, you must discard your humanity."',
    report: 'Armin Arlert, initially a physically weak and insecure trainee, is the ultimate intellectual asset of the Survey Corps. His brilliant tactical deductions sealed Trost, unmasked the Female Titan, and secured the retaking of Wall Maria. Inheriting the Colossal Titan and eventually succeeding Hange Zoë as the 15th Commander, Armin represents the beacon of hope and rational diplomacy, striving for a peaceful resolution in a war-torn world.',
    armory: {
      rigName: 'LIGHTWEIGHT STRATEGIC NAVIGATION APPARATUS',
      desc: 'Calibrated specifically for optimal defensive flight speeds and quick-deploy signaling maneuvers. Fully stripped of non-essential weight to maximize Armin\'s safety, allowing him to easily scale towering structures or Wall parapets to observe battlefields and coordinate strategies.',
      stats: {
        gasCapacity: 9.0,
        reelVelocity: 8.0,
        chassisReinforcement: 7.5
      },
      specs: {
        bladeType: 'Ultra-Hard Steel / Standard flexible grade',
        primaryUtility: 'Aerial battlefield observation and quick strategic signal gun operations',
        ordnanceLoadout: 'Dual Signal Flare Launchers & communication lanterns'
      }
    }
  }
];

const ScoutDirectory = ({ defaultScoutId = 'eren', onClose }) => {
  const [activeScout, setActiveScout] = useState(() => {
    return SCOUT_LIST.find(s => s.id === defaultScoutId) || SCOUT_LIST[0]
  })
  const [activeTab, setActiveTab] = useState('dossier') // 'dossier', 'armory'

  // Block background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Switch tab when active scout changes
  const handleScoutClick = (scout) => {
    setActiveScout(scout)
    setActiveTab('dossier') // Reset to dossier on scout change
  }

  return (
    <div className="sd-overlay animate-fade-in" onClick={onClose}>
      {/* Explicit Stacking context layers */}
      <div className="sd-backdrop" />
      <FireAshes />

      <div className="sd-modal" onClick={e => e.stopPropagation()}>
        
        {/* Top Gold Close Banner */}
        <div className="sd-top-banner" onClick={onClose}>
          <span className="sd-banner-anchor">⚔</span>
          <span className="sd-banner-text">CLOSE MILITARY RECORD</span>
          <span className="sd-banner-anchor">⚔</span>
        </div>

        <div className="sd-content">
          
          {/* LEFT COLUMN: THE SCOUT MENU LIST */}
          <div className="sd-left-col">
            <p className="sd-eyebrow">MILITARY REGISTRY</p>
            <h2 className="sd-main-title">SCOUT DIRECTORY</h2>
            <div className="sd-divider" />

            <div className="sd-menu">
              {SCOUT_LIST.map((scout) => {
                const isActive = activeScout.id === scout.id
                return (
                  <div
                    key={scout.id}
                    className={`sd-menu-item ${isActive ? 'sd-menu-item--active' : ''}`}
                    onClick={() => handleScoutClick(scout)}
                  >
                    <span className="sd-item-icon">{scout.iconChar}</span>
                    <div className="sd-item-info">
                      <span className="sd-item-name">{scout.name}</span>
                      <span className="sd-item-sub">{scout.sub}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: MILITARY FILE CARD */}
          <div className="sd-right-col">
            <div className="sd-dossier-card">
              
              {/* Red Angled Confidential Stamp */}
              <div className="sd-stamp-confidential">CONFIDENTIAL</div>

              {/* Dossier Header */}
              <div className="sd-dossier-header">
                <span className="sd-wings-symbol">⸸</span>
                <div className="sd-header-text">
                  <span className="sd-header-title">SURVEY CORPS</span>
                  <span className="sd-header-sub">WINGS OF FREEDOM</span>
                </div>
              </div>

              {/* Console/Dossier Tabs */}
              <div className="sd-console-tabs">
                <button 
                  className={`sd-tab-btn ${activeTab === 'dossier' ? 'sd-tab-btn--active' : ''}`}
                  onClick={() => setActiveTab('dossier')}
                >
                  📁 MILITARY FILE
                </button>
                <button 
                  className={`sd-tab-btn ${activeTab === 'armory' ? 'sd-tab-btn--active' : ''}`}
                  onClick={() => setActiveTab('armory')}
                >
                  ⚔️ ARMORY SPEC
                </button>
              </div>

              {/* TAB 1: MILITARY FILE (DOSSIER) */}
              {activeTab === 'dossier' && (
                <div className="sd-tab-content animate-fade-in">
                  {/* Profile Meta Row */}
                  <div className="sd-profile-row">
                    <div className="sd-photo-frame">
                      <img
                        src={activeScout.image}
                        alt={activeScout.name}
                        className="sd-scout-img"
                        draggable={false}
                      />
                      <div className="sd-photo-corner sd-photo-corner--tl" />
                      <div className="sd-photo-corner sd-photo-corner--tr" />
                      <div className="sd-photo-corner sd-photo-corner--bl" />
                      <div className="sd-photo-corner sd-photo-corner--br" />
                    </div>

                    <div className="sd-meta-text">
                      <p className="sd-meta-label">CODENAME / IDENTITY</p>
                      <h3 className="sd-scout-name">{activeScout.name}</h3>
                      
                      <p className="sd-meta-label sd-meta-label--margin">ASSIGNED MILITARY RANK</p>
                      <p className="sd-scout-rank">{activeScout.rankLabel}</p>
                    </div>
                  </div>

                  {/* Golden-bordered quote block */}
                  <div className="sd-quote-box">
                    <p className="sd-quote-text">{activeScout.quote}</p>
                  </div>

                  {/* Psychological Report Block */}
                  <div className="sd-report-box">
                    <p className="sd-report-label">HISTORICAL RECORD & PSYCHOLOGICAL REPORT</p>
                    <p className="sd-report-text">{activeScout.report}</p>
                  </div>
                </div>
              )}

              {/* TAB 2: ARMORY SPEC (VME SCHEMATICS) */}
              {activeTab === 'armory' && activeScout.armory && (
                <div className="sd-tab-content animate-fade-in">
                  <p className="sd-console-eyebrow">EQUIPMENT SPECS</p>
                  <h3 className="sd-console-rig-name">{activeScout.armory.rigName}</h3>
                  <div className="sd-console-divider" />

                  <p className="sd-armory-desc">{activeScout.armory.desc}</p>

                  {/* Armory Specs Detail Block */}
                  <div className="sd-armory-specs-block">
                    <div className="sd-spec-item">
                      <span className="sd-spec-lbl">BLADE METALLURGY</span>
                      <span className="sd-spec-val">{activeScout.armory.specs.bladeType}</span>
                    </div>
                    <div className="sd-spec-item">
                      <span className="sd-spec-lbl">PRIMARY TACTICAL UTILITY</span>
                      <span className="sd-spec-val">{activeScout.armory.specs.primaryUtility}</span>
                    </div>
                    <div className="sd-spec-item">
                      <span className="sd-spec-lbl">PRIMARY ORDNANCE LOADOUT</span>
                      <span className="sd-spec-val">{activeScout.armory.specs.ordnanceLoadout}</span>
                    </div>
                  </div>

                  {/* Stats meters panel */}
                  <div className="sd-stats-container">
                    <p className="sd-stats-header">TACTICAL FLIGHT PERFORMANCE</p>
                    <div className="sd-stats-grid">
                      <div className="sd-stat-row">
                        <div className="sd-stat-info">
                          <span className="sd-stat-name">GAS CYLINDER CAPACITY (ENDURANCE)</span>
                          <span className="sd-stat-value">{activeScout.armory.stats.gasCapacity} / 10</span>
                        </div>
                        <div className="sd-stat-bar-track">
                          <div 
                            className="sd-stat-bar-fill"
                            style={{ width: `${activeScout.armory.stats.gasCapacity * 10}%` }}
                          />
                        </div>
                      </div>

                      <div className="sd-stat-row">
                        <div className="sd-stat-info">
                          <span className="sd-stat-name">WIRE REEL EXPULSION VELOCITY</span>
                          <span className="sd-stat-value">{activeScout.armory.stats.reelVelocity} / 10</span>
                        </div>
                        <div className="sd-stat-bar-track">
                          <div 
                            className="sd-stat-bar-fill"
                            style={{ width: `${activeScout.armory.stats.reelVelocity * 10}%` }}
                          />
                        </div>
                      </div>

                      <div className="sd-stat-row">
                        <div className="sd-stat-info">
                          <span className="sd-stat-name">CHASSIS REINFORCEMENT LEVEL</span>
                          <span className="sd-stat-value">{activeScout.armory.stats.chassisReinforcement} / 10</span>
                        </div>
                        <div className="sd-stat-bar-track">
                          <div 
                            className="sd-stat-bar-fill"
                            style={{ width: `${activeScout.armory.stats.chassisReinforcement * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dossier Footer */}
              <div className="sd-dossier-footer">
                <span>MILITARY DOSSIER CO-8452-9 · SCOUT REGIMENT HQ</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ScoutDirectory
export { SCOUT_LIST }
