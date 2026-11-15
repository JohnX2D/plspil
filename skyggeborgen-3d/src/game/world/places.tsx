import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, PointLight } from "three";
import { Color } from "three";
import type { PlaceId } from "../logic";

export function Sky({ mode }: { mode: "night" | "dawn" | "crypt" }) {
  const top = mode === "dawn" ? "#3c4c86" : mode === "crypt" ? "#12141c" : "#1a2744";
  const mid = mode === "dawn" ? "#f0a07a" : "#3a4e78";
  const bot = mode === "dawn" ? "#ffd7a8" : "#6a7896";
  return (
    <mesh>
      <sphereGeometry args={[42, 24, 16]} />
      <shaderMaterial
        side={1}
        uniforms={{
          top: { value: new Color(top) },
          mid: { value: new Color(mid) },
          bot: { value: new Color(bot) },
        }}
        vertexShader={`varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`varying vec3 vPos; uniform vec3 top; uniform vec3 mid; uniform vec3 bot;
          void main(){
            float h = normalize(vPos).y;
            vec3 c = mix(bot, mid, smoothstep(-0.15, 0.2, h));
            c = mix(c, top, smoothstep(0.15, 0.75, h));
            gl_FragColor = vec4(c, 1.0);
          }`}
      />
    </mesh>
  );
}

export function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      const r = 20 + Math.random() * 16;
      const a = Math.random() * Math.PI * 2;
      const y = 4 + Math.random() * 16;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(a) * r - 6;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#fff6e4" size={0.06} sizeAttenuation />
    </points>
  );
}

export function Rain({ count = 320 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = Math.random() * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return arr;
  }, [count]);
  const ref = useRef<Group>(null);
  const geo = useRef<{ needs: boolean }>({ needs: false });
  const attr = useRef<Float32Array>(positions);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const arr = attr.current;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= dt * 10;
      arr[i * 3] -= dt * 1.6;
      if (arr[i * 3 + 1] < 0) {
        arr[i * 3 + 1] = 10;
        arr[i * 3] = (Math.random() - 0.5) * 18;
      }
    }
    const g = ref.current?.children[0] as { geometry?: { attributes: { position: { needsUpdate: boolean } } } } | undefined;
    if (g?.geometry) g.geometry.attributes.position.needsUpdate = true;
    geo.current.needs = true;
  });
  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#d5e4f8" size={0.07} transparent opacity={0.75} />
      </points>
    </group>
  );
}

export function Floor({ color = "#3a4152" }: { color?: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color={color} roughness={0.96} metalness={0.02} />
    </mesh>
  );
}

export function Torch({ position }: { position: [number, number, number] }) {
  const light = useRef<PointLight>(null);
  const flame = useRef<Group>(null);
  useFrame(({ clock }) => {
    const f = 0.8 + Math.sin(clock.elapsedTime * 13 + position[0]) * 0.18 + Math.sin(clock.elapsedTime * 27) * 0.08;
    if (light.current) light.current.intensity = 2.6 * f;
    if (flame.current) flame.current.scale.y = 0.85 + f * 0.35;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 0.7, 6]} />
        <meshStandardMaterial color="#4a321c" roughness={0.8} />
      </mesh>
      <group ref={flame} position={[0, 0.95, 0]}>
        <mesh>
          <coneGeometry args={[0.09, 0.32, 6]} />
          <meshBasicMaterial color="#ffb15a" />
        </mesh>
      </group>
      <pointLight ref={light} position={[0, 1.05, 0.1]} color="#ff9444" intensity={2.4} distance={7.5} decay={2} />
    </group>
  );
}

function Block({
  pos,
  args,
  color,
  emit,
  ei = 0,
}: {
  pos: [number, number, number];
  args: [number, number, number];
  color: string;
  emit?: string;
  ei?: number;
}) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.04} emissive={emit || "#000"} emissiveIntensity={ei} />
    </mesh>
  );
}

function Castle({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <Block pos={[0, 1.6, 0]} args={[3.6, 3.2, 1.6]} color="#8b97b0" />
      <Block pos={[-2.3, 2.15, 0]} args={[1.05, 4.3, 1.05]} color="#7e8ba6" />
      <Block pos={[2.3, 2.45, 0]} args={[1.05, 4.9, 1.05]} color="#73829e" />
      <mesh position={[-2.3, 4.5, 0]} castShadow>
        <coneGeometry args={[0.82, 1.25, 4]} />
        <meshStandardMaterial color="#4a4038" roughness={0.8} />
      </mesh>
      <mesh position={[2.3, 5.15, 0]} castShadow>
        <coneGeometry args={[0.84, 1.45, 4]} />
        <meshStandardMaterial color="#4a4038" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[0.85, 1.05, 4]} />
        <meshStandardMaterial color="#2a3650" />
      </mesh>
      <Block pos={[1.7, 2.7, 0.82]} args={[0.28, 0.4, 0.08]} color="#ffd27a" emit="#ffb15a" ei={1.4} />
      <Block pos={[-1.7, 2.2, 0.82]} args={[0.22, 0.32, 0.08]} color="#ffd27a" emit="#ffb15a" ei={1} />
      <pointLight position={[0, 2.2, 2.2]} color="#ffb15a" intensity={1.2} distance={8} decay={2} />
    </group>
  );
}

function House({ x, z, lit }: { x: number; z: number; lit?: boolean }) {
  return (
    <group position={[x, 0, z]}>
      <Block pos={[0, 0.85, 0]} args={[1.7, 1.7, 1.35]} color="#9aa6bc" />
      <mesh position={[0, 2.05, 0]} castShadow>
        <coneGeometry args={[1.3, 0.85, 4]} />
        <meshStandardMaterial color="#3a4254" roughness={0.85} />
      </mesh>
      <Block pos={[0.28, 0.9, 0.7]} args={[0.36, 0.42, 0.08]} color={lit ? "#ffcf86" : "#12151c"} emit={lit ? "#ffb15a" : "#000"} ei={lit ? 1.3 : 0} />
    </group>
  );
}

export function Moon() {
  return (
    <group position={[2.8, 5.4, -7]}>
      <mesh>
        <sphereGeometry args={[0.7, 20, 16]} />
        <meshBasicMaterial color="#fff6dd" />
      </mesh>
      <pointLight color="#d5e2ff" intensity={1.4} distance={30} decay={2} />
    </group>
  );
}

function Bell() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.08;
  });
  return (
    <group ref={ref} position={[0.2, 3.35, -1.2]}>
      <mesh rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[0.85, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#c6a15a" metalness={0.86} roughness={0.22} side={2} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color="#8a6a32" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#5a4630" />
      </mesh>
    </group>
  );
}

export function PlaceSet({ place }: { place: PlaceId }) {
  if (place === "mira") {
    return (
      <group>
        <Floor color="#3c4558" />
        <Moon />
        <Stars />
        <Rain />
        <Castle position={[0.6, 0, -4.2]} scale={1.15} />
        <House x={-3.3} z={-1.7} />
        <House x={-1.5} z={-2.3} />
        <House x={2.8} z={-1.5} lit />
        <Torch position={[-0.9, 0, -0.2]} />
        <Torch position={[1.6, 0, 0.1]} />
      </group>
    );
  }
  if (place === "port") {
    return (
      <group>
        <Floor color="#2a2f3a" />
        <Stars />
        <Moon />
        <Block pos={[0, 2.4, -2.4]} args={[12, 4.8, 0.8]} color="#343a48" />
        <Block pos={[0, 1.6, -1.95]} args={[2.1, 3.1, 0.4]} color="#07080c" />
        {Array.from({ length: 7 }).map((_, i) => (
          <Block key={i} pos={[-0.9 + i * 0.3, 1.7, -1.7]} args={[0.06, 2.6, 0.06]} color="#3a3530" />
        ))}
        <Torch position={[-1.8, 0, -1.2]} />
        <Torch position={[1.8, 0, -1.2]} />
        <directionalLight position={[2, 6, 4]} intensity={0.25} color="#b9c6de" />
      </group>
    );
  }
  if (place === "vej") {
    return (
      <group>
        <Floor color="#262b36" />
        <Block pos={[0, 2.2, -3.2]} args={[10, 4.4, 0.5]} color="#303646" />
        {[-2.4, -0.8, 0.8, 2.4].map((x) => (
          <Block key={x} pos={[x, 1.6, -1.4]} args={[0.28, 3.2, 0.28]} color="#3a4150" />
        ))}
        <Block pos={[-3.2, 0.7, -0.4]} args={[1.6, 0.25, 0.8]} color="#4a5160" />
        <Block pos={[-3.2, 1.15, -1]} args={[1.4, 0.25, 0.8]} color="#4a5160" />
        <Block pos={[-3.2, 1.6, -1.6]} args={[1.2, 0.25, 0.8]} color="#4a5160" />
        <mesh position={[2.6, 1.3, -1.5]}>
          <sphereGeometry args={[0.7, 16, 12]} />
          <meshBasicMaterial color="#7ec8ff" transparent opacity={0.18} />
        </mesh>
        <pointLight position={[2.6, 1.2, -1.2]} color="#7ec8ff" intensity={2} distance={6} decay={2} />
        <Drips />
      </group>
    );
  }
  if (place === "taarn") {
    return (
      <group>
        <Floor />
        <Block pos={[-2.3, 2.2, -1]} args={[0.5, 4.6, 4]} color="#323846" />
        <Block pos={[2.5, 2.2, -1]} args={[0.5, 4.6, 4]} color="#323846" />
        <Block pos={[0.1, 2.4, -3]} args={[4.4, 4.8, 0.4]} color="#2c3342" />
        <Bell />
        <mesh position={[0.2, 2.2, -1.2]}>
          <cylinderGeometry args={[0.025, 0.025, 3.2, 6]} />
          <meshStandardMaterial color="#6b5438" />
        </mesh>
        <Block pos={[1.5, 1.3, -2.7]} args={[1.1, 2.2, 0.16]} color="#3a3228" />
        <mesh position={[1.5, 1.7, -2.58]}>
          <coneGeometry args={[0.16, 0.28, 6]} />
          <meshStandardMaterial color="#ffb15a" emissive="#ff7a1a" emissiveIntensity={1.1} />
        </mesh>
        <group position={[-0.8, 0.08, 0.4]} rotation={[0, 0.4, 0.4]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.05, 0.45, 6]} />
            <meshStandardMaterial color="#6a4324" />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.22, 0.1, 0.1]} />
            <meshStandardMaterial color="#9aa3ad" metalness={0.7} />
          </mesh>
        </group>
        <pointLight position={[0.2, 2.4, 0]} color="#e4c48a" intensity={0.7} distance={8} decay={2} />
      </group>
    );
  }
  if (place === "kapel") {
    return (
      <group>
        <Floor color="#26242c" />
        <Block pos={[0, 2.2, -3.1]} args={[10, 4.4, 0.4]} color="#34303a" />
        <Block pos={[-2.2, 0.35, 0.2]} args={[1.3, 0.16, 0.4]} color="#4a3220" />
        <Block pos={[-0.4, 0.35, 0.6]} args={[1.3, 0.16, 0.4]} color="#4a3220" />
        <Block pos={[1.2, 0.55, -2.2]} args={[1.6, 0.7, 0.7]} color="#3e3934" />
        <mesh position={[1.2, 1.15, -2.15]}>
          <coneGeometry args={[0.08, 0.28, 6]} />
          <meshBasicMaterial color="#bdeaff" />
        </mesh>
        <pointLight position={[1.2, 1.2, -1.6]} color="#7ec8ff" intensity={2.4} distance={7} decay={2} />
        <mesh position={[-2.6, 2.2, -2.85]}>
          <planeGeometry args={[0.7, 1.3]} />
          <meshBasicMaterial color="#3a6ea8" transparent opacity={0.55} />
        </mesh>
        <mesh position={[-1.7, 2.2, -2.85]}>
          <planeGeometry args={[0.55, 1.3]} />
          <meshBasicMaterial color="#a33a3a" transparent opacity={0.45} />
        </mesh>
        <Block pos={[2.6, 1.4, -2.85]} args={[0.9, 2.1, 0.12]} color="#4a4034" />
      </group>
    );
  }
  if (place === "vagt" || place === "elias") {
    return (
      <group>
        <Floor color="#23262e" />
        <Block pos={[0, 2.3, -3]} args={[11, 4.6, 0.5]} color="#2a2e38" />
        <Block pos={[-4.2, 2, -0.5]} args={[0.4, 4, 6]} color="#2a2e38" />
        <Block pos={[4.2, 2, -0.5]} args={[0.4, 4, 6]} color="#2a2e38" />
        <Block pos={[1.7, 1.6, -2.6]} args={[1.8, 2.8, 0.25]} color="#3c3e46" />
        <Torch position={[-1.4, 0, -1.4]} />
        <Torch position={[0.2, 0, -1.6]} />
        {place === "elias" && (
          <group position={[0.3, 0.02, -0.2]}>
            <mesh rotation={[-Math.PI / 2, 0, 0.4]}>
              <planeGeometry args={[1.6, 0.12]} />
              <meshBasicMaterial color="#9fd8ff" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, -0.5]} position={[0.2, 0, 0.15]}>
              <planeGeometry args={[1.1, 0.08]} />
              <meshBasicMaterial color="#7ec8ff" />
            </mesh>
            <pointLight position={[0, 0.3, 0]} color="#7ec8ff" intensity={1.8} distance={4.5} decay={2} />
          </group>
        )}
      </group>
    );
  }
  if (place === "slut") {
    return (
      <group>
        <Floor color="#3a2c33" />
        <Castle position={[-3.2, 0, -6]} scale={1.05} />
        {[-1, 0.2, 1.6, 3.1, 4.2].map((x, i) => (
          <mesh key={x} position={[x, 0.7 + (i % 2) * 0.2, -2.2 - (i % 3) * 0.4]}>
            <coneGeometry args={[0.35, 1.5, 6]} />
            <meshStandardMaterial color="#241820" />
          </mesh>
        ))}
        <Lantern />
        <directionalLight position={[2, 6, 3]} intensity={0.85} color="#ffd0a4" />
      </group>
    );
  }
  return (
    <group>
      <Floor color="#1a140f" />
      <Stars />
      <Moon />
      <Campfire />
    </group>
  );
}

function Drips() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    ref.current?.children.forEach((c, i) => {
      const p = (clock.elapsedTime * 0.45 + i * 0.33) % 1;
      c.position.y = 3.2 - p * 3;
    });
  });
  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.4 + i * 0.7, 3, -0.8]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial color="#b9d4ea" />
        </mesh>
      ))}
    </group>
  );
}

function Lantern() {
  const ref = useRef<PointLight>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = 3.2 + Math.sin(clock.elapsedTime * 0.6) * 0.35;
    ref.current.intensity = 1.5 + Math.sin(clock.elapsedTime * 4) * 0.3;
  });
  return (
    <group>
      <pointLight ref={ref} position={[3.2, 1.3, -1.6]} color="#ff3a2a" intensity={1.6} distance={6} decay={2} />
      <mesh position={[3.2, 1.3, -1.6]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ff4a32" />
      </mesh>
    </group>
  );
}

function Campfire() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.y = 0.9 + Math.sin(clock.elapsedTime * 12) * 0.15;
  });
  return (
    <group position={[0.4, 0, -0.3]}>
      <mesh rotation={[0, 0.4, 0.6]} position={[-0.15, 0.12, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.7, 5]} />
        <meshStandardMaterial color="#4a321c" />
      </mesh>
      <mesh rotation={[0, 0.2, -0.7]} position={[0.15, 0.12, 0.05]}>
        <cylinderGeometry args={[0.05, 0.07, 0.7, 5]} />
        <meshStandardMaterial color="#3a2816" />
      </mesh>
      <group ref={ref} position={[0, 0.35, 0]}>
        <mesh>
          <coneGeometry args={[0.18, 0.45, 6]} />
          <meshBasicMaterial color="#ff7a1a" />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <coneGeometry args={[0.08, 0.28, 6]} />
          <meshBasicMaterial color="#ffe08a" />
        </mesh>
      </group>
      <pointLight position={[0, 0.6, 0.2]} color="#ff8a3a" intensity={3} distance={7} decay={2} />
    </group>
  );
}

export function MapStones({ at, next }: { at: number; next: number }) {
  return (
    <group>
      <Floor color="#1a1714" />
      <Stars />
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 6;
        const x = -4.2 + t * 8.4;
        const z = Math.sin(t * Math.PI) * 1.5;
        const on = i === at || i === next;
        const done = i <= at;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.18, 0]} castShadow>
              <cylinderGeometry args={[0.38, 0.46, 0.36, 6]} />
              <meshStandardMaterial
                color={done ? "#4a3820" : "#221c18"}
                emissive={on ? "#e4c48a" : "#000"}
                emissiveIntensity={on ? 0.35 : 0}
              />
            </mesh>
            <mesh position={[0, 0.42, 0]}>
              <sphereGeometry args={[0.08, 10, 8]} />
              <meshStandardMaterial color={on ? "#ffe7b0" : "#6a6258"} emissive={on ? "#e4c48a" : "#000"} emissiveIntensity={on ? 0.8 : 0} />
            </mesh>
          </group>
        );
      })}
      <directionalLight position={[2, 6, 4]} intensity={0.4} color="#d7c4a4" />
    </group>
  );
}
