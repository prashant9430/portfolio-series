import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { NAME, TITLE, GITHUB, EMAIL, skills, projects, education, doing } from './data.js'

const Scene = lazy(() => import('./Scene.jsx'))
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

function Split({ text }) {
  return <>{text.split(' ').map((w, i) => (
    <span className="w" key={i}><span className="wi">{w}</span>{' '}</span>
  ))}</>
}

function Tilt({ className = '', children }) {
  const r = useRef()
  const move = (e) => {
    const b = r.current.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height
    r.current.style.setProperty('--mx', x * 100 + '%'); r.current.style.setProperty('--my', y * 100 + '%')
    if (!reduce) gsap.to(r.current, { rotateY: (x - 0.5) * 10, rotateX: -(y - 0.5) * 10, duration: 0.3, transformPerspective: 900 })
  }
  const leave = () => gsap.to(r.current, { rotateX: 0, rotateY: 0, duration: 0.5 })
  return <div ref={r} className={'card ' + className} onPointerMove={move} onPointerLeave={leave}>{children}</div>
}

function Magnetic({ href, children, primary, ...p }) {
  const r = useRef()
  const mv = (e) => { if (reduce) return; const b = r.current.getBoundingClientRect()
    gsap.to(r.current, { x: (e.clientX - b.left - b.width / 2) * 0.25, y: (e.clientY - b.top - b.height / 2) * 0.25, duration: 0.3 }) }
  return <a ref={r} href={href} className={'btn' + (primary ? ' pri' : '')} onPointerMove={mv}
    onPointerLeave={() => gsap.to(r.current, { x: 0, y: 0, duration: 0.5 })} {...p}>{children}</a>
}

