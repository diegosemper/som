/**
 * De proeftoets: twintig sommen in de verdeling van de echte toets, zonder
 * hartjes. Onderwerpen waar je eerder op struikelde komen vaker voorbij.
 */

import type { Onderwerp, Opgave, Rondesoort } from '../stof/types.ts'
import { maakRng } from '../stof/rng.ts'
import { alsMeerkeuze } from './meerkeuze.ts'

export const TOETS_LENGTE = 20

export type Gegeven = {
  opgave: Opgave
  ingevuld: string
  goed: boolean
}

/**
 * Trekt onderwerpen zonder herhaling zolang het kan. Codes uit de foutenbak
 * krijgen een extra lot, zodat je juist die terugziet.
 */
export function maakToets(
  onderwerpen: Onderwerp[],
  foutenbak: Record<string, number>,
  soort: Rondesoort = 'open',
  zaad: number = Date.now(),
): Opgave[] {
  const rng = maakRng(zaad)

  const loten: Onderwerp[] = []
  for (const o of onderwerpen) {
    loten.push(o)
    if ((foutenbak[o.code] ?? 0) > 0) loten.push(o)
  }

  const gekozen: Onderwerp[] = []
  let voorraad = rng.schud(loten)
  while (gekozen.length < TOETS_LENGTE) {
    if (voorraad.length === 0) voorraad = rng.schud(loten)
    const kandidaat = voorraad.shift()
    if (!kandidaat) break
    // Liever geen twee sommen van hetzelfde onderwerp achter elkaar.
    if (gekozen.length > 0 && gekozen[gekozen.length - 1].code === kandidaat.code) {
      voorraad.push(kandidaat)
      continue
    }
    gekozen.push(kandidaat)
  }

  return gekozen.map((o) => {
    const opgave = o.maak(rng)
    if (soort !== 'meerkeuze') return opgave

    // Reservekeuzes uit hetzelfde onderwerp: een breuk als tegenspeler van een
    // coördinaat zou meteen verraden welke knop de goede is.
    const reserve = [o.maak(rng).antwoord, o.maak(rng).antwoord, o.maak(rng).antwoord]
    return alsMeerkeuze(opgave, rng, reserve)
  })
}

export function cijfer(gegevens: Gegeven[]): string {
  if (gegevens.length === 0) return '—'
  const goed = gegevens.filter((g) => g.goed).length
  const punt = 1 + (9 * goed) / gegevens.length
  return punt.toFixed(1).replace('.', ',')
}
