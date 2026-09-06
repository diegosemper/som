/** 5d — Snijpunten van een parabool met een horizontale lijn (reader 8.4) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { term, toonGetal as g, toonSom } from '../term.ts'
import { paar } from './7b.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  (rng) => {
    const m = rng.nietNul(-6, 6)
    let n = rng.nietNul(-6, 6)
    if (n === m) n = m + 1
    const k = rng.getal(-5, 8)
    // x² + bx + c = k  met oplossingen m en n
    const b = -(m + n)
    const c = k + m * n

    return {
      opdracht: 'Bepaal de snijpunten (geef de complete coördinaten)',
      vraag: `y = ${toonSom([term(1, { x: 2 }), term(b, { x: 1 }), term(c)])}   en   y = ${g(k)}`,
      antwoord: `(${g(m)}, ${g(k)}) en (${g(n)}, ${g(k)})`,
      stappen: [
        {
          doe: 'Stel de twee formules aan elkaar gelijk',
          werd: `${toonSom([term(1, { x: 2 }), term(b, { x: 1 }), term(c)])} = ${g(k)}`,
        },
        {
          doe: 'Alles naar links, zodat er = 0 staat',
          werd: `${toonSom([term(1, { x: 2 }), term(b, { x: 1 }), term(c - k)])} = 0`,
        },
        { doe: `Som-product: som ${b} en product ${c - k}`, werd: `${-m} en ${-n}` },
        { doe: 'Ontbinden en op nul stellen', werd: `${paar('x', -m, -n)} = 0` },
        {
          doe: `De x-waarden zijn ${g(m)} en ${g(n)}; de y-waarde is allebei ${g(k)}`,
          werd: `(${g(m)}, ${g(k)}) en (${g(n)}, ${g(k)})`,
        },
      ],
      valkuilen: [
        { fout: `(${g(m)}, 0) en (${g(n)}, 0)`, heet: `De lijn ligt op hoogte ${g(k)}, dus de y-waarde van beide snijpunten is ${g(k)}.` },
        { fout: `(${g(-m)}, ${g(k)}) en (${g(-n)}, ${g(k)})`, heet: 'Tekenfout bij het oplossen van de haakjes.' },
      ],
      tip: 'Snijpunt van twee grafieken: stel ze aan elkaar gelijk en los op.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '5d',
  hoofdstuk: 8,
  titel: 'Snijpunten met een lijn',
  waarover: 'parabool en horizontale lijn',
  uitleg: [
    {
      kop: 'Gelijkstellen',
      tekst:
        'Een snijpunt is een punt waar beide formules dezelfde uitkomst geven. Dus stel je ze aan elkaar gelijk.',
      voorbeeld: 'x² + 4x − 2 = 3',
    },
    {
      kop: 'Naar nul brengen',
      tekst: 'Breng alles naar één kant, dan kun je ontbinden en de nulproductregel gebruiken.',
      voorbeeld: 'x² + 4x − 5 = 0 → (x + 5)(x − 1) = 0',
    },
    {
      kop: 'Vergeet de y niet',
      tekst:
        'De oplossingen zijn de x-waarden. De y-waarde is bij een horizontale lijn voor beide punten hetzelfde: de hoogte van die lijn.',
      voorbeeld: 'snijpunten (−6, 3) en (2, 3)',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '5d',
      invoer: 'typen',
      soort: 'coordinaat',
      ...bouw,
    }
  },
}
