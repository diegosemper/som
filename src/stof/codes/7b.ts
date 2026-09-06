/** 7b — Ontbinden in factoren met de som-productmethode (reader 8.5) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { term, toonSom } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

/** (x + m)(x + n), netjes met − als m of n negatief is. */
export function paar(x: string, m: number, n: number): string {
  const deel = (k: number) => `(${toonSom([term(1, { [x]: 1 }), term(k)])})`
  return deel(m) + deel(n)
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  (rng) => {
    const x = rng.kies(['x', 'a', 'p', 'b'])
    const m = rng.nietNul(-9, 9)
    const n = rng.nietNul(-9, 9)
    const b = m + n
    const c = m * n

    const vraag = toonSom([term(1, { [x]: 2 }), term(b, { [x]: 1 }), term(c)])

    return {
      vraag,
      antwoord: paar(x, m, n),
      stappen: [
        {
          doe: `Zoek twee getallen die opgeteld ${b} zijn en vermenigvuldigd ${c}`,
          werd: `${m} en ${n}`,
          waarom: `${m} + ${n} = ${b} en ${m} · ${n} = ${c}`,
        },
        { doe: 'Zet die getallen in twee paar haakjes', werd: paar(x, m, n) },
        { doe: 'Controle: haakjes wegwerken geeft weer de opgave', werd: paar(x, m, n) },
      ],
      valkuilen: [
        { fout: paar(x, -m, -n), heet: 'Beide tekens omgedraaid. Let op: het product moet ook kloppen.' },
        { fout: paar(x, b, c), heet: 'Je zette de b en de c in de haakjes. Je moet twee getallen zoeken met som b en product c.' },
      ],
      tip: 'Som-product: zoek n en m met n + m = b en n · m = c. Dan is het (x + m)(x + n).',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '7b',
  hoofdstuk: 8,
  titel: 'Som-productmethode',
  waarover: 'x² + bx + c ontbinden in twee paar haakjes',
  uitleg: [
    {
      kop: 'De methode',
      tekst:
        'Wil je x² + bx + c ontbinden, zoek dan twee getallen n en m waarvoor geldt: n + m = b én n · m = c. Die twee zet je in de haakjes.',
      voorbeeld: 'x² + 5x + 6 → 2 + 3 = 5 en 2 · 3 = 6 → (x + 2)(x + 3)',
    },
    {
      kop: 'Let op de tekens',
      tekst:
        'Min keer min is plus. Is het product negatief, dan is precies één van de twee getallen negatief. Is het product positief en de som negatief, dan zijn ze allebei negatief.',
      voorbeeld: 'x² + 5x − 24 → −3 en 8, want −3 + 8 = 5 en −3 · 8 = −24',
    },
    {
      kop: 'Altijd even controleren',
      tekst: 'Werk de haakjes weer weg met de vogelbekmethode. Kom je op de oorspronkelijke som uit, dan klopt het.',
      voorbeeld: '(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '7b',
      opdracht: 'Ontbind in factoren',
      invoer: 'typen',
      soort: 'uitdrukking',
      ...bouw,
    }
  },
}
