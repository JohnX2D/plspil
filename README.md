# LDA Spil

Digital pointtavle til terninge- og kortspil, som spilles med rigtige terninger og et almindeligt kortspil ved bordet. Én HTML-fil, ingen installation.

## Spil

| Spil | Type | Udstyr |
|---|---|---|
| **Tårnet** | Push your luck: hvert slag skal være højere end det forrige | 1 terning |
| **Piratskatten** | Push your luck: læg slag sammen, en 1'er mister alt | 1 terning |
| **Kanonkampen** | Kamp: skyd på de andres borge eller byg mur. En faldet borg spøger videre | 1 terning |
| **Højere eller lavere** | Push your luck med kort | Kortspil |
| **Skattekisten** | Push your luck: samme værdi to gange, og kisten springer | Kortspil |
| **Monsterhulen** | Kamp og push your luck: slå monsteret i døren, og gå dybere ind eller hjem med sækken | Kortspil + 1 terning |
| **Måneraketten** | Rumrejse gennem seks stationer: vend et kort (krystalmine, alien-vagt eller ormehul), slå terningen, og flyv hjem før motoren eksploderer | Kortspil + 1 terning |

- 2–4 spillere med navne og farver
- I Tårnet og Piratskatten spilles runden færdig, når nogen når målet, så alle har haft lige mange ture
- Risikomåler og chancer regnet ud fra de kort, der er tilbage i bunken
- Fortryd, log og automatisk gemt spil i browseren
- Forside med en flise pr. spil. Hvert spil gemmes for sig, så man kan skifte spil og fortsætte senere
- Bygget til iPad 11" (højkant og på langs): ét fast skærmbillede uden rul, hvor scenen fylder mest, og terningknapper, risiko og stop altid er fremme. Virker også på telefon
- Lyd i alle spil (kan slås fra under Regler)
- **Aftenens mester:** hvert færdigt spil giver point til alle (vinderen flest), også Galaxy Raceway. Stillingen står på forsiden og starter forfra efter 10 timer uden spil eller med knappen Ny aften
- **Rekorder:** hvert spil har en rekord (fx højeste tårn eller største fangst), som står på spillets flise. En ny rekord fejres med det samme

## Galaxy Raceway

Et racerbrætspil i sin egen fil, `galaxy.html`, med link fra spilmenuen i `index.html`. Hele banen ses oppefra som et trykt spillebræt med nummererede felter: én omgang rundt, hvor start og mål ligger samme sted.

- 2–4 spillere vælger hver sin bil: Hajen, Svæveren, Jungletrucken eller Diskobilen
- Slå med en rigtig terning og tast slaget ind, eller brug den digitale terning. Bilen kører selv felt for felt
- Følg den aktive bil tæt på med forstørrelsesglasset, eller vis hele banen. Tryk på et felt for at se dets betydning
- Ved en gaffel kan du vælge en rute ved at trykke direkte på banen eller bruge knapperne
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

## Brug

Spillet bruges via claude.ai. `index.html` kan også åbnes direkte i en browser.
