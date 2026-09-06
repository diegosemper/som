/**
 * Eén ronde: acht sommen, drie hartjes.
 *
 * Een fout antwoord kost een hartje en zet dezelfde som achteraan in de rij.
 * Je krijgt hem dus nog een keer, meteen nadat je de uitwerking gelezen hebt.
 */

import type { Onderwerp, Opgave } from '../stof/types.ts'
import { maakRng } from '../stof/rng.ts'

export const RONDE_LENGTE = 8
export const LEVENS = 3

export type Rondestand = {
  code: string
  wachtrij: Opgave[]
  klaar: number
  totaal: number
  levens: number
  fouten: number
}

export type Afloop = 'bezig' | 'gewonnen' | 'verloren'

/**
 * Acht sommen, zo veel mogelijk verschillend van elkaar.
 *
 * `herhaling` zijn onderwerpen uit de foutenbak: daar komt er één van tussen,
 * halverwege de ronde. Zo blijf je herhalen wat je niet kunt in plaats van wat
 * je al kunt.
 */
export function startRonde(
  onderwerp: Onderwerp,
  zaad: number = Date.now(),
  herhaling: Onderwerp[] = [],
): Rondestand {
  const rng = maakRng(zaad)
  const wachtrij: Opgave[] = []
  const gezien = new Set<string>()

  while (wachtrij.length < RONDE_LENGTE) {
    let opgave = onderwerp.maak(rng)
    for (let poging = 0; poging < 8 && gezien.has(opgave.vraag); poging++) {
      opgave = onderwerp.maak(rng)
    }
    gezien.add(opgave.vraag)
    wachtrij.push(opgave)
  }

  // Nooit de eerste of de laatste: je begint en eindigt met het onderwerp zelf.
  const plekken = [3, 6]
  herhaling.slice(0, plekken.length).forEach((ander, i) => {
    wachtrij[plekken[i]] = ander.maak(rng)
  })

  return {
    code: onderwerp.code,
    wachtrij,
    klaar: 0,
    totaal: RONDE_LENGTE,
    levens: LEVENS,
    fouten: 0,
  }
}

export function huidige(stand: Rondestand): Opgave | undefined {
  return stand.wachtrij[0]
}

export function goed(stand: Rondestand): Rondestand {
  return { ...stand, wachtrij: stand.wachtrij.slice(1), klaar: stand.klaar + 1 }
}

export function mis(stand: Rondestand): Rondestand {
  const eerste = stand.wachtrij[0]
  const rest = stand.wachtrij.slice(1)
  return {
    ...stand,
    wachtrij: eerste ? [...rest, eerste] : rest,
    levens: stand.levens - 1,
    fouten: stand.fouten + 1,
  }
}

export function afloop(stand: Rondestand): Afloop {
  if (stand.levens <= 0) return 'verloren'
  if (stand.wachtrij.length === 0) return 'gewonnen'
  return 'bezig'
}
