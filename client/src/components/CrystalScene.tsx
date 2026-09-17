import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

type CrystalSceneProps = {
  progress: number;
  reducedMotion: boolean;
};

type CrystalState = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

const crystalStates: CrystalState[] = [
  { position: [0.78, 0.08, 0], rotation: [0.05, 0.1, 0], scale: 1.08 },
  { position: [-0.58, -0.12, 0], rotation: [0.5, 1.25, -0.18], scale: 0.82 },
  { position: [1.08, 0.26, 0], rotation: [-0.28, 2.7, 0.16], scale: 0.52 },
  { position: [0.92, -0.22, 0], rotation: [0.35, 4.2, -0.1], scale: 0.62 },
];

function Crystal({ progress, reducedMotion }: CrystalSceneProps) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const crystalGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.58, 2), []);
  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(crystalGeometry), [crystalGeometry]);
  const coreGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.78, 1), []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const time = reducedMotion ? 0 : clock.getElapsedTime();
    const clamped = THREE.MathUtils.clamp(progress, 0, 3);
    const index = Math.min(2, Math.floor(clamped));
    const blend = THREE.MathUtils.smoothstep(clamped - index, 0, 1);
    const current = crystalStates[index];
    const next = crystalStates[index + 1] ?? current;
    const targetPosition = current.position.map((value, axis) => THREE.MathUtils.lerp(value, next.position[axis], blend)) as [number, number, number];
    const targetRotation = current.rotation.map((value, axis) => THREE.MathUtils.lerp(value, next.rotation[axis], blend)) as [number, number, number];
    const targetScale = THREE.MathUtils.lerp(current.scale, next.scale, blend);

    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetPosition[0] + pointer.current.x * 0.12, 0.045);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetPosition[1] + pointer.current.y * -0.1 + Math.sin(time * 0.48) * (reducedMotion ? 0 : 0.035), 0.045);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotation[0] + pointer.current.y * -0.16, 0.055);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation[1] + pointer.current.x * 0.2 + time * (reducedMotion ? 0 : 0.035), 0.055);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotation[2] + pointer.current.x * 0.06, 0.055);
    const breathing = Math.sin(time * 0.5) * (reducedMotion ? 0 : 0.012);
    const scale = targetScale + breathing;
    group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, scale, 0.05);
    group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, scale, 0.05);
    group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, scale, 0.05);
  });

  return (
    <group ref={group}>
      <mesh geometry={crystalGeometry}>
        <meshPhysicalMaterial
          color="#d6f5f2"
          transmission={0.9}
          thickness={0.82}
          roughness={0.07}
          metalness={0.16}
          ior={1.46}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={0.12}
          iridescenceIOR={1.32}
          attenuationColor="#aee6e8"
          attenuationDistance={2.6}
          transparent
          opacity={0.84}
        />
      </mesh>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color="#d8ffff" transparent opacity={0.45} toneMapped={false} />
      </lineSegments>
      <mesh geometry={coreGeometry} scale={0.92}>
        <meshPhysicalMaterial
          color="#9ddfe2"
          emissive="#5eb6ba"
          emissiveIntensity={0.3}
          transmission={0.34}
          roughness={0.2}
          metalness={0.2}
          transparent
          opacity={0.42}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0.2, 0.28]}>
        <torusGeometry args={[2.03, 0.008, 8, 96]} />
        <meshBasicMaterial color="#baf7f4" transparent opacity={0.2} toneMapped={false} />
      </mesh>
      <mesh rotation={[0.4, Math.PI / 2.3, -0.34]}>
        <torusGeometry args={[2.22, 0.006, 8, 96]} />
        <meshBasicMaterial color="#d3ffff" transparent opacity={0.14} toneMapped={false} />
      </mesh>
      <mesh rotation={[0.12, -0.52, Math.PI / 2.1]}>
        <torusGeometry args={[1.82, 0.004, 8, 96]} />
        <meshBasicMaterial color="#9de3e8" transparent opacity={0.11} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function CrystalScene({ progress, reducedMotion }: CrystalSceneProps) {
  return (
    <div className="crystal-stage" aria-hidden="true">
      <div className="crystal-aura" />
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5.4], fov: 36 }}
        frameloop="always"
      >
        <ambientLight intensity={1.05} color="#d6ffff" />
        <directionalLight position={[3, 3, 4]} intensity={2.35} color="#eaffff" />
        <directionalLight position={[-4, -2, 2]} intensity={1.75} color="#84d8e0" />
        <pointLight position={[0, 0, 1.8]} intensity={2.2} distance={5} color="#a9ffff" />
        <Crystal progress={progress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
