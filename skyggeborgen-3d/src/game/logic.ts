export type HeroId = "warrior" | "mage" | "priest" | "hunter";

export type Screen =
  | "intro"
  | "setup"
  | "story"
  | "roll"
  | "card"
  | "combat"
  | "map"
  | "ending"
  | "lost"
  | "dark"
  | "cardheal"
  | "heal"
  | "sparkheal";

export type PlaceId =
  | "mira"
  | "port"
  | "vej"
  | "taarn"
  | "kapel"
  | "vagt"
  | "elias"
  | "slut"
  | "baal";

export type Option = { label: string; action: string; detail?: string };

export type Fx = {
  t: "slash" | "fire" | "heal" | "hurt" | "lunge" | "shield" | "sparks" | "seal" | "txt";
  who?: string;
  actor?: string;
  txt?: string;
  c?: string;
  d?: number;
};

export type Flags = {
  promise?: boolean;
  rav?: boolean;
  ravWords?: boolean;
  route?: string;
  segl?: boolean;
  ed?: boolean;
  spark?: boolean;
  darkEncounter?: boolean;
  guard?: "skånet" | "kamp" | "besejret";
  sealed?: boolean;
  elias?: "døren" | "bålet";
  tegn?: boolean;
  visionText?: string;
  round: number;
};

export type Pending = {
  type?: "rav" | "talk" | "seal";
  hero: HeroId | null;
  helper: HeroId | "none" | null;
};

export type GameData = {
  screen: Screen;
  selected: HeroId[];
  hp: Partial<Record<HeroId, number>>;
  used: Partial<Record<HeroId, boolean>>;
  dark: number;
  flags: Flags;
  chapter: number;
  story: string;
  title: string;
  options: Option[];
  phase: string;
  pending: Pending | null;
  enemy: number;
  acted: HeroId[];
  place: PlaceId;
  mapAt: number;
  mapNext: string;
  returnScreen: Screen;
  upgrades: Partial<Record<HeroId, number>>;
  showFull: boolean;
  audioOn: boolean;
  charging: boolean;
  fx: Fx[] | null;
  fxSeq: number;
  sfx: "" | "bell" | "hit";
};

export const HEROES: Record<
  HeroId,
  { name: string; title: string; desc: string; ability: string }
> = {
  warrior: {
    name: "Warrior",
    title: "Vogteren",
    desc: "Beskyt en helt mod ét angreb.",
    ability: "Skjoldmur",
  },
  mage: {
    name: "Mage",
    title: "Flammens mester",
    desc: "Giv fjenden 2 skade.",
    ability: "Ildstorm",
  },
  priest: {
    name: "Priest",
    title: "Lysets vogter",
    desc: "Giv en helt 2 liv tilbage.",
    ability: "Helende lys",
  },
  hunter: {
    name: "Demon Hunter",
    title: "Skyggenes jæger",
    desc: "Afslør faren før et valg.",
    ability: "Dæmonblik",
  },
};

export const ALL_HEROES: HeroId[] = ["warrior", "mage", "priest", "hunter"];

export const UPGRADES: Record<HeroId, [string, string]> = {
  warrior: ["Skjoldmur: Beskyt én helt", "Modstød: Beskyt en anden og gør skade"],
  mage: ["Ildstorm: 2 skade", "Værneild: Beskyt én helt"],
  priest: ["Helende lys: 2 liv til én", "Fælles lys: 1 liv til to"],
  hunter: ["Dæmonblik: Afslør en fare", "Jægerens mærke: 2 skade"],
};

export const NODES: { id: string; name: string; mark: string }[] = [
  { id: "mira", name: "Landsbyen", mark: "I" },
  { id: "port", name: "Porten", mark: "II" },
  { id: "vej", name: "Salen", mark: "III" },
  { id: "rute", name: "Tårn eller kapel", mark: "IV" },
  { id: "vagt", name: "Vagten", mark: "V" },
  { id: "elias", name: "Elias", mark: "VI" },
  { id: "slut", name: "Solopgang", mark: "VII" },
];

const NODE_INDEX: Record<string, number> = {
  mira: 0,
  port: 1,
  vej: 2,
  taarn: 3,
  kapel: 3,
  vagt: 4,
  elias: 5,
  slut: 6,
};

