# LDA Spil

Pointtavlen med de fem små spil ligger i `index.html`. Galaxy Raceway (racerbrætspil tegnet som et bræt set oppefra i SVG, ingen eksterne biblioteker) ligger i `galaxy.html` og åbnes via et link i spilmenuen. Skyggeborgen (samarbejdseventyr med terninger og kort, fortællerstemme i `voices/`) ligger i `skyggeborgen.html`. Det hele bruges via claude.ai, ikke GitHub Pages.

## Siden familien spiller på

https://claude.ai/artifact/T1E9hpzt6rFakHDsFKmpSH

Hver gang der pushes til `main` på GitHub, skal denne artifact også opdateres med den nye `index.html` (Artifact-værktøjet: publish med `url` sat til linket ovenfor, så linket bevares). `galaxy.html`, `skyggeborgen.html` og `assets/skyggeborgen.jpg` skal med som ekstra filer i samme publicering (`files: {"galaxy.html": "galaxy.html", "skyggeborgen.html": "skyggeborgen.html", "assets/skyggeborgen.jpg": "assets/skyggeborgen.jpg"}`), ellers virker linkene fra menuen ikke. Findes `voices/skyggeborgen.json` (fortællerstemmen fra ElevenLabs), skal den også med som `"voices/skyggeborgen.json": "voices/skyggeborgen.json"`. Stemmerne laves med `voices/lav_stemmer.py`; se `voices/README.md`. Tjek bagefter, at den publicerede side har samme indhold og versionsnummer som `index.html` i repoet.

## Versionsnummer

Versionsnummeret står nederst på siden i `index.html` (`<footer class="ver">`). Tæl det altid op, når spillet ændres, i samme commit som ændringen:

- **x.Y** (fx 1.0 → 1.1): rettelser, små justeringer, visuelle detaljer, tekster.
- **X.0** (fx 1.4 → 2.0): større ændringer, fx et nyt spil, nye eller ændrede regler, eller et stort visuelt løft.

Nævn den nye version i commit-beskeden.

Samme versionsnummer står også i `galaxy.html` (`<div class="ver">` i regel-vinduet). Hold de to ens.
