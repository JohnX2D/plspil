import { useEffect, useState } from "react";
import {
  ArrowDown,
  Bell,
  BookOpen,
  ChevronRight,
  Dices,
  DoorOpen,
  Eye,
  Flame,
  Handshake,
  Heart,
  KeyRound,
  Link2,
  MessageCircle,
  Shield,
  Sparkles,
  Sun,
  Swords,
  type LucideIcon,
} from "lucide-react";
import {
  HEROES,
  UPGRADES,
  alive,
  canVision,
  routeLabel,
  shortOf,
  type HeroId,
  type Option,
} from "./logic";
import { useGame } from "./store";

const ICONS: Record<string, LucideIcon> = {
  mira_klokke: Bell,
  mira_nogle: KeyRound,
  mira_lov: Handshake,
  rav_roll: Link2,
  rav_ord: MessageCircle,
  rav_ga: DoorOpen,
  taarn: Bell,
  kapel: Flame,
  card: BookOpen,
  vagt: ArrowDown,
  talk_roll: MessageCircle,
  vagt_fred: Shield,
  fight: Swords,
  seal_roll: Sparkles,
  elias_baal: Flame,
  elias_bliv: DoorOpen,
  vision: Eye,
  attack: Swords,
  mage: Flame,
  priest: Sparkles,
  revive: Heart,
  shield: Shield,
  peace: Shield,
  spark: Sparkles,
  fight_back: ChevronRight,
  fight_action: ChevronRight,
  cancel_target: ChevronRight,
};

const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Hearts({ n }: { n: number }) {
  return (
    <span className="chip">
      {[0, 1, 2, 3].map((i) => (
        <Heart key={i} className={i < n ? "heart on" : "heart"} />
      ))}
    </span>
  );
}

function Choice({ option, main = false }: { option: Option; main?: boolean }) {
  const Icon = ICONS[option.action] ?? ChevronRight;
  return (
    <button className={main || option.label === "Fortsæt" ? "choice main" : "choice"} data-go={option.action} onClick={() => useGame.getState().dispatch(option.action)}>
      <Icon size={18} />
      <span>
        {option.label}
        {option.detail ? <small>{option.detail}</small> : null}
      </span>
    </button>
  );
}

function Choices({ options }: { options: Option[] }) {
  if (!options.length) return null;
  return (
    <div className="stack">
      {options.map((o) => (
        <Choice key={o.action + o.label} option={o} />
      ))}
    </div>
  );
}

function HeroPick({
  ids,
  action,
  allowDown = false,
}: {
  ids: HeroId[];
  action: string;
  allowDown?: boolean;
}) {
  const hp = useGame((s) => s.hp);
  return (
    <div className="stack">
      {ids.map((id) => (
        <button key={id} className="choice" onClick={() => useGame.getState().dispatch(`${action}:${id}`)}>
          <Swords size={18} />
          <span>
            {HEROES[id].name}
            <small>
              {(hp[id] ?? 0) === 0 ? "Slået ud" : HEROES[id].title}
            </small>
          </span>
          <Hearts n={allowDown ? (hp[id] ?? 0) : (hp[id] ?? 0)} />
        </button>
      ))}
    </div>
  );
}

function DieFace({ n }: { n: number }) {
  const on = new Set(PIPS[n]);
  return (
    <span className="pips" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <b key={i} className={on.has(i) ? "on" : ""} />
      ))}
    </span>
  );
}

function Dice({
  action,
  two,
}: {
  action: "roll" | "attackroll";
  two: boolean;
}) {
  const dispatch = useGame((s) => s.dispatch);
  const [spin, setSpin] = useState(false);
  const [faces, setFaces] = useState<number[]>([1]);

  useEffect(() => {
    setSpin(false);
  }, [action, two]);

  function digital() {
    const a = 1 + Math.floor(Math.random() * 6);
    const b = two ? 1 + Math.floor(Math.random() * 6) : null;
    const shown = b ? [a, b] : [a];
    setFaces(shown);
    setSpin(true);
    dispatch("charge");
    window.setTimeout(() => {
      setSpin(false);
      dispatch(`${action}:${b ? Math.max(a, b) : a}`);
    }, 880);
  }

  return (
    <div>
      <div className="cube-wrap" aria-hidden>
        {faces.map((n, i) => (
          <div key={i} className={spin ? "cube spin" : "cube"} style={spin ? undefined : { transform: faceTurn(n) }}>
            <i>1</i>
            <i>6</i>
            <i>3</i>
            <i>4</i>
            <i>2</i>
            <i>5</i>
          </div>
        ))}
      </div>
      <button className="btn-gold" onClick={digital} disabled={spin}>
        <Dices size={18} />
        {two ? "Slå to terninger" : "Slå terningen"}
      </button>
      <p className="hint">Eller tryk på det, den rigtige terning viste{two ? " — den højeste gælder" : ""}.</p>
      <div className="die-row">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button key={n} className="die-btn" aria-label={`Terningen viste ${n}`} onClick={() => dispatch(`${action}:${n}`)} disabled={spin}>
            <DieFace n={n} />
          </button>
        ))}
      </div>
      <div className="legend">
        <span>1–2 det koster</span>
        <span>3–4 lykkes, men…</span>
        <span>5–6 flot</span>
      </div>
    </div>
  );
}

