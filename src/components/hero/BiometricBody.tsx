import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";

// Human silhouette built from capsules/spheres
function HumanFigure() {
  const groupRef = useRef<THREE.Group>(null);
  const materialColor = new THREE.Color("hsl(40, 65%, 55%)");
  const emissiveColor = new THREE.Color("hsl(40, 65%, 35%)");

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  // Capsule geometry helper
  const CapsulePart = ({
    position,
    args,
    rotation,
  }: {
    position: [number, number, number];
    args: [number, number, number];
    rotation?: [number, number, number];
  }) => (
    <mesh position={position} rotation={rotation}>
      <capsuleGeometry args={args} />
      <meshStandardMaterial
        color={materialColor}
        emissive={emissiveColor}
        emissiveIntensity={0.3}
        roughness={0.6}
        metalness={0.2}
        transparent
        opacity={0.85}
      />
    </mesh>
  );

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={materialColor}
          emissive={emissiveColor}
          emissiveIntensity={0.3}
          roughness={0.6}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Neck */}
      <CapsulePart position={[0, 2.0, 0]} args={[0.12, 0.15, 8]} />

      {/* Torso */}
      <CapsulePart position={[0, 1.2, 0]} args={[0.4, 0.7, 12]} />

      {/* Left arm upper */}
      <CapsulePart position={[-0.65, 1.5, 0]} args={[0.12, 0.45, 8]} rotation={[0, 0, 0.2]} />
      {/* Left arm lower */}
      <CapsulePart position={[-0.8, 0.85, 0]} args={[0.1, 0.4, 8]} rotation={[0, 0, 0.1]} />

      {/* Right arm upper */}
      <CapsulePart position={[0.65, 1.5, 0]} args={[0.12, 0.45, 8]} rotation={[0, 0, -0.2]} />
      {/* Right arm lower */}
      <CapsulePart position={[0.8, 0.85, 0]} args={[0.1, 0.4, 8]} rotation={[0, 0, -0.1]} />

      {/* Left leg upper */}
      <CapsulePart position={[-0.22, -0.1, 0]} args={[0.16, 0.55, 8]} rotation={[0, 0, 0.05]} />
      {/* Left leg lower */}
      <CapsulePart position={[-0.25, -1.0, 0]} args={[0.12, 0.5, 8]} />

      {/* Right leg upper */}
      <CapsulePart position={[0.22, -0.1, 0]} args={[0.16, 0.55, 8]} rotation={[0, 0, -0.05]} />
      {/* Right leg lower */}
      <CapsulePart position={[0.25, -1.0, 0]} args={[0.12, 0.5, 8]} />
    </group>
  );
}

// Orbiting biometric data labels
const BIOMETRIC_DATA = [
  { label: "Heart Rate", value: "72 bpm", angle: 0 },
  { label: "Body Fat", value: "18.4%", angle: Math.PI * 0.35 },
  { label: "VO₂ Max", value: "42 ml/kg", angle: Math.PI * 0.7 },
  { label: "BMI", value: "23.1", angle: Math.PI * 1.05 },
  { label: "Muscle Mass", value: "68 kg", angle: Math.PI * 1.4 },
  { label: "Hydration", value: "64%", angle: Math.PI * 1.75 },
];

function BiometricLabel({
  label,
  value,
  baseAngle,
  radius,
  yOffset,
  speed,
}: {
  label: string;
  value: string;
  baseAngle: number;
  radius: number;
  yOffset: number;
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.BufferGeometry>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + baseAngle;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = yOffset + Math.sin(clock.getElapsedTime() * 0.5 + baseAngle) * 0.15;
    // Always face camera
    ref.current.lookAt(0, ref.current.position.y, 0);
    ref.current.rotateY(Math.PI);
  });

  return (
    <group ref={ref}>
      <Text
        fontSize={0.12}
        color="hsl(40, 65%, 55%)"
        anchorX="center"
        anchorY="bottom"
        font="/fonts/Inter-Regular.woff"
      >
        {label}
      </Text>
      <Text
        position={[0, -0.18, 0]}
        fontSize={0.18}
        color="white"
        anchorX="center"
        anchorY="bottom"
        font="/fonts/Inter-Regular.woff"
        fontWeight={700}
      >
        {value}
      </Text>
      {/* Connector dot */}
      <mesh position={[0, -0.35, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="hsl(40, 65%, 55%)" />
      </mesh>
    </group>
  );
}

// Scanning ring effect
function ScanRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Oscillate up and down
    ref.current.position.y = Math.sin(t * 0.8) * 2.5 - 0.5;
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.15 + Math.sin(t * 2) * 0.1;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.0, 1.05, 64]} />
      <meshBasicMaterial
        color="hsl(40, 65%, 55%)"
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Floating particles around body
function Particles() {
  const count = 80;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.5 + Math.random() * 1.5;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="hsl(40, 65%, 55%)"
        size={0.03}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function BiometricBody() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 3]} intensity={0.8} color="hsl(40, 70%, 70%)" />
        <directionalLight position={[-3, 2, -3]} intensity={0.3} color="hsl(220, 30%, 60%)" />
        <pointLight position={[0, 3, 2]} intensity={0.5} color="hsl(40, 65%, 55%)" />

        <HumanFigure />
        <ScanRing />
        <Particles />

        {BIOMETRIC_DATA.map((d, i) => (
          <BiometricLabel
            key={i}
            label={d.label}
            value={d.value}
            baseAngle={d.angle}
            radius={2.2 + (i % 2) * 0.4}
            yOffset={-1 + i * 0.55}
            speed={0.25}
          />
        ))}
      </Canvas>
    </div>
  );
}
