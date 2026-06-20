import { useState, useEffect, useRef } from 'react'

const TITAN_CARDS = [
  { name: 'Attack Titan', symbol: '⚔️' },
  { name: 'Colossal Titan', symbol: '🌋' },
  { name: 'Armored Titan', symbol: '🛡️' },
  { name: 'Female Titan', symbol: '🩰' },
  { name: 'Beast Titan', symbol: '🐒' },
  { name: 'Cart Titan', symbol: '📦' },
  { name: 'Jaw Titan', symbol: '🦷' },
  { name: 'War Hammer', symbol: '🔨' },
  { name: 'Founding Titan', symbol: '👑' },
]

export default function TitanMatch({ difficulty, onClose }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([]) // index of flipped cards
  const [matched, setMatched] = useState([]) // index of matched cards
  const [moves, setScore] = useState(0) // mismatches / moves count
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameState, setGameState] = useState('playing') // 'playing', 'gameover', 'victory'

  const timerRef = useRef(null)

  const getGridSize = () => {
    if (difficulty === 'easy') return 8 // 4 matches
    if (difficulty === 'hard') return 18 // 9 matches
    return 16 // 8 matches (medium)
  }

  const getTimerLimit = () => {
    if (difficulty === 'easy') return 9999
    if (difficulty === 'hard') return 45
    return 60 // medium
  }

  // Setup Cards on Mount
  useEffect(() => {
    const size = getGridSize()
    const numPairs = size / 2

    // Select random unique card pairs
    const selectedPairs = TITAN_CARDS.slice(0, numPairs)
    
    // Duplicate and map into card objects
    const cardPool = [...selectedPairs, ...selectedPairs].map((item, index) => ({
      ...item,
      uniqueId: index,
      isFlipped: false
    }))

    // Shuffle pool
    const shuffled = cardPool.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setTimeLeft(getTimerLimit())
    setFlipped([])
    setMatched([])
    setScore(0)
    setGameState('playing')
  }, [difficulty])

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing' || difficulty === 'easy') return

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 1
        if (next <= 0) {
          setGameState('gameover')
        }
        return next
      })
    }, 1000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [gameState, difficulty])

  const handleCardClick = (index) => {
    if (gameState !== 'playing') return
    if (flipped.length >= 2 || flipped.includes(index) || matched.includes(index)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setScore((s) => s + 1)
      const [firstIdx, secondIdx] = newFlipped
      
      // Match Check
      if (cards[firstIdx].name === cards[secondIdx].name) {
        setMatched((prev) => {
          const next = [...prev, firstIdx, secondIdx]
          if (next.length === cards.length) {
            setGameState('victory')
          }
          return next
        })
        setFlipped([])
      } else {
        // Reset mismatched cards after delay
        setTimeout(() => {
          setFlipped([])
        }, 1000)
      }
    }
  }

  const handleRestart = () => {
    setGameState('playing')
    setFlipped([])
    setMatched([])
    setScore(0)
    setTimeLeft(getTimerLimit())
    
    const size = getGridSize()
    const numPairs = size / 2
    const selectedPairs = TITAN_CARDS.slice(0, numPairs)
    const cardPool = [...selectedPairs, ...selectedPairs].map((item, index) => ({
      ...item,
      uniqueId: index,
      isFlipped: false
    }))
    const shuffled = cardPool.sort(() => Math.random() - 0.5)
    setCards(shuffled)
  }

  return (
    <div className="tm-playfield">
      {/* HUD Info */}
      <div className="cd-hud">
        {difficulty !== 'easy' && (
          <div className="cd-hud-item">
            <span className="cd-hud-label">TIME LIMIT:</span>
            <span className="cd-health-text" style={{ color: timeLeft > 15 ? '#22c55e' : '#ef4444' }}>{timeLeft}s</span>
          </div>
        )}
        <div className="cd-hud-item">
          <span className="cd-hud-label">MOVES COMPLETED:</span>
          <span className="cd-score-value">{moves}</span>
        </div>
        <div className="cd-hud-item">
          <span className="cd-hud-label">INTEL MODE:</span>
          <span className="cd-diff-value" style={{ color: '#eab308' }}>{difficulty.toUpperCase()}</span>
        </div>
      </div>

      {/* Grid of memory cards */}
      <div className={`tm-grid tm-grid--${getGridSize()}`}>
        {cards.map((card, i) => {
          const isFlippedCard = flipped.includes(i) || matched.includes(i)
          return (
            <div
              key={card.uniqueId}
              className={`tm-card ${isFlippedCard ? 'tm-card--flipped' : ''}`}
              onClick={() => handleCardClick(i)}
            >
              <div className="tm-card-inner">
                {/* Back side of card */}
                <div className="tm-card-back">
                  <span className="tm-card-crest">⸸</span>
                </div>
                {/* Front side of card */}
                <div className="tm-card-front">
                  <div className="tm-card-symbol">{card.symbol}</div>
                  <div className="tm-card-name">{card.name}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Screen States (GameOver / Victory) */}
      {gameState === 'gameover' && (
        <div className="gh-game-overlay">
          <h2 className="gh-overlay-title">INTELLIGENCE LEAK!</h2>
          <p className="gh-overlay-score">YOU FAILED TO REPORT TITAN IDENTITIES IN TIME ON {difficulty.toUpperCase()} MODE.</p>
          <div className="gh-overlay-buttons">
            <button className="gh-overlay-btn gh-overlay-btn--primary" onClick={handleRestart}>RE-ENGAGE STUDY</button>
            <button className="gh-overlay-btn" onClick={onClose}>RETURN PROTOCOL</button>
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="gh-game-overlay">
          <h2 className="gh-overlay-title gh-overlay-title--victory">INTEL SECURED!</h2>
          <p className="gh-overlay-score">YOU MATCHED ALL {cards.length / 2} SHIFTER THREATS IN {moves} MOVES ON {difficulty.toUpperCase()} MODE!</p>
          <div className="gh-overlay-buttons">
            <button className="gh-overlay-btn gh-overlay-btn--primary" onClick={handleRestart}>STUDY AGAIN</button>
            <button className="gh-overlay-btn" onClick={onClose}>RETURN PROTOCOL</button>
          </div>
        </div>
      )}

      <style>{`
        .tm-playfield {
          position: relative;
          width: 100%;
          height: 100%;
          background: #050508;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem 2rem 2rem;
          overflow: hidden;
        }
        .tm-grid {
          display: grid;
          gap: 1.25rem;
          width: 100%;
          max-width: 800px;
          height: 70%;
          max-height: 550px;
          justify-content: center;
        }
        .tm-grid--8 {
          grid-template-columns: repeat(4, 120px);
          grid-template-rows: repeat(2, 160px);
        }
        .tm-grid--16 {
          grid-template-columns: repeat(4, 110px);
          grid-template-rows: repeat(4, 110px);
        }
        .tm-grid--18 {
          grid-template-columns: repeat(6, 95px);
          grid-template-rows: repeat(3, 130px);
        }

        .tm-card {
          perspective: 1000px;
          cursor: pointer;
        }
        .tm-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .tm-card--flipped .tm-card-inner {
          transform: rotateY(180deg);
        }
        .tm-card-back, .tm-card-front {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border: 1px solid rgba(196, 164, 80, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }
        .tm-card-back {
          background: rgba(14, 14, 19, 0.95);
          color: #9b1a1a;
        }
        .tm-card-back::before {
          content: '';
          position: absolute;
          inset: 3px;
          border: 1px dashed rgba(196, 164, 80, 0.1);
        }
        .tm-card-crest {
          font-family: 'Cinzel Decorative', serif;
          font-size: 1.8rem;
          text-shadow: 0 0 10px rgba(155,26,26,0.5);
        }
        .tm-card-front {
          background: rgba(26, 26, 34, 0.95);
          border-color: #c4a450;
          transform: rotateY(180deg);
          gap: 0.4rem;
        }
        .tm-card-symbol {
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }
        .tm-card-name {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #f0ece4;
          text-align: center;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  )
}