function faceTurn(n: number) {
  const turns: Record<number, string> = {
    1: "rotateY(0deg)",
    6: "rotateY(180deg)",
    3: "rotateY(-90deg)",
    4: "rotateY(90deg)",
    2: "rotateX(-90deg)",
    5: "rotateX(90deg)",
  };
  return turns[n] ?? "none";
}

function StoryBody() {
  const s = useGame();
  const caption = shortOf(s);
  const full = s.story.replace(/\n/g, " ");
  const longer = caption !== full && s.story.length > caption.length;
  return (
    <>
      <h2>{s.title}</h2>
      <p className="prose">{caption}</p>
      {longer ? (
        <button className="text-btn" onClick={() => s.dispatch("more")}>
          {s.showFull ? "Skjul hele teksten" : "Læs hele teksten"}
        </button>
      ) : null}
      {s.showFull ? <div className="full">{s.story}</div> : null}
      {s.flags.visionText ? <div className="notice">Dæmonblik: {s.flags.visionText}</div> : null}
      {canVision(s) ? (
        <Choices options={[{ label: "Demon Hunter bruger Dæmonblik", action: "vision", detail: "Se faren, før I vælger." }]} />
      ) : null}
      <Choices options={s.options} />
    </>
  );
}

function Status() {
  const selected = useGame((s) => s.selected);
  const hp = useGame((s) => s.hp);
  const flags = useGame((s) => s.flags);
  const screen = useGame((s) => s.screen);
  if (screen === "intro" || screen === "setup" || !selected.length) return null;
  return (
    <div className="status">
      {selected.map((id) => (
        <span key={id} className={(hp[id] ?? 0) === 0 ? "chip down" : "chip"}>
          {HEROES[id].name}
          {[0, 1, 2, 3].map((i) => (
            <Heart key={i} className={i < (hp[id] ?? 0) ? "heart on" : "heart"} />
          ))}
        </span>
      ))}
      {flags.segl ? <span className="chip">Flammesegl</span> : null}
      {flags.ed ? <span className="chip">Ed</span> : null}
      {flags.spark ? <span className="chip">Lysgnist</span> : null}
      {flags.rav ? <span className="chip">Sir Rav</span> : null}
    </div>
  );
}