export const SHORT: Record<string, string> = {
  "Pigen i regnen":
    "En pige med en rusten nøgle venter i regnen. Klokken på borgen har kaldt hendes navn.",
  "Ridderen ved porten":
    "En ridder sidder lænket ved borgens port. Han ville også nå frem til klokken.",
  "To veje gennem mørket":
    "Trappen fører op til klokken. Til højre lyser et glemt kapel. KLANG!",
  Klokketårnet: "Den kæmpe klokke hænger stille, men væggene ryster, når den ringer.",
  "Det glemte kapel": "Et blåt lys brænder ved alteret. Noget lille bevæger sig i skyggen.",
  "Vagten under klokken": "En vagt af aske spærrer døren. Bag den råber en stemme om hjælp.",
  "Stemmen bag døren":
    "Elias holder en revne lukket med blåt lys. Nogen har stjålet en glød fra flammen.",
  "Klokken er stille":
    "Klokken er stille, og solen står op. Men Mira ser et rødt lys mellem træerne …",
  "Noget i mørket": "Noget med alt for mange ben kravler ned ad væggen!",
  "Tilbage ved bålet": "I vågner ved bålet. Borgen står der endnu, men I kan prøve igen.",
  "Et navn i mørket": "Mira fortæller om klokkemanden Elias, som passede lyset.",
  "Den rustne nøgle": "En lille klokke er ridset ind i nøglens metal.",
  "Et løfte": "Mira smiler. Så ringer klokken, selv om hun er vågen.",
  "Kæden brister": "Sir Rav er fri. Hvis mørket finder jer, så kald hans navn.",
  "Ridderens ord": "Flammen er ikke jeres fjende. Sig det til anføreren.",
  "Gennem porten": "Rav bliver ved porten. Han forsøgte at nå klokken.",
  "Vagten hæver sværdet": "Samtalen slår fejl. Mørket vokser, og kampen begynder.",
  "Vagten tøver": "Han tøver, men I har intet tegn, der kan berolige ham.",
  "Vagten lytter": "Askevagten sænker sværdet og lader jer tale med stemmen.",
  "Vagten husker": "Eden vender tilbage. Sværdet synker mod gulvet.",
  "Vagten falder": "Gløden i hans bryst slukkes. Han skulle bare holde døren lukket.",
  "Et fund i mørket": "Kortet viser jer noget i mørket under klokken.",
  "Det blå lys": "Forseglingen svarer. Elias beder jer finde den stjålne glød.",
  "Elias følger med": "I tager Elias med. Revnen står stadig åben.",
  "Et løfte i mørket": "Elias bliver ved revnen. I skal finde den, der tog gløden.",
};

const PLACES = new Set(["mira", "port", "vej", "taarn", "kapel", "vagt", "elias"]);

export function initial(): GameData {
  return {
    screen: "intro",
    selected: [],
    hp: {},
    used: {},
    dark: 0,
    flags: { round: 1 },
    chapter: 0,
    story: "",
    title: "",
    options: [],
    phase: "",
    pending: null,
    enemy: 0,
    acted: [],
    place: "mira",
    mapAt: 0,
    mapNext: "",
    returnScreen: "story",
    upgrades: {},
    showFull: false,
    audioOn: false,
    charging: false,
    fx: null,
    fxSeq: 0,
    sfx: "",
  };
}

export function visualPlace(screen: Screen, place: PlaceId): PlaceId {
  if (screen === "ending") return "slut";
  if (screen === "lost") return "baal";
  if (screen === "intro" || screen === "setup") return "mira";
  if (screen === "combat" || screen === "dark") return "vagt";
  return place;
}

export function alive(s: GameData): HeroId[] {
  return s.selected.filter((id) => (s.hp[id] ?? 0) > 0);
}

export function shortOf(s: GameData): string {
  if (SHORT[s.title]) return SHORT[s.title];
  return s.story.replace(/\n/g, " ").slice(0, 180);
}

export function narrateText(s: GameData): string {
  if (s.screen === "intro") {
    return "Skyggeborgen. Den tavse klokke. En gammel klokke ringer i mørket. En flamme er ved at dø. Og nogen venter på jer bag borgens mure.";
  }
  if (s.screen === "setup") return "Vælg to til fire helte. I vinder eller taber sammen.";
  if (s.screen === "combat") return `Kamp mod askevagten. Runde ${s.flags.round}.`;
  if (s.screen === "card") return "Vend det øverste kort i bunken. Hvilken kulør er det?";
  if (s.screen === "roll") return "Slå terningen. Et lavt slag koster. Et højt slag lykkes.";
  if (s.screen === "map") return "I går videre gennem Skyggeborgen.";
  return s.story || "Skyggeborgen. Den tavse klokke.";
}

