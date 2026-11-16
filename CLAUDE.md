# LDA Spil

Pointtavlen med de syv små spil ligger i `index.html`. Det hele bruges via claude.ai, ikke GitHub Pages.

## Siden familien spiller på

https://claude.ai/artifact/T1E9hpzt6rFakHDsFKmpSH

Hver gang der pushes til `main` på GitHub, skal denne artifact også opdateres med den nye `index.html` (Artifact-værktøjet: publish med `url` sat til linket ovenfor, så linket bevares). Tjek bagefter, at den publicerede side har samme indhold og versionsnummer som `index.html` i repoet.

## Versionsnummer

Versionsnummeret står nederst på siden i `index.html` (`<footer class="ver">`). Tæl det altid op, når spillet ændres, i samme commit som ændringen:

- **x.Y** (fx 1.0 → 1.1): rettelser, små justeringer, visuelle detaljer, tekster.
- **X.0** (fx 1.4 → 2.0): større ændringer, fx et nyt spil, nye eller ændrede regler, eller et stort visuelt løft.

Nævn den nye version i commit-beskeden.
