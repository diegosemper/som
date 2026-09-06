/** 1d — Eén paar haakjes wegwerken (reader 4.1) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { term, toonGetal as g, toonSom, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const VOGELBEK = 'Vogelbek: het getal vóór de haakjes gaat langs álle elementen binnen de haakjes.'

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k(ax + b)
  (rng) => {
    const x = rng.kies(['x', 'a', 'p', 'c'])
    // Geen 1 of −1: dan valt er niets te vermenigvuldigen.
    const k = rng.kies([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9])
    const a = rng.nietNul(-8, 8)
    const b = rng.nietNul(-9, 9)

    const binnen = toonSom([term(a, { [x]: 1 }), term(b)])
    const uit = [term(k * a, { [x]: 1 }), term(k * b)]

    return {
      vraag: `${g(k)}(${binnen})`,
      antwoord: toonSom(uit),
      stappen: [
        { doe: `Eerste stap: ${g(k)} · ${toonTerm(term(a, { [x]: 1 }))}`, werd: toonTerm(term(k * a, { [x]: 1 })) },
        { doe: `Tweede stap: ${g(k)} · ${g(b)}`, werd: toonTerm(term(k * b)) },
        { doe: 'Achter elkaar opschrijven', werd: toonSom(uit) },
      ],
      valkuilen: [
        {
          fout: toonSom([term(k * a, { [x]: 1 }), term(b)]),
          heet: 'Je vergat het tweede element ook te vermenigvuldigen.',
        },
        {
          fout: toonSom([term(k * a, { [x]: 1 }), term(-k * b)]),
          heet: 'Tekenfout bij het tweede element: min keer min wordt plus.',
        },
      ],
      tip: VOGELBEK,
    }
  },

  // kx(ax² + bx)
  (rng) => {
    const x = rng.kies(['x', 'a', 'm', 'c'])
    const k = rng.nietNul(-8, 8)
    const a = rng.nietNul(-8, 8)
    const b = rng.nietNul(-9, 9)

    const binnen = toonSom([term(a, { [x]: 2 }), term(b, { [x]: 1 })])
    const uit = [term(k * a, { [x]: 3 }), term(k * b, { [x]: 2 })]

    return {
      vraag: `${toonTerm(term(k, { [x]: 1 }))}(${binnen})`,
      antwoord: toonSom(uit),
      stappen: [
        {
          doe: `Eerste stap: ${toonTerm(term(k, { [x]: 1 }))} · ${toonTerm(term(a, { [x]: 2 }))}`,
          werd: toonTerm(term(k * a, { [x]: 3 })),
          waarom: 'Getallen keer getallen, en de machten van dezelfde letter tel je op.',
        },
        {
          doe: `Tweede stap: ${toonTerm(term(k, { [x]: 1 }))} · ${toonTerm(term(b, { [x]: 1 }))}`,
          werd: toonTerm(term(k * b, { [x]: 2 })),
        },
        { doe: 'Achter elkaar opschrijven', werd: toonSom(uit) },
      ],
      valkuilen: [
        {
          fout: toonSom([term(k * a, { [x]: 2 }), term(k * b, { [x]: 2 })]),
          heet: `De machten moet je optellen: ${x} · ${x}² = ${x}³.`,
        },
        {
          fout: toonSom([term(k * a, { [x]: 3 }), term(b, { [x]: 1 })]),
          heet: 'Je vergat het tweede element ook te vermenigvuldigen.',
        },
      ],
      tip: VOGELBEK,
    }
  },

  // kx(ay + bz) — twee verschillende letters binnen de haakjes
  (rng) => {
    const [x, y] = rng.kies([
      ['m', 'n'],
      ['a', 'b'],
      ['p', 'q'],
      ['x', 'y'],
    ])
    const k = rng.nietNul(-8, 8)
    const a = rng.nietNul(-6, 6)
    const b = rng.nietNul(-6, 6)

    const binnen = toonSom([term(a, { [x]: 1 }), term(b, { [y]: 1 })])
    const uit = [term(k * a, { [x]: 2 }), term(k * b, { [x]: 1, [y]: 1 })]

    return {
      vraag: `${toonTerm(term(k, { [x]: 1 }))}(${binnen})`,
      antwoord: toonSom(uit),
      stappen: [
        { doe: `Eerste stap: ${toonTerm(term(k, { [x]: 1 }))} · ${toonTerm(term(a, { [x]: 1 }))}`, werd: toonTerm(term(k * a, { [x]: 2 })) },
        { doe: `Tweede stap: ${toonTerm(term(k, { [x]: 1 }))} · ${toonTerm(term(b, { [y]: 1 }))}`, werd: toonTerm(term(k * b, { [x]: 1, [y]: 1 })) },
        { doe: 'Achter elkaar opschrijven', werd: toonSom(uit) },
      ],
      valkuilen: [
        {
          fout: toonSom([term(k * a, { [x]: 2 }), term(k * b, { [y]: 1 })]),
          heet: `De ${x} van buiten de haakjes gaat ook mee naar het tweede element.`,
        },
      ],
      tip: VOGELBEK,
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '1d',
  hoofdstuk: 4,
  titel: 'Haakjes wegwerken',
  waarover: 'de vogelbekmethode: één paar haakjes',
  uitleg: [
    {
      kop: 'Waarom wegwerken',
      tekst:
        'Staat er een letter tussen de haakjes, dan kun je niet eerst uitrekenen wat erin staat. Je vermenigvuldigt dan wat vóór de haakjes staat met álles wat erin staat.',
      voorbeeld: '5(x + 2) = 5 · x + 5 · 2 = 5x + 10',
    },
    {
      kop: 'De vogelbek',
      tekst:
        'Trek in gedachten twee boogjes vanaf het getal vóór de haakjes: één naar het eerste element, één naar het tweede. Beide boogjes moet je uitrekenen.',
      voorbeeld: '2x(3x + 5) = 6x² + 10x',
    },
    {
      kop: 'Mintekens meenemen',
      tekst:
        'Staat er een minteken vóór de haakjes, dan gaat dat mee naar allebei de elementen. Min keer min wordt daarbij plus.',
      voorbeeld: '−4(2x − 7) = −8x + 28',
    },
    {
      kop: 'Machten optellen',
      tekst: 'Vermenigvuldig je letters met elkaar, dan tel je hun machten op.',
      voorbeeld: '5x · 2x² = 10x³',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '1d',
      opdracht: 'Werk de haakjes weg',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: { geenHaakjes: true, geenMaal: true },
      ...bouw,
    }
  },
}
