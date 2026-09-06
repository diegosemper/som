/**
 * Van een gewone som een meerkeuzevraag maken.
 *
 * De foute opties zijn de valkuilen van de opgavemaker zelf, dus geen willekeurig
 * verzonnen getallen: je kiest tussen het goede antwoord en de fouten die
 * mensen echt maken. Zijn er te weinig valkuilen, dan lenen we antwoorden van
 * andere sommen van hetzelfde onderwerp — die zien er vanzelf plausibel uit.
 */

import type { Opgave } from '../stof/types.ts'
import type { Rng } from '../stof/rng.ts'
import { zelfdeAntwoord } from './antwoord.ts'

const AANTAL_OPTIES = 3

export function alsMeerkeuze(opgave: Opgave, rng: Rng, reserve: string[] = []): Opgave {
  // Onderwerpen die van zichzelf al meerkeuze zijn laten we met rust.
  if (opgave.invoer === 'keuze') return opgave

  const fout: string[] = []
  const bruikbaar = (kandidaat: string) => {
    if (!kandidaat) return false
    if (kandidaat === opgave.antwoord) return false
    if (fout.includes(kandidaat)) return false
    return !zelfdeAntwoord(kandidaat, opgave.antwoord, opgave.soort)
  }

  for (const valkuil of opgave.valkuilen) {
    if (fout.length >= AANTAL_OPTIES - 1) break
    if (bruikbaar(valkuil.fout)) fout.push(valkuil.fout)
  }

  for (const geleend of reserve) {
    if (fout.length >= AANTAL_OPTIES - 1) break
    if (bruikbaar(geleend)) fout.push(geleend)
  }

  // Zonder tegenspelers is het geen keuze; dan blijft het gewoon intikken.
  if (fout.length === 0) return opgave

  return {
    ...opgave,
    invoer: 'keuze',
    soort: 'keuze',
    keuzes: rng.schud([opgave.antwoord, ...fout]),
    // Vormeisen slaan nergens op als je uit knoppen kiest.
    vorm: undefined,
  }
}