export default function App() {
  const [count, setCount] = useState(0)
  const [ready, setReady] = useState(reduce)
  const [pv, setPv] = useState(null)
  const bar = useRef(), glow = useRef(), root = useRef()

  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setPv(null)
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [])

  useEffect(() => {
    if (reduce) return
    const o = { v: 0 }
    gsap.to(o, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => setCount(Math.round(o.v)), onComplete: () => setReady(true) })
  }, [])

  useEffect(() => {
    if (!ready || reduce) return
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    const ctx = gsap.context(() => {
      gsap.from('.hero .wi', { yPercent: 110, rotate: 4, duration: 1, stagger: 0.07, ease: 'power4.out' })
      gsap.from('.hero .fade', { opacity: 0, y: 24, duration: 0.9, stagger: 0.12, delay: 0.5 })
      gsap.from('.portrait', { opacity: 0, scale: 0.92, duration: 1.2, delay: 0.3, ease: 'power3.out' })
      gsap.to(bar.current, { scaleX: 1, ease: 'none', scrollTrigger: { scrub: 0.3, start: 0, end: 'max' } })
      gsap.utils.toArray('.rv').forEach((el) => gsap.from(el, { opacity: 0, y: 40, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 90%' } }))
      gsap.utils.toArray('.sh .wi').forEach((el) => gsap.from(el, { yPercent: 110, duration: 0.9, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 92%' } }))
      gsap.to('.portrait img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.portrait', scrub: true } })
    }, root)
    const gx = gsap.quickTo(glow.current, 'left', { duration: 0.5 }), gy = gsap.quickTo(glow.current, 'top', { duration: 0.5 })
    const pm = (e) => { gx(e.clientX); gy(e.clientY) }
    addEventListener('pointermove', pm)
    return () => { removeEventListener('pointermove', pm); gsap.ticker.remove(tick); lenis.destroy(); ctx.revert() }
  }, [ready])

  return (
    <div ref={root}>
      <a className="skip" href="#main">Skip to content</a>
      {!ready && <div className="pre" aria-hidden="true"><span>{NAME.split(' ')[0]}</span><span>{count}</span></div>}
      <div className="bar" ref={bar} /><div className="glow" ref={glow} aria-hidden="true" />
      <div className="bg" aria-hidden="true"><Suspense fallback={null}><Scene /></Suspense></div>

      <header className="top"><div className="wrap">
        <a className="logo" href="#top">Prashant</a>
        <nav aria-label="Main">{['about', 'skills', 'projects', 'education', 'contact'].map((s) => <a key={s} href={'#' + s}>{s[0].toUpperCase() + s.slice(1)}</a>)}</nav>
      </div></header>

      <main id="main">
        <section className="hero" id="top"><div className="wrap hg">
          <div>
            <h1><Split text={NAME} /></h1>
            <p className="role fade">{TITLE}</p>
            <p className="lead fade">I build modern digital experiences by combining creative design, practical functionality, and a passion for technology.</p>
            <div className="btns fade">
              <Magnetic href="#projects" primary>Projects</Magnetic>
              <Magnetic href="#contact">Contact Me</Magnetic>
              <Magnetic href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</Magnetic>
            </div>
          </div>
          <div className="portrait"><img src="/photo.jpg" alt={NAME} width="350" height="480" /></div>
        </div></section>

        <section className="sec" id="about"><div className="wrap">
          <h2 className="sh"><Split text="A student who learns by building" /></h2>
          <div className="two rv">
            <p>I'm Prashant, from East Champaran, Bihar. I completed 12th in the Science stream in 2026 and I'm heading toward web development, software development and computer applications.</p>
            <p>I learn by building real projects: web apps, Firebase chat apps, a Telegram AI bot and a spiritual knowledge site. I like turning an idea into something that works, and I keep improving my skills with every project.</p>
          </div>
        </div></section>

        <section className="sec" id="skills"><div className="wrap">
          <h2 className="sh"><Split text="Skills and tools" /></h2>
          <div className="grid2">{skills.map(([t, l]) => (
            <Tilt className="rv" key={t}><h3>{t}</h3><ul className="tags">{l.map((x) => <li key={x}>{x}</li>)}</ul></Tilt>))}
          </div>
        </div></section>

        <section className="sec" id="projects"><div className="wrap">
          <h2 className="sh"><Split text="Featured projects" /></h2>
          <p className="sub rv">Personal development projects, shown honestly with their current status.</p>
          <div className="grid3">{projects.map((p) => (
            <Tilt className="rv proj" key={p.key}>
              <div className={'vis v-' + p.key} aria-hidden="true"><i /><i /><i /></div>
              <span className="st">{p.status}</span>
              <h3>{p.title}</h3><p>{p.text}</p>
              <ul className="tags">{p.tags.map((x) => <li key={x}>{x}</li>)}</ul>
              {(p.live || p.link) && (
                <div className="actions">
                  {p.preview && <button className="lnk" onClick={() => setPv(p)}>Preview</button>}
                  <a className="lnk" href={p.live || p.link} target="_blank" rel="noopener noreferrer">{p.live ? 'Live Demo' : p.linkText}</a>
                </div>)}
            </Tilt>))}
          </div>
        </div></section>

        <section className="sec" id="education"><div className="wrap">
          <h2 className="sh"><Split text="Education" /></h2>
          <ol className="tl">{education.map(([y, t, s]) => (
            <li className="rv" key={y}><b>{y}</b><div><h3>{t}</h3><p>{s}</p></div></li>))}
          </ol>
          <h2 className="sh mt"><Split text="What I do" /></h2>
          <ul className="doing">{doing.map((d) => <li className="rv" key={d}>{d}</li>)}</ul>
        </div></section>

        <section className="sec" id="contact"><div className="wrap">
          <h2 className="sh"><Split text="Let's connect" /></h2>
          <p className="sub rv">Open to learning, collaboration and interesting projects.</p>
          <div className="btns rv">
            <Magnetic href={GITHUB} primary target="_blank" rel="noopener noreferrer">GitHub: prashant9430</Magnetic>
            {EMAIL && <Magnetic href={'mailto:' + EMAIL}>{EMAIL}</Magnetic>}
          </div>
        </div></section>
      </main>

      {pv && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={pv.title + ' preview'} data-lenis-prevent onClick={() => setPv(null)}>
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <div className="mbar">
              <span>{pv.title}</span>
              <span className="mact">
                <a className="lnk" href={pv.live} target="_blank" rel="noopener noreferrer">Open in new tab</a>
                <button className="x" onClick={() => setPv(null)} aria-label="Close preview">✕</button>
              </span>
            </div>
            <iframe src={pv.live} title={pv.title + ' live preview'} loading="lazy" referrerPolicy="no-referrer" />
          </div>
        </div>
      )}

      <footer><div className="wrap">{NAME} · {TITLE} · © {new Date().getFullYear()}</div></footer>
    </div>
  )
}
