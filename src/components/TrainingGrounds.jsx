import { useState, useEffect, useRef } from 'react'
import FireAshes from './FireAshes'
import './TrainingGrounds.css'

// 🧮 MODULE-SCOPE PURE UTILITY FUNCTIONS (Declared outside React to satisfy Purity rules)
function getRandomPosition(width, height, size) {
  const x = Math.floor(Math.random() * (width - size - 40)) + 20
  const y = Math.floor(Math.random() * (height - size - 40)) + 20
  return { x, y }
}

function generateNoiseBuffer(ctx, sampleRate) {
  const bufferSize = sampleRate * 0.15 // 150ms burst
  const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate)
  const output = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1
  }
  return noiseBuffer
}

// Global Audio Context initialized lazily in browser
let globalAudioCtx = null

function initGlobalAudio() {
  if (!globalAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext) {
      globalAudioCtx = new AudioContext()
    }
  }
  if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume()
  }
  return globalAudioCtx
}

function playSlashSound() {
  const ctx = initGlobalAudio()
  if (!ctx) return

  const now = ctx.currentTime

  // 1. Swoosh (Filtered White Noise Burst)
  const noiseBuffer = generateNoiseBuffer(ctx, ctx.sampleRate)
  const noiseSource = ctx.createBufferSource()
  noiseSource.buffer = noiseBuffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.setValueAtTime(2000, now)
  filter.frequency.exponentialRampToValueAtTime(800, now + 0.12)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.25, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

  noiseSource.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(ctx.destination)
  noiseSource.start()

  // 2. Metallic Impact (Fm Synthesized Pitch-Drop Oscillator)
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(850, now)
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.08)

  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0.18, now)
  oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09)

  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.start()
  osc.stop(now + 0.1)
}

function playMissSound() {
  const ctx = initGlobalAudio()
  if (!ctx) return

  const now = ctx.currentTime

  // Low frequency metallic thud
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(130, now)
  osc.frequency.linearRampToValueAtTime(30, now + 0.25)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.4, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(now + 0.25)
}

function playGameOverSound() {
  const ctx = initGlobalAudio()
  if (!ctx) return

  const now = ctx.currentTime

  // Orchestral dark descending horn swell
  const freqs = [180, 140, 110] // Descending chord
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, now + i * 0.12)
    osc.frequency.linearRampToValueAtTime(freq - 15, now + 0.6)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 450

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.12, now + i * 0.12 + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now + i * 0.12)
    osc.stop(now + 0.8)
  })
}

