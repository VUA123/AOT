import { useState, useEffect, useRef } from 'react'
import './MilitaryRadio.css'

const TRACKS = [
  { id: 'off', name: 'SIGNAL DETUNED (MUTE)' },
  { id: 'wind', name: 'PARADIS WIND (Procedural)', frequency: 'Howling Gusts' },
  { id: 'rumble', name: 'RUMBLING TREMORS (Sub-Bass)', frequency: 'Tectonic Waves' },
  { id: 'static', name: 'MILITARY STATIC & MORSE', frequency: '84.5 MHz Band' },
  { id: 'clock', name: 'CLOCK OF FATE (Ticking)', frequency: 'Temporal Sync' },
  { id: 'anthem', name: 'ELDIA ANTHEM (Theme Synth)', frequency: '104.0 MHz Band' }
]

const ANTHEM_MELODY = [
  370.0, // F#4
  493.9, // B4
  554.4, // C#5
  587.3, // D5
  554.4, // C#5
  493.9, // B4
  554.4, // C#5
  370.0, // F#4
  493.9, // B4
  554.4, // C#5
  587.3, // D5
  740.0, // F#5
  659.3, // E5
  587.3, // D5
  554.4, // C#5
  493.9  // B4
]

export default function MilitaryRadio() {
  const [activeTrack, setActiveTab] = useState('off')
  const [volume, setVolume] = useState(0.4) // Default volume 40%
  const [isExpanded, setIsExpanded] = useState(false)
  const [signalStrength, setSignalStrength] = useState(92)

  // Web Audio API context refs
  const audioCtxRef = useRef(null)
  const gainNodeRef = useRef(null)
  
  // Track-specific node refs
  const activeNodesRef = useRef([])
  const tickingTimerRef = useRef(null)

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        audioCtxRef.current = new AudioContext()
        gainNodeRef.current = audioCtxRef.current.createGain()
        gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime)
        gainNodeRef.current.connect(audioCtxRef.current.destination)
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
  }

  // Update master volume when state changes
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(
        volume, 
        audioCtxRef.current.currentTime + 0.1
      )
    }
  }, [volume])

  // Periodic random signal strength drift for visual realism
  useEffect(() => {
    const timer = setInterval(() => {
      setSignalStrength(prev => {
        const drift = Math.floor(Math.random() * 7) - 3
        const next = prev + drift
        return Math.min(100, Math.max(78, next))
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Clean up all active audio nodes and timers
  const stopAllAudio = () => {
    // Clear ticking clock timer
    if (tickingTimerRef.current) {
      clearInterval(tickingTimerRef.current)
      tickingTimerRef.current = null
    }

    // Stop and disconnect all Web Audio nodes
    activeNodesRef.current.forEach(node => {
      try {
        node.stop()
      } catch {
        // Safe fail
      }
      try {
        node.disconnect()
      } catch {
        // Safe fail
      }
    })
    activeNodesRef.current = []
  }

  // Effect to manage active sound synthesis
  useEffect(() => {
    if (activeTrack === 'off') {
      stopAllAudio()
      return
    }

    // Initialize audio if not already done
    initAudio()
    const ctx = audioCtxRef.current
    const masterGain = gainNodeRef.current
    if (!ctx || !masterGain) return

    // Stop previous track sounds first
    stopAllAudio()

    const nodesToCleanup = []

    if (activeTrack === 'wind') {
      // 1. Procedural Wind Synthesizer (Filtered Brown Noise with LFO modulation)
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      
      // Generate Brown Noise
      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        output[i] = (lastOut + (0.02 * white)) / 1.02
        lastOut = output[i]
        output[i] *= 3.5 // Amplify noise to audible levels
      }

      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = noiseBuffer
      noiseSource.loop = true

      // Filter to simulate the wind howling frequency
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 400
      filter.Q.value = 3.0

      // LFO to modulate filter frequency (creates wind gusts)
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.15 // Very slow cycles
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 250 // Swell range

      lfo.connect(lfoGain)
      lfoGain.connect(filter.frequency)
      
      noiseSource.connect(filter)
      filter.connect(masterGain)

      lfo.start()
      noiseSource.start()

      nodesToCleanup.push(noiseSource, lfo)
    } 
    
    else if (activeTrack === 'rumble') {
      // 2. Procedural Rumbling Tremors (Low frequency modulated sine waves)
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()

      osc1.type = 'sine'
      osc1.frequency.value = 42 // Sub-bass frequency

      osc2.type = 'triangle'
      osc2.frequency.value = 46

      // Lowpass filter to block mid frequencies and emphasize rumble
      filter.type = 'lowpass'
      filter.frequency.value = 75

      // Slow LFO to modulate gain (creates breathing tectonic rumbles)
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.1
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.35

      const rumbleGainNode = ctx.createGain()
      rumbleGainNode.gain.value = 0.65

      lfo.connect(lfoGain)
      lfoGain.connect(rumbleGainNode.gain)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(rumbleGainNode)
      rumbleGainNode.connect(masterGain)

      osc1.start()
      osc2.start()
      lfo.start()

      nodesToCleanup.push(osc1, osc2, lfo)
    } 
    
    else if (activeTrack === 'static') {
      // 3. Procedural Static hum & random Morse Code bleeps
      const bufferSize = ctx.sampleRate
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
      const staticSource = ctx.createBufferSource()
      staticSource.buffer = noiseBuffer
      staticSource.loop = true

      const staticGain = ctx.createGain()
      staticGain.gain.value = 0.08 // Soft background hum static

      staticSource.connect(staticGain)
      staticGain.connect(masterGain)
      staticSource.start()
      nodesToCleanup.push(staticSource)

      // Morse Code generator function
      const triggerMorseCode = () => {
        if (activeTrack !== 'static') return
        const duration = Math.random() > 0.4 ? 0.08 : 0.22 // Dit or Dah
        const beepOsc = ctx.createOscillator()
        beepOsc.type = 'sine'
        beepOsc.frequency.value = 750 // Vintage high pitch beep

        const beepGain = ctx.createGain()
        beepGain.gain.value = 0.12

        beepOsc.connect(beepGain)
        beepGain.connect(masterGain)
        
        beepOsc.start()
        beepOsc.stop(ctx.currentTime + duration)

        // Queue next morse element
        const delay = duration * 1000 + (Math.random() * 600 + 100)
        tickingTimerRef.current = setTimeout(triggerMorseCode, delay)
      };

      triggerMorseCode()
    } 
    
    else if (activeTrack === 'clock') {
      // 4. Procedural Clock of Fate (Filtered ticking sounds every 1 second)
      const triggerTick = () => {
        if (activeTrack !== 'clock') return
        
        // Generate a synthetic clock tick using highly filtered short pulses
        const tickOsc = ctx.createOscillator()
        tickOsc.type = 'triangle'
        tickOsc.frequency.setValueAtTime(1200, ctx.currentTime)
        tickOsc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05)

        const tickGain = ctx.createGain()
        tickGain.gain.setValueAtTime(0.4, ctx.currentTime)
        tickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04)

        const filter = ctx.createBiquadFilter()
        filter.type = 'bandpass'
        filter.frequency.value = 800

        tickOsc.connect(filter)
        filter.connect(tickGain)
        tickGain.connect(masterGain)

        tickOsc.start()
        tickOsc.stop(ctx.currentTime + 0.06)
      };

      // Set up a rigid 1-second interval timer
      tickingTimerRef.current = setInterval(triggerTick, 1000)
      triggerTick() // Initial tick
    }

    else if (activeTrack === 'anthem') {
      // 5. Code synthesized AoT anthem step loop
      let step = 0
      const tempo = 135
      const stepTime = (60 / tempo) / 2 // eighth note step duration in seconds (222ms)

      const playStep = () => {
        if (activeTrack !== 'anthem') return
        const freq = ANTHEM_MELODY[step % ANTHEM_MELODY.length]
        if (freq > 0) {
          const osc = ctx.createOscillator()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, ctx.currentTime)

          const subOsc = ctx.createOscillator()
          subOsc.type = 'sine'
          subOsc.frequency.setValueAtTime(freq / 2, ctx.currentTime)

          const synthFilter = ctx.createBiquadFilter()
          synthFilter.type = 'lowpass'
          synthFilter.frequency.setValueAtTime(1200, ctx.currentTime)

          const oscGain = ctx.createGain()
          oscGain.gain.setValueAtTime(0.0, ctx.currentTime)
          oscGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.02)
          oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

          osc.connect(synthFilter)
          subOsc.connect(synthFilter)
          synthFilter.connect(oscGain)
          oscGain.connect(masterGain)

          osc.start()
          subOsc.start()
          osc.stop(ctx.currentTime + 0.22)
          subOsc.stop(ctx.currentTime + 0.22)
        }
        step++
      }

      playStep()
      tickingTimerRef.current = setInterval(playStep, stepTime * 1000)
    }

    activeNodesRef.current = nodesToCleanup

    return () => {
      stopAllAudio()
    }
  }, [activeTrack])

  // Cleanup completely on unmount
  useEffect(() => {
    return () => {
      stopAllAudio()
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  const handleTrackSelect = (trackId) => {
    initAudio()
    setActiveTab(trackId)
  }

  const selectedTrackName = TRACKS.find(t => t.id === activeTrack)?.name || 'MUTE'

  return (
    <div className={`mr-widget ${isExpanded ? 'mr-widget--expanded' : ''}`}>
      
      {/* Closed Knob Trigger Box */}
      <div className="mr-closed-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className={`mr-signal-dot ${activeTrack !== 'off' ? 'mr-signal-dot--active' : ''}`} />
        <span className="mr-tag">SIGNAL CORPS RADIO</span>
        <span className="mr-dial-arrow">{isExpanded ? '▼' : '▲'}</span>
      </div>

      {/* Expanded Control Deck */}
      {isExpanded && (
        <div className="mr-panel animate-fade-in">
          
          {/* Radio Signal Analytics Panel */}
          <div className="mr-display">
            <div className="mr-display-row">
              <span className="mr-lbl">FREQUENCY:</span>
              <span className="mr-val mr-val--freq">
                {TRACKS.find(t => t.id === activeTrack)?.frequency || 'NO BAND'}
              </span>
            </div>
            <div className="mr-display-row">
              <span className="mr-lbl">ACTIVE RCVR:</span>
              <span className="mr-val mr-val--active">{selectedTrackName}</span>
            </div>
            <div className="mr-display-signal">
              <span className="mr-lbl">SIGNAL:</span>
              <div className="mr-signal-strength">
                <div className="mr-signal-bar" style={{ width: `${signalStrength}%` }} />
                <span className="mr-signal-txt">{signalStrength}% EST.</span>
              </div>
            </div>
          </div>

          {/* Master Volume Slider */}
          <div className="mr-volume-deck">
            <span className="mr-vol-icon">🔈</span>
            <input 
              type="range" 
              min="0" 
              max="0.8" 
              step="0.05" 
              value={volume} 
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="mr-volume-slider"
            />
            <span className="mr-vol-icon">🔊</span>
          </div>

          {/* Selection Deck */}
          <div className="mr-tracks-menu">
            <p className="mr-section-title">CHOOSE RECEIVER FREQUENCY:</p>
            {TRACKS.map(track => {
              const isActive = activeTrack === track.id
              return (
                <button
                  key={track.id}
                  className={`mr-track-btn ${isActive ? 'mr-track-btn--active' : ''}`}
                  onClick={() => handleTrackSelect(track.id)}
                >
                  <span className="mr-btn-indicator">⸸</span>
                  {track.name}
                </button>
              )
            })}
          </div>

          {/* Retro Signal Brass Footer */}
          <div className="mr-footer">
            <span>SURVEY CORPS SIGNAL TRANSMITTER CO-908</span>
          </div>

        </div>
      )}

    </div>
  )
}
