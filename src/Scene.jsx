import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const prog = () => scrollY / Math.max(1, document.body.scrollHeight - innerHeight)

function Core() {
  const m = useRef()
  useFrame((s, d) => {
    const p = prog(), t = m.current
    t.rotation.x += d * 0.12
    t.rotation.y += d * 0.18 + p * 0.01
    t.position.y += (-p * 3 - t.position.y) * 0.06
    t.position.x += (s.pointer.x * 0.6 - t.position.x) * 0.04
    t.scale.setScalar(1 + Math.sin(p * Math.PI) * 0.5)
  })
  return (
    <mesh ref={m} position={[1.6, 0, 0]}>
      <icosahedronGeometry args={[1.3, 1]} />
      <meshBasicMaterial wireframe color="#e8c98a" transparent opacity={0.5} />
    </mesh>
  )
}

function Dust() {
  const g = useRef()
  const arr = useMemo(() => {
    const a = new Float32Array(1800)
    for (let i = 0; i < a.length; i += 3) {
      const r = 3 + Math.random() * 5, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1)
      a[i] = r * Math.sin(ph) * Math.cos(th); a[i + 1] = r * Math.sin(ph) * Math.sin(th); a[i + 2] = r * Math.cos(ph)
    }
    return a
  }, [])
  useFrame((s, d) => {
    g.current.rotation.y += d * 0.03
    g.current.rotation.x = prog() * 1.2 + s.pointer.y * 0.1
  })
  return (
    <points ref={g}>
      <bufferGeometry><bufferAttribute attach="attributes-position" array={arr} count={arr.length / 3} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.025} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <Core /><Dust />
    </Canvas>
  )
}
