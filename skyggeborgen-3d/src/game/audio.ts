let ctx: AudioContext | null = null;
let hum: { o: OscillatorNode; g: GainNode } | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = ctx || new Ctor();
  return ctx;
}

export function play(kind: "click" | "bell" | "hit" | "ambient" | "stop") {
  try {
    const audio = ac();
    if (!audio) return;
    void audio.resume();
    if (kind === "stop") {
      if (hum) {
        hum.o.stop();
        hum = null;
      }
      return;
    }
    if (kind === "ambient") {
      if (hum) return;
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = "sine";
      o.frequency.value = 52;
      g.gain.value = 0.02;
      o.connect(g).connect(audio.destination);
      o.start();
      hum = { o, g };
      return;
    }
    const now = audio.currentTime;
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.type = kind === "bell" ? "sine" : kind === "hit" ? "triangle" : "square";
    const start = kind === "bell" ? 220 : kind === "hit" ? 90 : 520;
    o.frequency.setValueAtTime(start, now);
    o.frequency.exponentialRampToValueAtTime(kind === "click" ? 180 : 60, now + (kind === "bell" ? 1.4 : 0.35));
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(kind === "click" ? 0.03 : 0.08, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "bell" ? 1.8 : 0.4));
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(now + (kind === "bell" ? 2 : 0.5));
  } catch {
    /* autoplay or missing device */
  }
}

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "da-DK";
  u.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const da = voices.find((v) => v.lang.toLowerCase().startsWith("da"));
  if (da) u.voice = da;
  window.speechSynthesis.speak(u);
}

export function stopSpeak() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
