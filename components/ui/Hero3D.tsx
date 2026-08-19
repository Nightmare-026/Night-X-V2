'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function LiquidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.12;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.18;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.4}>
      <mesh ref={meshRef} scale={1.35} position={[0, 0, -0.5]}>
        <torusKnotGeometry args={[1.1, 0.35, 160, 48]} />
        <MeshDistortMaterial
          color="#15803D"
          emissive="#0D5A2B"
          emissiveIntensity={0.45}
          roughness={0.2}
          metalness={0.85}
          distort={0.32}
          speed={1.6}
          wireframe={false}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

function FloatingAmbientOrbs() {
  return (
    <>
      <Float speed={1.4} rotationIntensity={1} floatIntensity={2} position={[-3.2, 1.8, -2]}>
        <Sphere args={[0.45, 48, 48]}>
          <MeshDistortMaterial
            color="#06B6D4"
            emissive="#0891B2"
            emissiveIntensity={0.5}
            roughness={0.15}
            metalness={0.9}
            distort={0.25}
            speed={2}
            transparent={true}
            opacity={0.65}
          />
        </Sphere>
      </Float>

      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={1.8} position={[3.2, -1.2, -1.5]}>
        <Sphere args={[0.55, 48, 48]}>
          <MeshDistortMaterial
            color="#22C55E"
            emissive="#16A34A"
            emissiveIntensity={0.55}
            roughness={0.18}
            metalness={0.85}
            distort={0.3}
            speed={1.8}
            transparent={true}
            opacity={0.65}
          />
        </Sphere>
      </Float>

      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1.4} position={[0, -2.2, -2.5]}>
        <Sphere args={[0.35, 32, 32]}>
          <MeshDistortMaterial
            color="#10B981"
            emissive="#059669"
            emissiveIntensity={0.4}
            roughness={0.25}
            metalness={0.8}
            distort={0.2}
            speed={1.5}
            transparent={true}
            opacity={0.5}
          />
        </Sphere>
      </Float>
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 42 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 6]} intensity={1.4} color="#4ADE80" />
        <directionalLight position={[-10, -10, -4]} intensity={0.8} color="#06B6D4" />
        <pointLight position={[0, 0, 3]} intensity={0.6} color="#22C55E" />
        
        {/* Soft Particle Glimmers */}
        <Sparkles count={60} scale={14} size={2.2} speed={0.35} opacity={0.35} color="#22C55E" />
        <Sparkles count={30} scale={10} size={1.8} speed={0.25} opacity={0.25} color="#06B6D4" />
        
        <LiquidMesh />
        <FloatingAmbientOrbs />
      </Canvas>

      {/* Radial vignette mask for 100% crystal clear text contrast in foreground */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080A0E]/30 via-transparent to-[#080A0E] pointer-events-none" />
    </div>
  );
}
