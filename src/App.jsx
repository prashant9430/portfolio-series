import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { NAME, TITLE, GITHUB, EMAIL, skills, projects, education, doing } from './data.js'

const Scene = lazy(() => import('./Scene.jsx'))
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = typeof matchMedia !== 'undefined' && matchMedia('(pointer: fine)').matches

const NAV = ['about', 'skills', 'projects', 'education', 'contact']

function Split({ text }) {
  return (
    <span className="split">
      {text.split(' ').map((w, i) => (
        <span className="w" key={i}><span className="wi">{w}</span></span>
      ))}
    </span>
  )
}

function Cursor() {
  const dot = useRef(), ring = useRef()
  useEffect(() => {
    if (reduce || !finePointer) return
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, x: -100, y: -100 })
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3.out' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3.out' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' })
    const pm = (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY) }
    const over = (e) => { if (e.target.closest('a, button, [data-hover]')) ring.current.classList.add('on') }
    const out = (e) => { if (e.target.closest('a, button, [data-hover]')) ring.current.classList.remove('on') }
    addEventListener('pointermove', pm)
    addEventListener('pointerover', over)
    addEventListener('pointerout', out)
    return () => { removeEventListener('pointermove', pm); removeEventListener('pointerover', over); removeEventListener('pointerout', out) }
  }, [])
  if (reduce || !finePointer) return null
  return (<><div className="cur-d" ref={dot} aria-hidden="true" /><div className="cur-r" ref={ring} aria-hidden="true" /></>)
}

