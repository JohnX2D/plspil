# LDA Spil

Digital pointtavle til terninge- og kortspil, som spilles med rigtige terninger og et almindeligt kortspil ved bordet. Én HTML-fil, ingen installation.

## Spil

| Spil | Type | Udstyr |
|---|---|---|
| **Tårnet** | Push your luck: hvert slag skal være højere end det forrige | 1 terning |
| **Piratskatten** | Push your luck: læg slag sammen, en 1'er mister alt | 1 terning |
| **Kanonkampen** | Kamp: skyd på de andres borge eller byg mur | 1 terning |
| **Højere eller lavere** | Push your luck med kort | Kortspil |
| **Skattekisten** | Push your luck: samme værdi to gange, og kisten springer | Kortspil |

- 2–4 spillere med navne og farver
- I Tårnet og Piratskatten spilles runden færdig, når nogen når målet, så alle har haft lige mange ture
- Risikomåler og chancer regnet ud fra de kort, der er tilbage i bunken
- Fortryd, log og automatisk gemt spil i browseren
- Tilpasset telefon og iPad (højkant og på langs)

## Galaxy Raceway

Et racerbrætspil i sin egen fil, `galaxy.html`, med link fra spilmenuen i `index.html`. Hele banen ses oppefra som et trykt spillebræt med nummererede felter: én omgang rundt, hvor start og mål ligger samme sted.

- 2–4 spillere vælger hver sin bil: Hajen, Svæveren, Jungletrucken eller Diskobilen
- Slå med en rigtig terning og tast slaget ind. Bilen kører selv felt for felt
- **Gafler:** tre steder vælger man mellem en kort, farlig genvej og en længere omvej med power-kasser, fartbånd og hopperamper. Genvejen springer feltnumre over
- **Underlag:** sand og mudder koster 2 skridt pr. felt, og på is glider bilen 2 felter videre
- **Hopperamper:** bilen flyver 4 felter frem hen over alt, hvad der ligger under den
- **Farer:** toppen af loopet og luften over kløften (stopper man der, falder man ned), den brændende bro (stå over), tordensky (lynet rammer den forreste) og sort hul (3 felter tilbage)
- **Begivenheder:** fra anden runde kan der ved hver ny runde ske et vulkanudbrud, meteorregn, nordlys eller stjerneskud på et tilfældigt stykke af banen. Det varer runden ud
- **Powers fra kasserne:** raket, jagermissil, lynstorm, olieplet og skjold. Man vælger selv hvornår, men aldrig hvem der rammes
- Stopper man på en anden bil, ryger den 1 felt tilbage. Den bagerste bil får +1 på hvert slag
- Skilte med gode og dårlige ting bliver stående, til man trykker OK
- Fortryd, lyd og automatisk gemt løb
- Brættet vender sig selv på højkant, når det passer bedst til skærmen

## Skyggeborgen

Et samarbejdseventyr for 2–4 helte i sin egen fil, `skyggeborgen.html`, med link fra spilmenuen. Man spiller med rigtige terninger og et spil kort, træffer valg i historien og kæmper sammen mod askevagten. Hvert sted har sin egen tegnede scene med heltene og de andre figurer, teksten er kort (hele teksten kan foldes ud), kampen vises med sværdhug, ildkugler og skadetal, og et eventyrkort viser, hvor langt I er nået. Knappen **Fortæl** læser scenen op; stemmen laves med ElevenLabs ved at køre `voices/lav_stemmer.py`, også i en Claude-cloudsession. Se `voices/README.md`.

## Brug

Spillet bruges via claude.ai. `index.html` kan også åbnes direkte i en browser.
