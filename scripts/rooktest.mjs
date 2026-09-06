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

const klachten = []

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
