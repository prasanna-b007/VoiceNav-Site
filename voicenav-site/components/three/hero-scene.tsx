"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

function Particles({ count = 60, radius = 2.5 }: { count?: number; radius?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.8 + Math.random() * 0.4);
      pos.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return pos;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    positions.forEach(([x, y, z], i) => {
      const drift = Math.sin(t * 0.3 + i) * 0.08;
      dummy.position.set(x + drift, y + drift * 0.5, z);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={0.5} transparent opacity={0.6} />
    </instancedMesh>
  );
}

function ConnectionLine({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const points = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 20; i++) {
      pts.push(new THREE.Vector3().lerpVectors(s, e, i / 20));
    }
    return pts;
  }, [start, end]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#2563eb", transparent: true, opacity: 0.15 }))} />
  );

}

function SemanticOrb() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-jetbrains), monospace",
    fontSize: "11px",
    background: "rgba(253,250,245,0.88)",
    padding: "4px 10px",
    borderRadius: "6px",
    border: "1px solid rgba(44,42,53,0.1)",
    color: "#2C2A35",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    userSelect: "none",
  };

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Core orb */}
        <mesh>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial
            color="#2563eb"
            emissive="#93c5fd"
            emissiveIntensity={0.2}
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>

        {/* Wireframe semantic space */}
        <mesh>
          <sphereGeometry args={[1.8, 24, 24]} />
          <meshStandardMaterial
            color="#2563eb"
            wireframe
            transparent
            opacity={0.06}
          />
        </mesh>

        {/* Outer glow ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.0, 0.008, 8, 100]} />
          <meshStandardMaterial
            color="#2563eb"
            emissive="#2563eb"
            emissiveIntensity={0.4}
            transparent
            opacity={0.3}
          />
        </mesh>

        <Particles />

        {/* Labels */}
        <Html position={[-2, 1.6, 0]} center>
          <div style={labelStyle}>Voice</div>
        </Html>
        <Html position={[0, -2.1, 0.5]} center>
          <div style={labelStyle}>Model2Vec</div>
        </Html>
        <Html position={[2.1, 1.1, -0.5]} center>
          <div style={labelStyle}>Action</div>
        </Html>

        {/* Connection lines */}
        <ConnectionLine start={[-1.8, 1.4, 0]} end={[-0.2, -1.7, 0.4]} />
        <ConnectionLine start={[0.2, -1.7, 0.4]} end={[1.8, 0.9, -0.4]} />
        <ConnectionLine start={[-1.6, 1.3, 0]} end={[1.7, 0.9, -0.3]} />
      </group>
    </Float>
  );
}

export function HeroScene() {
  return (
    <div className="w-full aspect-square max-w-lg mx-auto">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#FFF5E6" />
        <pointLight position={[-3, -2, 3]} intensity={0.3} color="#2563eb" />
        <SemanticOrb />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}
