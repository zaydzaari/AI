"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** Three iridescent glass slabs — Standard, Low-refusal, Abliterated — that fan apart. */
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      env.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Slabs({ spread }: { spread: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const refs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const geo = useMemo(() => new RoundedBoxGeometry(2.6, 0.16, 3.4, 6, 0.08), []);
  const mats = useMemo(
    () =>
      [
        { color: "#fff4fb", ir: [300, 800] },
        { color: "#f1ebff", ir: [400, 1000] },
        { color: "#e8fbff", ir: [500, 1200] },
      ].map(
        (c) =>
          new THREE.MeshPhysicalMaterial({
            color: c.color,
            metalness: 0.55,
            roughness: 0.16,
            opacity: 0.72,
            sheen: 1,
            sheenColor: new THREE.Color("#ffc8ee"),
            sheenRoughness: 0.3,
            iridescence: 1,
            iridescenceIOR: 2.1,
            iridescenceThicknessRange: c.ir as [number, number],
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            envMapIntensity: 2.2,
            transparent: true,
          })
      ),
    []
  );
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", on);
    return () => window.removeEventListener("pointermove", on);
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y += ((pointer.current.x * 0.5 - 0.5 + Math.sin(t * 0.25) * 0.12) - g.rotation.y) * Math.min(1, dt * 2.5);
    g.rotation.x += ((0.55 + pointer.current.y * 0.18) - g.rotation.x) * Math.min(1, dt * 2.5);
    const s = 0.55 + spread.current * 0.65;
    refs.forEach((r, i) => {
      const m = r.current;
      if (!m) return;
      const target = (i - 1) * s + Math.sin(t * 0.8 + i) * 0.04;
      m.position.y += (target - m.position.y) * Math.min(1, dt * 3);
      m.rotation.y = (i - 1) * 0.12 * (0.4 + spread.current);
    });
  });

  return (
    <group ref={group} rotation={[0.55, -0.5, 0]}>
      {refs.map((r, i) => (
        <mesh key={i} ref={r} geometry={geo} material={mats[i]} position={[0, (i - 1) * 0.55, 0]} />
      ))}
    </group>
  );
}

export default function PrismScene({ spread }: { spread: React.MutableRefObject<number> }) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={box} className="h-full w-full">
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.4, 7.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <Env />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, -2, -4]} intensity={0.8} color="#ffd6f2" />
      <pointLight position={[-3, 2, 3]} intensity={18} color="#ff9fe0" />
      <pointLight position={[3, -1, 3]} intensity={18} color="#8fd8ff" />
      <pointLight position={[0, 3, -2]} intensity={12} color="#b6ffd9" />
      <Slabs spread={spread} />
    </Canvas>
    </div>
  );
}
