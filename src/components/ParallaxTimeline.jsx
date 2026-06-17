import { useState, useEffect, useRef } from 'react'
import FireAshes from './FireAshes'
import './ParallaxTimeline.css'

function playFlashbackSound(id) {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return
  const ctx = new AudioContext()
  const now = ctx.currentTime

  if (id === 'progenitor') {
    // Celestial bell chime (Paths resonant chords)
    const freqs = [523.25, 659.25, 783.99, 1046.50] // C Major
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.1)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.0, now)
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.1 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 1.2)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.1)
      osc.stop(now + idx * 0.1 + 1.3)
    })
  } else if (id === 'retreat') {
    // Royal horn blast (King Karl Fritz's command)
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now) // A3
    osc.frequency.linearRampToValueAtTime(196, now + 0.8) // G3

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(450, now)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0, now)
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(now + 1.1)
  } else if (id === 'fall') {
    // Shiganshina gateway breach (colossal explosion thud)
    const bufferSize = ctx.sampleRate * 0.8
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(300, now)
    filter.frequency.exponentialRampToValueAtTime(10, now + 0.6)

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.35, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7)

    const thud = ctx.createOscillator()
    thud.type = 'triangle'
    thud.frequency.setValueAtTime(80, now)
    thud.frequency.exponentialRampToValueAtTime(20, now + 0.3)

    const thudGain = ctx.createGain()
    thudGain.gain.setValueAtTime(0.3, now)
    thudGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(ctx.destination)

    thud.connect(thudGain)
    thudGain.connect(ctx.destination)

    noise.start()
    thud.start()
    noise.stop(now + 0.8)
    thud.stop(now + 0.5)
  } else if (id === 'vanguard') {
    // 3DMG combat slicing blade swooshes
    for (let i = 0; i < 3; i++) {
      const start = now + i * 0.2
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(2200, start)
      osc.frequency.exponentialRampToValueAtTime(400, start + 0.15)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.0, start)
      gain.gain.linearRampToValueAtTime(0.12, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.14)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.16)
    }
  } else if (id === 'basement') {
    // Ocean waves sound (Swell filter sweep)
    const bufferSize = ctx.sampleRate * 2.0
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(150, now)
    filter.frequency.linearRampToValueAtTime(350, now + 0.8)
    filter.frequency.linearRampToValueAtTime(120, now + 1.8)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0, now)
    gain.gain.linearRampToValueAtTime(0.25, now + 0.8)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start()
    noise.stop(now + 2.0)
  } else if (id === 'rumbling') {
    // Sub-bass heavy earthquake rumbles (Stomp cadence)
    const osc1 = ctx.createOscillator()
    osc1.type = 'triangle'
    osc1.frequency.value = 35

    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 40

    const lfo = ctx.createOscillator()
    lfo.frequency.value = 3.2
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.5

    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.65

    lfo.connect(lfoGain)
    lfoGain.connect(masterGain.gain)

    osc1.connect(masterGain)
    osc2.connect(masterGain)
    masterGain.connect(ctx.destination)

    osc1.start()
    osc2.start()
    lfo.start()

    osc1.stop(now + 2.2)
    osc2.stop(now + 2.2)
    lfo.stop(now + 2.2)
  }
}

const EPOCHS = [
  {
    id: 'progenitor',
    roman: 'I',
    year: '0 B.C. · THE PROGENITOR',
    title: 'YMIR FRITZ & THE COORDINATE',
    subtitle: 'THE ANOMALY OF ALL LIFE',
    summary: 'A young slave girl named Ymir is pursued by hounds into the hollow core of a primordial giant tree. There, she merges with a mysterious spine-like aquatic organism, becoming the world\'s very first Titan. King Fritz exploits her god-like power to conquer nations and establish the Eldian Empire. Upon her physical death, Ymir\'s soul is bound to the timeless realm of the Paths, endlessly building Titans out of clay for her future inheritors.',
    badge: '👑'
  },
  {
    id: 'retreat',
    roman: 'II',
    year: '743 B.C. · THE GREAT RETREAT',
    title: 'THE COVENANT OF WALLS',
    subtitle: 'THE 145TH MONARCH\'S VOW',
    summary: 'Saddened by centuries of global blood and conflict, King Karl Fritz (the 145th Eldian Monarch) orchestrates the collapse of the Eldian Empire during the Great Titan War. He leads millions of Eldians to the remote island of Paradis, raises millions of Wall Titans to construct Walls Maria, Rose, and Sheena, and uses the Founding Titan to rewrite his subjects\' memories, forcing them into a peaceful, state-controlled ignorance.',
    badge: '🧱'
  },
  {
    id: 'fall',
    roman: 'III',
    year: 'YEAR 845 · THE BREACH',
    title: 'THE DAY THE WALLS FELL',
    subtitle: 'HUMANITY\'S GRIM RECOVERY',
    summary: 'After a century of silent security, the Colossal Titan suddenly materializes at Shiganshina District, kicking a breach into the gate, followed by the Armored Titan shattering the inner gate. Humanity loses Wall Maria and 25% of its land. A young Eren Yeager witnesses his mother being devoured, swearing an absolute, desperate vow to exterminate every single Titan from the face of the earth.',
    badge: '💀'
  },
  {
    id: 'vanguard',
    roman: 'IV',
    year: 'YEAR 850 · THE STAND',
    title: 'THE STRUGGLE FOR PARADIS',
    subtitle: 'THE FIRST COUNTERATTACK',
    summary: 'The Colossal Titan breaches Wall Rose at Trost District. During the desperate defense, Eren Yeager awakens his Attack Titan form, lifting a colossal boulder to seal the breach. Later, the Survey Corps unmasks Annie Leonhart as the Female Titan, launching a high-stakes capture operation inside Stohess District, which reveals a giant skinless Titan sleeping inside the stone walls.',
    badge: '⚔'
  },
  {
    id: 'basement',
    roman: 'V',
    year: 'YEAR 850 · THE BASEMENT',
    title: 'SECRETS OF THE OCEAN',
    subtitle: 'THE WORLD BEYOND THE SEA',
    summary: 'The Survey Corps retakes Shiganshina, defeating the Beast and Colossal Titans at a tragic cost. Reaching Grisha Yeager\'s basement, Eren unlocks a desk drawer containing three journals and a photograph. The truth is revealed: humanity did not perish beyond the walls; instead, Paradis is a quarantined island blockaded by the global Marleyan Empire, which keeps them locked in a tragic cycle of war.',
    badge: '🌊'
  },
  {
    id: 'rumbling',
    roman: 'VI',
    year: 'YEAR 854 · THE APOCALYPSE',
    title: 'THE RUMBLING OF EARTH',
    subtitle: 'EREN\'S ABSOLUTE FREEDOM',
    summary: 'Believing that peaceful diplomacy is a lie, Eren Yeager seizes absolute control of the Founding Titan\'s Coordinate. He awakens the millions of sleeping Colossal Titans bricked inside the walls, launching the Rumbling—a global march of colossal destruction to trample every civilization outside Paradis, forcing the remnants of the Survey Corps to launch a final suicidal defense.',
    badge: '🔥'
  }
]

