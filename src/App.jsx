import { useState } from 'react'
import './App.css'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Story from './components/Story'
import TitanSize from './components/Titansize'
import TitanCodex from './components/TitanCodex'
import ScoutDirectory from './components/ScoutDirectory'
import WallDefense from './components/WallDefense'
import MilitaryRadio from './components/MilitaryRadio'
import DeploymentMap from './components/DeploymentMap'
import TrainingGrounds from './components/TrainingGrounds'

function App() {
  const [showArchives, setShowArchives] = useState(false)
  const [showCodex, setShowCodex] = useState(false)
  const [showScouts, setShowScouts] = useState(false)
  const [showWalls, setShowWalls] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showTraining, setShowTraining] = useState(false)
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
        onWallsClick={() => setShowWalls(true)}
        onChronicleClick={() => setShowMap(true)}
        onTrainingClick={() => setShowTraining(true)}
      />
      <Hero />
      <Story isOpen={showArchives} onClose={() => setShowArchives(false)} />
      <TitanSize onTitanClick={handleTitansClick} />
      <WallDefense isOpen={showWalls} onClose={() => setShowWalls(false)} />
      <DeploymentMap isOpen={showMap} onClose={() => setShowMap(false)} />
      <TrainingGrounds isOpen={showTraining} onClose={() => setShowTraining(false)} />
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
      <MilitaryRadio />
    </>
  )
}

export default App
