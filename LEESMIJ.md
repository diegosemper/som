# SOM

Oefenspel voor **Startvaardigheden Wiskunde HBO-ICT** (Hanze, versie 2026-27).
Korte rondes van acht sommen, drie hartjes, en bij een fout de hele uitwerking
van precies die som — met de naam van de fout die je maakte.

Mobiel-eerst: bedoeld om op je telefoon te spelen, met een eigen
wiskunde-toetsenbord zodat je nooit naar `^`, `√` of `·` hoeft te zoeken.

---

## Zelf draaien

```
npm install
npm run dev
```

Open `http://localhost:5175`.

Op je eigen telefoon, over je eigen wifi:

```
npm run telefoon
```

Vite drukt dan een adres af dat met je eigen ip begint. Dat typ je op je telefoon
over.

Controleren of alles klopt:

```
npm run build
```

Dat doet drie dingen achter elkaar: de types nakijken, de **stof** nakijken, en
pas dan bouwen.

---

## Hoe het in elkaar zit

Vier lagen, streng gescheiden:

```
src/stof/      de wiskunde als data — uitleg en opgavemakers. Geen React.
src/engine/    de regels — antwoord nakijken, ronde, pad. Geen React.
src/opslag/    voortgang in localStorage.
src/schermen/  hoe het eruitziet.
```

### De opgavemakers

`src/stof/codes/` bevat één bestand per **opgavecode uit de oefentool** (`1a` tot
en met `7e`). Die indeling komt van blz. 7 van de reader, en de toets wordt uit
diezelfde codes getrokken — dus wie alle codes op drie sterren heeft, heeft de
toetsstof gehad.

Een opgavemaker levert nooit alleen een antwoord. Hij levert:

| veld | wat erin zit |
|---|---|
| `vraag` | de som, met de getallen van deze keer |
| `antwoord` | het goede antwoord |
| `stappen` | de hele uitwerking van **deze** som, stap voor stap |
| `valkuilen` | veelgemaakte fouten mét de uitkomst die eruit rolt |
| `tip` | de regel die je moet onthouden |

Door `valkuilen` weet de app het verschil tussen "fout" en *"je las −3² als
(−3)²"*. Dat is het hele punt van de app.

### Antwoorden nakijken

`src/engine/rekenaar.ts` ontleedt wiskunde-notatie en `antwoord.ts` velt het
oordeel. Twee antwoorden zijn gelijk als ze bij zes verschillende invullingen
voor de letters dezelfde waarde geven — zo is `6ab` hetzelfde als `6ba` en
`3a − ab` hetzelfde als `−ab + 3a`, zonder algebra-bibliotheek.

De vórm wordt apart bewaakt (`Vormeis`): bij "schrijf zonder breuken" is
`32/u⁴` numeriek goed maar niet wat er gevraagd wordt. Zonder die eisen zou het
overtikken van de vraag als goed antwoord gelden — die heeft immers dezelfde
waarde.

---

## `npm run controleer`

Drie stappen, allemaal met de échte motor:

1. **Tweehonderd sommen per onderwerp.** Wordt het eigen antwoord goedgekeurd,
   worden alle valkuilen afgekeurd, eindigt de uitwerking op het antwoord, en
   wordt het overtikken van de vraag niet geaccepteerd.
2. **De syllabus zelf.** `src/stof/reader.ts` bevat 152 opgaven uit de reader met
   de officiële antwoorden van blz. 67–70. Is de rekenaar het daar niet mee
   eens, dan breekt de bouw.
3. **Rooktest en rendertest.** Van elk onderwerp wordt een hele ronde uitgespeeld,
   en het pad wordt met `react-dom/server` getekend — zodat een lege pagina de
   bouw breekt en niet pas op de toetsdag opvalt.

Stap 2 ving tijdens het bouwen twee echte fouten:

- `6x² ÷ 3x` werd als `(6x²/3)·x` gelezen in plaats van `6x²/(3x)`;
- `2/3 ÷ 1/2` kwam uit op `1/3`, omdat `÷` en `/` even sterk waren. Het deelteken
  scheidt hele breuken en bindt dus losser dan de breukstreep, terwijl het even
  sterk blijft als het maalteken. Nu klopt `24 ÷ 3 · 2 = 16` én `2/3 ÷ 1/2 = 4/3`.

---

## Proeftoets

Twintig sommen in de verdeling van de echte toets, zonder hartjes. Achteraf
krijg je elke fout terug mét de uitwerking. Onderwerpen waar je eerder op
struikelde krijgen een extra lot — die komen ook tussen gewone rondes door
terug (`src/engine/toets.ts` en de foutenbak in `src/opslag/voortgang.ts`).

---

## Online zetten

Pushen naar `main` is genoeg; `.github/workflows/deploy.yml` bouwt en publiceert
naar **https://diegosemper.github.io/som/**. Een service worker maakt de app
offline bruikbaar; "Zet op beginscherm" geeft een echt app-icoon.

---

## Een onderwerp toevoegen of aanpassen

De codes staan in padvolgorde in `src/stof/index.ts`; wat er niet is wordt
overgeslagen. Een onderwerp toevoegen is dus: bestand in `src/stof/codes/`,
importeren in `index.ts`, in `AANWEZIG` zetten.

Alle 35 codes van de oefentool zitten erin. De letter-per-onderwerp verdeling is
afgeleid uit de volgorde waarin de stof in de reader staat; klopt een code niet
met wat er in Brightspace staat, dan is dat één regel verzetten — de codes zijn
alleen labels boven de generators.
