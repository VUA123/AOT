import { useState, useEffect, useRef } from 'react'

export default function OdmReflexes({ difficulty, onClose }) {
  const [score, setScore] = useState(0)
  const [gasLevel, setGasLevel] = useState(100)
  const [activePrompt, setActivePrompt] = useState(null) // null or { key, x, y, size, timestamp }
  const [gameState, setGameState] = useState('playing') // 'playing', 'gameover', 'victory'
  const [feedbacks, setFeedbacks] = useState([]) // array of { id, text, x, y, color }

  const promptTimerRef = useRef(null)
  const animFrameRef = useRef(null)
  const playfieldRef = useRef(null)

  const getSpawnInterval = () => {
    if (difficulty === 'easy') return 2400
    if (difficulty === 'hard') return 900
    return 1600 // medium
  }

  const getTimingDuration = () => {
    if (difficulty === 'easy') return 1600
    if (difficulty === 'hard') return 600
    return 1000 // medium
  }

  const getVictoryScore = () => {
    if (difficulty === 'easy') return 12
    if (difficulty === 'hard') return 30
    return 20 // medium
  }

  const getAvailableKeys = () => {
    if (difficulty === 'easy') return ['W', 'S']
    return ['W', 'A', 'S', 'D']
  }

  // Key Down Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing' || !activePrompt) return

      const pressedKey = e.key.toUpperCase()
      const targetKey = activePrompt.key

      if (['W', 'A', 'S', 'D'].includes(pressedKey)) {
        if (pressedKey === targetKey) {
          // Check timing ring precision
          const elapsed = Date.now() - activePrompt.timestamp
          const duration = getTimingDuration()
          const precision = 1 - (elapsed / duration) // 1.0 (perfect) to 0.0 (too late)

          let points = 1
          let feedbackText = 'PERFECT!'
          let feedbackColor = '#22c55e'

          if (precision > 0.4) {
            feedbackText = 'PERFECT!'
            feedbackColor = '#22c55e'
          } else if (precision > 0.12) {
            feedbackText = 'GOOD!'
            feedbackColor = '#eab308'
          } else {
            feedbackText = 'SLOPPY!'
            feedbackColor = '#f97316'
          }

          // Trigger Success
          triggerFeedback(feedbackText, activePrompt.x, activePrompt.y, feedbackColor)
          setScore((s) => {
            const next = s + points
            if (next >= getVictoryScore()) {
              setGameState('victory')
            }
            return next
          })
          setActivePrompt(null) // Consume prompt
        } else {
          // Wrong key pressed
          triggerFeedback('MISS-CLICK!', activePrompt.x, activePrompt.y, '#ef4444')
          deductGas()
          setActivePrompt(null)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameState, activePrompt, difficulty])

  // Prompt Spawner Loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const spawnPrompt = () => {
      const keys = getAvailableKeys()
      const key = keys[Math.floor(Math.random() * keys.length)]
      
      const newPrompt = {
        key,
        x: Math.random() * 70 + 15, // percent 15 to 85
        y: Math.random() * 60 + 20, // percent 20 to 80
        size: 1.0, // scale factor for outer ring
        timestamp: Date.now()
      }

      setActivePrompt(newPrompt)
    }

    promptTimerRef.current = setInterval(spawnPrompt, getSpawnInterval())

    return () => {
      clearInterval(promptTimerRef.current)
    }
  }, [gameState, difficulty])

  // Ring Animation tick
  useEffect(() => {
    if (gameState !== 'playing') return

    const animateRing = () => {
      if (activePrompt) {
        const elapsed = Date.now() - activePrompt.timestamp
        const duration = getTimingDuration()
        const scale = 1 - (elapsed / duration)

        if (scale <= 0) {
          // Prompt expired without hit - MISS!
          triggerFeedback('TIMEOUT!', activePrompt.x, activePrompt.y, '#ef4444')
          deductGas()
          setActivePrompt(null)
        } else {
          setActivePrompt((prev) => prev ? { ...prev, size: scale } : null)
        }
      }

      // Cleanup feedbacks
      setFeedbacks((prev) => prev.filter(f => Date.now() - f.timestamp < 800))

      animFrameRef.current = requestAnimationFrame(animateRing)
    }

    animFrameRef.current = requestAnimationFrame(animateRing)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [gameState, activePrompt, difficulty])

  const deductGas = () => {
    setGasLevel((gas) => {
      const damage = difficulty === 'hard' ? 25 : difficulty === 'medium' ? 20 : 12
      const nextGas = Math.max(0, gas - damage)
      if (nextGas <= 0) {
        setGameState('gameover')
      }
      return nextGas
    })
  }

  const triggerFeedback = (text, x, y, color) => {
    const id = Math.random().toString(36).substring(2, 9)
    setFeedbacks((prev) => [...prev, { id, text, x, y, color, timestamp: Date.now() }])
  }

  const handleRestart = () => {
    setScore(0)
    setGasLevel(100)
    setActivePrompt(null)
    setFeedbacks([])
    setGameState('playing')
  }

  return (
    <div className="odm-playfield" ref={playfieldRef}>
      {/* HUD Bar */}
      <div className="cd-hud">
        <div className="cd-hud-item">
          <span className="cd-hud-label">GAS PRESSURE:</span>
          <div className="cd-health-bar-container">
            <div className="cd-health-bar" style={{ width: `${gasLevel}%`, backgroundColor: gasLevel > 50 ? '#0284c7' : gasLevel > 25 ? '#f97316' : '#ef4444' }} />
          </div>
          <span className="cd-health-text" style={{ color: '#38bdf8' }}>{gasLevel}%</span>
        </div>
        <div className="cd-hud-item">
          <span className="cd-hud-label">GRAPPLES SECURED:</span>
          <span className="cd-score-value">{score} / {getVictoryScore()}</span>
        </div>
        <div className="cd-hud-item">
          <span className="cd-hud-label">FLIGHT:</span>
          <span className="cd-diff-value" style={{ color: '#0284c7' }}>{difficulty.toUpperCase()}</span>
        </div>
      </div>

      {/* Target prompt */}
      {activePrompt && (
        <div className="odm-prompt-container" style={{ left: `${activePrompt.x}%`, top: `${activePrompt.y}%` }}>
          {/* Target Key Letter */}
          <div className="odm-prompt-key">{activePrompt.key}</div>
          
          {/* Outer Shrinking Ring */}
          <div 
            className="odm-prompt-ring" 
            style={{ 
              transform: `translate(-50%, -50%) scale(${1 + activePrompt.size * 1.5})`,
              borderColor: activePrompt.size < 0.25 ? '#ef4444' : '#c4a450'
            }} 
          />
        </div>
      )}

      {/* Float Feedbacks */}
      {feedbacks.map((f) => (
        <div
          key={f.id}
          className="odm-feedback animate-float-up"
          style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.color }}
        >
          {f.text}
        </div>
      ))}

      {/* Screen States (GameOver / Victory) */}
      {gameState === 'gameover' && (
        <div className="gh-game-overlay">
          <h2 className="gh-overlay-title">GAS DEPLETED!</h2>
          <p className="gh-overlay-score">YOU CRASHED TO THE FOREST FLOOR ON {difficulty.toUpperCase()} MODE.</p>
          <div className="gh-overlay-buttons">
            <button className="gh-overlay-btn gh-overlay-btn--primary" onClick={handleRestart}>RE-LAUNCH FLIGHT</button>
            <button className="gh-overlay-btn" onClick={onClose}>RETURN PROTOCOL</button>
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="gh-game-overlay">
          <h2 className="gh-overlay-title gh-overlay-title--victory">FLIGHT PATH COMPLETED!</h2>
          <p className="gh-overlay-score">YOU NAVIGATED THE FOREST SECTOR SWIFTLY ON {difficulty.toUpperCase()} MODE!</p>
          <div className="gh-overlay-buttons">
            <button className="gh-overlay-btn gh-overlay-btn--primary" onClick={handleRestart}>FLIGHT AGAIN</button>
            <button className="gh-overlay-btn" onClick={onClose}>RETURN PROTOCOL</button>
          </div>
        </div>
      )}

      <style>{`
        .odm-playfield {
          position: relative;
          width: 100%;
          height: 100%;
          background: #030305;
          overflow: hidden;
        }
        .odm-prompt-container {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
        }
        .odm-prompt-key {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(196, 164, 80, 0.15);
          border: 2px solid #c4a450;
          box-shadow: 0 0 15px rgba(196, 164, 80, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f0ece4;
          font-family: 'Cinzel Decorative', serif;
          font-size: 1.8rem;
          font-weight: 900;
          user-select: none;
        }
        .odm-prompt-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #c4a450;
          pointer-events: none;
        }
        .odm-feedback {
          position: absolute;
          transform: translate(-50%, -50%);
          font-family: 'Cinzel Decorative', serif;
          font-size: 1.1rem;
          font-weight: 900;
          text-shadow: 0 2px 4px rgba(0,0,0,0.9);
          pointer-events: none;
          z-index: 12;
        }
        .animate-float-up {
          animation: odm-float 0.8s cubic-bezier(.2,0,.2,1) forwards;
        }
        @keyframes odm-float {
          0% { transform: translate(-50%, -50%) translateY(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) translateY(-40px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
