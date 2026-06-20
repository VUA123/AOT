import { useState, useEffect, useRef } from 'react'

export default function CannonDefense({ difficulty, onClose }) {
  const [score, setScore] = useState(0)
  const [wallHealth, setWallHealth] = useState(100)
  const [titans, setTitans] = useState([])
  const [explosions, setExplosions] = useState([])
  const [gameState, setGameState] = useState('playing') // 'playing', 'gameover', 'victory'
  
  const requestRef = useRef(null)
  const spawnTimerRef = useRef(null)
  const gameAreaRef = useRef(null)

  // Configure difficulty parameters
  const getSpeedMultiplier = () => {
    if (difficulty === 'easy') return 0.5
    if (difficulty === 'hard') return 1.6
    return 1.0 // medium
  }

  const getSpawnInterval = () => {
    if (difficulty === 'easy') return 2200
    if (difficulty === 'hard') return 800
    return 1400 // medium
  }

  const getVictoryScore = () => {
    if (difficulty === 'easy') return 15
    if (difficulty === 'hard') return 40
    return 25 // medium
  }

  // Spawning Titans
  useEffect(() => {
    if (gameState !== 'playing') return

    const spawnTitan = () => {
      const id = Math.random().toString(36).substring(2, 9)
      const sizeClasses = ['titan-small', 'titan-medium', 'titan-large']
      const type = sizeClasses[Math.floor(Math.random() * sizeClasses.length)]
      
      let speed = (type === 'titan-small' ? 1.8 : type === 'titan-medium' ? 1.1 : 0.7) * getSpeedMultiplier()
      let hp = type === 'titan-large' ? 3 : type === 'titan-medium' ? 2 : 1

      const newTitan = {
        id,
        x: Math.random() * 85 + 5, // Percent from left (5% to 90%)
        y: -10, // Start above the screen
        hp,
        maxHp: hp,
        speed,
        type
      }

      setTitans((prev) => [...prev, newTitan])
    }

    spawnTimerRef.current = setInterval(spawnTitan, getSpawnInterval())

    return () => {
      clearInterval(spawnTimerRef.current)
    }
  }, [gameState, difficulty])

  // Game Loop (Moving Titans)
  useEffect(() => {
    if (gameState !== 'playing') return

    const updateGame = () => {
      setTitans((prevTitans) => {
        let hitWall = false
        const updated = prevTitans.map((titan) => {
          const nextY = titan.y + titan.speed
          if (nextY >= 90) {
            hitWall = true
            return null
          }
          return { ...titan, y: nextY }
        }).filter(Boolean)

        if (hitWall) {
          setWallHealth((h) => {
            const nextH = Math.max(0, h - (difficulty === 'hard' ? 20 : difficulty === 'medium' ? 15 : 8))
            if (nextH <= 0) {
              setGameState('gameover')
            }
            return nextH
          })
        }

        return updated
      })

      // Clean up finished explosions
      setExplosions((prev) => prev.filter(exp => Date.now() - exp.timestamp < 600))

      requestRef.current = requestAnimationFrame(updateGame)
    }

    requestRef.current = requestAnimationFrame(updateGame)

    return () => {
      cancelAnimationFrame(requestRef.current)
    }
  }, [gameState, difficulty])

  // Fire Cannon on Titan click
  const handleShootTitan = (titanId, e) => {
    e.stopPropagation()
    if (gameState !== 'playing') return

    // Find coordinate relative to container for explosion
    const rect = gameAreaRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Trigger cannon blast sound or effect visual
    const expId = Math.random().toString(36).substring(2, 9)
    setExplosions((prev) => [...prev, { id: expId, x: clickX, y: clickY, timestamp: Date.now() }])

    setTitans((prev) => {
      return prev.map((t) => {
        if (t.id === titanId) {
          const nextHp = t.hp - 1
          if (nextHp <= 0) {
            setScore((s) => {
              const nextScore = s + 1
              if (nextScore >= getVictoryScore()) {
                setGameState('victory')
              }
              return nextScore
            })
            return null // Titan vaporized
          }
          return { ...t, hp: nextHp }
        }
        return t
      }).filter(Boolean)
    })
  }

  const handleAreaClick = (e) => {
    // Standard firing on empty space
    if (gameState !== 'playing') return
    const rect = gameAreaRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    const expId = Math.random().toString(36).substring(2, 9)
    setExplosions((prev) => [...prev, { id: expId, x: clickX, y: clickY, timestamp: Date.now() }])
  }

  const handleRestart = () => {
    setScore(0)
    setWallHealth(100)
    setTitans([])
    setExplosions([])
    setGameState('playing')
  }

  return (
    <div className="cd-playfield" ref={gameAreaRef} onClick={handleAreaClick}>
      {/* HUD Info */}
      <div className="cd-hud">
        <div className="cd-hud-item">
          <span className="cd-hud-label">WALL INTG:</span>
          <div className="cd-health-bar-container">
            <div className="cd-health-bar" style={{ width: `${wallHealth}%`, backgroundColor: wallHealth > 50 ? '#22c55e' : wallHealth > 25 ? '#eab308' : '#ef4444' }} />
          </div>
          <span className="cd-health-text">{wallHealth}%</span>
        </div>
        <div className="cd-hud-item">
          <span className="cd-hud-label">TITANS DESTROYED:</span>
          <span className="cd-score-value">{score} / {getVictoryScore()}</span>
        </div>
        <div className="cd-hud-item">
          <span className="cd-hud-label">SECTOR:</span>
          <span className="cd-diff-value cd-diff-value--hard">{difficulty.toUpperCase()}</span>
        </div>
      </div>

      {/* Wall Indicator at the bottom */}
      <div className="cd-wall-boundary">
        <div className="cd-wall-brick-pattern" />
        <span className="cd-wall-warning-text">WALL ROSE DEFENSE SYSTEM</span>
      </div>

      {/* Advancing Titans */}
      {titans.map((titan) => (
        <div
          key={titan.id}
          className={`cd-titan ${titan.type}`}
          style={{ left: `${titan.x}%`, top: `${titan.y}%` }}
          onClick={(e) => handleShootTitan(titan.id, e)}
        >
          {/* Health indicator on top of Titan */}
          {titan.maxHp > 1 && (
            <div className="cd-titan-hp">
              <span className="cd-hp-dot cd-hp-dot--active" />
              {titan.maxHp >= 2 && <span className={`cd-hp-dot ${titan.hp >= 2 ? 'cd-hp-dot--active' : ''}`} />}
              {titan.maxHp >= 3 && <span className={`cd-hp-dot ${titan.hp >= 3 ? 'cd-hp-dot--active' : ''}`} />}
            </div>
          )}
          {/* Titan head silhouette SVG */}
          <div className="cd-titan-silhouette">👹</div>
        </div>
      ))}

      {/* Explosion animations */}
      {explosions.map((exp) => (
        <div
          key={exp.id}
          className="cd-explosion"
          style={{ left: `${exp.x}px`, top: `${exp.y}px` }}
        />
      ))}

      {/* Screen States (GameOver / Victory) */}
      {gameState === 'gameover' && (
        <div className="gh-game-overlay">
          <h2 className="gh-overlay-title">WALL ROSE BREACHED!</h2>
          <p className="gh-overlay-score">HUMANITY HAS FALLEN ON {difficulty.toUpperCase()} MODE.</p>
          <div className="gh-overlay-buttons">
            <button className="gh-overlay-btn gh-overlay-btn--primary" onClick={handleRestart}>RE-ENGAGE DEFENSE</button>
            <button className="gh-overlay-btn" onClick={onClose}>RETURN PROTOCOL</button>
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="gh-game-overlay">
          <h2 className="gh-overlay-title gh-overlay-title--victory">VICTORY FOR HUMANITY!</h2>
          <p className="gh-overlay-score">YOU SECURED THE SECTOR ON {difficulty.toUpperCase()} MODE!</p>
          <div className="gh-overlay-buttons">
            <button className="gh-overlay-btn gh-overlay-btn--primary" onClick={handleRestart}>DEFEND AGAIN</button>
            <button className="gh-overlay-btn" onClick={onClose}>RETURN PROTOCOL</button>
          </div>
        </div>
      )}

      {/* Custom Styles Embedded Directly */}
      <style>{`
        .cd-playfield {
          position: relative;
          width: 100%;
          height: 100%;
          background: #06060a;
          overflow: hidden;
          cursor: crosshair;
        }
        .cd-hud {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 2rem;
          background: rgba(14, 14, 19, 0.9);
          border: 1px solid rgba(196, 164, 80, 0.2);
          padding: 0.8rem 1.5rem;
          z-index: 10;
          font-family: 'Cinzel', serif;
        }
        .cd-hud-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .cd-hud-label {
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          color: #c4a450;
        }
        .cd-health-bar-container {
          width: 100px;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .cd-health-bar {
          height: 100%;
          transition: width 0.3s;
        }
        .cd-health-text, .cd-score-value, .cd-diff-value {
          font-size: 0.75rem;
          font-weight: 700;
          color: #f0ece4;
        }
        .cd-diff-value--hard {
          color: #ef4444;
        }
        .cd-wall-boundary {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 10%;
          background: #1a1a24;
          border-top: 4px solid #c4a450;
          box-shadow: inset 0 10px 30px rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }
        .cd-wall-warning-text {
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          letter-spacing: 0.25em;
          color: rgba(240, 236, 228, 0.6);
        }
        /* Titans */
        .cd-titan {
          position: absolute;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .cd-titan:hover {
          transform: translateX(-50%) scale(1.1);
        }
        .cd-titan-silhouette {
          font-size: 3.5rem;
          user-select: none;
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.8));
          animation: cd-sway 1.5s ease-in-out infinite alternate;
        }
        @keyframes cd-sway {
          from { transform: rotate(-5deg); }
          to { transform: rotate(5deg); }
        }
        .titan-small .cd-titan-silhouette { font-size: 2.2rem; }
        .titan-medium .cd-titan-silhouette { font-size: 3.2rem; }
        .titan-large .cd-titan-silhouette { font-size: 4.8rem; filter: drop-shadow(0 0 10px rgba(155,26,26,0.5)); }

        .cd-titan-hp {
          display: flex;
          gap: 3px;
          background: rgba(0,0,0,0.7);
          padding: 2px 4px;
          border-radius: 4px;
          margin-bottom: 2px;
        }
        .cd-hp-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
        }
        .cd-hp-dot--active {
          background: #ef4444;
          box-shadow: 0 0 5px #ef4444;
        }
        /* Explosions */
        .cd-explosion {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, #f59e0b, #ef4444 60%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          animation: cd-blast-anim 0.5s ease-out forwards;
          opacity: 0.9;
          z-index: 8;
        }
        @keyframes cd-blast-anim {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