export function Hud() {
  const s = useGame();

  let body = null;
  if (s.screen === "intro") {
    body = (
      <>
        <p className="eyebrow">Et samarbejdseventyr for 2–4 helte</p>
        <h1>Skyggeborgen</h1>
        <p className="lead">En gammel klokke ringer i mørket. En flamme er ved at dø. Og nogen venter på jer bag borgens mure.</p>
        <div className="btn-row">
          <button className="btn-gold" onClick={() => s.dispatch("setup")}>
            Begynd eventyret
            <ChevronRight size={18} />
          </button>
        </div>
        <p className="hint">10–20 minutter. I kan slå terningen her — eller bruge rigtige terninger og et spil kort.</p>
      </>
    );
  } else if (s.screen === "setup") {
    body = (
      <>
        <p className="eyebrow">Før eventyret begynder</p>
        <h2>Vælg jeres helte</h2>
        <p className="prose">Vælg 2–4 helte. Hver spiller styrer én, og I vinder eller taber sammen.</p>
        <div className="hero-grid">
          {(Object.keys(HEROES) as HeroId[]).map((id) => {
            const h = HEROES[id];
            const on = s.selected.includes(id);
            return (
              <button key={id} className={on ? "hero-card on" : "hero-card"} onClick={() => s.dispatch(`select:${id}`)} aria-pressed={on}>
                <strong>{h.name}</strong>
                <em>{h.title}</em>
                <span>{h.desc}</span>
              </button>
            );
          })}
        </div>
        <div className="btn-row">
          <button className="btn-gold" disabled={s.selected.length < 2} onClick={() => s.dispatch("start")}>
            Træd ind i historien
            <ChevronRight size={18} />
          </button>
        </div>
        <p className="hint">{s.selected.length < 2 ? "Vælg mindst to helte." : `${s.selected.length} helte er klar.`}</p>
      </>
    );
  } else if (s.screen === "story") {
    body = <StoryBody />;
  } else if (s.screen === "map") {
    body = (
      <>
        <h2>Videre i eventyret</h2>
        <p className="prose">I går videre mod {routeLabel(s)}.</p>
        <Choices options={[{ label: "Gå videre", action: `go:${s.mapNext}` }]} />
      </>
    );
  } else if (s.screen === "roll" && s.pending) {
    const prompts = {
      rav: "Hvem forsøger at bryde kæden?",
      talk: "Hvem taler med askevagten?",
      seal: "Hvem hjælper Elias med at forsegle revnen?",
    };
    const type = s.pending.type ?? "rav";
    if (!s.pending.hero) {
      body = (
        <>
          <h2>Terningeslag</h2>
          <p className="prose">{prompts[type]}</p>
          <HeroPick ids={alive(s)} action="rollhero" />
        </>
      );
    } else if (s.pending.helper === null) {
      body = (
        <>
          <h2>Hjælp?</h2>
          <p className="prose">Vil en anden helt hjælpe {HEROES[s.pending.hero].name}? Så slår I 2 terninger og bruger den højeste.</p>
          <HeroPick ids={alive(s).filter((id) => id !== s.pending?.hero)} action="helper" />
          <Choices options={[{ label: "Ingen hjælper", action: "helper:none" }]} />
        </>
      );
    } else {
      body = (
        <>
          <h2>{s.pending.helper === "none" ? "Slå terningen" : "Slå to terninger"}</h2>
          <p className="prose">{HEROES[s.pending.hero].name} handler. {s.pending.helper === "none" ? "Én terning." : "Den højeste tæller."}</p>
          <Dice action="roll" two={s.pending.helper !== "none"} />
        </>
      );
    }
  } else if (s.screen === "card") {
    body = (
      <>
        <h2>Vend et kort</h2>
        <p className="prose">Træk det øverste kort — eller vælg den kulør, I lige vendte.</p>
        <div className="btn-row">
          <button
            className="btn-gold"
            onClick={() => {
              const suits = ["heart", "diamond", "club", "spade"];
              s.dispatch(`card:${suits[Math.floor(Math.random() * 4)]}`);
            }}
          >
            <BookOpen size={18} />
            Træk et kort
          </button>
        </div>
        <div className="suit-row">
          <button className="suit-btn red" onClick={() => s.dispatch("card:heart")}>♥<small>Hjerter</small></button>
          <button className="suit-btn red" onClick={() => s.dispatch("card:diamond")}>♦<small>Ruder</small></button>
          <button className="suit-btn" onClick={() => s.dispatch("card:club")}>♣<small>Klør</small></button>
          <button className="suit-btn" onClick={() => s.dispatch("card:spade")}>♠<small>Spar</small></button>
        </div>
      </>
    );
  } else if (s.screen === "dark" || s.screen === "cardheal" || s.screen === "heal" || s.screen === "sparkheal") {
    const titles = {
      dark: "Noget i mørket",
      cardheal: "Det blå lys",
      heal: "Helende lys",
      sparkheal: "Lysgnisten",
    };
    const ids =
      s.screen === "dark" ? alive(s) : s.selected.filter((id) => (s.hp[id] ?? 0) < 4);
    body = (
      <>
        <h2>{titles[s.screen]}</h2>
        <p className="prose">
          {s.screen === "dark"
            ? "Et monster kravler ned ad væggen. Vælg en helt, der mister 1 liv."
            : s.story || "Vælg en helt."}
        </p>
        <HeroPick ids={ids} action="target" allowDown />
        {s.screen !== "dark" && s.screen !== "cardheal" ? (
          <Choices options={[{ label: "Fortryd", action: "cancel_target" }]} />
        ) : null}
      </>
    );
  } else if (s.screen === "combat") {
    body = (
      <>
        <h2>Kamp mod askevagten</h2>
        <Combat />
      </>
    );
  } else if (s.screen === "ending") {
    body = (
      <>
        <h2>{s.title}</h2>
        <p className="prose">{shortOf(s)}</p>
        {s.showFull ? null : (
          <button className="text-btn" onClick={() => s.dispatch("more")}>
            Læs hele teksten
          </button>
        )}
        {s.showFull ? <div className="full">{s.story}</div> : null}
        <ul className="sum">
          <li>{s.flags.rav ? "Sir Rav er fri og skylder jer en tjeneste." : "Sir Rav blev ved porten."}</li>
          <li>{s.flags.sealed ? "Revnen er forseglet." : "Revnen står stadig åben."}</li>
          <li>En glød er stjålet fra borgens flamme.</li>
          {s.flags.tegn ? <li>I bærer Vogterens tegn.</li> : null}
        </ul>
        <p className="prose">Vælg en ny evne til hver helt. Næste eventyr er endnu ikke bygget.</p>
        {(s.selected as HeroId[]).map((id) => (
          <div key={id} className="stack">
            <strong>{HEROES[id].name}</strong>
            {UPGRADES[id].map((label, i) => (
              <button key={label} className={s.upgrades[id] === i ? "choice main" : "choice"} onClick={() => s.dispatch(`upgrade:${id},${i}`)}>
                <Sun size={18} />
                <span>{s.upgrades[id] === i ? `Valgt: ${label}` : label}</span>
              </button>
            ))}
          </div>
        ))}
        <Choices options={[{ label: "Spil eventyret igen", action: "again" }]} />
      </>
    );
  } else if (s.screen === "lost") {
    body = (
      <>
        <h2>{s.title}</h2>
        <p className="prose">{shortOf(s)}</p>
        <Choices options={[{ label: "Prøv igen", action: "retry" }, { label: "Vælg nye helte", action: "setup" }]} />
      </>
    );
  }

  const spark =
    s.flags.spark && (s.screen === "story" || s.screen === "combat") ? (
      <Choices options={[{ label: "Brug lysgnisten", action: "spark", detail: "Giv en helt 1 liv." }]} />
    ) : null;

  return (
    <section className="dock">
      <Status />
      {body}
      {spark}
    </section>
  );
}

