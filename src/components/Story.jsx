import { useState, useEffect } from 'react'
import { CHRONICLES, SHELF_BOOKS } from '../data/storyData'
import FireAshes from './FireAshes'
import './Story.css'

const Story = ({ isOpen, onClose }) => {
  const [view, setView] = useState('shelf') // 'shelf', 'directory', 'book'
  const [activeBook, setActiveBook] = useState(null)
  const [displayIndex, setDisplayIndex] = useState(0) // Tracks the current active spread (0 to N-1)
  const [animating, setAnimating] = useState(false) // Prevents overlapping clicks
  const [animationClass, setAnimationClass] = useState('') // 'flip-next', 'flip-prev', or ''

  // Block background scrolling when archives pop-up is active
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

  if (!isOpen) return null

  const getSpread = (index) => {
    if (!activeBook || !activeBook.spreads) return null
    const safeIndex = Math.max(0, Math.min(index, activeBook.spreads.length - 1))
    return activeBook.spreads[safeIndex]
  }

  const handleBookSelect = (book) => {
    setActiveBook(book)
    setDisplayIndex(0)
    setAnimating(false)
    setAnimationClass('')
    setView('book')
  }

  const handlePrevSpread = () => {
    if (animating || displayIndex <= 0) return

    setAnimating(true)
    setAnimationClass('flip-prev')

    // Complete the page index update when animation finishes (850ms)
    setTimeout(() => {
      setDisplayIndex((prev) => prev - 1)
      setAnimating(false)
      setAnimationClass('')
    }, 850)
  }

  const handleNextSpread = () => {
    if (animating || !activeBook || displayIndex >= activeBook.spreads.length - 1) return

    setAnimating(true)
    setAnimationClass('flip-next')

    // Complete index transition and reset animation class when finished (850ms)
    setTimeout(() => {
      setDisplayIndex((prev) => prev + 1)
      setAnimating(false)
      setAnimationClass('')
    }, 850)
  }

  const handleLeaveClick = () => {
    setView('shelf')
    onClose()
  }

  const currentSpread = getSpread(displayIndex)
  const nextSpread = getSpread(displayIndex + 1)
  const prevSpread = getSpread(displayIndex - 1)

  let leftPageData = currentSpread
  let rightPageData = currentSpread
  let flippableFrontData = currentSpread
  let flippableBackData = currentSpread

  if (animating) {
    if (animationClass === 'flip-next') {
      leftPageData = currentSpread
      rightPageData = nextSpread
      flippableFrontData = currentSpread
      flippableBackData = nextSpread
    } else if (animationClass === 'flip-prev') {
      leftPageData = prevSpread
      rightPageData = currentSpread
      flippableFrontData = prevSpread
      flippableBackData = currentSpread
    }
  }

  return (
    <section className="story-sec">
      <div className="story-ambient" />

      {/* Top Universal Banner (Leave Chronicles) - Visible only on the Shelf view to prevent overlaps */}
      {view === 'shelf' && (
        <div className="story-top-banner" onClick={handleLeaveClick}>
          <span className="banner-swords">⚔</span>
          <span className="banner-text">LEAVE CHRONICLES</span>
          <span className="banner-swords">⚔</span>
        </div>
      )}

      {/* VIEW 1: THE SHELF (Wrapped in story-container to preserve styling) */}
      {view === 'shelf' && (
        <div className="story-container">
          <div className="shelf-view-container animate-fade-in" onClick={() => setView('directory')}>
            <FireAshes />
            <h1 className="shelf-main-title">THE PARADIS ARCHIVES</h1>
            <p className="shelf-main-subtitle">
              CLICK ANYWHERE ON THE SHELF OR BOOKS TO OPEN THE ARCHIVES DIRECTORY
            </p>

            {/* Simulated Animated Candle */}
            <div className="candle-container">
              <div className="candle-flame" />
              <div className="candle-wick" />
              <div className="candle-wax" />
            </div>

            <p className="shelf-footer-panel">
              SCOUT REGIMENT LIBRARY · DIRECTORY ACCESS PANEL
            </p>

            {/* The 15-book horizontal shelf */}
            <div className="physical-bookshelf-wrapper">
              <div className="physical-bookshelf-row">
                {SHELF_BOOKS.map((book) => {
                  if (book.isFiller) {
                    return (
                      <div
                        key={book.id}
                        className="shelf-book-spine shelf-book-spine--filler"
                        style={{
                          '--color': book.color,
                          '--width': book.width,
                        }}
                      >
                        <span className="spine-text-filler">{book.title}</span>
                      </div>
                    )
                  } else {
                    return (
                      <div
                        key={book.id}
                        className="shelf-book-spine shelf-book-spine--chronicle"
                        style={{ '--color': book.color }}
                      >
                        <span className="spine-num-top">{book.num}</span>
                        <h3 className="spine-title-text">{book.title}</h3>
                      </div>
                    )
                  }
                })}
              </div>
              {/* Heavy wood shelf base */}
              <div className="physical-shelf-base" />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ARCHIVES DIRECTORY SCROLL OVERLAY (Placed directly under story-sec for perfect fixed centering) */}
      {view === 'directory' && (
        <div className="directory-overlay-container animate-fade-in">
          <div className="directory-backdrop" />
          <FireAshes />
          <div className="directory-scroll-box">
            <p className="directory-eyebrow">MILITARY RECONNAISSANCE OFFICE</p>
            <h2 className="directory-main-title">ARCHIVES DIRECTORY</h2>

            <div className="directory-list">
              {CHRONICLES.map((chronicle) => (
                <div
                  key={chronicle.id}
                  className="directory-item"
                  style={{ '--accent-color': chronicle.color }}
                  onClick={() => handleBookSelect(chronicle)}
                >
                  <div className="directory-left-bar" />
                  <span className="directory-num">{chronicle.num}</span>
                  <div className="directory-info">
                    <h4 className="directory-title">{chronicle.title}</h4>
                    <p className="directory-subtitle">{chronicle.year}</p>
                  </div>
                  <span className="directory-icon" data-icon-type={chronicle.iconType}>
                    {chronicle.iconChar}
                  </span>
                </div>
              ))}
            </div>

            <button className="directory-dismiss-btn" onClick={() => setView('shelf')}>
              DISMISS REGISTRY
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: THE IMMERSIVE BOOK VIEW WITH 3D PAGE TURN ANIMATION (Placed directly under story-sec for perfect fixed centering) */}
      {view === 'book' && activeBook && (
        <div className="book-overlay-container animate-fade-in">
          <div className="book-backdrop" />
          <FireAshes />

          {/* Quick Return to Directory List */}
          <button className="book-close-directory-btn" onClick={() => setView('directory')}>
            <span>←</span> RETURN TO REGISTRY
          </button>

          <div className="book-layout-wrapper">
            
            {/* Left Page Flip Arrow */}
            {displayIndex > 0 ? (
              <button className="page-flip-arrow page-flip-arrow--left" onClick={handlePrevSpread}>
                ‹
              </button>
            ) : (
              <div className="page-flip-arrow-placeholder" />
            )}

            {/* The 3D Page Flipping Book Spread */}
            <div className="immersive-book-spread">
              
              {/* Center fold crease shadow */}
              <div className="book-center-crease" />

              {/* LAYER 1: Permanent Left Page */}
              <div className="immersive-book-page page--left permanent-left">
                <div className="page-content-flow">
                  <p className="book-page-category-tag">
                    {leftPageData?.leftSubtitle}
                  </p>
                  <h2 className="book-page-large-title">
                    {leftPageData?.leftTitle}
                  </h2>
                  <div className="book-page-divider" />
                  <div className="book-page-center-emblem">
                    <div className="emblem-inner-circle">
                      <span className="emblem-symbol">
                        {leftPageData?.leftEmblem}
                      </span>
                    </div>
                  </div>
                  <div className="book-page-bottom-accent">
                    <div className="accent-red-bar" />
                    <p className="accent-year-text">
                      {leftPageData?.leftYear}
                    </p>
                  </div>
                  <div className="book-page-footer">
                    <span className="footer-volume-text">
                      {leftPageData?.leftFooterText}
                    </span>
                    <span className="footer-page-num">
                      {leftPageData?.leftPageNum}
                    </span>
                  </div>
                </div>
              </div>

              {/* LAYER 2: 3D Flippable Middle Sheet */}
              <div className={`flippable-sheet ${animationClass} ${!animating ? 'flippable-sheet--hidden' : ''}`}>
                
                {/* Front Side */}
                <div className="br-page-3d br-page-3d--front">
                  <div className="page-content-flow">
                    <p className="book-page-category-tag text-right">
                      {flippableFrontData?.rightSubtitle}
                    </p>
                    <h3 className="book-page-gold-header">
                      {flippableFrontData?.rightTitle}
                    </h3>
                    <p className="book-page-body-serif">
                      {flippableFrontData?.rightText}
                    </p>
                    <div className="book-page-footer">
                      <span className="footer-page-num">
                        {flippableFrontData?.rightPageNum}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div className="br-page-3d br-page-3d--back">
                  <div className="page-content-flow">
                    <p className="book-page-category-tag">
                      {flippableBackData?.leftSubtitle}
                    </p>
                    <h2 className="book-page-large-title">
                      {flippableBackData?.leftTitle}
                    </h2>
                    <div className="book-page-divider" />
                    <div className="book-page-center-emblem">
                      <div className="emblem-inner-circle">
                        <span className="emblem-symbol">
                          {flippableBackData?.leftEmblem}
                        </span>
                      </div>
                    </div>
                    <div className="book-page-bottom-accent">
                      <div className="accent-red-bar" />
                      <p className="accent-year-text">
                        {flippableBackData?.leftYear}
                      </p>
                    </div>
                    <div className="book-page-footer">
                      <span className="footer-volume-text">
                        {flippableBackData?.leftFooterText}
                      </span>
                      <span className="footer-page-num">
                        {flippableBackData?.leftPageNum}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* LAYER 3: Permanent Right Page */}
              <div className="immersive-book-page page--right permanent-right">
                <div className="page-content-flow">
                  <p className="book-page-category-tag text-right">
                    {rightPageData?.rightSubtitle}
                  </p>
                  <h3 className="book-page-gold-header">
                    {rightPageData?.rightTitle}
                  </h3>
                  <p className="book-page-body-serif">
                    {rightPageData?.rightText}
                  </p>
                  <div className="book-page-footer">
                    <span className="footer-page-num">
                      {rightPageData?.rightPageNum}
                    </span>
                    {displayIndex === activeBook.spreads.length - 1 && (
                      <button className="book-return-shelf-btn" onClick={() => setView('directory')}>
                        RETURN TO REGISTRY
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Page Flip Arrow */}
            {displayIndex < activeBook.spreads.length - 1 ? (
              <button className="page-flip-arrow page-flip-arrow--right" onClick={handleNextSpread}>
                ›
              </button>
            ) : (
              <div className="page-flip-arrow-placeholder" />
            )}

          </div>
        </div>
      )}
    </section>
  )
}

export default Story
