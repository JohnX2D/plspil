#!/usr/bin/env python3
"""Indtaler fortællerstemmen til Skyggeborgen med ElevenLabs.

Brug (fra repoets rodmappe):
    python3 voices/lav_stemmer.py            # indtal alt, der mangler eller er ændret
    python3 voices/lav_stemmer.py --liste    # vis afsnittene og antal tegn uden at indtale

Nøglen læses fra miljøvariablen ELEVENLABS_API_KEY eller fra .env.local og må aldrig stå i koden.
(I en Claude-cloudsession sætter netværksproxyen nøglen på, så variablen kan være en pladsholder.)
Stemme og model står i voices/indstillinger.json. Rettelser til udtalen står i voices/udtale.json.

Scriptet finder alle fortællertekster i skyggeborgen.html og deler dem op i afsnit (ét afsnit pr. linje).
Resultatet er voices/skyggeborgen.json:  {"klip": {"<afsnittets tekst>": {"mp3": "<base64>"}, ...}}
Fortæl-knappen afspiller afsnittene efter hinanden. Mangler et afsnit, bruges browserens stemme.
Kun nye eller ændrede afsnit indtales, så en rettelse koster næsten ingen tegn.
"""
import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request

ROD = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.join(ROD, 'skyggeborgen.html')
MAPPE = os.path.join(ROD, 'voices')
KLIP_FIL = os.path.join(MAPPE, 'skyggeborgen.json')


def js_tekst(s):
    """Gør en JavaScript-strengs indhold til almindelig tekst."""
    return s.replace('\\n', '\n').replace("\\'", "'").replace('\\"', '"')


def afsnit():
    """Alle afsnit, som Fortæl-knappen kan få brug for, i den rækkefølge de står i spillet."""
    src = open(HTML, encoding='utf-8').read()
    tekster = []
    # Scener: story('Titel',`tekst`, ...). Her tages alle linjer med, også korte som "KLANG."
    scener = [m.group(1) for m in re.finditer(r"story\('[^']*',`([^`$]*)`", src)]
    # Resultater og faste fortællertekster: result('Titel','tekst'...), text=..., txt=..., S.story='...'
    for m in re.finditer(r"(?:result\('[^']*',|\btext\+?=|\btxt=|S\.story=)", src):
        bid = src[m.end():m.end() + 900]
        slut = re.search(r";|'\s*,\s*'[a-z_]+'\)|'\)", bid)
        udtryk = bid[:slut.end()] if slut else bid
        tekster += [x for x in re.findall(r"'((?:[^'\\]|\\.)*)'", udtryk)]
    ud, set_ = [], set()
    for t in scener + tekster:
        for linje in js_tekst(t).split('\n'):
            linje = linje.strip()
            # I andre tekster kun rigtige sætninger (ikke scene-id'er som 'fight' eller 'vej')
            if not linje or linje in set_ or (t not in scener and (len(linje) < 20 or ' ' not in linje)):
                continue
            set_.add(linje)
            ud.append(linje)
    return ud


def udtal(tekst, udtale):
    for fra, til in udtale.items():
        tekst = re.sub(r'(?<![\wæøåÆØÅ])' + re.escape(fra) + r'(?![\wæøåÆØÅ])', til, tekst)
    return tekst


def noegle():
    k = os.environ.get('ELEVENLABS_API_KEY')
    if not k:
        sti = os.path.join(ROD, '.env.local')
        if os.path.exists(sti):
            for linje in open(sti, encoding='utf-8'):
                if linje.startswith('ELEVENLABS_API_KEY='):
                    k = linje.split('=', 1)[1].strip().strip('"\'')
    if not k:
        sys.exit('Ingen ELEVENLABS_API_KEY i miljøet eller i .env.local.')
    return k


def indtal(cfg, tekst, key):
    url = (f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['stemme']}"
           f"?output_format={cfg.get('format', 'mp3_22050_32')}")
    data = json.dumps({'text': tekst, 'model_id': cfg['model'],
                       'language_code': cfg.get('sprog', 'da')}).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST', headers={
        'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f'ElevenLabs svarede {e.code}: {e.read().decode("utf-8", "replace")[:300]}')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--liste', action='store_true', help='vis afsnittene uden at indtale')
    a = ap.parse_args()

    cfg = json.load(open(os.path.join(MAPPE, 'indstillinger.json'), encoding='utf-8'))
    udtale = {k: v for k, v in json.load(open(os.path.join(MAPPE, 'udtale.json'), encoding='utf-8')).items()
              if not k.startswith('_')}
    alle = afsnit()

    if a.liste:
        for t in alle:
            print(f'- {t}')
        print(f'{len(alle)} afsnit, {sum(len(udtal(t, udtale)) for t in alle)} tegn')
        return

    key = noegle()
    gammel = json.load(open(KLIP_FIL, encoding='utf-8')) if os.path.exists(KLIP_FIL) else {}
    samme = gammel.get('stemme') == cfg['stemme'] and gammel.get('model') == cfg['model']
    ud = {'stemme': cfg['stemme'], 'model': cfg['model'], 'klip': {}}
    nye = tegn = 0
    for t in alle:
        sagt = udtal(t, udtale)
        g = gammel.get('klip', {}).get(t)
        if samme and g and g.get('t') == sagt:
            ud['klip'][t] = g
            continue
        lyd = indtal(cfg, sagt, key)
        ud['klip'][t] = {'t': sagt, 'mp3': base64.b64encode(lyd).decode('ascii')}
        nye += 1
        tegn += len(sagt)
        print(f'  {t[:60]}  ({len(lyd) // 1024} kB)', flush=True)
        if nye % 10 == 0:
            json.dump(ud, open(KLIP_FIL, 'w', encoding='utf-8'), ensure_ascii=False)
    json.dump(ud, open(KLIP_FIL, 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'Færdig: {len(ud["klip"])} klip i voices/skyggeborgen.json, {nye} nye ({tegn} tegn), '
          f'{os.path.getsize(KLIP_FIL) // 1024} kB')


if __name__ == '__main__':
    main()