function clamp(n: number) {
  return Math.max(0, Math.min(4, n));
}

function op(label: string, action: string, detail = ""): Option {
  return detail ? { label, action, detail } : { label, action };
}

function setFx(s: GameData, list: Fx[]) {
  s.fx = list;
  s.fxSeq += 1;
}

function damage(s: GameData, id: HeroId, n = 1) {
  s.hp[id] = clamp((s.hp[id] ?? 0) - n);
}

function heal(s: GameData, id: HeroId, n = 1) {
  s.hp[id] = clamp((s.hp[id] ?? 0) + n);
}

function story(s: GameData, title: string, text: string, choices: Option[], chapter: number) {
  s.showFull = false;
  s.flags.visionText = "";
  s.screen = "story";
  s.title = title;
  s.story = text;
  s.options = choices;
  s.chapter = chapter;
  s.phase = "story";
  s.charging = false;
  if (title.includes("klokke") || title.includes("porten")) s.sfx = "bell";
}

function result(s: GameData, title: string, text: string, next = "port") {
  story(s, title, text, [op("Fortsæt", next)], s.chapter);
}

function scene(s: GameData, id: string) {
  s.pending = null;
  s.charging = false;
  if (PLACES.has(id)) s.place = id as PlaceId;
  switch (id) {
    case "mira":
      story(
        s,
        "Pigen i regnen",
        "Regnen trommer mod jeres kapper, da I når frem til landsbyen. Alle vinduer er mørke. Alle undtagen ét.\nI døråbningen står en pige med en alt for stor frakke. Hun holder en rusten nøgle så hårdt, at hendes knoer er blevet hvide.\n“Klokken ringede igen i nat,” hvisker hun. “Den sidste gang … kaldte den mit navn.”\nHun rækker jer nøglen. “Vil I finde ud af, hvem der ringer?”",
        [
          op("Spørg, hvad hun ved om klokken", "mira_klokke"),
          op("Spørg til nøglen", "mira_nogle"),
          op("Lov hende, at I vil hjælpe", "mira_lov"),
        ],
        1,
      );
      break;
    case "port":
      story(
        s,
        "Ridderen ved porten",
        "Borgens port er lukket. Ved siden af den hænger en mindre dør skævt i sine hængsler.\nEn ridder sidder lænket til muren. Hans rustning er revnet, og hans hjelm er tom. Da I nærmer jer, løfter han langsomt hovedet.\n“Mit navn er Sir Rav. Jeg forsøgte at nå frem til klokken. Borgens egne vagter lænkede mig fast.”",
        [
          op("Befri Sir Rav", "rav_roll", "Et lavt slag larmer og kan koste liv."),
          op("Spørg, hvem der lænkede ham fast", "rav_ord"),
          op("Gå ind i borgen", "rav_ga"),
        ],
        2,
      );
      break;
    case "vej":
      story(
        s,
        "To veje gennem mørket",
        "I står i en rund sal. Vand drypper fra loftet, og jeres lys får skyggerne til at strække sig hen over gulvet.\nTil venstre fører en trappe op til klokken. Til højre skinner et svagt, blåt lys fra et glemt kapel.\nKLANG.\nFra dybet under jer svarer en anden lyd. Bank. Bank. Bank.",
        [op("Gå op i klokketårnet", "taarn"), op("Undersøg det glemte kapel", "kapel")],
        3,
      );
      break;
    case "taarn":
      s.flags.route = "Klokketårnet";
      story(
        s,
        "Klokketårnet",
        "Trappen snor sig opad. Øverst hænger en enorm klokke. Den står fuldstændig stille.\nAlligevel ryster væggene, da den ringer.\nPå gulvet ligger en lille hammer. Ved siden af den er der ridset en flamme over en lukket dør. Flammen beskytter noget bag døren.",
        [op("Undersøg hammeren", "card"), op("Følg rebet nedad", "vagt")],
        3,
      );
      break;
    case "kapel":
      s.flags.route = "Det glemte kapel";
      story(
        s,
        "Det glemte kapel",
        "Kapellet er fyldt med væltede bænke. Foran alteret brænder ét enkelt blåt lys.\nI væggen bag alteret er der hugget en flamme over en lukket dør. Under billedet står: “Så længe ilden lever, holder døren.”\nLyset blafrer. En lille skygge bevæger sig under alteret.",
        [op("Undersøg skyggen", "card"), op("Følg trappen bag alteret", "vagt")],
        3,
      );
      break;
    case "vagt":
      if (s.dark >= 2 && !s.flags.darkEncounter) {
        s.flags.darkEncounter = true;
        s.screen = "dark";
        s.title = "Noget i mørket";
        s.story =
          "Noget kravler ned ad væggen. I ser det kun et øjeblik — for mange ben, for lange skygger.\nAskevagten vender sig og jager det væk. “Selv nu beskytter jeg jer,” siger han.\nVælg en helt, der mister 1 liv. Den sidste stående helt kan ikke slås ud her.";
        s.charging = false;
        return;
      }
      vagt(s);
      break;
    case "elias":
      story(
        s,
        "Stemmen bag døren",
        "Den rustne nøgle passer i låsen. Døren åbner med en lang, dyb lyd.\nPå den anden side sidder en gammel mand ved en revne i gulvet. Et blåt lys strømmer fra hans hænder ned i stenen.\n“Jeg hedder Elias. Jeg ringede med klokken for at få hjælp. En skygge er fanget under borgen, men nogen har taget en glød fra flammen.”\nHans hænder ryster. “Jeg ved ikke, hvor længe jeg kan holde revnen lukket.”",
        [
          op("Hjælp Elias med at forsegle revnen", "seal_roll", "Det lykkes, men et lavt slag koster liv."),
          op("Tag Elias med til bålet", "elias_baal", "Revnen står åben."),
          op("Lad Elias blive og find gløden", "elias_bliv", "Revnen står åben."),
        ],
        5,
      );
      break;
    case "slut":
      finish(s);
      break;
    case "tabt":
      s.screen = "lost";
      s.title = "Tilbage ved bålet";
      s.story =
        "I åbner øjnene ved Det Sidste Bål. Jeres kapper er våde, og ilden er næsten gået ud. Men under asken findes stadig en lille glød.\nBorgen står der endnu. Og klokken er ikke blevet stille.";
      s.options = [];
      s.charging = false;
      break;
    default:
      break;
  }
}

