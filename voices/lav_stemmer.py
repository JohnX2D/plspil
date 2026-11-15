#!/usr/bin/env python3
"""Laver fortællerstemmen til Skyggeborgen med ElevenLabs.

Scriptet læser de 8 scenetekster direkte fra skyggeborgen.html, så lyden
altid passer til teksten i spillet, og gemmer dem som MP3 i denne mappe.

Brug (fra repoets rodmappe):

    export ELEVENLABS_API_KEY="din-nøgle"        # findes på elevenlabs.io under API Keys
    export ELEVENLABS_VOICE_ID="stemme-id"        # id på den stemme, du har valgt i Voice Library
    python3 voices/lav_stemmer.py --vis           # vis teksterne og antal tegn, uden at kalde ElevenLabs
    python3 voices/lav_stemmer.py                 # lav de filer, der mangler
    python3 voices/lav_stemmer.py --igen port     # lav én scene om (eller flere: --igen port vagt)

Nøglen ligger kun i din terminal og skrives aldrig i en fil.
Kun Python 3's standardbibliotek bruges.
"""
import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.join(ROOT, "skyggeborgen.html")
OUT = os.path.join(ROOT, "voices")

# Samme navne som Fortæl-knappen i skyggeborgen.html leder efter.
SCENES = {
    "Pigen i regnen": "mira",
    "Ridderen ved porten": "port",
    "To veje gennem mørket": "veje",
    "Klokketårnet": "taarn",
    "Det glemte kapel": "kapel",
    "Vagten under klokken": "vagt",
    "Stemmen bag døren": "elias",
    "Klokken er stille": "slut",
}


def scene_texts():
    src = open(HTML, encoding="utf-8").read()
    found = {}
    for m in re.finditer(r"story\('([^']+)',`([^`]*)`", src):
        found[m.group(1)] = m.group(2)
    m = re.search(r"S\.title='Klokken er stille';S\.story='([^']*)'", src)
    if m:
        found["Klokken er stille"] = m.group(1)
    texts = {}
    for title, fid in SCENES.items():
        if title not in found:
            sys.exit(f"Fandt ikke scenen '{title}' i skyggeborgen.html. Er teksten blevet ændret?")
        # JavaScript-tekst: \n er linjeskift
        texts[fid] = found[title].replace("\\n", "\n")
    return texts


def tts(text, key, voice, model):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128"
    body = json.dumps({
        "text": text,
        "model_id": model,
        "voice_settings": {"stability": 0.55, "similarity_boost": 0.75, "style": 0.25},
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="POST", headers={
        "xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        msg = e.read().decode("utf-8", "replace")[:400]
        sys.exit(f"ElevenLabs svarede {e.code}: {msg}")


def main():
    ap = argparse.ArgumentParser(description="Lav fortællerstemmen til Skyggeborgen med ElevenLabs.")
    ap.add_argument("--vis", action="store_true", help="vis teksterne og antal tegn uden at kalde ElevenLabs")
    ap.add_argument("--igen", nargs="+", metavar="SCENE", help="lav disse scener om, selv om filen findes")
    ap.add_argument("--model", default="eleven_multilingual_v2", help="ElevenLabs-model (standard: eleven_multilingual_v2)")
    a = ap.parse_args()

    texts = scene_texts()
    if a.igen:
        bad = [x for x in a.igen if x not in texts]
        if bad:
            sys.exit(f"Ukendt scene: {', '.join(bad)}. Vælg blandt: {', '.join(texts)}")

    todo = [fid for fid in texts if (a.igen and fid in a.igen) or
            (not a.igen and not os.path.exists(os.path.join(OUT, fid + ".mp3")))]

    if a.vis:
        for fid, t in texts.items():
            mark = "laves" if fid in todo else "findes"
            print(f"--- {fid}.mp3 ({len(t)} tegn, {mark})\n{t}\n")
        print(f"I alt {sum(len(texts[f]) for f in todo)} tegn skal sendes til ElevenLabs.")
        return

    if not todo:
        print("Alle stemmefiler findes allerede. Brug --igen SCENE for at lave en om.")
        return
    key = os.environ.get("ELEVENLABS_API_KEY")
    voice = os.environ.get("ELEVENLABS_VOICE_ID")
    if not key or not voice:
        sys.exit("Sæt ELEVENLABS_API_KEY og ELEVENLABS_VOICE_ID i terminalen først (se toppen af scriptet).")

    for fid in todo:
        print(f"Laver {fid}.mp3 ({len(texts[fid])} tegn) …", flush=True)
        audio = tts(texts[fid], key, voice, a.model)
        with open(os.path.join(OUT, fid + ".mp3"), "wb") as f:
            f.write(audio)
    print("Færdig. Åbn skyggeborgen.html og tryk Fortæl for at høre dem.")


if __name__ == "__main__":
    main()
