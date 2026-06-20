import { useState } from 'react'
import TrainingGrounds from '../TrainingGrounds'
import CannonDefense from './CannonDefense'
import OdmReflexes from './OdmReflexes'
import TitanMatch from './TitanMatch'
import './GamesHub.css'

export default function GamesHub({ gameType, onClose, user }) {
  const [difficulty, setDifficulty] = useState(null) // null, 'easy', 'medium', 'hard'

  const getGameTitle = () => {
    switch (gameType) {
      case 'training': return 'Target Practice (Training Grounds)'
      case 'cannon': return 'Trost Cannon Defense'
      case 'odm': return 'ODM Gear Reflex Maneuvers'
      case 'match': return 'Titan Shifter Memory Intel'
      default: return 'Scout Training Simulation'
    }
  }

  const getDifficultyDesc = (level) => {
    if (level === 'easy') return 'Peaceful Mode. Slower targets, abundant resources, and no timers. Perfect for recruits.'
    if (level === 'medium') return 'Normal Mode. Standard military speed, frequency, and conditions.'
    if (level === 'hard') return 'Hard Mode. Abnormal targets, lightning speed, and brutal timers. Dedicate your heart!'
    return ''
  }

  return (
    <div className="gh-fullscreen">
      {/* Background Grid Dust */}
      <div className="gh-ambient-grid" />

      {/* Top Header Bar */}
      <div className="gh-header animate-fade-in">
        <div className="gh-header-logo">
          <span className="gh-logo-wings">⸸</span>
          <span className="gh-logo-title">MILITARY SIMULATION HUB</span>
        </div>
        <div className="gh-header-game">{getGameTitle().toUpperCase()}</div>
        <button className="gh-header-close" onClick={onClose}>
          ✕ RETURN TO HEADQUARTERS
        </button>
      </div>

      {/* Difficulty Selection Screen */}
      {!difficulty ? (
        <div className="gh-selection-screen animate-fade-in">
          <div className="gh-wings-banner">⸸</div>
          <h2 className="gh-selection-title">SELECT SIMULATION DIFFICULTY</h2>
          <p className="gh-selection-subtitle">CADET {user ? user.name.toUpperCase() : 'RECRUIT'}, SELECT YOUR ACTIVE MISSION PROTOCOL</p>

          <div className="gh-diff-cards">
            {['easy', 'medium', 'hard'].map((level) => (
              <div 
                key={level} 
                className={`gh-diff-card gh-diff-card--${level}`}
                onClick={() => setDifficulty(level)}
              >
                <div className="gh-diff-badge">{level.toUpperCase()}</div>
                <div className="gh-diff-mode-title">
                  {level === 'easy' ? 'PEACEFUL' : level === 'medium' ? 'NORMAL' : 'BRUTAL'}
                </div>
                <p className="gh-diff-desc">{getDifficultyDesc(level)}</p>
                <button className="gh-diff-select-btn">ENGAGE SIMULATION</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Render Active Game */
        <div className="gh-active-game-container">
          {gameType === 'training' && (
            <TrainingGrounds 
              isOpen={true} 
              onClose={onClose} 
              difficulty={difficulty} 
              isEmbedded={true}
            />
          )}
          {gameType === 'cannon' && (
            <CannonDefense 
              difficulty={difficulty} 
              onClose={() => setDifficulty(null)}
            />
          )}
          {gameType === 'odm' && (
            <OdmReflexes 
              difficulty={difficulty} 
              onClose={() => setDifficulty(null)}
            />
          )}
          {gameType === 'match' && (
            <TitanMatch 
              difficulty={difficulty} 
              onClose={() => setDifficulty(null)}
            />
          )}
        </div>
      )}
    </div>
  )
}
