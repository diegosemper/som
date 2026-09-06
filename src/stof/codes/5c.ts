/** 5c — Snijpunten met de x-as en de y-as (reader 8.4 en 8.6) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { term, toonGetal as g, toonSom } from '../term.ts'
import { paar } from './7b.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  (rng) => {
    const m = rng.nietNul(-7, 7)
    let n = rng.nietNul(-7, 7)
    if (n === m) n = m + 1
    const b = m + n
    const c = m * n
    const formule = `y = ${toonSom([term(1, { x: 2 }), term(b, { x: 1 }), term(c)])}`
    const yAs = rng.kans(0.35)

    if (yAs) {
      return {
        opdracht: 'Bepaal het snijpunt met de y-as (geef de complete coördinaten)',
        vraag: formule,
        antwoord: `(0, ${g(c)})`,
        stappen: [
          { doe: 'Een snijpunt met de y-as betekent dat x = 0', werd: `y = 0² + ${b} · 0 + ${g(c)}` },
          { doe: 'Uitrekenen', werd: `y = ${g(c)}` },
          { doe: 'Complete coördinaten opschrijven', werd: `(0, ${g(c)})` },
        ],
        valkuilen: [
          { fout: `(${g(c)}, 0)`, heet: 'De coördinaten staan omgedraaid: eerst x, dan y.' },
        ],
        tip: 'Snijpunt met de y-as: vul x = 0 in.',
      }
    }

    return {
      opdracht: 'Bepaal de snijpunten met de x-as (geef de complete coördinaten)',
      vraag: formule,
      antwoord: `(${g(-m)}, 0) en (${g(-n)}, 0)`,
      stappen: [
        { doe: 'Een snijpunt met de x-as betekent dat y = 0', werd: `${toonSom([term(1, { x: 2 }), term(b, { x: 1 }), term(c)])} = 0` },
        { doe: `Som-product: som ${b} en product ${c}`, werd: `${m} en ${n}` },
        { doe: 'Ontbinden in factoren', werd: `${paar('x', m, n)} = 0` },
        { doe: 'Elke factor op nul stellen', werd: `x = ${g(-m)} ∨ x = ${g(-n)}` },
        { doe: 'En dan de complete coördinaten', werd: `(${g(-m)}, 0) en (${g(-n)}, 0)` },
      ],
      valkuilen: [
        { fout: `(${g(m)}, 0) en (${g(n)}, 0)`, heet: 'Tekenfout: uit (x + 3) = 0 volgt x = −3.' },
        { fout: `(0, ${g(-m)}) en (0, ${g(-n)})`, heet: 'Op de x-as is de y-waarde 0, dus het getal hoort vooraan.' },
      ],
      tip: 'x-as: y = 0. y-as: x = 0. En schrijf altijd de complete coördinaten op.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '5c',
  hoofdstuk: 8,
  titel: 'Snijpunten met de assen',
  waarover: 'waar snijdt de parabool de x-as en de y-as',
  uitleg: [
    {
      kop: 'De y-as is makkelijk',
      tekst: 'Op de y-as is x gelijk aan 0. Vul dat in en je hebt de y-waarde meteen.',
      voorbeeld: 'y = x² + 5x + 6 → bij x = 0 is y = 6, dus (0, 6)',
    },
    {
      kop: 'De x-as vraagt ontbinden',
      tekst:
        'Op de x-as is y gelijk aan 0. Stel de formule op nul, ontbind in factoren en stel elke factor apart op nul.',
      voorbeeld: 'x² + 5x + 6 = 0 → (x + 3)(x + 2) = 0 → x = −3 ∨ x = −2',
    },
    {
      kop: 'Complete coördinaten',
      tekst:
        'Een snijpunt is een punt, dus schrijf altijd beide getallen op: eerst de x, dan de y. Alleen "x = −3" is fout gerekend.',
      voorbeeld: '(−3, 0) en (−2, 0)',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '5c',
      invoer: 'typen',
      soort: 'coordinaat',
      ...bouw,
    }
  },
}
