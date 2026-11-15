import { useEffect, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group, Mesh, PointLight } from "three";
import type { HeroId } from "../logic";
import { HEROES } from "../logic";
import { useGame } from "../store";

function Box({
  pos,
  args,
  color,
  metal = 0.25,
  rough = 0.55,
  emit = "#000000",
  ei = 0,
  rot,
}: {
  pos: [number, number, number];
  args: [number, number, number];
  color: string;
  metal?: number;
  rough?: number;
  emit?: string;
  ei?: number;
  rot?: [number, number, number];
}) {
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} metalness={metal} roughness={rough} emissive={emit} emissiveIntensity={ei} />
    </mesh>
  );
}

function Warrior() {
  return (
    <group>
      <Box pos={[-0.12, 0.38, 0]} args={[0.16, 0.74, 0.18]} color="#241c1e" metal={0.35} />
      <Box pos={[0.12, 0.38, 0]} args={[0.16, 0.74, 0.18]} color="#241c1e" metal={0.35} />
      <Box pos={[0, 1.08, 0]} args={[0.5, 0.62, 0.28]} color="#8d1c22" rough={0.72} />
      <Box pos={[0, 1.14, 0.08]} args={[0.38, 0.42, 0.12]} color="#d5dee8" metal={0.86} rough={0.22} />
      <Box pos={[-0.32, 1.25, 0]} args={[0.18, 0.14, 0.22]} color="#c5ced6" metal={0.8} rough={0.28} />
      <Box pos={[0.32, 1.25, 0]} args={[0.18, 0.14, 0.22]} color="#c5ced6" metal={0.8} rough={0.28} />
      <Box pos={[0, 0.95, -0.18]} args={[0.42, 0.95, 0.05]} color="#6d1219" rough={0.85} />
      <mesh position={[0, 1.55, 0.02]} castShadow>
        <sphereGeometry args={[0.15, 18, 14]} />
        <meshStandardMaterial color="#e0b08a" roughness={0.55} />
      </mesh>
      <Box pos={[0, 1.66, 0.02]} args={[0.26, 0.16, 0.26]} color="#e7eef6" metal={0.78} rough={0.25} />
      <Box pos={[0, 1.58, 0.14]} args={[0.18, 0.035, 0.04]} color="#14161c" />
      <Box pos={[-0.02, 1.86, -0.02]} args={[0.06, 0.28, 0.06]} color="#d0232c" rot={[0.4, 0, -0.35]} />
      <Box pos={[-0.42, 1.05, 0.12]} args={[0.08, 0.46, 0.36]} color="#1d3f86" metal={0.45} rough={0.4} />
      <Box pos={[-0.46, 1.05, 0.12]} args={[0.02, 0.16, 0.16]} color="#e4c48a" metal={0.7} ei={0.2} emit="#e4c48a" />
      <Box pos={[0.46, 1.2, 0.05]} args={[0.045, 0.9, 0.03]} color="#e7eef5" metal={0.92} rough={0.18} rot={[0.2, 0, -0.2]} />
      <Box pos={[0.4, 0.82, 0.06]} args={[0.16, 0.045, 0.06]} color="#e4c48a" metal={0.75} />
    </group>
  );
}

function Mage() {
  return (
    <group>
      <mesh position={[0, 0.72, 0]} castShadow>
        <coneGeometry args={[0.46, 1.4, 8]} />
        <meshStandardMaterial color="#4b247f" roughness={0.72} />
      </mesh>
      <Box pos={[0, 0.85, 0.18]} args={[0.08, 0.7, 0.04]} color="#e4c48a" metal={0.6} />
      <mesh position={[0, 1.52, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 12]} />
        <meshStandardMaterial color="#e6c2a2" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.78, 0]} castShadow>
        <coneGeometry args={[0.2, 0.42, 8]} />
        <meshStandardMaterial color="#2a134c" roughness={0.7} />
      </mesh>
      <Box pos={[0.34, 0.95, 0.05]} args={[0.05, 1.15, 0.05]} color="#6a4324" rot={[0.08, 0, 0.12]} />
      <mesh position={[0.38, 1.58, 0.08]}>
        <sphereGeometry args={[0.12, 14, 12]} />
        <meshStandardMaterial color="#ffb15a" emissive="#ff7a1a" emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0.38, 1.58, 0.12]} color="#ff8a3a" intensity={1.4} distance={4.5} decay={2} />
    </group>
  );
}

