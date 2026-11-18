import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface ParticleFieldProps {
  count?: number;
  prefersReducedMotion?: boolean;
  scrollProgress?: number;
  mode?: string;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 600,
  prefersReducedMotion = false,
  scrollProgress = 0,
  mode = 'assembled',
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const orbitalGroupRef = useRef<THREE.Group>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const tempScaleVec = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cyberBlue = new THREE.Color('#38BDF8');
    const electricViolet = new THREE.Color('#6366F1');
    const starWhite = new THREE.Color('#E2E8F0');
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute in a wide spherical shell & architectural field around the scene
      const radius = 4.5 + Math.pow(Math.random(), 0.75) * 16.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.78;
      pos[i3 + 2] = radius * Math.cos(phi) - 2.0;

      const mixChoice = Math.random();
      if (mixChoice < 0.55) {
        tempColor.copy(cyberBlue);
      } else if (mixChoice < 0.88) {
        tempColor.copy(electricViolet);
      } else {
        tempColor.copy(starWhite);
      }

      col[i3] = tempColor.r;
      col[i3 + 1] = tempColor.g;
      col[i3 + 2] = tempColor.b;
    }

    return { positions: pos, colors: col };
  }, [count]);

  const gridLinesGeometry = useMemo(() => {
    const vertices: number[] = [];
    const size = 26;
    const divisions = 26;
    const step = (size * 2) / divisions;

    for (let i = -size; i <= size; i += step) {
      // X-axis lines
      vertices.push(-size, 0, i, size, 0, i);
      // Z-axis lines
      vertices.push(i, 0, -size, i, 0, size);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    return geometry;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const elapsed = state.clock.getElapsedTime();

    if (pointsRef.current) {
      if (!prefersReducedMotion) {
        pointsRef.current.rotation.y += dt * 0.028;
        pointsRef.current.rotation.x =
          Math.sin(elapsed * 0.15) * 0.06 + scrollProgress * 0.25;
      } else {
        pointsRef.current.rotation.y = scrollProgress * 0.15;
      }
    }

    if (orbitalGroupRef.current && !prefersReducedMotion) {
      orbitalGroupRef.current.rotation.z = elapsed * 0.04;
      orbitalGroupRef.current.rotation.y = -elapsed * 0.025;
      const targetScale =
        mode === 'exploded' || mode === 'matrix'
          ? 1.16
          : mode === 'process' || mode === 'events'
          ? 1.1
          : 1.0;
      tempScaleVec.set(targetScale, targetScale, targetScale);
      orbitalGroupRef.current.scale.lerp(tempScaleVec, dt * 2.5);
    }

    if (keyLightRef.current && !prefersReducedMotion) {
      keyLightRef.current.intensity = 2.8 + Math.sin(elapsed * 1.4) * 0.25;
    }
    if (rimLightRef.current && !prefersReducedMotion) {
      rimLightRef.current.intensity = 2.3 + Math.cos(elapsed * 1.1) * 0.2;
    }
  });

  return (
    <group name="rubik-atmosphere-and-lighting">
      {/* Cinematic 3-Point Lighting Rig */}
      <ambientLight color="#0E172F" intensity={1.15} />
      <hemisphereLight
        args={['#38BDF8', '#080D1A', 0.75]}
        position={[0, 12, 0]}
      />

      {/* 1. Key Light — Cyber Blue (#38BDF8) */}
      <directionalLight
        ref={keyLightRef}
        color="#38BDF8"
        intensity={2.8}
        position={[8, 10, 8]}
      />

      {/* 2. Rim / Back Light — Electric Violet (#6366F1) */}
      <directionalLight
        ref={rimLightRef}
        color="#6366F1"
        intensity={2.3}
        position={[-9, -7, -8]}
      />

      {/* 3. Soft Overhead Specular Fill Light */}
      <directionalLight
        color="#F8FAFC"
        intensity={1.35}
        position={[0, 14, 5]}
      />

      {/* Accent Core Point Lights for Crystalline Bevel Speculars */}
      <pointLight
        color="#38BDF8"
        intensity={2.4}
        distance={14}
        decay={2}
        position={[3.5, 2.5, 4.0]}
      />
      <pointLight
        color="#6366F1"
        intensity={2.0}
        distance={14}
        decay={2}
        position={[-3.5, -2.5, 3.5]}
      />

      {/* Atmospheric Cyber Particle Dust */}
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          vertexColors
          transparent
          opacity={0.68}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Subtle Spatial Architectural Grid Plane */}
      <group
        position={[0, -4.6, -2]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <lineSegments geometry={gridLinesGeometry}>
          <lineBasicMaterial
            color="#38BDF8"
            transparent
            opacity={0.075}
            depthWrite={false}
          />
        </lineSegments>
      </group>

      {/* Subtle Outer Spatial Orbital Rings */}
      <group ref={orbitalGroupRef} position={[0, 0, -1.5]}>
        <mesh rotation={[Math.PI / 2.6, 0.25, 0]}>
          <torusGeometry args={[5.4, 0.008, 12, 120]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 3.1, -0.4, 0.3]}>
          <torusGeometry args={[6.8, 0.006, 12, 120]} />
          <meshBasicMaterial
            color="#6366F1"
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};
