/** 3c — Modus (reader 3.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { breuk, toonGemengd } from '../getal.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

/**
 * Bouwt een rij waarin precies één waarde het vaakst voorkomt. De andere
 * waarden krijgen er hoogstens één minder, zodat er nooit twee modi ontstaan --
 * de oefentool van de reader doet dat ook niet.
 */
function metEenModus(rng: Rng, waarden: number[], lengte: number) {
  const geschud = rng.schud(waarden)
  const modus = geschud[0]
  const anderen = geschud.slice(1)
  const modusAantal = 4

  const rij: number[] = Array(modusAantal).fill(modus)
  const tellers = new Map<number, number>()
  let i = 0
  while (rij.length < lengte && i < 200) {
    const ander = anderen[i % anderen.length]
    const zoveel = tellers.get(ander) ?? 0
    if (zoveel < modusAantal - 1) {
      rij.push(ander)
      tellers.set(ander, zoveel + 1)
    }
    i++
  }
  return { modus, rij: rng.schud(rij) }
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  (rng) => {
    const soort = rng.kies([
      { wat: 'leeftijden van de vrienden', waarden: [17, 18, 19, 20, 21, 22, 25] },
      { wat: 'scores op de toets', waarden: [5, 6, 7, 8, 9, 10] },
      { wat: 'behaalde scores', waarden: [10, 12, 15, 18, 20, 22] },
    ])
    const lengte = rng.kies([7, 9, 10])
    const { modus, rij } = metEenModus(rng, soort.waarden, lengte)
    const hoeVaak = rij.filter((n) => n === modus).length
    const gesorteerd = [...rij].sort((a, b) => a - b)
    const totaal = rij.reduce((a, b) => a + b, 0)

    return {
      opdracht: `Wat is de modus van deze ${soort.wat}?`,
      vraag: rij.join(', '),
      antwoord: String(modus),
      stappen: [
        { doe: 'Zet ze op volgorde, dan zie je de herhalingen', werd: gesorteerd.join(', ') },
        { doe: 'Tel hoe vaak elke waarde voorkomt', werd: `${modus} komt ${hoeVaak} keer voor, de rest minder` },
        { doe: 'De waarde die het vaakst voorkomt is de modus', werd: String(modus) },
      ],
      valkuilen: [
        { fout: String(hoeVaak), heet: `Dat is hóe vaak hij voorkomt (${hoeVaak}×). De modus is de waarde zelf.` },
        { fout: toonGemengd(breuk(totaal, rij.length)), heet: 'Dat is het gemiddelde, niet de modus.' },
        { fout: String(gesorteerd[Math.floor(rij.length / 2)]), heet: 'Dat is (ongeveer) de mediaan. De modus is de vaakst voorkomende waarde.' },
      ],
      tip: 'Modus = de waarde die het vaakst voorkomt. Denk aan "mode": wat het meest gedragen wordt.',
    }
  },

  // Modaal inkomen
  (rng) => {
    const modaal = rng.kies([1800, 2000, 2200, 2500])
    const anderen = rng.schud([1500, 1700, 1900, 2100, 2300, 2600, 2800]).slice(0, 5)
    const hoeVaak = rng.getal(4, 5)
    const rij = rng.schud([...Array(hoeVaak).fill(modaal), ...anderen])

    return {
      opdracht: 'Wat is het modale inkomen in dit dorp?',
      vraag: rij.join(', '),
      antwoord: String(modaal),
      stappen: [
        { doe: 'Tel hoe vaak elk bedrag voorkomt', werd: `${modaal} komt ${hoeVaak} keer voor, elk ander bedrag één keer` },
        { doe: 'Het vaakst voorkomende bedrag is het modale inkomen', werd: String(modaal) },
      ],
      valkuilen: [
        { fout: String(hoeVaak), heet: 'Dat is het aantal mensen, niet het bedrag.' },
        {
          fout: toonGemengd(breuk(rij.reduce((a, b) => a + b, 0), rij.length)),
          heet: 'Dat is het gemiddelde inkomen. Jan Modaal verdient wat het vaakst voorkomt.',
        },
      ],
      tip: '"Jan Modaal" is de Nederlander met het vaakst voorkomende inkomen — dus de modus.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '3c',
  hoofdstuk: 3,
  titel: 'Modus',
  waarover: 'de waarde die het vaakst voorkomt',
  uitleg: [
    {
      kop: 'Wat is de modus',
      tekst:
        'De waarde die het vaakst in de rij voorkomt. Denk aan het woord "mode": wat op dit moment het meest gedragen wordt.',
      voorbeeld: '5, 7, 8, 9, 7, 6, 7 → modus 7',
    },
    {
      kop: 'De waarde, niet het aantal',
      tekst:
        'De modus is het getal zelf, niet hoe vaak het voorkomt. Komt de 7 drie keer voor, dan is de modus 7 en niet 3.',
      voorbeeld: 'modus = 7 (die komt 3× voor)',
    },
    {
      kop: 'Meerdere of geen',
      tekst:
        'Komen twee waarden even vaak voor, dan zijn er twee modi — en die tel je niet bij elkaar op. Komt alles even vaak voor, dan is er geen modus.',
      voorbeeld: '4, 6, 7, 6, 4, 8, 8, 6, 8 → modus 6 én 8',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '3c',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
