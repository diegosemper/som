/** 3b — Mediaan (reader 3.2) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { breuk, toonGemengd } from '../getal.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

function mediaanVan(lijst: number[]): { waarde: string; gesorteerd: number[]; midden: string } {
  const gesorteerd = [...lijst].sort((a, b) => a - b)
  const n = gesorteerd.length
  if (n % 2 === 1) {
    const m = gesorteerd[(n - 1) / 2]
    return { waarde: String(m), gesorteerd, midden: `het middelste getal is ${m}` }
  }
  const a = gesorteerd[n / 2 - 1]
  const b = gesorteerd[n / 2]
  return {
    waarde: toonGemengd(breuk(a + b, 2)),
    gesorteerd,
    midden: `de twee middelste zijn ${a} en ${b}`,
  }
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // Oneven aantal
  (rng) => {
    const soort = rng.kies([
      { wat: 'toetscijfers van de studenten', min: 4, max: 10 },
      { wat: 'leeftijden van de spelers', min: 16, max: 25 },
      { wat: 'lengtes van de planten (cm)', min: 30, max: 46 },
    ])
    const aantal = rng.kies([5, 7, 9])
    const lijst = Array.from({ length: aantal }, () => rng.getal(soort.min, soort.max))
    const { waarde, gesorteerd } = mediaanVan(lijst)
    const midden = gesorteerd[(aantal - 1) / 2]
    const ongesorteerdMidden = lijst[(aantal - 1) / 2]

    return {
      opdracht: `Wat is de mediaan van deze ${soort.wat}?`,
      vraag: lijst.join(', '),
      antwoord: waarde,
      stappen: [
        { doe: 'Zet ze eerst op volgorde van klein naar groot', werd: gesorteerd.join(', ') },
        { doe: `Er zijn ${aantal} getallen — een oneven aantal, dus pak het middelste`, werd: String(midden) },
      ],
      valkuilen: [
        { fout: String(ongesorteerdMidden), heet: 'Je pakte het middelste getal van de ongesorteerde rij. Eerst op volgorde zetten!' },
        {
          fout: toonGemengd(breuk(lijst.reduce((a, b) => a + b, 0), aantal)),
          heet: 'Dat is het gemiddelde. De mediaan is de middelste waarde.',
        },
      ],
      tip: 'Mediaan: eerst sorteren, dan het middelste getal pakken.',
    }
  },

  // Even aantal
  (rng) => {
    const soort = rng.kies([
      { wat: 'maandinkomens', min: 1500, max: 3500, stap: 500 },
      { wat: 'leeftijden van de deelnemers', min: 12, max: 24, stap: 1 },
      { wat: 'getallen', min: 3, max: 20, stap: 1 },
    ])
    const aantal = rng.kies([6, 8])
    const lijst = Array.from({ length: aantal }, () => {
      const ruw = rng.getal(soort.min, soort.max)
      return soort.stap === 1 ? ruw : Math.round(ruw / soort.stap) * soort.stap
    })
    const { waarde, gesorteerd } = mediaanVan(lijst)
    const a = gesorteerd[aantal / 2 - 1]
    const b = gesorteerd[aantal / 2]

    return {
      opdracht: `Wat is de mediaan van deze ${soort.wat}?`,
      vraag: lijst.join(', '),
      antwoord: waarde,
      stappen: [
        { doe: 'Eerst op volgorde zetten', werd: gesorteerd.join(', ') },
        { doe: `Er zijn ${aantal} getallen — een even aantal, dus pak de twee middelste`, werd: `${a} en ${b}` },
        { doe: `Neem daar het gemiddelde van: (${a} + ${b}) / 2`, werd: waarde },
      ],
      valkuilen: [
        { fout: String(a), heet: 'Bij een even aantal is de mediaan het gemiddelde van de twee middelste, niet de linker.' },
        { fout: String(b), heet: 'Bij een even aantal is de mediaan het gemiddelde van de twee middelste, niet de rechter.' },
      ],
      tip: 'Even aantal? Dan is de mediaan het gemiddelde van de twee middelste getallen.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '3b',
  hoofdstuk: 3,
  titel: 'Mediaan',
  waarover: 'de middelste waarde na sorteren',
  uitleg: [
    {
      kop: 'Wat is de mediaan',
      tekst:
        'De middelste waarde van een rij getallen, nadat je ze van klein naar groot hebt gezet. Sorteren is dus altijd stap één.',
      voorbeeld: '8, 9, 5, 7, 6 → 5, 6, 7, 8, 9 → mediaan 7',
    },
    {
      kop: 'Even aantal',
      tekst: 'Bij een even aantal getallen zijn er twee middelste. De mediaan is dan het gemiddelde van die twee.',
      voorbeeld: '12, 14, 16, 18, 20, 22 → (16 + 18)/2 = 17',
    },
    {
      kop: 'Waarom niet gewoon het gemiddelde',
      tekst:
        'Uitschieters trekken het gemiddelde scheef. Verdient één iemand in een dorp €30.000, dan zegt de mediaan meer over wat mensen daar echt verdienen.',
      voorbeeld: 'gemiddelde €7.500, mediaan €2.000',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '3b',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
