import { useState, useEffect } from 'react'
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
import ParallaxTimeline from './components/ParallaxTimeline'
import Auth from './components/Auth'
import GamesHub from './components/games/GamesHub'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeGame, setActiveGame] = useState(null) // null, 'training', 'cannon', 'odm', 'match'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [showArchives, setShowArchives] = useState(false)
  const [showCodex, setShowCodex] = useState(false)
  const [showScouts, setShowScouts] = useState(false)
  const [showWalls, setShowWalls] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showTraining, setShowTraining] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [selectedTitanId, setSelectedTitanId] = useState('founding')

  // Check if user is already authenticated
  useEffect(() => {
    const storedUser = localStorage.getItem('scoutUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const handleLogout = async () => {
    if (user) {
      try {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: user.name }),
        });
      } catch (err) {
        console.error('Failed to notify logout backend:', err);
      }
    }
    localStorage.removeItem('scoutUser')
    setUser(null)
  }

  const handleTitansClick = (titanId) => {
    setSelectedTitanId(titanId || 'founding')
    setShowCodex(true)
  }

  if (loading) {
    return (
      <div className="auth-screen">
        <div className="auth-loading-spinner" />
      </div>
    )
  }

  if (!user) {
    return <Auth onLogin={(loggedInUser) => setUser(stored => loggedInUser || stored)} />
  }

  // If a full-screen game is active, render it directly and hide the rest of the application
  if (activeGame) {
    return (
      <GamesHub 
        gameType={activeGame} 
        onClose={() => setActiveGame(null)} 
        user={user}
      />
    )
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
        onTimelineClick={() => setShowTimeline(true)}
        onLogout={handleLogout}
        onSelectGame={(game) => setActiveGame(game)}
        onMenuToggle={setIsSidebarOpen}
        user={user}
      />
      <Hero />
      <Story isOpen={showArchives} onClose={() => setShowArchives(false)} />
      <TitanSize onTitanClick={handleTitansClick} />
      <WallDefense isOpen={showWalls} onClose={() => setShowWalls(false)} />
      <DeploymentMap isOpen={showMap} onClose={() => setShowMap(false)} />
      <TrainingGrounds isOpen={showTraining} onClose={() => setShowTraining(false)} />
      <ParallaxTimeline isOpen={showTimeline} onClose={() => setShowTimeline(false)} />
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
      <MilitaryRadio isShifted={isSidebarOpen} />
    </>
  )
}

export default App