function Priest() {
  return (
    <group>
      <mesh position={[0, 0.72, 0]} castShadow>
        <coneGeometry args={[0.44, 1.38, 8]} />
        <meshStandardMaterial color="#f3efe4" roughness={0.78} />
      </mesh>
      <Box pos={[0, 0.95, 0.2]} args={[0.06, 0.55, 0.03]} color="#e4c48a" metal={0.65} />
      <Box pos={[0, 1.05, 0.22]} args={[0.22, 0.06, 0.03]} color="#e4c48a" metal={0.65} />
      <mesh position={[0, 1.52, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 12]} />
        <meshStandardMaterial color="#efc3a0" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.015, 8, 24]} />
        <meshStandardMaterial color="#ffe7a8" emissive="#ffe7a8" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.36, 0.95, 0.12]}>
        <boxGeometry args={[0.12, 0.16, 0.12]} />
        <meshStandardMaterial color="#e4c48a" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0.36, 1.1, 0.12]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color="#fff1c4" emissive="#ffd27a" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0.36, 1.15, 0.2]} color="#ffd9a0" intensity={0.8} distance={3.5} decay={2} />
    </group>
  );
}

function Hunter() {
  return (
    <group>
      <Box pos={[-0.11, 0.4, 0]} args={[0.15, 0.78, 0.16]} color="#14181c" />
      <Box pos={[0.11, 0.4, 0]} args={[0.15, 0.78, 0.16]} color="#14181c" />
      <Box pos={[0, 1.08, 0]} args={[0.46, 0.58, 0.26]} color="#243628" rough={0.8} />
      <Box pos={[0, 1.02, -0.16]} args={[0.5, 0.85, 0.06]} color="#121814" rough={0.9} />
      <mesh position={[0, 1.52, 0.02]} castShadow>
        <sphereGeometry args={[0.14, 16, 12]} />
        <meshStandardMaterial color="#c99570" roughness={0.55} />
      </mesh>
      <Box pos={[0, 1.6, 0]} args={[0.3, 0.22, 0.28]} color="#1c2a22" rough={0.85} />
      <mesh position={[-0.05, 1.54, 0.12]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#9dffb4" emissive="#39ff78" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.05, 1.54, 0.12]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#9dffb4" emissive="#39ff78" emissiveIntensity={2} />
      </mesh>
      <Box pos={[-0.34, 1.05, 0.12]} args={[0.03, 0.55, 0.08]} color="#d5ffe2" metal={0.7} rough={0.25} emit="#39ff78" ei={0.35} rot={[0.2, 0, 0.4]} />
      <Box pos={[0.34, 1.0, 0.1]} args={[0.03, 0.55, 0.08]} color="#d5ffe2" metal={0.7} rough={0.25} emit="#39ff78" ei={0.35} rot={[0.1, 0, -0.5]} />
    </group>
  );
}

const BODIES = { warrior: Warrior, mage: Mage, priest: Priest, hunter: Hunter };

export function HeroFigure({
  id,
  position,
  hp,
  selected,
  label = true,
}: {
  id: HeroId;
  position: [number, number, number];
  hp: number;
  selected?: boolean;
  label?: boolean;
}) {
  const ref = useRef<Group>(null);
  const fxSeq = useGame((s) => s.fxSeq);
  const hit = useRef(0);
  const lunge = useRef(0);
  const healT = useRef(0);
  const shieldT = useRef(0);
  const phase = useRef(id.length);

  useEffect(() => {
    const fx = useGame.getState().fx;
    if (!fx) return;
    if (fx.some((f) => f.t === "hurt" && f.who === id)) hit.current = 0.6;
    if (fx.some((f) => (f.t === "slash" || f.t === "fire") && f.actor === id)) lunge.current = 0.55;
    if (fx.some((f) => f.t === "heal" && f.who === id)) healT.current = 1.15;
    if (fx.some((f) => f.t === "shield" && f.actor === id)) shieldT.current = 1.25;
  }, [fxSeq, id]);

  useFrame(({ clock }, delta) => {
    const g = ref.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const t = clock.elapsedTime;
    const fallen = hp <= 0;
    hit.current = Math.max(0, hit.current - dt);
    lunge.current = Math.max(0, lunge.current - dt);
    healT.current = Math.max(0, healT.current - dt);
    shieldT.current = Math.max(0, shieldT.current - dt);
    const bob = fallen ? 0 : Math.sin(t * 1.7 + phase.current) * 0.03;
    const lz = lunge.current > 0 ? Math.sin((1 - lunge.current / 0.55) * Math.PI) * 0.85 : 0;
    g.position.set(position[0], bob + (fallen ? 0.35 : 0), position[2] - lz);
    g.rotation.z = fallen ? -1.25 : hit.current > 0 ? Math.sin(t * 40) * 0.08 : 0;
    g.rotation.y = fallen ? 0.4 : 0.15;
    g.scale.setScalar(1.45);
  });

  const Body = BODIES[id];
  return (
    <group ref={ref} position={position}>
      <Body />
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[0.38, 0.48, 24]} />
          <meshBasicMaterial color="#e4c48a" />
        </mesh>
      )}
      {shieldT.current >= 0 && <ShieldDome timer={shieldT} />}
      {healT.current >= 0 && <HealRing timer={healT} />}
      {label && hp >= 0 && (
        <Html position={[0, 2.05, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="nameplate">
            {HEROES[id].name}
            <div style={{ letterSpacing: 2, color: "#e0705f", fontFamily: "Outfit, sans-serif" }}>
              {"●".repeat(Math.max(0, hp))}
              <span style={{ color: "#5c534c" }}>{"●".repeat(Math.max(0, 4 - hp))}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function ShieldDome({ timer }: { timer: RefObject<number> }) {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const k = timer.current ?? 0;
    m.visible = k > 0;
    const p = 1 - k / 1.25;
    const mat = m.material as { opacity: number };
    m.scale.setScalar(0.7 + p * 0.5);
    mat.opacity = k > 0 ? 0.35 * (1 - p) : 0;
  });
  return (
    <mesh ref={ref} position={[0, 1, 0]}>
      <sphereGeometry args={[0.85, 18, 14]} />
      <meshBasicMaterial color="#bfe6ff" transparent opacity={0.3} />
    </mesh>
  );
}

function HealRing({ timer }: { timer: RefObject<number> }) {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const k = timer.current ?? 0;
    m.visible = k > 0;
    const p = 1 - k / 1.15;
    m.scale.setScalar(0.4 + p * 1.4);
    (m.material as { opacity: number }).opacity = Math.max(0, 0.8 * (1 - p));
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
      <ringGeometry args={[0.35, 0.42, 24]} />
      <meshBasicMaterial color="#ffe7a8" transparent opacity={0.8} />
    </mesh>
  );
}

export function AshGuard({
  position,
  mode,
  pips,
}: {
  position: [number, number, number];
  mode: "ready" | "peace" | "fall";
  pips: number;
}) {
  const ref = useRef<Group>(null);
  const flame = useRef<PointLight>(null);
  const fxSeq = useGame((s) => s.fxSeq);
  const lunge = useRef(0);
  const fall = useRef(0);

  useEffect(() => {
    const fx = useGame.getState().fx;
    if (fx?.some((f) => f.t === "lunge")) lunge.current = 0.55;
    if (fx?.some((f) => f.t === "slash" || f.t === "fire")) lunge.current = Math.max(lunge.current, 0.15);
  }, [fxSeq]);

  useFrame(({ clock }, delta) => {
    const g = ref.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    lunge.current = Math.max(0, lunge.current - dt);
    if (mode === "fall") fall.current = Math.min(1, fall.current + dt * 0.45);
    const f = 0.75 + Math.sin(clock.elapsedTime * 9) * 0.2;
    if (flame.current) flame.current.intensity = mode === "fall" ? 0.2 : 1.6 * f;
    const z = lunge.current > 0 ? Math.sin((1 - lunge.current / 0.55) * Math.PI) * 1.1 : 0;
    g.position.set(position[0], -fall.current * 0.8, position[2] + z);
    g.rotation.z = mode === "fall" ? fall.current * 0.9 : 0;
    g.scale.setScalar(1 - fall.current * 0.25);
  });

  const swordDown = mode === "peace" || mode === "fall";
  return (
    <group ref={ref} position={position}>
      <Box pos={[-0.22, 0.7, 0]} args={[0.28, 1.35, 0.28]} color="#1a1c22" metal={0.7} rough={0.4} />
      <Box pos={[0.22, 0.7, 0]} args={[0.28, 1.35, 0.28]} color="#14161c" metal={0.7} rough={0.4} />
      <Box pos={[0, 1.7, 0]} args={[0.95, 1.05, 0.55]} color="#12141a" metal={0.65} rough={0.42} />
      <Box pos={[0, 1.75, 0.18]} args={[0.08, 0.7, 0.04]} color="#ff7a1a" emit="#ff6a1a" ei={1.5} />
      <Box pos={[0, 1.55, 0.2]} args={[0.45, 0.06, 0.04]} color="#ff7a1a" emit="#ff6a1a" ei={1.2} />
      <Box pos={[-0.55, 1.95, 0]} args={[0.28, 0.22, 0.4]} color="#1c1e26" metal={0.6} />
      <Box pos={[0.55, 1.95, 0]} args={[0.28, 0.22, 0.4]} color="#1c1e26" metal={0.6} />
      <Box pos={[0, 2.45, 0]} args={[0.55, 0.48, 0.5]} color="#0e1016" metal={0.55} rough={0.45} />
      <Box pos={[0, 2.42, 0.24]} args={[0.32, 0.06, 0.04]} color="#ffb02e" emit="#ff8a1a" ei={2} />
      <mesh position={[0, 2.15, 0.1]}>
        <sphereGeometry args={[0.18, 12, 10]} />
        <meshStandardMaterial color="#ffb15a" emissive="#ff6a1a" emissiveIntensity={mode === "fall" ? 0.1 : 0.8} transparent opacity={0.85} />
      </mesh>
      <pointLight ref={flame} position={[0, 2.2, 0.4]} color="#ff7a2a" intensity={1.5} distance={6} decay={2} />
      <Box
        pos={swordDown ? [0.15, 0.7, 0.35] : [0.7, 1.7, 0.15]}
        args={[0.08, swordDown ? 1.3 : 1.7, 0.08]}
        color="#d5dde6"
        metal={0.9}
        rough={0.2}
        rot={swordDown ? [0.4, 0, 0.6] : [0.15, 0, -0.5]}
      />
      {Array.from({ length: Math.max(0, pips) }).map((_, i) => (
        <mesh key={i} position={[(i - (pips - 1) / 2) * 0.22, 2.9, 0]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshStandardMaterial color="#ffb08a" emissive="#e0705f" emissiveIntensity={1.2} />
        </mesh>
      ))}
      <Ash />
    </group>
  );
}

function Ash() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      const y = ((clock.elapsedTime * 0.35 + i * 0.17) % 1.4);
      c.position.y = 0.4 + y;
      (c as Mesh).scale.setScalar(1 - y / 1.6);
    });
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.3 + (i % 4) * 0.18, 0.5, -0.1 + (i % 3) * 0.08]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshBasicMaterial color="#c8beb4" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export function MiraFigure({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.4) * 0.02;
  });
  return (
    <group ref={ref} position={position} scale={0.78}>
      <Box pos={[-0.08, 0.28, 0]} args={[0.1, 0.5, 0.1]} color="#2a211c" />
      <Box pos={[0.08, 0.28, 0]} args={[0.1, 0.5, 0.1]} color="#2a211c" />
      <Box pos={[0, 0.75, 0]} args={[0.42, 0.55, 0.28]} color="#8a5a32" rough={0.8} />
      <mesh position={[0, 1.18, 0]} castShadow>
        <sphereGeometry args={[0.13, 14, 12]} />
        <meshStandardMaterial color="#efc2a2" />
      </mesh>
      <Box pos={[0, 1.28, -0.02]} args={[0.22, 0.12, 0.2]} color="#5a3218" />
      <mesh position={[0.24, 0.85, 0.12]}>
        <torusGeometry args={[0.06, 0.018, 6, 10]} />
        <meshStandardMaterial color="#e4c48a" metalness={0.8} emissive="#e4c48a" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export function RavFigure({ position, free }: { position: [number, number, number]; free: boolean }) {
  return (
    <group position={[position[0], free ? position[1] : 0.35, position[2]]} rotation={free ? [0, 0.4, 0] : [0.5, 0.2, 0]}>
      <Box pos={[-0.12, 0.4, 0]} args={[0.16, 0.7, 0.16]} color="#3a404a" metal={0.6} />
      <Box pos={[0.12, 0.4, 0]} args={[0.16, 0.7, 0.16]} color="#3a404a" metal={0.6} />
      <Box pos={[0, 1.05, 0]} args={[0.5, 0.55, 0.28]} color="#b7c0ca" metal={0.75} rough={0.35} />
      <Box pos={[0, 1.5, 0]} args={[0.28, 0.22, 0.28]} color="#d5dee6" metal={0.7} />
      {!free && (
        <>
          <mesh position={[-0.7, 1.15, -0.2]} rotation={[0, 0, 0.6]}>
            <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
            <meshStandardMaterial color="#8d949e" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.75, 1.1, -0.15]} rotation={[0, 0, -0.7]}>
            <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
            <meshStandardMaterial color="#8d949e" metalness={0.8} roughness={0.3} />
          </mesh>
        </>
      )}
    </group>
  );
}

