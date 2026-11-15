import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { MathUtils, Vector3, ACESFilmicToneMapping, type PerspectiveCamera } from "three";
import { ALL_HEROES, visualPlace, type HeroId } from "../logic";
import { useGame } from "../store";
import {
  AshGuard,
  Crawler,
  EliasFigure,
  Fireball,
  HeroFigure,
  MiraFigure,
  RavFigure,
  SlashArc,
} from "./actors";
import { MapStones, PlaceSet, Sky } from "./places";

const CAM: Record<string, { pos: [number, number, number]; look: [number, number, number] }> = {
  mira: { pos: [0.15, 1.65, 5.1], look: [0.35, 1.7, -2.4] },
  port: { pos: [0, 1.55, 4.6], look: [0, 1.7, -1.4] },
  vej: { pos: [0.2, 1.6, 4.8], look: [0, 1.45, -1.4] },
  taarn: { pos: [0, 1.55, 4.4], look: [0.15, 2.3, -1.2] },
  kapel: { pos: [-0.2, 1.55, 4.5], look: [0.8, 1.3, -1.5] },
  vagt: { pos: [-0.4, 1.55, 4.4], look: [0.9, 1.55, -1] },
  elias: { pos: [0.15, 1.55, 4.3], look: [0.2, 1.15, -0.5] },
  slut: { pos: [0.2, 1.7, 5.4], look: [-0.2, 1.55, -2] },
  baal: { pos: [0, 1.5, 4.2], look: [0.35, 1.05, -0.2] },
  map: { pos: [0.1, 5.2, 5.6], look: [0, 0.3, 0.2] },
};

const _look = new Vector3();
const _goal = new Vector3();
const _offset = new Vector3();
const _up = new Vector3(0, 1, 0);

function CameraRig({ camKey }: { camKey: string }) {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const key = useRef(camKey);

  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      drag.current = { x: e.clientX, y: e.clientY, yaw: yaw.current, pitch: pitch.current };
    };
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      if (Math.abs(e.clientX - drag.current.x) + Math.abs(e.clientY - drag.current.y) < 4) return;
      yaw.current = MathUtils.clamp(drag.current.yaw - (e.clientX - drag.current.x) * 0.005, -0.7, 0.7);
      pitch.current = MathUtils.clamp(drag.current.pitch + (e.clientY - drag.current.y) * 0.003, -0.28, 0.28);
    };
    const up = () => {
      drag.current = null;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (key.current !== camKey) {
      key.current = camKey;
      yaw.current = 0;
      pitch.current = 0;
    }
    const preset = CAM[camKey] ?? CAM.mira;
    _look.set(...preset.look);
    _goal.set(...preset.pos);
    _offset.copy(_goal).sub(_look);
    _offset.applyAxisAngle(_up, yaw.current);
    _goal.copy(_look).add(_offset);
    _goal.y += pitch.current * 2.2;
    const cam = camera as PerspectiveCamera;
    cam.position.lerp(_goal, 1 - Math.exp(-dt * 2.4));
    cam.lookAt(_look);
  });
  return null;
}

function Party() {
  const screen = useGame((s) => s.screen);
  const selected = useGame((s) => s.selected);
  const hp = useGame((s) => s.hp);
  const ids: HeroId[] = screen === "intro" ? [] : screen === "setup" ? ALL_HEROES : selected;
  if (!ids.length || screen === "map") return null;
  const gap = ids.length <= 1 ? 0 : Math.min(1.35, 4.6 / (ids.length - 1));
  const start = -((ids.length - 1) * gap) / 2 - 0.15;
  return (
    <group>
      {ids.map((id, i) => (
        <HeroFigure
          key={id}
          id={id}
          position={[start + i * gap, 0, screen === "setup" ? 0.85 : 0.55]}
          hp={screen === "setup" ? 4 : (hp[id] ?? 4)}
          selected={screen === "setup" && selected.includes(id)}
          label={screen !== "setup" && screen !== "intro"}
        />
      ))}
    </group>
  );
}