function vagt(s: GameData) {
  const opts: Option[] = [op("Tal med vagten", "talk_roll", "Et lavt slag kan starte en kamp.")];
  if (s.flags.segl) opts.push(op("Vis Flammeseglet", "vagt_fred"));
  if (s.flags.ravWords || s.flags.ed) opts.push(op("Fortæl ham om hans ed", "vagt_fred"));
  opts.push(op("Gå til angreb", "fight"));
  story(
    s,
    "Vagten under klokken",
    "Trappen fører jer ned under borgen. Foran en stendør står en vagt i rustning. Aske siver ud mellem pladerne, hver gang han bevæger sig.\nHan løfter sit sværd. “Ingen må åbne døren.”\nFra den anden side lyder en svag stemme: “Vent … der er nogen herude!”",
    opts,
    4,
  );
}

function defeated(s: GameData) {
  if (!alive(s).length) {
    scene(s, "tabt");
    return true;
  }
  return false;
}

function goTo(s: GameData, id: string) {
  const i = NODE_INDEX[id];
  if (i !== undefined && i > (s.mapAt || 0)) {
    s.screen = "map";
    s.mapNext = id;
    s.charging = false;
    s.pending = null;
    return;
  }
  scene(s, id);
}

function beginRoll(s: GameData, type: "rav" | "talk" | "seal") {
  s.screen = "roll";
  s.pending = { type, hero: null, helper: null };
  s.phase = "choose";
  s.charging = false;
}