export function EliasFigure({ position }: { position: [number, number, number] }) {
  const light = useRef<PointLight>(null);
  useFrame(({ clock }) => {
    if (light.current) light.current.intensity = 1.4 + Math.sin(clock.elapsedTime * 3) * 0.35;
  });
  return (
    <group position={position} rotation={[0.4, 0, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <coneGeometry args={[0.4, 0.9, 8]} />
        <meshStandardMaterial color="#6a543c" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.1, 0.05]}>
        <sphereGeometry args={[0.13, 14, 12]} />
        <meshStandardMaterial color="#e0b89a" />
      </mesh>
      <Box pos={[0, 1.02, 0.12]} args={[0.16, 0.08, 0.06]} color="#f2f2f2" />
      <mesh position={[0.15, 0.7, 0.25]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color="#bdeaff" emissive="#7ec8ff" emissiveIntensity={1.6} />
      </mesh>
      <pointLight ref={light} position={[0.2, 0.5, 0.4]} color="#7ec8ff" intensity={1.6} distance={5} decay={2} />
    </group>
  );
}

export function Crawler() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = 2.2 + Math.sin(clock.elapsedTime * 1.4) * 0.25;
    ref.current.position.x = 2.4 + Math.sin(clock.elapsedTime * 0.7) * 0.3;
  });
  return (
    <group ref={ref} position={[2.4, 2.2, -1.6]}>
      <mesh>
        <sphereGeometry args={[0.28, 10, 8]} />
        <meshStandardMaterial color="#07080c" />
      </mesh>
      {[-1, 1].map((s) =>
        [0, 1, 2].map((k) => (
          <mesh key={`${s}${k}`} position={[s * 0.25, -0.05 + k * 0.05, 0.05]} rotation={[0.4, 0, s * 0.8]}>
            <cylinderGeometry args={[0.02, 0.015, 0.45, 5]} />
            <meshStandardMaterial color="#0a0c10" />
          </mesh>
        )),
      )}
      <mesh position={[-0.08, 0.06, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ff3a2a" />
      </mesh>
      <mesh position={[0.1, 0.05, 0.18]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ff3a2a" />
      </mesh>
    </group>
  );
}

export function Fireball() {
  const ref = useRef<Mesh>(null);
  const fxSeq = useGame((s) => s.fxSeq);
  const life = useRef(0);
  useEffect(() => {
    if (useGame.getState().fx?.some((f) => f.t === "fire")) life.current = 0.65;
  }, [fxSeq]);
  useFrame((_, delta) => {
    const m = ref.current;
    if (!m) return;
    life.current = Math.max(0, life.current - Math.min(delta, 0.05));
    m.visible = life.current > 0;
    const p = 1 - life.current / 0.65;
    m.position.set(-0.6 + p * 2.2, 1.4 + Math.sin(p * Math.PI) * 0.5, 1.4 - p * 2.4);
    m.scale.setScalar(life.current > 0.1 ? 1 : 2.2);
  });
  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[0.16, 12, 10]} />
      <meshBasicMaterial color="#ffb15a" />
    </mesh>
  );
}

export function SlashArc() {
  const ref = useRef<Mesh>(null);
  const fxSeq = useGame((s) => s.fxSeq);
  const life = useRef(0);
  useEffect(() => {
    if (useGame.getState().fx?.some((f) => f.t === "slash")) life.current = 0.38;
  }, [fxSeq]);
  useFrame((_, delta) => {
    const m = ref.current;
    if (!m) return;
    life.current = Math.max(0, life.current - Math.min(delta, 0.05));
    m.visible = life.current > 0;
    m.rotation.z = -0.8 + (1 - life.current / 0.38) * 1.8;
    (m.material as { opacity: number }).opacity = life.current / 0.38;
  });
  return (
    <mesh ref={ref} position={[1.35, 1.6, -0.7]} visible={false}>
      <torusGeometry args={[0.7, 0.03, 8, 18, Math.PI * 0.8]} />
      <meshBasicMaterial color="#fff6e4" transparent opacity={1} />
    </mesh>
  );
}