export default function ParallaxTimeline({ isOpen, onClose }) {
  const [scrollProgress, setSignalProgress] = useState(0)
  const [activeFlashback, setActiveFlashback] = useState(null)
  const timelineViewportRef = useRef(null)

  // Block background scroll when modal is active
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

  // Automatically fade out flashback overlay after 2.2 seconds
  useEffect(() => {
    if (activeFlashback) {
      const timer = setTimeout(() => {
        setActiveFlashback(null)
      }, 2200)
      return () => clearTimeout(timer)
    }
  }, [activeFlashback])

  if (!isOpen) return null

  const triggerFlashback = (id) => {
    setActiveFlashback(id)
    playFlashbackSound(id)
  }

  // Calculate parallax scrolling shift percentage
  const handleScroll = () => {
    const el = timelineViewportRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll <= 0) return
    const progress = el.scrollLeft / maxScroll
    setSignalProgress(progress)
  }

  return (
    <div className="pt-overlay animate-fade-in" onClick={onClose}>
      <div className="pt-backdrop" />
      <FireAshes />

      {activeFlashback && (
        <div className={`pt-flashback-overlay pt-flashback-overlay--${activeFlashback}`} />
      )}

      <div className="pt-modal" onClick={e => e.stopPropagation()}>
        
        {/* Top Gold Close Banner */}
        <div className="pt-top-banner" onClick={onClose}>
          <span className="pt-banner-anchor">⚔</span>
          <span className="pt-banner-text">DISMISS EPOCH TIMELINE</span>
          <span className="pt-banner-anchor">⚔</span>
        </div>

        <div className="pt-container">
          
          {/* Header section matching the gold/cinzel style */}
          <div className="pt-header">
            <span className="pt-header-rule" />
            <div className="pt-header-title-box">
              <p className="pt-eyebrow">2,000 YEARS OF ELDIAN HISTORY</p>
              <h2 className="pt-title">THE PARADIS TIMELINE</h2>
            </div>
            <span className="pt-header-rule" />
          </div>

          {/* Interactive Parallax horizontal timeline viewport */}
          <div 
            className="pt-viewport" 
            ref={timelineViewportRef}
            onScroll={handleScroll}
          >
            {/* Parallax Background Layer (Slow shifting scriptures/constellations) */}
            <div 
              className="pt-parallax-bg"
              style={{ transform: `translateX(${-scrollProgress * 150}px)` }}
            >
              {/* Decorative Coordinates Paths line network in CSS */}
              <div className="pt-paths-line" />
            </div>

            <div className="pt-cards-track">
              {EPOCHS.map((epoch, idx) => (
                <div 
                  key={epoch.id} 
                  className="pt-epoch-card"
                  style={{ '--idx': idx }}
                >
                  <div className="pt-card-header">
                    <span className="pt-card-roman">{epoch.roman}</span>
                    <span className="pt-card-badge">{epoch.badge}</span>
                  </div>

                  <p className="pt-card-year">{epoch.year}</p>
                  <h3 className="pt-card-title">{epoch.title}</h3>
                  <p className="pt-card-subtitle">{epoch.subtitle}</p>
                  <div className="pt-card-divider" />
                  
                  <p className="pt-card-desc">{epoch.summary}</p>

                  <div className="pt-card-footer">
                    <span>SECTOR RECORD {idx + 1} OF 6</span>
                    <button 
                      className="pt-flashback-btn" 
                      onClick={() => triggerFlashback(epoch.id)}
                    >
                      ⚡ RECALL FLASHBACK
                    </button>
                    <span className="pt-footer-coordinate">⸸</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Scroll progress slider at the bottom */}
          <div className="pt-scroll-indicator">
            <div className="pt-indicator-bar-track">
              <div 
                className="pt-indicator-bar-fill" 
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <span className="pt-indicator-txt">DRAG OR SCROLL HORIZONTALLY TO NAVIGATE EPOCHS</span>
          </div>

        </div>

      </div>
    </div>
  )
}
