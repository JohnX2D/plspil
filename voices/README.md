# Fortællerstemme til Skyggeborgen

Knappen **Fortæl** afspiller den aktuelle tekst med en ElevenLabs-stemme, afsnit for afsnit. Mangler et afsnit, bruges browserens danske oplæsningsstemme til hele teksten.

Lyden ligger i `voices/skyggeborgen.json` (ét klip pr. afsnit, gemt som base64) og laves med `voices/lav_stemmer.py`, på samme måde som i nytårsquizzen.

## Lav eller opdater stemmerne

Kør fra repoets rodmappe:

```bash
python3 voices/lav_stemmer.py --liste
python3 voices/lav_stemmer.py
```

- `--liste` viser alle afsnit og antal tegn uden at kalde ElevenLabs (ca. 5.100 tegn i alt).
- Kun nye eller ændrede afsnit indtales, så en rettelse i en tekst koster næsten ingen tegn.
- Stemme, model, sprog og lydformat står i `voices/indstillinger.json`. Skiftes stemme eller model, indtales alt forfra.
- Ord, der udtales forkert, rettes i `voices/udtale.json`. Det ændrer kun oplæsningen, ikke teksten i spillet.

## Nøglen

Nøglen læses fra miljøvariablen `ELEVENLABS_API_KEY` eller fra en linje `ELEVENLABS_API_KEY=...` i `.env.local` i repoets rodmappe. `.env.local` er udelukket i `.gitignore` og må aldrig committes.

I en Claude-cloudsession, hvor ElevenLabs-nøglen er lagt ind i cloud-miljøet, sætter netværksproxyen nøglen på kaldene til ElevenLabs. Så kan variablen bare være en pladsholder, og scriptet kan køres direkte i sessionen.
