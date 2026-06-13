import { useState } from 'react'
import './App.css'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Story from './components/Story'
import TitanSize from './components/Titansize'
import TitanCodex from './components/TitanCodex'
import ScoutDirectory from './components/ScoutDirectory'

function App() {
  const [showArchives, setShowArchives] = useState(false)
  const [showCodex, setShowCodex] = useState(false)
  const [showScouts, setShowScouts] = useState(false)
  const [selectedTitanId, setSelectedTitanId] = useState('founding')

  const handleTitansClick = (titanId) => {
    setSelectedTitanId(titanId || 'founding')
    setShowCodex(true)
  }

  return (
    <>
      <Navbar 
        onStoryClick={() => setShowArchives(true)} 
        onTitansClick={() => handleTitansClick('founding')}
        onScoutsClick={() => setShowScouts(true)}
      />
      <Hero />
      <Story isOpen={showArchives} onClose={() => setShowArchives(false)} />
      <TitanSize onTitanClick={handleTitansClick} />
      {showCodex && (
        <TitanCodex 
          defaultTitanId={selectedTitanId} 
          onClose={() => setShowCodex(false)} 
        />
      )}
      {showScouts && (
        <ScoutDirectory 
          onClose={() => setShowScouts(false)} 
        />
      )}
    </>
  )
}

export default App
