/**
 * Eén ronde: acht sommen, drie hartjes.
 *
 * Een fout antwoord kost een hartje en zet dezelfde som achteraan in de rij.
 * Je krijgt hem dus nog een keer, meteen nadat je de uitwerking gelezen hebt.
 */

import type { Onderwerp, Opgave, Rondesoort } from '../stof/types.ts'
import { maakRng } from '../stof/rng.ts'
import { alsMeerkeuze } from './meerkeuze.ts'

export const RONDE_LENGTE = 5
export const LEVENS = 3

export type Rondestand = {
  code: string
  soort: Rondesoort
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
 * Vijf sommen, allemaal in dezelfde vorm.
 *
 * Bij `meerkeuze` kies je uit knoppen waarvan de foute opties de valkuilen van
 * de opgavemaker zijn; bij `open` tik je alles zelf in. Welke vorm helpt
 * verschilt per onderwerp, dus dat kiest de speler zelf.
 *
 * `herhaling` zijn onderwerpen uit de foutenbak: daar komt er één van tussen.
 * Zo blijf je herhalen wat je niet kunt in plaats van wat je al kunt.
 */
export function startRonde(
  onderwerp: Onderwerp,
  soort: Rondesoort,
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

  // Nooit als eerste of laatste vraag: je begint en eindigt met dit onderwerp.
  const herhaalplek = 3
  if (herhaling.length > 0 && wachtrij.length > herhaalplek) {
    wachtrij[herhaalplek] = herhaling[0].maak(rng)
  }

  if (soort === 'meerkeuze') {
    // Als tegenspelers gebruiken we de valkuilen van de opgave zelf, aangevuld
    // met de antwoorden van de andere sommen uit deze ronde.
    const reserve = wachtrij.map((o) => o.antwoord)
    for (let i = 0; i < wachtrij.length; i++) {
      wachtrij[i] = alsMeerkeuze(
        wachtrij[i],
        rng,
        rng.schud(reserve.filter((_, k) => k !== i)),
      )
    }
  }

  return {
    code: onderwerp.code,
    soort,
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