export default function TrainingGrounds({ isOpen, onClose }) {
  const [gameState, setGameState] = useState('idle') // 'idle', 'playing', 'gameover'
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  const [targets, setTargets] = useState([]) // Array of active target items
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('scout_high_score') || '0', 10)
  })

  const gameAreaRef = useRef(null)
  const gameIntervalRef = useRef(null)
  const targetIdCounterRef = useRef(0)

  // Block body scroll when active
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

  // Stop game loop
  const stopGame = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current)
      gameIntervalRef.current = null
    }
  }

  // Clean up timers on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stopGame()
    }
    return () => {
      stopGame()
    }
  }, [isOpen])

  // Handler for target misses
  const handleTargetMiss = (id) => {
    setTargets(prev => {
      const exists = prev.some(t => t.id === id)
      if (exists) {
        playMissSound()
        setLives(currLives => {
          const nextLives = currLives - 1
          if (nextLives <= 0) {
            // Game Over sequence
            stopGame()
            setTargets([])
            setGameState('gameover')
            playGameOverSound()

            setScore(currScore => {
              if (currScore > highScore) {
                setHighScore(currScore)
                localStorage.setItem('scout_high_score', currScore.toString())
              }
              return currScore
            })
          }
          return nextLives
        })
        return prev.filter(t => t.id !== id)
      }
      return prev
    })
  }

  // Spawns a single target item
  const spawnTarget = () => {
    if (!gameAreaRef.current) return

    const id = targetIdCounterRef.current++
    const rect = gameAreaRef.current.getBoundingClientRect()
    
    // Constraints: 12% - 88% range so targets don't clip outside borders
    const size = 52 // Match CSS target size
    const pos = getRandomPosition(rect.width, rect.height, size)

    // Target lifespan shrinks as level grows
    const duration = Math.max(750, 1800 - (level * 100))

    const newTarget = {
      id,
      x: pos.x,
      y: pos.y,
      duration
    }

    setTargets(prev => [...prev, newTarget])

    // Set automatic miss timer if target isn't sliced in time
    setTimeout(() => {
      handleTargetMiss(id)
    }, duration)
  }

  // Starts the main gameplay loop
  const startGame = () => {
    initGlobalAudio()
    setScore(0)
    setLives(3)
    setLevel(1)
    setTargets([])
    setGameState('playing')
    targetIdCounterRef.current = 0

    // Spawn a target immediately, then start interval loop
    spawnTarget()
  }

  // Update target spawn rate when Level scales
  useEffect(() => {
    if (gameState !== 'playing') return
    stopGame()

    // Spawn targets progressively based on level
    const spawnDelay = Math.max(480, 1200 - (level * 110))
    gameIntervalRef.current = setInterval(() => {
      spawnTarget()
    }, spawnDelay)

    return () => stopGame()
  }, [level, gameState])

  if (!isOpen) return null

  const handleTargetSlice = (id, e) => {
    e.stopPropagation()
    playSlashSound()

    setScore(prev => {
      const nextScore = prev + 10
      // Scale level every 50 points
      setLevel(Math.floor(nextScore / 50) + 1)
      return nextScore
    })

    // Remove target from board
    setTargets(prev => prev.filter(t => t.id !== id))
  }

  // EVALUATING PERFORMANCE RANK
  const getRankEvaluation = () => {
    if (score >= 200) return { title: "RANK S: HUMANITY'S STRONGEST", desc: "Peerless Ackerman reflexes. Your movements are supersonic. Captain Levi would be honored to fight by your side.", badge: "⸸" }
    if (score >= 120) return { title: "RANK A: SQUAD LEADER", desc: "Expert maneuverability. Excellent targeting accuracy and battlefield awareness. Fully ready to lead the Special Ops Squad.", badge: "🦅" }
    if (score >= 70)  return { title: "RANK B: ELITE SOLDIER", desc: "Highly skilled. Successfully navigated high-threat targets and secured the nape slice. Eldia stands proud of your steel.", badge: "⚔" }
    if (score >= 30)  return { title: "RANK C: RECRUIT CADET", desc: "Basic cadet reflexes. You survived your first scouting encounter, but your speed needs training. Dedicate your heart!", badge: "🧱" }
    return { title: "RANK F: TITAN BAIT", desc: "Mindless titan food. You failed to slice the napes and became a tragic casualty beyond the walls. Re-enlist immediately!", badge: "💀" }
  }

  const rank = getRankEvaluation()

  return (
    <div className="tg-overlay animate-fade-in" onClick={onClose}>
      <div className="tg-backdrop" />
      <FireAshes />

      <div className="tg-modal" onClick={e => e.stopPropagation()}>
        
        {/* Top Close Banner */}
        <div className="tg-top-banner" onClick={onClose}>
          <span className="tg-banner-anchor">⚔</span>
          <span className="tg-banner-text">DISMISS TRAINING GROUNDS</span>
          <span className="tg-banner-anchor">⚔</span>
        </div>

        <div className="tg-container">
          
          {/* LEFT COLUMN: THE SCOREBOARD CARD */}
          <div className="tg-left-col">
            <p className="tg-eyebrow">REFLEX CONDITIONING</p>
            <h2 className="tg-main-title">CADET GYM</h2>
            <div className="tg-divider" />

            <div className="tg-scoreboard-card">
              <div className="tg-stamp">SURVEY OPS</div>

              <div className="tg-stat-block">
                <span className="tg-stat-lbl">CURRENT HIGHSCORE</span>
                <span className="tg-stat-val tg-stat-val--gold">{highScore} PTS</span>
              </div>

              <div className="tg-stat-block">
                <span className="tg-stat-lbl">TACTICAL FIELD SCORE</span>
                <span className="tg-stat-val">{score} PTS</span>
              </div>

              <div className="tg-stat-block">
                <span className="tg-stat-lbl">CADET LEVEL STAGE</span>
                <span className="tg-stat-val tg-stat-val--danger">STAGE {level}</span>
              </div>

              <div className="tg-lives-block">
                <span className="tg-stat-lbl">WINGS OF SURVIVAL (LIVES)</span>
                <div className="tg-lives-row">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span 
                      key={i} 
                      className={`tg-heart-icon ${i < lives ? 'tg-heart-icon--active' : ''}`}
                    >
                      🛡️
                    </span>
                  ))}
                </div>
              </div>

              <div className="tg-instructions-box">
                <p className="tg-instruction-title">⚔️ TRAINING OBJECTIVE</p>
                <p className="tg-instruction-text">
                  Titans targets (glowing target circles representing vulnerable napes) will spawn at random sectors inside the training arena. 
                </p>
                <p className="tg-instruction-text">
                  **Slice (click) them before their shrinking countdown border reaches zero.** Missing three targets ends the session.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: THE INTERACTIVE TARGET ARENA */}
          <div className="tg-right-col">
            
            {/* GAME VIEW: IDLE / START SCREEN */}
            {gameState === 'idle' && (
              <div className="tg-arena-panel tg-arena-panel--intro animate-fade-in">
                <div className="tg-panel-tag">MILITARY TRAINING SECTOR CO-850</div>
                <div className="tg-center-intro">
                  <span className="tg-intro-logo">⸸</span>
                  <h3 className="tg-intro-title">ACKERMAN REFLEX PROTOCOL</h3>
                  <p className="tg-intro-desc">
                    Test your response times and target accuracy against moving target sectors. Calibrated to mirror Ackerman-level combat orbits.
                  </p>
                  <button className="tg-start-btn" onClick={startGame}>
                    INITIALIZE MANEUVER EXERCISE
                    <span className="tg-btn-glow" />
                  </button>
                </div>
              </div>
            )}

            {/* GAME VIEW: RUNNING PLAYING FIELD */}
            {gameState === 'playing' && (
              <div 
                className="tg-arena-panel tg-arena-panel--playing" 
                ref={gameAreaRef}
              >
                <div className="tg-panel-tag">TACTICAL COMBAT ARENA - STAGE {level}</div>
                
                {/* Dynamically spawned target elements */}
                {targets.map(target => (
                  <div
                    key={target.id}
                    className="tg-target-circle"
                    style={{
                      left: target.x,
                      top: target.y,
                      '--duration': `${target.duration}ms`
                    }}
                    onClick={(e) => handleTargetSlice(target.id, e)}
                  >
                    {/* Shrinking outer boundary countdown circle */}
                    <div className="tg-target-countdown" />
                    {/* Solid inner targeting nape core */}
                    <div className="tg-target-core">
                      <span className="tg-target-blade">⚔</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* GAME VIEW: GAMEOVER SCORE EVALUATION SCREEN */}
            {gameState === 'gameover' && (
              <div className="tg-arena-panel tg-arena-panel--gameover animate-fade-in">
                <div className="tg-panel-tag">MILITARY DISCHARGE DOSSIER</div>
                
                <div className="tg-evaluation-card">
                  <div className="tg-badge-circle">
                    <span className="tg-badge-icon">{rank.badge}</span>
                  </div>

                  <h3 className="tg-rank-title">{rank.title}</h3>
                  <p className="tg-rank-score">FINAL SCORE: {score} POINTS</p>
                  <div className="tg-rank-divider" />
                  <p className="tg-rank-desc">{rank.desc}</p>

                  <div className="tg-action-row">
                    <button className="tg-retry-btn" onClick={startGame}>
                      RE-ENLIST FOR EXERCISE
                    </button>
                    <button className="tg-dismiss-btn" onClick={() => setGameState('idle')}>
                      RETURN TO HALL
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
