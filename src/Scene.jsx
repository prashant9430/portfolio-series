import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const prog = () => scrollY / Math.max(1, document.body.scrollHeight - innerHeight)

function Knot() {
  const m = useRef()
  useFrame((s, d) => {
    const t = m.current, p = prog()
    t.rotation.x += d * 0.14
    t.rotation.y += d * 0.2
    const wide = typeof innerWidth !== 'undefined' && innerWidth >= 900
    t.position.x += ((wide ? 2.6 : 0) + s.pointer.x * 0.35 - t.position.x) * 0.05
    t.position.y += (0.7 + s.pointer.y * 0.25 - p * 9 - t.position.y) * 0.06
    const o = Math.max(0, 1 - p * 6)
    t.material.opacity = 0.2 * o
    t.visible = o > 0.02
  })
  return (
    <mesh ref={m} position={[2.4, 0, 0]}>
      <torusKnotGeometry args={[0.78, 0.22, 200, 28]} />
      <meshBasicMaterial wireframe color="#e6c17a" transparent opacity={0.2} />
    </mesh>
  )
}

function Dust() {
  const g = useRef()
  const count = typeof innerWidth !== 'undefined' && innerWidth < 820 ? 800 : 1800
  const arr = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < a.length; i += 3) {
      const r = 3 + Math.random() * 6, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1)
      a[i] = r * Math.sin(ph) * Math.cos(th); a[i + 1] = r * Math.sin(ph) * Math.sin(th); a[i + 2] = r * Math.cos(ph)
    }
    return a
  }, [count])
  useFrame((s, d) => {
    g.current.rotation.y += d * 0.025
    g.current.rotation.x += (s.pointer.y * 0.08 - g.current.rotation.x) * 0.03
  })
  return (
    <points ref={g}>
      <bufferGeometry><bufferAttribute attach="attributes-position" array={arr} count={arr.length / 3} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.022} color="#e8d5ae" transparent opacity={0.55} sizeAttenuation />
    </points>
  )
}

export default function Scene() {
  const wide = typeof innerWidth !== 'undefined' && innerWidth >= 900
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      {wide && <Knot />}<Dust />
    </Canvas>
  )
}
