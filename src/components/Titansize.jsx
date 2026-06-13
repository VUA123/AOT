import React, { useEffect, useRef } from 'react'
import './TitanSize.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TITANS = [
  {
    id      : 'human',
    name    : 'Human',
    height  : '1.7 m',
    color   : '#c4a450',
    desc    : 'Survey Corps soldier. The brave ones who dare to face the giants.',
    imgH    : 5.8,   
    imgW    : 5.9,   
    img     : '/images/Human.png',
  },
  {
    id      : 'pure',
    name    : 'Pure Titan',
    height  : '4 – 15 m',
    color   : '#b0a090',
    desc    : 'Mindless and relentless. The most common threat beyond the walls.',
    imgH    : 14,
    imgW    : 10,
    img     : '/images/PureTitan.png',
  },
  {
    id      : 'armored',
    name    : 'Armored Titan',
    height  : '15 m',
    color   : '#8c8c8c',
    desc    : 'Reiner Braun. Hardened plates make it nearly impenetrable.',
    imgH    : 15.5,
    imgW    : 9,
    img     : '/images/ArmoredTitan.png',
  },
  {
    id      : 'female',
    name    : 'Female Titan',
    height  : '14 m',
    color   : '#c49090',
    desc    : 'Annie Leonhart. Agile, crystalline, and terrifyingly intelligent.',
    imgH    : 23.5,
    imgW    : 12.5,
    img     : '/images/FemaleTitan.png',
  },
  {
    id      : 'beast',
    name    : 'Beast Titan',
    height  : '17 m',
    color   : '#7a8c6a',
    desc    : 'Zeke Yeager. Ape-like form with devastating projectile attacks.',
    imgH    : 30.5,
    imgW    : 18,
    img     : '/images/BeastTitan.png',
  },
  {
    id      : 'colossal',
    name    : 'Colossal Titan',
    height  : '60 m',
    color   : '#c0522a',
    desc    : 'Bertholdt Hoover. The one who broke the gate. Steam Incarnate.',
    imgH    : 50,
    imgW    : 28,
    img     : '/images/col.png',
  },
]

export default function TitanSize() {
  const sectionRef = useRef(null)
  const stickyRef  = useRef(null)
  const titanRefs  = useRef([])
  const labelRefs  = useRef([])
  const lineRefs   = useRef([])
  const headerRef  = useRef(null)
  const fogRef     = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const sticky  = stickyRef.current
    if (!section || !sticky) return

    const scrollLen = window.innerHeight * (TITANS.length + 1.5)
    section.style.height = `${scrollLen + window.innerHeight}px`

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger   : section,
        start     : 'top top',
        end       : `+=${scrollLen}`,
        scrub     : 1.2,
        pin       : sticky,
        pinSpacing: false,
      },
    })

    tl.fromTo(headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.4 },
      0)

    TITANS.forEach((_, i) => {
      const el    = titanRefs.current[i]
      const label = labelRefs.current[i]
      const line  = lineRefs.current[i]
      if (!el) return

      const start = 0.12 + i * 0.15

      tl.fromTo(el,
        { yPercent: 110, opacity: 0, filter: 'blur(4px)' },
        { yPercent: 0,   opacity: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power3.out' },
        start)

      tl.fromTo([label, line],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.1 },
        start + 0.14)
    })

    tl.fromTo(fogRef.current,
      { opacity: 0.9 },
      { opacity: 0.15, duration: 1 },
      0)

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section className="ts-section" ref={sectionRef}>
      <div className="ts-sticky" ref={stickyRef}>

        <div className="ts-sky" />
        <div className="ts-ground" />
        <div className="ts-fog" ref={fogRef} />

        <div className="ts-header" ref={headerRef}>
          <span className="ts-header-rule" />
          <div>
            <p className="ts-header-eyebrow">Scale of Terror</p>
            <h2 className="ts-header-title">Titan Size Comparison</h2>
          </div>
          <span className="ts-header-rule" />
        </div>

        <div className="ts-stage">
          {TITANS.map((titan, i) => (
            <div
              key={titan.id}
              className="ts-titan-slot"
              style={{ '--color': titan.color }}
            >
              <div
                className="ts-figure"
                ref={el => titanRefs.current[i] = el}
              >
                <img
                  src={titan.img}
                  alt={titan.name}
                  className="ts-figure-img"
                  draggable={false}
                  style={{
                    height  : `${titan.imgH}vh`,
                    width   : `${titan.imgW}vh`,
                  }}
                />
              </div>

              <div
                className="ts-measure-line"
                ref={el => lineRefs.current[i] = el}
                style={{ height: `${titan.imgH}vh` }}
              />

              <div
                className="ts-label"
                ref={el => labelRefs.current[i] = el}
              >
                <span className="ts-label-height">{titan.height}</span>
                <span className="ts-label-name">{titan.name}</span>
                <span className="ts-label-desc">{titan.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="ts-wall-line">
          <span className="ts-wall-label">Wall Maria · 50 m</span>
        </div>

        <div className="ts-grain" />
      </div>
    </section>
  )
}