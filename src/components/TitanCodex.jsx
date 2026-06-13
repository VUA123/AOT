import { useState, useEffect } from 'react'
import FireAshes from './FireAshes'
import './TitanCodex.css'

const TITAN_LIST = [
  {
    id: 'founding',
    num: '01',
    name: 'FOUNDING TITAN',
    height: '240+ Meters · Height',
    owner: 'Ymir Fritz / Eren Yeager',
    image: '/images/Founding titan.png',
    desc: 'The progenitor of all Titans, also known as the Founding Titan. It holds the "Coordinate," the intersection of all Paths connecting Eldians. With a scream, its user can command legions of Wall Titans, rewrite memories, and alter Eldian genetics. When Eren Yeager fully unleashed its divine power, its titanic, skeletal structure dominated the sky, triggering the global cataclysm of the Rumbling.'
  },
  {
    id: 'colossal',
    num: '02',
    name: 'COLOSSAL TITAN',
    height: '60 Meters · Height',
    owner: 'Bertholdt Hoover / Armin Arlert',
    image: '/images/col.png',
    desc: 'The Colossal Titan stands at a towering sixty meters, dwarf-like next to the walls. It emits extreme heat and pressurized steam from its body, capable of scorching nearby soldiers to ash in seconds. Upon transformation, it releases a massive explosive blast of energy akin to a tactical bomb, obliterating everything in its radius.'
  },
  {
    id: 'armored',
    num: '03',
    name: 'ARMORED TITAN',
    height: '15 Meters · Height',
    owner: 'Reiner Braun',
    image: '/images/ArmoredTitan.png',
    desc: 'Covered in thick, hardened organic plates, the Armored Titan acts as a walking fortress. It possesses immense physical strength and durability, capable of charging through reinforced stone gates with ease. However, to maintain its top speed, it must shed armor segments on its joints, creating brief vulnerabilities.'
  },
  {
    id: 'female',
    num: '04',
    name: 'FEMALE TITAN',
    height: '14 Meters · Height',
    owner: 'Annie Leonhart',
    image: '/images/FemaleTitan.png',
    desc: 'An exceptionally versatile Titan with high speed and endurance. The Female Titan can temporarily harden segments of her skin into an impenetrable crystal for offense or defense. Additionally, she possesses the unique ability to attract mindless Titans with a scream, directing their savage movements to her location.'
  },
  {
    id: 'beast',
    num: '05',
    name: 'BEAST TITAN',
    height: '17 Meters · Height',
    owner: 'Zeke Yeager',
    image: '/images/BeastTitan.png',
    desc: 'Taking the form of a giant, ape-like beast, this Titan is famous for its long, powerful arms. Zeke Yeager utilizes this trait to deliver devastating high-velocity projectile attacks, throwing crushed stones like artillery. Possessing royal blood, Zeke is also capable of creating and commanding Titans under his direct will.'
  },
  {
    id: 'pure',
    num: '06',
    name: 'PURE TITAN',
    height: '4 - 15 Meters · Height',
    owner: 'None',
    image: '/images/PureTitan.png',
    desc: 'Mindless, feral, and driven solely by the instinct to devour humans. Pure Titans are Eldians transformed through spinal fluid. They wander aimlessly beyond the walls, completely unaware of their past human lives, acting as a tragic and relentless fence keeping humanity trapped inside their stone cages.'
  }
];

const TitanCodex = ({ defaultTitanId = 'founding', onClose }) => {
  const [activeTitan, setActiveTitan] = useState(() => {
    return TITAN_LIST.find(t => t.id === defaultTitanId) || TITAN_LIST[0]
  })

  // Block background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="tc-overlay animate-fade-in" onClick={onClose}>
      {/* Explicit Stacking context layers */}
      <div className="tc-backdrop" />
      <FireAshes />

      <div className="tc-modal" onClick={e => e.stopPropagation()}>
        
        {/* Top Gold Close Banner */}
        <div className="tc-top-banner" onClick={onClose}>
          <span className="tc-banner-anchor">⚔</span>
          <span className="tc-banner-text">CLOSE TITAN FILES</span>
          <span className="tc-banner-anchor">⚔</span>
        </div>

        <div className="tc-content">
          
          {/* LEFT COLUMN: THE TITAN MENU LIST */}
          <div className="tc-left-col">
            <p className="tc-eyebrow">THE NINE TITANS</p>
            <h2 className="tc-main-title">TITAN CODEX</h2>
            <div className="tc-divider" />

            <div className="tc-menu">
              {TITAN_LIST.map((titan) => {
                const isActive = activeTitan.id === titan.id
                return (
                  <div
                    key={titan.id}
                    className={`tc-menu-item ${isActive ? 'tc-menu-item--active' : ''}`}
                    onClick={() => setActiveTitan(titan)}
                  >
                    <span className="tc-item-num">{titan.num}</span>
                    <span className="tc-item-name">{titan.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: DISPLAY DISPLAY PANEL */}
          <div className="tc-right-col">
            <div className="tc-display-panel">
              
              {/* Grow/Tilt Image Frame */}
              <div className="tc-image-frame">
                <img
                  src={activeTitan.image}
                  alt={activeTitan.name}
                  className="tc-titan-img"
                  draggable={false}
                />
              </div>

              {/* Lore Text and details */}
              <div className="tc-details">
                <p className="tc-height-tag">{activeTitan.height}</p>
                <h3 className="tc-titan-name">{activeTitan.name}</h3>
                
                <p className="tc-owner-line">
                  <span className="tc-owner-label">Current Owner: </span>
                  <span className="tc-owner-val">{activeTitan.owner}</span>
                </p>

                <p className="tc-desc-paragraph">{activeTitan.desc}</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default TitanCodex
export { TITAN_LIST }