function Magnetic({ href, children, primary, ...p }) {
  const r = useRef()
  const mv = (e) => {
    if (reduce || !finePointer) return
    const b = r.current.getBoundingClientRect()
    gsap.to(r.current, { x: (e.clientX - b.left - b.width / 2) * 0.28, y: (e.clientY - b.top - b.height / 2) * 0.28, duration: 0.35, ease: 'power3.out' })
  }
  const leave = () => gsap.to(r.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  return <a ref={r} href={href} className={'btn' + (primary ? ' pri' : '')} onPointerMove={mv} onPointerLeave={leave} {...p}>{children}</a>
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(scrollY > 40)
    fn(); addEventListener('scroll', fn, { passive: true })
    return () => removeEventListener('scroll', fn)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  return (
    <header className={'top' + (scrolled ? ' sc' : '')}>
      <div className="wrap tin">
        <a className="logo" href="#top" onClick={() => setOpen(false)}>Prashant<span className="dot">.</span></a>
        <nav className="dnav" aria-label="Main">
          {NAV.map((s) => <a key={s} href={'#' + s}>{s[0].toUpperCase() + s.slice(1)}</a>)}
        </nav>
        <button className={'burger' + (open ? ' x' : '')} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
      <div className={'mnav' + (open ? ' open' : '')} data-lenis-prevent>
        <nav aria-label="Mobile">
          {NAV.map((s, i) => (
            <a key={s} href={'#' + s} style={{ transitionDelay: open ? 0.08 + i * 0.06 + 's' : '0s' }} onClick={() => setOpen(false)}>
              <em>0{i + 1}</em>{s[0].toUpperCase() + s.slice(1)}
            </a>
          ))}
        </nav>
        <a className="mgh" href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub — prashant9430</a>
      </div>
    </header>
  )
}

function Head({ n, label, title, sub }) {
  return (
    <div className="shead">
      <span className="eyebrow rv"><i>{n}</i> / {label}</span>
      <h2 className="sh"><Split text={title} /></h2>
      {sub && <p className="sub rv">{sub}</p>}
    </div>
  )
}

function Marquee() {
  const items = ['Web Developer', 'React', 'Firebase', 'UI Design', 'JavaScript', 'Telegram Bots', 'AI Apps', 'Responsive Design']
  const row = items.map((x, i) => <span key={i}>{x}<b>✦</b></span>)
  return (
    <div className="marq" aria-hidden="true">
      <div className="mtrack"><div className="mrow">{row}</div><div className="mrow">{row}</div></div>
    </div>
  )
}

function SkillCard({ title, list }) {
  const r = useRef()
  const mv = (e) => {
    const b = r.current.getBoundingClientRect()
    r.current.style.setProperty('--mx', (e.clientX - b.left) + 'px')
    r.current.style.setProperty('--my', (e.clientY - b.top) + 'px')
  }
  return (
    <div ref={r} className="scard rv" onPointerMove={mv}>
      <h3>{title}</h3>
      <ul className="tags">{list.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  )
}

function ProjectCard({ p, onPreview, featured }) {
  const r = useRef()
  const mv = (e) => {
    if (reduce || !finePointer) return
    const b = r.current.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height
    gsap.to(r.current, { rotateY: (x - 0.5) * 5, rotateX: -(y - 0.5) * 5, duration: 0.4, transformPerspective: 1000 })
  }
  const leave = () => gsap.to(r.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
  const live = p.status.toLowerCase().includes('live')
  return (
    <article ref={r} className={'pcard rv' + (featured ? ' feat' : '')} onPointerMove={mv} onPointerLeave={leave}>
      <div className={'art a-' + p.key} aria-hidden="true"><span className="aglow" /><span className="aletter">{p.title[0]}</span></div>
      <div className="pbody">
        <span className={'st' + (live ? ' live' : '')}><i />{p.status}</span>
        <h3>{p.title}</h3>
        <p>{p.text}</p>
        <ul className="tags">{p.tags.map((x) => <li key={x}>{x}</li>)}</ul>
        {(p.live || p.link) && (
          <div className="actions">
            {p.preview && <button className="lnk" onClick={() => onPreview(p)}>Preview</button>}
            <a className="lnk" href={p.live || p.link} target="_blank" rel="noopener noreferrer">{p.live ? 'Live Demo ↗' : p.linkText + ' ↗'}</a>
          </div>
        )}
      </div>
    </article>
  )
}

export default function App() {
  const [count, setCount] = useState(0)
  const [ready, setReady] = useState(reduce)
  const [pv, setPv] = useState(null)
  const bar = useRef(), root = useRef(), tline = useRef()

  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setPv(null)
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [])

  useEffect(() => {
    if (reduce) return
    const o = { v: 0 }
    gsap.to(o, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => setCount(Math.round(o.v)), onComplete: () => setReady(true) })
  }, [])

  useEffect(() => {
    if (!ready || reduce) return
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    const ctx = gsap.context(() => {
      gsap.from('.hero .wi', { yPercent: 115, rotate: 3, duration: 1.1, stagger: 0.08, ease: 'power4.out' })
      gsap.from('.hero .fade', { opacity: 0, y: 26, duration: 0.9, stagger: 0.12, delay: 0.45 })
      gsap.from('.portrait', { opacity: 0, scale: 0.9, y: 30, duration: 1.2, delay: 0.3, ease: 'power3.out' })
      gsap.from('.marq', { opacity: 0, duration: 1, delay: 0.8 })
      gsap.to(bar.current, { scaleX: 1, ease: 'none', scrollTrigger: { scrub: 0.3, start: 0, end: 'max' } })
      gsap.utils.toArray('.rv').forEach((el) => gsap.from(el, { opacity: 0, y: 44, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))
      gsap.utils.toArray('.sh .wi').forEach((el) => gsap.from(el, { yPercent: 115, duration: 0.95, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 92%' } }))
      gsap.to('.portrait img', { yPercent: 7, ease: 'none', scrollTrigger: { trigger: '.portrait', scrub: true } })
      if (tline.current) gsap.from(tline.current, { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 80%', end: 'bottom 60%', scrub: 0.4 } })
    }, root)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); ctx.revert() }
  }, [ready])

  return (
    <div ref={root}>
      <a className="skip" href="#main">Skip to content</a>
      {!ready && <div className="pre" aria-hidden="true"><span className="pre-name">{NAME.split(' ')[0]} {NAME.split(' ')[2]}</span><span className="pre-count">{count}</span></div>}
      <div className="bar" ref={bar} aria-hidden="true" />
      <div className="bg" aria-hidden="true"><Suspense fallback={null}><Scene /></Suspense></div>
      <Cursor />
      <Nav />

      <main id="main">
        <section className="hero" id="top"><div className="wrap hg">
          <div className="hcol">
            <p className="hey fade"><i />Student & Web Developer — Portfolio 2026</p>
            <h1><Split text={NAME} /></h1>
            <p className="lead fade">I build modern digital experiences by combining creative design, practical functionality, and a passion for technology.</p>
            <div className="btns fade">
              <Magnetic href="#projects" primary>View Projects</Magnetic>
              <Magnetic href="#contact">Contact Me</Magnetic>
              <Magnetic href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub ↗</Magnetic>
            </div>
          </div>
          <div className="portrait" data-hover>
            <span className="pring" aria-hidden="true" />
            <span className="pframe" aria-hidden="true" />
            <img src="/photo.jpg" alt={NAME} width="350" height="480" />
            <span className="pchip">{TITLE}</span>
          </div>
        </div>
        <a className="scroll-hint fade" href="#about" aria-label="Scroll to about section"><span>Scroll</span><i /></a>
        </section>

        <Marquee />

        <section className="sec" id="about"><div className="wrap">
          <Head n="01" label="About" title="A student who learns by building" />
          <div className="two rv">
            <p>I'm Prashant, from East Champaran, Bihar. I completed 12th in the Science stream in 2026 and I'm heading toward web development, software development and computer applications.</p>
            <p>I learn by building real projects: web apps, Firebase chat apps, a Telegram AI bot and a spiritual knowledge site. I like turning an idea into something that works, and I keep improving my skills with every project.</p>
          </div>
        </div></section>

        <section className="sec" id="skills"><div className="wrap">
          <Head n="02" label="Skills" title="Skills and tools" />
          <div className="grid2">{skills.map(([t, l]) => <SkillCard key={t} title={t} list={l} />)}</div>
        </div></section>

        <section className="sec" id="projects"><div className="wrap">
          <Head n="03" label="Projects" title="Featured projects" sub="Personal development projects, shown honestly with their current status." />
          <div className="pgrid">{projects.map((p, i) => <ProjectCard key={p.key} p={p} onPreview={setPv} featured={i === 0} />)}</div>
        </div></section>

        <section className="sec" id="education"><div className="wrap">
          <Head n="04" label="Education" title="Education" />
          <ol className="tl"><span className="tl-line" ref={tline} aria-hidden="true" />
            {education.map(([y, t, s]) => (
              <li className="rv" key={y}><b>{y}</b><div><h3>{t}</h3><p>{s}</p></div></li>
            ))}
          </ol>
          <div className="doblock">
            <h3 className="doh rv">What I do</h3>
            <ul className="doing">{doing.map((d, i) => (
              <li className="rv" key={d} data-hover><em>0{i + 1}</em><span>{d}</span></li>
            ))}</ul>
          </div>
        </div></section>

        <section className="sec contact" id="contact"><div className="wrap">
          <span className="eyebrow rv"><i>05</i> / Contact</span>
          <h2 className="sh big"><Split text="Let's build something" /></h2>
          <p className="sub rv">Open to learning, collaboration and interesting projects.</p>
          <div className="btns rv">
            <Magnetic href={GITHUB} primary target="_blank" rel="noopener noreferrer">GitHub: prashant9430 ↗</Magnetic>
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
                <a className="lnk" href={pv.live} target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>
                <button className="x" onClick={() => setPv(null)} aria-label="Close preview">✕</button>
              </span>
            </div>
            <iframe src={pv.live} title={pv.title + ' live preview'} loading="lazy" referrerPolicy="no-referrer" />
          </div>
        </div>
      )}

      <footer><div className="wrap fin">
        <span>{NAME} · {TITLE}</span>
        <span>© {new Date().getFullYear()} · Built with React, GSAP & Three.js</span>
      </div></footer>
    </div>
  )
}