function Npcs() {
  const screen = useGame((s) => s.screen);
  const place = useGame((s) => s.place);
  const title = useGame((s) => s.title);
  const rav = useGame((s) => !!s.flags.rav);
  const guard = useGame((s) => s.flags.guard);
  const enemy = useGame((s) => s.enemy);
  const visual = screen === "map" ? "map" : visualPlace(screen, place);
  return (
    <group>
      {(visual === "mira" && screen !== "intro" && screen !== "setup") || screen === "setup" ? (
        <MiraFigure position={[2.15, 0, -1.15]} />
      ) : null}
      {visual === "port" && <RavFigure position={[-1.55, 0, 0.15]} free={rav || title === "Kæden brister"} />}
      {(visual === "vagt" || screen === "combat" || screen === "dark") &&
        visual !== "elias" &&
        screen !== "ending" &&
        place !== "elias" && (
          <AshGuard
            position={[1.25, 0, -1.05]}
            mode={title === "Vagten falder" || guard === "besejret" ? "fall" : guard === "skånet" || title === "Vagten husker" || title === "Vagten lytter" ? "peace" : "ready"}
            pips={screen === "combat" ? enemy : 0}
          />
        )}
      {screen === "dark" && <Crawler />}
      {(visual === "elias" || (place === "elias" && screen !== "ending")) && <EliasFigure position={[0.15, 0, -0.35]} />}
      <Fireball />
      <SlashArc />
    </group>
  );
}

function World() {
  const screen = useGame((s) => s.screen);
  const place = useGame((s) => s.place);
  const mapAt = useGame((s) => s.mapAt);
  const mapNext = useGame((s) => s.mapNext);
  const visual = visualPlace(screen, place);
  const camKey = screen === "map" ? "map" : visual;
  const fog =
    visual === "slut" ? "#e7b089" : visual === "mira" ? "#8ea0be" : visual === "baal" ? "#1a140f" : "#1c2230";
  const sky = visual === "slut" ? "dawn" : visual === "vagt" || visual === "elias" || visual === "taarn" || visual === "kapel" ? "crypt" : "night";
  const nodeAt: Record<string, number> = {
    mira: 0,
    port: 1,
    vej: 2,
    taarn: 3,
    kapel: 3,
    vagt: 4,
    elias: 5,
    slut: 6,
  };
  const nextStone = nodeAt[mapNext] ?? mapAt;

  return (
    <>
      <color attach="background" args={[fog]} />
      <fog attach="fog" args={[fog, visual === "mira" ? 18 : 9, visual === "mira" ? 46 : 24]} />
      <ambientLight intensity={visual === "slut" ? 0.5 : 0.26} />
      <hemisphereLight args={["#b7c9ea", "#3a2a22", visual === "slut" ? 0.55 : 0.4]} />
      <directionalLight
        position={[-6, 7, -4]}
        intensity={visual === "slut" ? 0.4 : 1.15}
        color="#9eb6e8"
      />
      <directionalLight
        position={[4, 8, 5]}
        intensity={visual === "slut" ? 1.25 : 0.85}
        color={visual === "slut" ? "#ffd2a8" : "#d5e2ff"}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={24}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <Sky mode={sky} />
      <CameraRig camKey={camKey} />
      {screen === "map" ? <MapStones at={mapAt} next={nextStone} /> : <PlaceSet place={visual} />}
      {screen !== "map" && <Party />}
      {screen === "map" && <MapParty at={mapAt} />}
      {screen !== "map" && <Npcs />}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={16} blur={2.2} far={4} color="#000000" />
    </>
  );
}

function MapParty({ at }: { at: number }) {
  const selected = useGame((s) => s.selected);
  const t = at / 6;
  const x = -4.2 + t * 8.4;
  const z = Math.sin(t * Math.PI) * 1.5;
  return (
    <group position={[x, 0.45, z]} scale={0.42}>
      {selected.map((id, i) => (
        <HeroFigure key={id} id={id} position={[(i - (selected.length - 1) / 2) * 0.9, 0, 0]} hp={4} label={false} />
      ))}
    </group>
  );
}

export function Stage() {
  return (
    <div className="stage-wrap">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0.3, 2.3, 7.4], fov: 38, near: 0.1, far: 80 }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.22;
        }}
      >
        <Suspense fallback={null}>
          <World />
        </Suspense>
      </Canvas>
    </div>
  );
}
