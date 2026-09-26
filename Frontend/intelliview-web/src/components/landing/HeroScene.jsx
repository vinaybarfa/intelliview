import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'

function Core() {
  const group = useRef()

  useFrame((state, delta) => {
    if (!group.current) return

    group.current.rotation.y += delta * 0.16
    group.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.34) * 0.07
  })

  return (
    <group ref={group}>
      <mesh rotation={[0.45, 0.4, 0]}>
        <icosahedronGeometry args={[1.04, 2]} />
        <meshStandardMaterial
          color="#201449"
          emissive="#4c1d95"
          emissiveIntensity={1.3}
          metalness={0.75}
          roughness={0.22}
          wireframe
        />
      </mesh>

      <mesh rotation={[0.1, 0.6, 0.25]}>
        <octahedronGeometry args={[0.66, 1]} />
        <meshStandardMaterial
          color="#d8c7ff"
          emissive="#8b5cf6"
          emissiveIntensity={1.9}
          metalness={0.82}
          roughness={0.18}
        />
      </mesh>

      {[
        [-0.5, 0.9, 0.2],
        [0.75, -0.25, 0.45],
        [-0.65, -0.55, -0.35],
      ].map((position, index) => (
        <mesh
          position={position}
          key={index}
        >
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial
            color={index === 1 ? '#818cf8' : '#c084fc'}
          />
        </mesh>
      ))}
    </group>
  )
}

function Rings() {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x =
        0.72 + Math.sin(state.clock.elapsedTime * 0.25) * 0.08
      ref.current.rotation.z = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[1.55, 0.012, 8, 96]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.62}
        />
      </mesh>

      <mesh rotation={[1.17, 0.4, 0]}>
        <torusGeometry args={[1.31, 0.018, 8, 96]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.48}
        />
      </mesh>

      <mesh rotation={[0.4, 1.28, 0.3]}>
        <torusGeometry args={[1.82, 0.008, 8, 96]} />
        <meshBasicMaterial
          color="#d8b4fe"
          transparent
          opacity={0.27}
        />
      </mesh>
    </group>
  )
}

function Particles() {
  const points = useMemo(() => {
    const positions = new Float32Array(90 * 3)

    for (let i = 0; i < positions.length; i += 3) {
      const index = i / 3
      const radius = 2 + ((index * 47) % 100) / 70
      const theta = index * 2.3999632297
      const phi = Math.acos(
        1 - (2 * (index + 0.5)) / 90
      )

      positions[i] =
        radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.cos(phi)
      positions[i + 2] =
        radius * Math.sin(phi) * Math.sin(theta)
    }

    return positions
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#c4b5fd"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.75}
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.45} />

      <pointLight
        position={[3, 2, 3]}
        intensity={28}
        color="#8b5cf6"
        distance={7}
      />

      <pointLight
        position={[-3, -1, 2]}
        intensity={15}
        color="#6366f1"
        distance={6}
      />

      <Float
        speed={1.25}
        rotationIntensity={0.12}
        floatIntensity={0.45}
      >
        <Core />
        <Rings />
      </Float>

      <Particles />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.25}
      />
    </>
  )
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas')

    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

function HeroScene() {
  const [enabled] = useState(canUseWebGL)

  if (!enabled) {
    return (
      <div
        className="scene-fallback"
        role="img"
        aria-label="Abstract IntelliView intelligence core"
      >
        <span />
        <i />
        <b />
      </div>
    )
  }

  return (
    <Canvas
      className="hero-canvas"
      dpr={[1, 1.5]}
      camera={{
        position: [0, 0, 5.2],
        fov: 43,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}

export default HeroScene
