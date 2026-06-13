import { useState } from 'react'
import './FireAshes.css'

const FireAshes = () => {
  // Generate 35 particles with random parameters synchronously on mount
  const [particles] = useState(() => {
    return Array.from({ length: 35 }).map((_, i) => {
      const size = Math.random() * 5 + 3.5 // 3px to 8.5px
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${size}px`,
        delay: `${Math.random() * 9}s`,
        duration: `${Math.random() * 8 + 7}s`, // Float up over 7s to 15s
        drift: `${Math.random() * 80 - 40}px`, // Sway side-to-side by -40px to +40px
        glowColor: Math.random() > 0.4 ? 'rgba(255, 110, 0, 0.75)' : 'rgba(255, 45, 0, 0.85)'
      }
    })
  })

  return (
    <div className="fire-ashes-container">
      {particles.map(p => (
        <span
          key={p.id}
          className="fire-ash-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            '--drift': p.drift,
            '--glow': p.glowColor
          }}
        />
      ))}
    </div>
  )
}

export default FireAshes
