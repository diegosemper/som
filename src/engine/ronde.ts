/**
 * Eén ronde: acht sommen, drie hartjes.
 *
 * Een fout antwoord kost een hartje en zet dezelfde som achteraan in de rij.
 * Je krijgt hem dus nog een keer, meteen nadat je de uitwerking gelezen hebt.
 */

import type { Onderwerp, Opgave } from '../stof/types.ts'
import { maakRng } from '../stof/rng.ts'
import { alsMeerkeuze } from './meerkeuze.ts'

/** Eerst kiezen uit knoppen, dan pas zelf intikken. */
export const MEERKEUZE = 4
export const ZELF = 8
export const RONDE_LENGTE = MEERKEUZE + ZELF
export const LEVENS = 4

export type Rondestand = {
  code: string
  wachtrij: Opgave[]
  klaar: number
  totaal: number
  levens: number
  fouten: number
  /** Hoeveel goede antwoorden achter elkaar. Voor de combo op het scherm. */
  reeks: number
}

export type Afloop = 'bezig' | 'gewonnen' | 'verloren'

/**
 * Twaalf sommen: eerst vier meerkeuze om erin te komen, daarna acht die je zelf
 * intikt. Zo zie je bij de eerste vier meteen hoe een goed antwoord eruitziet --
 * en welke fouten er op de loer liggen, want de knoppen zijn de valkuilen.
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

  // Herhaling uit de foutenbak komt in het intikgedeelte, niet tussen de
  // meerkeuzevragen: die vier gaan over dít onderwerp.
  const plekken = [MEERKEUZE + 2, MEERKEUZE + 5]
  herhaling.slice(0, plekken.length).forEach((ander, i) => {
    wachtrij[plekken[i]] = ander.maak(rng)
  })

  // De eerste vier worden meerkeuze. Als tegenspelers gebruiken we de valkuilen
  // van de opgave zelf, aangevuld met antwoorden van de andere sommen.
  const reserve = wachtrij.map((o) => o.antwoord)
  for (let i = 0; i < MEERKEUZE && i < wachtrij.length; i++) {
    wachtrij[i] = alsMeerkeuze(
      wachtrij[i],
      rng,
      rng.schud(reserve.filter((_, k) => k !== i)),
    )
  }

  return {
    code: onderwerp.code,
    wachtrij,
    klaar: 0,
    totaal: RONDE_LENGTE,
    levens: LEVENS,
    fouten: 0,
    reeks: 0,
  }
}

export function huidige(stand: Rondestand): Opgave | undefined {
  return stand.wachtrij[0]
}

export function goed(stand: Rondestand): Rondestand {
  return {
    ...stand,
    wachtrij: stand.wachtrij.slice(1),
    klaar: stand.klaar + 1,
    reeks: stand.reeks + 1,
  }
}

export function mis(stand: Rondestand): Rondestand {
  const eerste = stand.wachtrij[0]
  const rest = stand.wachtrij.slice(1)
  return {
    ...stand,
    wachtrij: eerste ? [...rest, eerste] : rest,
    levens: stand.levens - 1,
    fouten: stand.fouten + 1,
    reeks: 0,
  }
}

export function afloop(stand: Rondestand): Afloop {
  if (stand.levens <= 0) return 'verloren'
  if (stand.wachtrij.length === 0) return 'gewonnen'
  return 'bezig'
}