function resolveRoll(s: GameData, n: number) {
  const p = s.pending;
  if (!p?.hero || !p.type) return;
  const hero = p.hero;
  let title = "";
  let text = "";
  let next = "";
  if (p.type === "rav") {
    s.flags.rav = true;
    const list: Fx[] = [{ t: "sparks", who: "foe" }];
    if (n <= 2) {
      list.push({ t: "hurt", who: hero, d: 0.3 }, { t: "txt", who: hero, txt: "−1", d: 0.3 });
      damage(s, hero);
    }
    if (n <= 4) s.dark = clamp(s.dark + 1);
    setFx(s, list);
    title = "Kæden brister";
    text =
      n <= 2
        ? "Kæden brister med et øredøvende brag. Larmen vækker mørket, og slaget sårer helten."
        : n <= 4
          ? "Kæden brister, men støjen vækker mørket."
          : "Kæden løsnes stille.";
    text += "\nRidderen rejser sig. “Jeg skylder jer en tjeneste. Hvis mørket finder jer, så kald mit navn.”";
    next = "vej";
  } else if (p.type === "talk") {
    if (n <= 2) {
      s.dark = clamp(s.dark + 1);
      s.pending = null;
      if (defeated(s)) return;
      result(s, "Vagten hæver sværdet", "Vagten tror, I vil bryde ind. Mørket vokser.", "fight");
      return;
    }
    if (n <= 4 && !s.flags.segl && !s.flags.ravWords && !s.flags.ed) {
      s.pending = null;
      result(
        s,
        "Vagten tøver",
        "Han tøver, men I har intet tegn eller ord, der kan overbevise ham. Han hæver sværdet.",
        "fight",
      );
      return;
    }
    title = "Vagten lytter";
    text =
      n <= 4
        ? "Vagten tøver. I viser ham det, I har lært, og langsomt sænker han sværdet."
        : "Vagten sænker sværdet. “Tal da med stemmen,” siger han.";
    s.flags.guard = "skånet";
    next = "elias";
  } else {
    s.flags.sealed = true;
    s.flags.elias = "døren";
    const list: Fx[] = [{ t: "seal" }];
    if (n <= 2) {
      damage(s, hero);
      list.push({ t: "hurt", who: hero, d: 0.3 }, { t: "txt", who: hero, txt: "−1", d: 0.3 });
    }
    if (n >= 5) s.flags.tegn = true;
    setFx(s, list);
    title = "Det blå lys";
    text =
      n <= 2
        ? "Forseglingen holder, men en kold kraft rammer helten for 1 liv."
        : n <= 4
          ? "Det blå lys breder sig gennem sprækkerne. Bankelyden bliver svagere."
          : "Forseglingen lyser klart. Elias giver jer Vogterens tegn som tak.";
    text += "\n“Jeg bliver her og holder øje. Find den stjålne glød.”";
    next = "slut";
  }
  s.pending = null;
  if (defeated(s)) return;
  result(s, title, text, next);
}

function cardResult(s: GameData, suit: string) {
  if (suit === "heart") {
    const hurt = s.selected.filter((x) => (s.hp[x] ?? 0) < 4);
    if (hurt.length) {
      s.screen = "cardheal";
      s.story = "Et varmt, blåt lys samler sig om jeres hænder. Vælg en helt, som får 1 liv tilbage.";
      s.charging = false;
      return;
    }
    s.flags.spark = true;
    result(
      s,
      "Et fund i mørket",
      "Et varmt, blåt lys samler sig til en lysgnist. I kan bruge den til at give en helt 1 liv.",
      "vagt",
    );
    return;
  }
  if (suit === "diamond") {
    s.flags.segl = true;
    result(s, "Et fund i mørket", "I finder et lille sølvsegl med en flamme. Måske genkender nogen det.", "vagt");
    return;
  }
  if (suit === "club") {
    s.flags.ed = true;
    result(
      s,
      "Et fund i mørket",
      "En hviskende stemme siger: “Vagten glemte sin ed, men ikke sit hjerte.”",
      "vagt",
    );
    return;
  }
  s.dark = clamp(s.dark + 1);
  result(s, "Et fund i mørket", "Noget sort glider ud af synsfeltet. Alle lys blafrer. Mørket vokser.", "vagt");
}

function combat(s: GameData) {
  s.screen = "combat";
  s.enemy = s.selected.length;
  s.acted = [];
  s.flags.round = 1;
  s.flags.guard = "kamp";
  s.phase = "choose";
  s.pending = null;
  s.place = "vagt";
  s.charging = false;
}

function afterAction(s: GameData) {
  if (s.enemy <= 0) {
    s.flags.guard = "besejret";
    result(
      s,
      "Vagten falder",
      "Vagten falder på knæ. Gløden i hans bryst slukkes langsomt. “Jeg skulle … bare holde den lukket,” hvisker han.",
      "elias",
    );
    return;
  }
  if (defeated(s)) return;
  const living = alive(s);
  if (living.every((x) => s.acted.includes(x))) {
    s.phase = "enemy";
    s.pending = null;
  } else {
    s.phase = "choose";
    s.pending = null;
  }
  s.screen = "combat";
}