function Combat() {
  const s = useGame();
  if (s.phase === "choose") {
    return (
      <>
        <p className="prose">Runde {s.flags.round}. Askevagten har {s.enemy} liv tilbage. Hvem handler nu?</p>
        <HeroPick ids={alive(s).filter((id) => !s.acted.includes(id))} action="fighter" />
        {s.flags.round > 1 ? <Choices options={[{ label: "Stop kampen og tal", action: "peace" }]} /> : null}
      </>
    );
  }
  if (s.phase === "action" && s.pending?.hero) {
    const id = s.pending.hero;
    const opts: Option[] = [ { label: "Angrib", action: "attack", detail: "Slå terningen." }];
    if (!s.used[id] && id === "mage") opts.push({ label: "Ildstorm", action: "mage", detail: "2 skade, ingen terning." });
    if (!s.used[id] && id === "priest" && s.selected.some((x) => (s.hp[x] ?? 0) < 4)) {
      opts.push({ label: "Helende lys", action: "priest", detail: "2 liv til én helt." });
    }
    if (s.selected.some((x) => (s.hp[x] ?? 0) === 0)) opts.push({ label: "Hjælp en falden helt op", action: "revive" });
    opts.push({ label: "Vælg en anden helt", action: "fight_back" });
    return (
      <>
        <p className="prose">Hvad gør {HEROES[id].name}?</p>
        <Choices options={opts} />
      </>
    );
  }
  if (s.phase === "attackhelper" && s.pending?.hero) {
    return (
      <>
        <p className="prose">{HEROES[s.pending.hero].name} angriber. Vil en anden helt hjælpe med en ekstra terning?</p>
        <HeroPick ids={alive(s).filter((id) => id !== s.pending?.hero && !s.acted.includes(id))} action="fighthelp" />
        <Choices options={[{ label: "Angrib uden hjælp", action: "fighthelp:none" }]} />
      </>
    );
  }
  if (s.phase === "attackroll") {
    return (
      <>
        <p className="prose">{s.pending?.helper && s.pending.helper !== "none" ? "Slå 2 terninger og brug den højeste." : "Slå terningen."}</p>
        <Dice action="attackroll" two={!!s.pending?.helper && s.pending.helper !== "none"} />
      </>
    );
  }
  if (s.phase === "revive") {
    return (
      <>
        <p className="prose">Hvem skal hjælpes op?</p>
        <HeroPick ids={s.selected.filter((id) => (s.hp[id] ?? 0) === 0)} action="revive" allowDown />
        <Choices options={[{ label: "Tilbage", action: "fight_action" }]} />
      </>
    );
  }
  if (s.phase === "enemy") {
    return (
      <>
        <p className="prose">Vagten slår igen. Hvem bliver ramt?</p>
        <HeroPick ids={alive(s)} action="enemy" />
        {s.selected.includes("warrior") && (s.hp.warrior ?? 0) > 0 && !s.used.warrior ? (
          <Choices options={[{ label: "Warrior bruger Skjoldmur", action: "shield", detail: "Ingen bliver ramt." }]} />
        ) : null}
      </>
    );
  }
  return null;
}
