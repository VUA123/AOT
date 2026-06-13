import { useState, useEffect } from 'react'
import { CHRONICLES, SHELF_BOOKS } from '../data/storyData'
import FireAshes from './FireAshes'
import './Story.css'

const Story = ({ isOpen, onClose }) => {
  const [view, setView] = useState('shelf') // 'shelf', 'directory', 'book'
  const [activeBook, setActiveBook] = useState(null)
  const [spreadIndex, setSpreadIndex] = useState(0) // 0 = Spread 1 (Page 1 & 2), 1 = Spread 2 (Page 3 & 4)

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

  const handleBookSelect = (book) => {
    setActiveBook(book)
    setSpreadIndex(0)
    setView('book')
  }

  const handlePrevSpread = () => {
    if (spreadIndex > 0) setSpreadIndex(0)
  }

  const handleNextSpread = () => {
    if (spreadIndex < 1) setSpreadIndex(1)
  }

  const handleLeaveClick = () => {
    setView('shelf')
    onClose()
  }

  return (
    <section className="story-sec">
      <div className="story-ambient" />

      {/* Top Universal Banner (Leave Chronicles) - Styled exactly as in screenshots */}
      <div className="story-top-banner" onClick={handleLeaveClick}>
        <span className="banner-swords">⚔</span>
        <span className="banner-text">LEAVE CHRONICLES</span>
        <span className="banner-swords">⚔</span>
      </div>

      <div className="story-container">
        
        {/* VIEW 1: THE SHELF */}
        {view === 'shelf' && (
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
        )}

        {/* VIEW 2: ARCHIVES DIRECTORY SCROLL OVERLAY */}
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

        {/* VIEW 3: THE IMMERSIVE BOOK VIEW WITH 3D PAGE TURN ANIMATION */}
        {view === 'book' && activeBook && (
          <div className="book-overlay-container animate-fade-in">
            <div className="book-backdrop" />
            <FireAshes />
            <div className="book-layout-wrapper">
              
              {/* Left Page Flip Arrow */}
              {spreadIndex > 0 ? (
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

                {/* LAYER 1: Permanent Left Page (Page 1 Content) */}
                <div className={`immersive-book-page page--left permanent-left ${spreadIndex === 1 ? 'page--hidden' : ''}`}>
                  <div className="page-content-flow">
                    <p className="book-page-category-tag">
                      {activeBook.spreads[0].leftSubtitle}
                    </p>
                    <h2 className="book-page-large-title">
                      {activeBook.spreads[0].leftTitle}
                    </h2>
                    <div className="book-page-divider" />
                    <div className="book-page-center-emblem">
                      <div className="emblem-inner-circle">
                        <span className="emblem-symbol">
                          {activeBook.spreads[0].leftEmblem}
                        </span>
                      </div>
                    </div>
                    <div className="book-page-bottom-accent">
                      <div className="accent-red-bar" />
                      <p className="accent-year-text">
                        {activeBook.spreads[0].leftYear}
                      </p>
                    </div>
                    <div className="book-page-footer">
                      <span className="footer-volume-text">
                        {activeBook.spreads[0].leftFooterText}
                      </span>
                      <span className="footer-page-num">
                        {activeBook.spreads[0].leftPageNum}
                      </span>
                    </div>
                  </div>
                </div>

                {/* LAYER 2: 3D Flippable Middle Sheet */}
                {/* 
                  - Unflipped (spreadIndex === 0): Sits on the right, showing Page 2 (Front)
                  - Flipped (spreadIndex === 1): Rotates -180deg to the left, showing Page 3 (Back)
                */}
                <div className={`flippable-sheet ${spreadIndex === 1 ? 'flippable-sheet--flipped' : ''}`}>
                  
                  {/* Front Side: Page 2 Content */}
                  <div className="br-page-3d br-page-3d--front">
                    <div className="page-content-flow">
                      <p className="book-page-category-tag text-right">
                        {activeBook.spreads[0].rightSubtitle}
                      </p>
                      <h3 className="book-page-gold-header">
                        {activeBook.spreads[0].rightTitle}
                      </h3>
                      <p className="book-page-body-serif">
                        {activeBook.spreads[0].rightText}
                      </p>
                      <div className="book-page-footer">
                        <span className="footer-page-num">
                          {activeBook.spreads[0].rightPageNum}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Back Side: Page 3 Content */}
                  <div className="br-page-3d br-page-3d--back">
                    <div className="page-content-flow">
                      <p className="book-page-category-tag">
                        {activeBook.spreads[1].leftSubtitle}
                      </p>
                      <h2 className="book-page-large-title">
                        {activeBook.spreads[1].leftTitle}
                      </h2>
                      <div className="book-page-divider" />
                      <div className="book-page-center-emblem">
                        <div className="emblem-inner-circle">
                          <span className="emblem-symbol">
                            {activeBook.spreads[1].leftEmblem}
                          </span>
                        </div>
                      </div>
                      <div className="book-page-bottom-accent">
                        <div className="accent-red-bar" />
                        <p className="accent-year-text">
                          {activeBook.spreads[1].leftYear}
                        </p>
                      </div>
                      <div className="book-page-footer">
                        <span className="footer-volume-text">
                          {activeBook.spreads[1].leftFooterText}
                        </span>
                        <span className="footer-page-num">
                          {activeBook.spreads[1].leftPageNum}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* LAYER 3: Permanent Right Page (Page 4 Content) */}
                <div className={`immersive-book-page page--right permanent-right ${spreadIndex === 0 ? 'page--hidden' : ''}`}>
                  <div className="page-content-flow">
                    <p className="book-page-category-tag text-right">
                      {activeBook.spreads[1].rightSubtitle}
                    </p>
                    <h3 className="book-page-gold-header">
                      {activeBook.spreads[1].rightTitle}
                    </h3>
                    <p className="book-page-body-serif">
                      {activeBook.spreads[1].rightText}
                    </p>
                    <div className="book-page-footer">
                      <span className="footer-page-num">
                        {activeBook.spreads[1].rightPageNum}
                      </span>
                      <button className="book-return-shelf-btn" onClick={() => setView('directory')}>
                        RETURN TO SHELF
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Page Flip Arrow */}
              {spreadIndex < 1 ? (
                <button className="page-flip-arrow page-flip-arrow--right" onClick={handleNextSpread}>
                  ›
                </button>
              ) : (
                <div className="page-flip-arrow-placeholder" />
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  )
}

export default Story
