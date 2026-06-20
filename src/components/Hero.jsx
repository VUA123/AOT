import { useEffect, useRef } from 'react'
import './Hero.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const sectionRef = useRef(null)   
  const stickyRef  = useRef(null)   
  const videoRef   = useRef(null)

  const ch1EyebrowRef = useRef(null)
  const ch1TitleRef = useRef(null)
  const ch1SubRef   = useRef(null)
  const ch2TitleRef = useRef(null)
  const ch2SubRef   = useRef(null)
  const ch3TitleRef = useRef(null)
  const ch3SubRef   = useRef(null)
  const overlayRef  = useRef(null)

  useEffect(() => {
    const video   = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    video.play().catch(e => console.log("Video play failed:", e))

    const ctx = gsap.context(() => {
      const setup = () => {
        const scrollLen = window.innerHeight * 2.2

        section.style.height = `${scrollLen + window.innerHeight}px`

        // Ensure background video plays whenever the hero section is in view
        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => {
            video.play().catch(e => console.log("Video play failed:", e))
          },
          onEnterBack: () => {
            video.play().catch(e => console.log("Video play failed:", e))
          },
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger : section,
            start   : 'top top',
            end     : `+=${scrollLen}`,
            scrub   : true,
          },
          defaults: { ease: 'power3.out' },
        })

        tl.fromTo(ch1TitleRef.current,
          { opacity: 0, y: 60, filter: 'blur(12px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.12 },
          0.03)
        tl.fromTo(ch1SubRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0,  duration: 0.1 },
          0.1)
        tl.fromTo(ch1EyebrowRef.current,
          { opacity: 1, y: 0, filter: 'blur(0px)' },
          { opacity: 0, y: -30, filter: 'blur(6px)', duration: 0.08 },
          0.24)
        tl.to([ch1TitleRef.current, ch1SubRef.current],
          { opacity: 0, y: -40, filter: 'blur(8px)', duration: 0.08 },
          0.24)

        tl.fromTo(ch2TitleRef.current,
          { opacity: 0, letterSpacing: '0.5em', filter: 'blur(18px)' },
          { opacity: 1, letterSpacing: '0.2em', filter: 'blur(0px)', duration: 0.14 },
          0.30)
        tl.fromTo(ch2SubRef.current,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.1 },
          0.40)
        tl.to([ch2TitleRef.current, ch2SubRef.current],
          { opacity: 0, y: -30, duration: 0.08 },
          0.58)

        tl.fromTo(overlayRef.current,
          { opacity: 0.55 },
          { opacity: 0.10, duration: 0.15 },
          0.62)

        tl.fromTo(ch3TitleRef.current,
          { opacity: 0, scale: 1.15, filter: 'blur(14px)' },
          { opacity: 1, scale: 1,    filter: 'blur(0px)', duration: 0.16 },
          0.68)
        tl.fromTo(ch3SubRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.12 },
          0.80)
      }

      if (video.readyState >= 1) {
        setup()
      } else {
        video.addEventListener('loadedmetadata', setup, { once: true })
      }
    })

    return () => ctx.revert()
  }, [])

  return (

    <section className="hero" ref={sectionRef}>
      <div className="hero__sticky" ref={stickyRef}>

        <video
          ref={videoRef}
          className="hero__video"
          src="/video/one.mp4"
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
        />

        <div className="hero__overlay" ref={overlayRef} />

        <div className="hero__grain" />

        <div className="hero__chapter hero__ch1">
          <div className="hero__eyebrow" ref={ch1EyebrowRef}>
            <span className="hero__rule" />
            <span className="hero__eyebrow-txt">Year 845 · Wall Maria</span>
            <span className="hero__rule" />
          </div>
          <h1 className="hero__ch1-title" ref={ch1TitleRef}>
            Beyond the <em>Walls</em><br />
            <span>lies the truth</span>
          </h1>
          <p className="hero__ch1-sub" ref={ch1SubRef}>
            Humanity's last refuge — three walls, one consuming dread.
          </p>
        </div>

        <div className="hero__chapter hero__ch2">
          <p className="hero__ch2-title" ref={ch2TitleRef}>SHINGEKI NO KYOJIN</p>
          <p className="hero__ch2-sub"   ref={ch2SubRef}>— The day the wall was breached —</p>
        </div>

        <div className="hero__chapter hero__ch3">
          <h2 className="hero__ch3-title" ref={ch3TitleRef}>
            ATTACK<br /><span>ON TITAN</span>
          </h2>
          <p className="hero__ch3-sub" ref={ch3SubRef}>
            Dedicate your heart. Pledge your life.
          </p>
        </div>

        <div className="hero__scroll-hint">
          <span />
        </div>

      </div>
    </section>
  )
}

export default Hero