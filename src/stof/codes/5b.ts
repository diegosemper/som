/** 5b — Herleiden met machten (reader opdracht 2.3.1) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { herleid, term, toonSom, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip' | 'vorm'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k1·x · k2·x
  (rng) => {
    const x = rng.kies(['x', 'y', 'a', 'p'])
    const k1 = rng.getal(2, 8)
    const k2 = rng.getal(2, 8)
    return {
      vraag: `${toonTerm(term(k1, { [x]: 1 }))} · ${toonTerm(term(k2, { [x]: 1 }))}`,
      antwoord: toonTerm(term(k1 * k2, { [x]: 2 })),
      vorm: { geenMaal: true },
      stappen: [
        { doe: 'Getallen keer getallen', werd: `${k1} · ${k2} = ${k1 * k2}` },
        { doe: `${x} keer ${x} geeft ${x}²`, werd: toonTerm(term(k1 * k2, { [x]: 2 })) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 * k2, { [x]: 1 })), heet: `Twee keer de letter ${x} geeft ${x}², niet ${x}.` },
        { fout: toonTerm(term(k1 + k2, { [x]: 2 })), heet: 'De getallen moeten keer elkaar, niet opgeteld.' },
      ],
      tip: 'Bij vermenigvuldigen tel je de machten op: x · x = x².',
    }
  },

  // k1·x² + x · k2·x
  (rng) => {
    const x = rng.kies(['x', 'y', 'b'])
    const k1 = rng.getal(2, 8)
    const k2 = rng.getal(2, 8)
    return {
      vraag: `${toonTerm(term(k1, { [x]: 2 }))} + ${x} · ${toonTerm(term(k2, { [x]: 1 }))}`,
      antwoord: toonTerm(term(k1 + k2, { [x]: 2 })),
      vorm: { geenMaal: true },
      stappen: [
        { doe: 'Rekenvolgorde: eerst het vermenigvuldigen', werd: `${toonTerm(term(k1, { [x]: 2 }))} + ${toonTerm(term(k2, { [x]: 2 }))}` },
        { doe: `Nu zijn het allebei ${x}²-termen, dus optellen mag`, werd: toonTerm(term(k1 + k2, { [x]: 2 })) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 * k2, { [x]: 2 })), heet: 'Na het vermenigvuldigen moet je de twee termen optéllen.' },
        { fout: toonTerm(term(k1 + k2, { [x]: 3 })), heet: `Optellen verandert de macht niet: ${x}² + ${x}² blijft ${x}².` },
      ],
      tip: 'Eerst vermenigvuldigen, dan pas kijken wat gelijksoortig is.',
    }
  },

  // k1·y² − k2·y² + k3·x²
  (rng) => {
    const [y, x] = rng.kies([['y', 'x'], ['b', 'a'], ['q', 'p']])
    const k1 = rng.getal(3, 9)
    const k2 = rng.getal(1, k1 - 1)
    const k3 = rng.nietNul(-6, 6)
    const stukken = [term(k1, { [y]: 2 }), term(-k2, { [y]: 2 }), term(k3, { [x]: 2 })]
    return {
      vraag: toonSom(stukken),
      antwoord: toonSom(herleid(stukken)),
      stappen: [
        { doe: `De twee ${y}²-termen zijn gelijksoortig`, werd: toonTerm(term(k1 - k2, { [y]: 2 })) },
        { doe: `${x}² is een andere soort en blijft staan`, werd: toonSom(herleid(stukken)) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 - k2 + k3, { [y]: 2 })), heet: `${y}² en ${x}² zijn verschillende soorten.` },
      ],
      tip: 'Alleen dezelfde letter én dezelfde macht mag je samenvoegen.',
    }
  },

  // k1·a · k2·a² + k3·a³
  (rng) => {
    const a = rng.kies(['a', 'x', 'u'])
    const k1 = rng.getal(2, 5)
    const k2 = rng.getal(2, 5)
    const k3 = rng.nietNul(-7, 7)
    return {
      vraag: `${toonTerm(term(k1, { [a]: 1 }))} · ${toonTerm(term(k2, { [a]: 2 }))} + ${toonTerm(term(k3, { [a]: 3 }))}`,
      antwoord: toonTerm(term(k1 * k2 + k3, { [a]: 3 })),
      vorm: { geenMaal: true },
      stappen: [
        { doe: 'Eerst vermenigvuldigen: getallen keer elkaar, machten optellen', werd: `${toonTerm(term(k1 * k2, { [a]: 3 }))} + ${toonTerm(term(k3, { [a]: 3 }))}` },
        { doe: `Beide zijn nu ${a}³-termen`, werd: toonTerm(term(k1 * k2 + k3, { [a]: 3 })) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 * k2 + k3, { [a]: 2 })), heet: `${a} · ${a}² geeft ${a}³: de machten tel je op.` },
      ],
      tip: 'aˣ · aʸ = aˣ⁺ʸ',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '5b',
  hoofdstuk: 2,
  titel: 'Herleiden met machten',
  waarover: 'optellen én vermenigvuldigen door elkaar',
  uitleg: [
    {
      kop: 'Twee regels tegelijk',
      tekst:
        'In deze sommen staat zowel een maalteken als een plus. Doe eerst het vermenigvuldigen (daar tel je de machten op), en kijk pas daarna wat je kunt optellen.',
      voorbeeld: '2x² + x · 3x = 2x² + 3x² = 5x²',
    },
    {
      kop: 'Optellen verandert de macht niet',
      tekst: 'x² + x² is 2x², niet x⁴. Bij optellen tel je alleen het getal ervoor op; de letter en de macht blijven staan.',
      voorbeeld: '4b² + 8b² = 12b²',
    },
    {
      kop: 'Vermenigvuldigen wél',
      tekst: 'Bij keer tel je de machten op en vermenigvuldig je de getallen.',
      voorbeeld: '2x · 3x = 6x²',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '5b',
      opdracht: 'Herleid',
      invoer: 'typen',
      soort: 'uitdrukking',
      ...bouw,
    }
  },
}
