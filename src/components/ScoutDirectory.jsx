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
    report: 'Born and raised in Shiganshina, Eren Yeager is the core driving force of humanity. After witnessing his mother being devoured, he enlisted in the 104th Cadet Corps, graduating 5th in his class. Eren possesses the powers of the Attack Titan, War Hammer Titan, and Founding Titan. His journey is a tragic descent from a desperate, freedom-seeking boy into a cold, uncompromising entity willing to trample the world to protect his home.'
  },
  {
    id: 'mikasa',
    name: 'MIKASA ACKERMAN',
    rankLabel: 'Elite Soldier / Special Ops Officer',
    sub: 'Elite Soldier',
    image: '/images/Mikasa Ackerman.jpg',
    iconChar: '🧣',
    quote: '"This world is cruel, and it\'s also very beautiful. I am strong, stronger than all of you. Extremely strong!"',
    report: 'Mikasa Ackerman is the top graduate of the 104th Training Corps, possessing peerless, near-superhuman physical combat capabilities due to her Ackerman heritage. Bound by deep-seated devotion to Eren Yeager, who rescued her in childhood, she joined the Survey Corps solely to keep him safe. Calm under pressure but fiercely lethal in battle, Mikasa is equivalent to an entire brigade of elite soldiers.'
  },
  {
    id: 'levi',
    name: 'LEVI ACKERMAN',
    rankLabel: 'Captain / Humanity\'s Strongest Soldier',
    sub: 'Captain',
    image: '/images/Levi Ackerman.jpg',
    iconChar: '⸸',
    quote: '"The only thing we\'re allowed to do... is to believe that we won\'t regret the choice we made."',
    report: 'Levi Ackerman is the Captain of the Special Operations Squad inside the Survey Corps, universally feared and revered as Humanity\'s Strongest Soldier. Raised in the brutal Underground District, he possesses unmatched maneuver gear mastery, allowing him to slice through multiple titans single-handedly. Despite his cold, clean-freak exterior, Levi cares deeply about the survival of his subordinates and carries the burden of their memory.'
  },
  {
    id: 'erwin',
    name: 'ERWIN SMITH',
    rankLabel: '13th Commander / Master Strategist',
    sub: '13th Commander',
    image: '/images/Erwin smith.jpg',
    iconChar: '✝',
    quote: '"My soldiers, rage! My soldiers, scream! My soldiers, fight!"',
    report: 'As the 13th Commander of the Survey Corps, Erwin Smith was a complex, brilliant, and ruthless leader. He possessed unyielding determination, willing to sacrifice hundreds of soldiers—and his own humanity—to uncover the truth about the world. Highly analytical, Erwin formulated the Long-Distance Scouting Formation, drastically increasing expedition survival rates. He died leading a legendary suicidal charge to retake Wall Maria.'
  },
  {
    id: 'armin',
    name: 'ARMIN ARLERT',
    rankLabel: '15th Commander / The Tactical Mind',
    sub: '15th Commander',
    image: '/images/Armin Arlert.jpg',
    iconChar: '🐚',
    quote: '"A person who cannot sacrifice anything, cannot change anything. To defeat a monster, you must discard your humanity."',
    report: 'Armin Arlert, initially a physically weak and insecure trainee, is the ultimate intellectual asset of the Survey Corps. His brilliant tactical deductions sealed Trost, unmasked the Female Titan, and secured the retaking of Wall Maria. Inheriting the Colossal Titan and eventually succeeding Hange Zoë as the 15th Commander, Armin represents the beacon of hope and rational diplomacy, striving for a peaceful resolution in a war-torn world.'
  }
];

const ScoutDirectory = ({ defaultScoutId = 'eren', onClose }) => {
  const [activeScout, setActiveScout] = useState(() => {
    return SCOUT_LIST.find(s => s.id === defaultScoutId) || SCOUT_LIST[0]
  })

  // Block background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

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
                    onClick={() => setActiveScout(scout)}
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