function finish(s: GameData) {
  const campaign = {
    rav: !!s.flags.rav,
    ravWords: !!s.flags.ravWords,
    guard: s.flags.guard || "skånet",
    sealed: !!s.flags.sealed,
    elias: s.flags.elias || "døren",
    tegn: !!s.flags.tegn,
    route: s.flags.route,
    heroes: s.selected,
    items: [s.flags.spark ? "Lysgnist" : null, s.flags.segl ? "Flammeseglet" : null].filter(Boolean),
    completed: true,
    upgrades: s.upgrades,
  };
  try {
    localStorage.setItem("skyggeborgen-kampagne", JSON.stringify(campaign));
  } catch {
    /* ignore quota */
  }
  s.screen = "ending";
  s.place = "slut";
  s.title = "Klokken er stille";
  s.story =
    "Da I kommer ud af borgen, er regnen holdt op. Langt væk i landsbyen står Mira og venter.\nSå ser I et lille, rødt lys bevæge sig mellem træerne. Det ligner en lanterne.\nMira stivner. “Åh nej,” hvisker hun. “Den fandt han.”";
  s.chapter = 5;
  s.options = [];
  s.charging = false;
  s.sfx = "bell";
}

function isHero(v: string): v is HeroId {
  return (ALL_HEROES as string[]).includes(v);
}

