import { useEffect, useState } from "react";
import { BookOpen, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useGame } from "./store";
import { Hud } from "./Hud";
import { Stage } from "./world/Stage";

const PLACE_LABEL: Record<string, string> = {
  mira: "Landsbyen",
  port: "Porten",
  vej: "Den runde sal",
  taarn: "Klokketårnet",
  kapel: "Kapellet",
  vagt: "Under klokken",
  elias: "Revnen",
  slut: "Solopgang",
  baal: "Det sidste bål",
};

export function GameApp() {
  const screen = useGame((s) => s.screen);
  const place = useGame((s) => s.place);
  const chapter = useGame((s) => s.chapter);
  const dark = useGame((s) => s.dark);
  const audioOn = useGame((s) => s.audioOn);
  const title = useGame((s) => s.title);
  const fxSeq = useGame((s) => s.fxSeq);
  const [ask, setAsk] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; txt: string; good: boolean }[]>([]);

  useEffect(() => {
    const fx = useGame.getState().fx;
    if (!fx) return;
    const texts = fx.filter((f) => f.t === "txt" && f.txt);
    if (!texts.length) return;
    setToasts(texts.map((t, i) => ({ id: fxSeq * 10 + i, txt: t.txt ?? "", good: (t.txt ?? "").includes("+") || t.txt === "Blokeret" || t.txt === "Forbi" })));
    const timer = window.setTimeout(() => setToasts([]), 1300);
    return () => window.clearTimeout(timer);
  }, [fxSeq]);

  const label =
    screen === "intro" || screen === "setup"
      ? "Den tavse klokke"
      : screen === "map"
        ? "Eventyrkortet"
        : screen === "combat"
          ? "Kamp"
          : title || PLACE_LABEL[place] || "Skyggeborgen";

  return (
    <main className="app">
      <Stage />
      <div className={`vignette d${Math.min(4, dark)}`} />
      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={t.good ? "toast good" : "toast"}>
            {t.txt}
          </div>
        ))}
      </div>
      {screen !== "intro" && screen !== "setup" ? <div className="place-tag">{label}</div> : null}
      {screen !== "intro" && screen !== "setup" ? (
        <div className="dots" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <i key={i} className={i <= chapter ? "on" : ""} />
          ))}
        </div>
      ) : null}
      <div className="chrome">
        <header className="topbar">
          <div className="brand">Skyggeborgen</div>
          <div className="top-actions">
            <button className="icon-btn" onClick={() => useGame.getState().toggleAudio()}>
              {audioOn ? <Volume2 /> : <VolumeX />}
              {audioOn ? "Lyd til" : "Lyd fra"}
            </button>
            <button className="icon-btn" onClick={() => useGame.getState().narrate()} aria-label="Fortæl scenen">
              <BookOpen />
              Fortæl
            </button>
            <button className="icon-btn" onClick={() => setAsk(true)}>
              <RotateCcw />
              Nyt
            </button>
          </div>
        </header>
        {ask ? (
          <section className="dock">
            <h2>Nyt eventyr?</h2>
            <p className="prose">Det nuværende forsøg bliver slettet. Borgen venter stadig.</p>
            <div className="btn-row">
              <button
                className="btn-gold"
                onClick={() => {
                  useGame.getState().fresh();
                  setAsk(false);
                }}
              >
                Start forfra
              </button>
              <button className="btn-ghost" onClick={() => setAsk(false)}>
                Bliv i historien
              </button>
            </div>
          </section>
        ) : (
          <Hud />
        )}
      </div>
    </main>
  );
}
