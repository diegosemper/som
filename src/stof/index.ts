/**
 * Het register van alle onderwerpen, in de volgorde van het pad.
 *
 * De volgorde volgt de hoofdstukken van de reader, niet het alfabet: hoofdstuk
 * 1, dan 2, enzovoort. De codes ernaast zijn de opgavecodes van de oefentool
 * (blz. 7), want daar wordt de toets uit getrokken.
 */

import type { Onderwerp } from './types.ts'
import { aantalTermen, zelfdeAntwoord } from '../engine/antwoord.ts'
import { normaliseer } from '../engine/rekenaar.ts'

import { onderwerp as c1a } from './codes/1a.ts'
import { onderwerp as c1b } from './codes/1b.ts'
import { onderwerp as c1c } from './codes/1c.ts'
import { onderwerp as c1d } from './codes/1d.ts'
import { onderwerp as c1e } from './codes/1e.ts'
import { onderwerp as c4a } from './codes/4a.ts'
import { onderwerp as c4b } from './codes/4b.ts'
import { onderwerp as c4c } from './codes/4c.ts'
import { onderwerp as c5a } from './codes/5a.ts'

/**
 * Zo hoort het pad te lopen. Codes die er nog niet zijn worden overgeslagen,
 * dus een nieuw onderwerp toevoegen is: bestand maken, hierboven importeren,
 * in AANWEZIG zetten.
 */
const PAD = [
  // Hoofdstuk 1 — rekenen
  '1a', '1b',
  // Hoofdstuk 2 — algebra en machten
  '1c', '5a', '5b', '4a', '4b', '4c', '4d', '4e',
  // Hoofdstuk 3 — kansen
  '3a', '3b', '3c', '3d', '3e',
  // Hoofdstuk 4 — haakjes
  '1d', '1e', '7a',
  // Hoofdstuk 5 — breuken zonder letters
  '2a', '2b',
  // Hoofdstuk 6 — breuken met letters
  '2c', '2d', '2e',
  // Hoofdstuk 7 — lijnen
  '6a', '6b', '6c', '6d', '6e',
  // Hoofdstuk 8 — hogeregraadsfuncties
  '7b', '7c', '5c', '5d', '5e', '7d', '7e',
]

const AANWEZIG: Onderwerp[] = [c1a, c1b, c1c, c5a, c4a, c4b, c4c, c1d, c1e]

/**
 * Een valkuil die toevallig hetzelfde uitkomt als het goede antwoord zou de
 * speler vertellen dat zijn juiste antwoord fout is. Dat filteren we hier
 * centraal weg, zodat geen enkele opgavemaker dat zelf hoeft te bewaken.
 */
function veilig(o: Onderwerp): Onderwerp {
  return {
    ...o,
    maak(rng) {
      const opgave = o.maak(rng)

      // Zonder termgrens zou het overtikken van de vraag als goed gelden: die
      // heeft immers dezelfde waarde als het antwoord.
      const vorm =
        opgave.soort === 'uitdrukking' && opgave.vorm?.maxTermen === undefined
          ? { ...opgave.vorm, maxTermen: aantalTermen(normaliseer(opgave.antwoord)) }
          : opgave.vorm

      return {
        ...opgave,
        vorm,
        valkuilen: opgave.valkuilen.filter((v) => !zelfdeAntwoord(v.fout, opgave.antwoord, opgave.soort)),
      }
    },
  }
}

export const ONDERWERPEN: Onderwerp[] = PAD.map((code) => AANWEZIG.find((o) => o.code === code))
  .filter((o): o is Onderwerp => o !== undefined)
  .map(veilig)

export function zoekOnderwerp(code: string): Onderwerp | undefined {
  return ONDERWERPEN.find((o) => o.code === code)
}

/** De hoofdstukken die er nu in zitten, in padvolgorde. */
export function hoofdstukken(): { nummer: number; naam: string; onderwerpen: Onderwerp[] }[] {
  const namen: Record<number, string> = {
    1: 'Rekenen',
    2: 'Algebra: rekenen met letters',
    3: 'Kansen',
    4: 'Haakjes en ontbinden',
    5: 'Breuken zonder letters',
    6: 'Breuken met letters',
    7: 'Lijnen',
    8: 'Hogeregraadsfuncties',
  }
  const uit: { nummer: number; naam: string; onderwerpen: Onderwerp[] }[] = []
  for (const o of ONDERWERPEN) {
    let groep = uit.find((g) => g.nummer === o.hoofdstuk)
    if (!groep) {
      groep = { nummer: o.hoofdstuk, naam: namen[o.hoofdstuk] ?? `Hoofdstuk ${o.hoofdstuk}`, onderwerpen: [] }
      uit.push(groep)
    }
    groep.onderwerpen.push(o)
  }
  return uit
}