export function reduce(prev: GameData, action: string, value = ""): GameData {
  const s: GameData = {
    ...prev,
    selected: [...prev.selected],
    hp: { ...prev.hp },
    used: { ...prev.used },
    flags: { ...prev.flags },
    options: prev.options.map((o) => ({ ...o })),
    pending: prev.pending ? { ...prev.pending } : null,
    acted: [...prev.acted],
    upgrades: { ...prev.upgrades },
    fx: null,
    sfx: "",
  };

  const a = action;
  const v = value;

  if (["mira", "port", "vej", "taarn", "kapel", "vagt", "elias", "slut"].includes(a)) {
    goTo(s, a);
    return s;
  }

  switch (a) {
    case "setup": {
      const audioOn = s.audioOn;
      const fresh = initial();
      fresh.audioOn = audioOn;
      fresh.screen = "setup";
      return fresh;
    }
    case "select": {
      if (!isHero(v)) return s;
      if (s.selected.includes(v)) s.selected = s.selected.filter((x) => x !== v);
      else if (s.selected.length < 4) s.selected.push(v);
      return s;
    }
    case "start": {
      if (s.selected.length < 2) return s;
      s.selected.forEach((id) => {
        s.hp[id] = 4;
        s.used[id] = false;
      });
      s.mapAt = 0;
      scene(s, "mira");
      return s;
    }
    case "mira_klokke":
      result(
        s,
        "Et navn i mørket",
        "“Den gamle klokkemand hed Elias,” siger Mira. “Han passede klokken, dengang borgen stadig havde lys.”",
      );
      return s;
    case "mira_nogle":
      result(
        s,
        "Den rustne nøgle",
        "Der er en lille klokke ridset ind i metallet. “Far sagde, at nøglen nok tilhører borgen,” siger Mira.",
      );
      return s;
    case "mira_lov":
      s.flags.promise = true;
      result(
        s,
        "Et løfte",
        "Mira smiler et øjeblik. Så høres et dybt KLANG fra borgen. “Den plejer ikke at ringe, når jeg er vågen.”",
      );
      return s;
    case "rav_roll":
      beginRoll(s, "rav");
      return s;
    case "rav_ord":
      s.flags.ravWords = true;
      result(
        s,
        "Ridderens ord",
        "“Borgens egne vagter lænkede mig fast,” siger Rav. “Hvis I møder deres anfører, så sig: Flammen er ikke jeres fjende.”",
        "vej",
      );
      return s;
    case "rav_ga":
      result(
        s,
        "Gennem porten",
        "Bag jer rasler lænkerne. “Hvis I finder klokkemanden,” kalder ridderen, “så sig, at jeg forsøgte.”",
        "vej",
      );
      return s;
    case "go":
      s.mapAt = NODE_INDEX[v] ?? s.mapAt;
      scene(s, v);
      return s;
    case "more":
      s.showFull = !s.showFull;
      s.fx = prev.fx;
      return s;
    case "card":
      if (v) cardResult(s, v);
      else {
        s.screen = "card";
        s.charging = false;
      }
      return s;
    case "rollhero":
      if (s.pending && isHero(v)) s.pending.hero = v;
      s.charging = false;
      return s;
    case "helper":
      if (s.pending && (v === "none" || isHero(v))) s.pending.helper = v === "none" ? "none" : v;
      s.charging = false;
      return s;
    case "charge":
      s.charging = true;
      return s;
    case "roll":
      s.charging = false;
      resolveRoll(s, Number(v));
      return s;
    case "vagt_fred":
      s.flags.guard = "skånet";
      result(
        s,
        "Vagten husker",
        "Vagten står helt stille. Så synker hans sværd langsomt mod gulvet. “Jeg husker en ed,” siger han.",
        "elias",
      );
      return s;
    case "talk_roll":
      beginRoll(s, "talk");
      return s;
    case "seal_roll":
      beginRoll(s, "seal");
      return s;
    case "elias_baal":
      s.flags.elias = "bålet";
      s.flags.sealed = false;
      result(
        s,
        "Elias følger med",
        "I hjælper Elias på benene. Bag jer lyder et knæk fra stenen. “Revnen er der stadig. Hvis I finder gløden, kan vi måske lukke den sammen.”",
        "slut",
      );
      return s;
    case "elias_bliv":
      s.flags.elias = "døren";
      s.flags.sealed = false;
      result(
        s,
        "Et løfte i mørket",
        "“Jeg kan holde den lidt endnu,” siger Elias. “Gå. Find den, der tog gløden.” I lukker døren forsigtigt bag jer.",
        "slut",
      );
      return s;
    case "vision":
      s.used.hunter = true;
      s.flags.visionText =
        s.title === "Ridderen ved porten"
          ? "Kæden kan larme og såre den, der bryder den."
          : s.title === "Vagten under klokken"
            ? "Samtalen kan ende i kamp; et kendt tegn eller løfte kan berolige vagten."
            : "Et sort kort vækker mørket. De andre kulører giver hjælp eller spor.";
      return s;
    case "fight":
      combat(s);
      return s;
    case "fighter":
      if (isHero(v)) {
        s.pending = { hero: v, helper: null };
        s.phase = "action";
      }
      return s;
    case "fight_back":
      s.pending = null;
      s.phase = "choose";
      return s;
    case "fight_action":
      s.phase = "action";
      return s;
    case "attack":
      s.phase = "attackhelper";
      return s;
    case "fighthelp":
      if (!s.pending) return s;
      s.pending.helper = v === "none" || !isHero(v) ? "none" : v;
      if (v !== "none" && isHero(v)) s.acted.push(v);
      s.phase = "attackroll";
      s.charging = false;
      return s;
    case "attackroll": {
      const n = Number(v);
      const id = s.pending?.hero;
      if (!id) return s;
      s.acted.push(id);
      s.charging = false;
      if (n >= 3) {
        const list: Fx[] = [
          { t: "slash", who: "foe", actor: id },
          { t: "txt", who: "foe", txt: "−1" },
        ];
        s.enemy -= 1;
        s.sfx = "hit";
        if (n <= 4) {
          damage(s, id);
          list.push({ t: "hurt", who: id, d: 0.5 }, { t: "txt", who: id, txt: "−1", d: 0.5 });
        }
        setFx(s, list);
      } else {
        setFx(s, [{ t: "txt", who: "foe", txt: "Forbi", c: "#d6dde8" }]);
      }
      s.pending = null;
      afterAction(s);
      return s;
    }
    case "mage":
      setFx(s, [
        { t: "fire", actor: "mage" },
        { t: "txt", who: "foe", txt: "−2", d: 0.6 },
      ]);
      s.used.mage = true;
      s.acted.push("mage");
      s.enemy = Math.max(0, s.enemy - 2);
      s.sfx = "hit";
      s.pending = null;
      afterAction(s);
      return s;
    case "priest":
      s.screen = "heal";
      s.story = "Priest kalder på lyset. Vælg en helt, der får 2 liv tilbage.";
      return s;
    case "revive":
      if (v && isHero(v)) {
        heal(s, v);
        setFx(s, [
          { t: "heal", who: v },
          { t: "txt", who: v, txt: "+1", c: "#d7ffe4" },
        ]);
        if (s.pending?.hero) s.acted.push(s.pending.hero);
        s.pending = null;
        afterAction(s);
      } else {
        s.phase = "revive";
      }
      return s;
    case "enemy":
      if (!isHero(v)) return s;
      setFx(s, [
        { t: "lunge", actor: "guard", who: v },
        { t: "hurt", who: v, d: 0.25 },
        { t: "txt", who: v, txt: "−1", d: 0.25 },
      ]);
      damage(s, v);
      s.sfx = "hit";
      if (defeated(s)) return s;
      s.flags.round += 1;
      s.acted = [];
      s.phase = "choose";
      return s;
    case "shield":
      setFx(s, [
        { t: "lunge", actor: "guard" },
        { t: "shield", actor: "warrior" },
        { t: "txt", who: "warrior", txt: "Blokeret", c: "#d5ecff", d: 0.2 },
      ]);
      s.used.warrior = true;
      s.flags.round += 1;
      s.acted = [];
      s.phase = "choose";
      s.sfx = "hit";
      return s;
    case "peace":
      s.flags.guard = "skånet";
      result(
        s,
        "Vagten husker",
        "Vagten sænker sit sværd. “Jeg gav et løfte,” hvisker han. Han lader jer tale med stemmen bag døren.",
        "elias",
      );
      return s;
    case "target": {
      if (!isHero(v)) return s;
      if (s.screen === "dark") {
        if (!(alive(s).length === 1 && s.hp[v] === 1)) {
          damage(s, v);
          setFx(s, [
            { t: "hurt", who: v },
            { t: "txt", who: v, txt: "−1" },
          ]);
          s.sfx = "hit";
        }
        if (!defeated(s)) vagt(s);
      } else if (s.screen === "cardheal") {
        heal(s, v);
        setFx(s, [
          { t: "heal", who: v },
          { t: "txt", who: v, txt: "+1", c: "#d7ffe4" },
        ]);
        result(s, "Et fund i mørket", "Det blå lys giver helten 1 liv tilbage.", "vagt");
      } else if (s.screen === "heal") {
        heal(s, v, 2);
        setFx(s, [
          { t: "heal", who: v },
          { t: "txt", who: v, txt: "+2", c: "#d7ffe4" },
        ]);
        s.used.priest = true;
        if (s.pending?.hero) s.acted.push(s.pending.hero);
        s.pending = null;
        s.screen = "combat";
        afterAction(s);
      } else if (s.screen === "sparkheal") {
        heal(s, v);
        setFx(s, [
          { t: "heal", who: v },
          { t: "txt", who: v, txt: "+1", c: "#d7ffe4" },
        ]);
        s.flags.spark = false;
        s.screen = s.returnScreen;
      }
      return s;
    }
    case "spark":
      if (!s.selected.some((x) => (s.hp[x] ?? 0) < 4)) return s;
      s.returnScreen = s.screen;
      s.screen = "sparkheal";
      s.story = "Vælg en helt, der får 1 liv tilbage.";
      return s;
    case "cancel_target":
      s.screen = s.returnScreen || "combat";
      if (s.screen === "combat") s.phase = "action";
      return s;
    case "retry": {
      const chosen = s.selected.slice();
      const audioOn = s.audioOn;
      const fresh = initial();
      fresh.audioOn = audioOn;
      fresh.selected = chosen;
      chosen.forEach((id) => {
        fresh.hp[id] = 4;
        fresh.used[id] = false;
      });
      fresh.mapAt = 0;
      scene(fresh, "mira");
      return fresh;
    }
    case "again": {
      const audioOn = s.audioOn;
      const fresh = initial();
      fresh.audioOn = audioOn;
      fresh.screen = "setup";
      return fresh;
    }
    case "upgrade": {
      const [id, idx] = v.split(",");
      if (isHero(id)) {
        s.upgrades[id] = Number(idx);
        try {
          const raw = localStorage.getItem("skyggeborgen-kampagne");
          const c = raw ? (JSON.parse(raw) as { upgrades?: GameData["upgrades"] }) : {};
          c.upgrades = s.upgrades;
          localStorage.setItem("skyggeborgen-kampagne", JSON.stringify(c));
        } catch {
          /* ignore */
        }
      }
      return s;
    }
    default:
      return s;
  }
}

export function routeLabel(s: GameData): string {
  if (s.mapNext === "taarn" || s.flags.route === "Klokketårnet") return "klokketårnet";
  if (s.mapNext === "kapel" || s.flags.route === "Det glemte kapel") return "det glemte kapel";
  const idx = NODE_INDEX[s.mapNext];
  return NODES[idx]?.name.toLowerCase() ?? "næste sted";
}

export function canVision(s: GameData): boolean {
  const risky = ["Ridderen ved porten", "Vagten under klokken", "Klokketårnet", "Det glemte kapel"].includes(
    s.title,
  );
  return (
    risky &&
    s.selected.includes("hunter") &&
    (s.hp.hunter ?? 0) > 0 &&
    !s.used.hunter &&
    !s.flags.visionText
  );
}
