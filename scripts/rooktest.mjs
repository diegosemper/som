/**
 * Speelt van elk onderwerp een hele ronde na met de echte motor uit
 * src/engine/, zonder React ertussen. Zo weten we dat een ronde ook echt
 * uitspeelt en dat de hartjes aflopen -- dingen die `controleer.mjs` per losse
 * opgave niet ziet.
 */

import { ONDERWERPEN } from '../src/stof/index.ts'
import { afloop, goed, huidige, mis, startRonde } from '../src/engine/ronde.ts'
import { kijkNa } from '../src/engine/antwoord.ts'
import { maakToets, TOETS_LENGTE } from '../src/engine/toets.ts'
import { bouwLes } from '../src/engine/les.ts'
import { introVoor, receptVoor } from '../src/stof/gasten.ts'

const klachten = []

// Elk onderwerp moet een lesje opleveren dat je kunt doorlopen. Meerdere zaden,
// want het voorbeeld en de controlevraag worden elke keer opnieuw getrokken.
for (const onderwerp of ONDERWERPEN) {
  const code = onderwerp.code

  if (introVoor(code).join(' ').startsWith('Even kijken hoe dit werkt')) {
    klachten.push(`${code}: geen eigen introductie geschreven`)
  }
  if (receptVoor(code).length < 3) {
    klachten.push(`${code}: stappenplan van minder dan drie stappen`)
  }

  for (const zaad of [1, 7, 12345, 98765, 555]) {
    const les = bouwLes(onderwerp, zaad)
    const soorten = les.map((b) => b.soort)

    for (const nodig of ['praat', 'recept', 'regel', 'uitwerking', 'kies']) {
      if (!soorten.includes(nodig)) klachten.push(`${code} (zaad ${zaad}): lesje zonder ${nodig}`)
    }

    for (const beurt of les) {
      if (beurt.soort !== 'kies') continue
      const goede = beurt.opties.filter((o) => o.goed)
      if (goede.length !== 1) {
        klachten.push(`${code} (zaad ${zaad}): controlevraag heeft ${goede.length} goede antwoorden`)
      }
      if (beurt.opties.length < 2) {
        klachten.push(`${code} (zaad ${zaad}): controlevraag met te weinig keuzes`)
      }
      if (new Set(beurt.opties.map((o) => o.tekst)).size !== beurt.opties.length) {
        klachten.push(`${code} (zaad ${zaad}): controlevraag met dubbele keuzes`)
      }
      for (const optie of beurt.opties) {
        if (!optie.reactie || optie.reactie.trim().length < 4) {
          klachten.push(`${code} (zaad ${zaad}): keuze "${optie.tekst}" zonder reactie`)
        }
      }
    }
  }
}

// De proeftoets moet twintig sommen leveren die allemaal nagekeken kunnen worden.
for (const zaad of [1, 2, 3]) {
  const toets = maakToets(ONDERWERPEN, { '4c': 3, '7d': 1 }, zaad)
  if (toets.length !== TOETS_LENGTE) {
    klachten.push(`proeftoets ${zaad}: ${toets.length} sommen in plaats van ${TOETS_LENGTE}`)
  }
  for (const opgave of toets) {
    if (!kijkNa(opgave.antwoord, opgave).goed) {
      klachten.push(`proeftoets ${zaad}: "${opgave.vraag}" keurt het eigen antwoord af`)
    }
  }
  for (let i = 1; i < toets.length; i++) {
    if (toets[i].code === toets[i - 1].code) {
      klachten.push(`proeftoets ${zaad}: twee keer ${toets[i].code} achter elkaar`)
    }
  }
}

for (const onderwerp of ONDERWERPEN) {
  // 1. Alles goed beantwoorden: ronde gewonnen, nul fouten.
  let stand = startRonde(onderwerp, 42)
  let ronden = 0
  while (afloop(stand) === 'bezig' && ronden++ < 60) {
    const opgave = huidige(stand)
    if (!kijkNa(opgave.antwoord, opgave).goed) {
      klachten.push(`${onderwerp.code}: eigen antwoord "${opgave.antwoord}" wordt afgekeurd`)
      break
    }
    stand = goed(stand)
  }
  if (afloop(stand) !== 'gewonnen' || stand.fouten !== 0) {
    klachten.push(`${onderwerp.code}: ronde speelt niet uit`)
  }

  // 2. Drie keer missen: hartjes op.
  if (afloop(mis(mis(mis(startRonde(onderwerp, 7))))) !== 'verloren') {
    klachten.push(`${onderwerp.code}: de levens lopen niet af`)
  }

  // 3. Onzin wordt afgekeurd.
  const proef = huidige(startRonde(onderwerp, 99))
  if (kijkNa('999999', proef).goed) {
    klachten.push(`${onderwerp.code}: onzin-antwoord wordt goedgekeurd`)
  }
}

if (klachten.length > 0) {
  console.error('\nRooktest mislukt:\n')
  for (const klacht of klachten) console.error('  - ' + klacht)
  console.error('')
  process.exit(1)
}

console.log(`Rooktest in orde: ${ONDERWERPEN.length} rondes uitgespeeld.`)
