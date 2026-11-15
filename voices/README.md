# Fortællerstemme til Skyggeborgen

Læg valgfrie MP3-filer i denne mappe. Knappen **Fortæl** afspiller filen for den aktuelle scene og bruger ellers browserens danske oplæsningsstemme. Ingen API-nøgle eller forbindelse til ElevenLabs kræves af spillet. Indtal scene-teksten præcis som den vises i spillet, og gem filerne som:

- `mira.mp3` — Pigen i regnen
- `port.mp3` — Ridderen ved porten
- `veje.mp3` — To veje gennem mørket
- `taarn.mp3` — Klokketårnet
- `kapel.mp3` — Det glemte kapel
- `vagt.mp3` — Vagten under klokken
- `elias.mp3` — Stemmen bag døren
- `slut.mp3` — Klokken er stille

Mellemtekster og variable resultater læses op af browserens stemme. De faktiske tekster findes i `skyggeborgen.html`; stemmefiler medfølger ikke. Afspilning kræver et tryk på knappen.

## Lav stemmerne med ElevenLabs

`lav_stemmer.py` henter de 8 scenetekster fra `skyggeborgen.html` og laver dem til MP3 med ElevenLabs (modellen `eleven_multilingual_v2`, som kan tale dansk). Det er ca. 2.300 tegn i alt. Kør fra repoets rodmappe:

```bash
export ELEVENLABS_API_KEY="din-nøgle"
export ELEVENLABS_VOICE_ID="stemme-id"
python3 voices/lav_stemmer.py --vis
python3 voices/lav_stemmer.py
```

- `--vis` viser teksterne og antal tegn uden at kalde ElevenLabs.
- Filer, der allerede findes, springes over. `--igen port vagt` laver de nævnte scener om.
- Nøglen og stemme-id'et sættes kun i terminalen og gemmes aldrig i repoet.
- Ændres en scenetekst i spillet, så kør `--igen` for den scene, så lyden passer til teksten.
