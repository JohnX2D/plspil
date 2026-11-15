import { create } from "zustand";
import { play, speak, stopSpeak } from "./audio";
import {
  initial,
  narrateText,
  reduce,
  type GameData,
  type HeroId,
  type Screen,
} from "./logic";

const KEY = "skyggeborgen-3d-v1";

const SCREENS = new Set<Screen>([
  "intro",
  "setup",
  "story",
  "roll",
  "card",
  "combat",
  "map",
  "ending",
  "lost",
  "dark",
  "cardheal",
  "heal",
  "sparkheal",
]);

function load(): GameData {
  const base = initial();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const p = JSON.parse(raw) as Partial<GameData>;
    if (!p || !p.screen || !SCREENS.has(p.screen)) return base;
    const selected = (p.selected ?? []).filter((id): id is HeroId =>
      ["warrior", "mage", "priest", "hunter"].includes(id),
    );
    return {
      ...base,
      ...p,
      selected,
      hp: { ...p.hp },
      used: { ...p.used },
      flags: { ...base.flags, ...p.flags },
      options: Array.isArray(p.options) ? p.options : [],
      acted: Array.isArray(p.acted) ? p.acted : [],
      upgrades: { ...p.upgrades },
      pending: p.pending ?? null,
      fx: null,
      fxSeq: 0,
      sfx: "",
      charging: false,
      showFull: false,
    };
  } catch {
    return base;
  }
}

function persist(s: GameData) {
  try {
    const { fx: _fx, fxSeq: _seq, sfx: _sfx, charging: _c, showFull: _full, ...rest } = s;
    localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {
    /* ignore quota */
  }
}

type Store = GameData & {
  dispatch: (raw: string) => void;
  toggleAudio: () => void;
  narrate: () => void;
  fresh: () => void;
};

export const useGame = create<Store>((set, get) => ({
  ...load(),
  dispatch: (raw) => {
    const audioOn = get().audioOn;
    if (audioOn) play("click");
    stopSpeak();
    const [a, ...rest] = raw.split(":");
    const next = reduce(get(), a, rest.join(":"));
    set(next);
    persist(next);
    if (audioOn && next.sfx) play(next.sfx);
  },
  toggleAudio: () => {
    const on = !get().audioOn;
    set({ audioOn: on });
    persist({ ...get(), audioOn: on });
    if (on) {
      play("ambient");
      play("bell");
    } else {
      play("stop");
    }
  },
  narrate: () => {
    speak(narrateText(get()));
  },
  fresh: () => {
    stopSpeak();
    const audioOn = get().audioOn;
    const next = initial();
    next.audioOn = audioOn;
    set(next);
    persist(next);
  },
}));
