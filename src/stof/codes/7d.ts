/** 7d — Vergelijkingen oplossen door ontbinden in factoren (reader 8.7) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { term, toonGetal as g, toonSom } from '../term.ts'
import { paar } from './7b.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

function oplossing(x: string, w1: number, w2: number): string {
  return w1 === w2 ? `${x} = ${g(w1)}` : `${x} = ${g(w1)} ∨ ${x} = ${g(w2)}`
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // x² + bx + c = 0
  (rng) => {
    const x = rng.kies(['x', 'a', 'p'])
    const dubbel = rng.kans(0.25)
    const m = rng.nietNul(-9, 9)
    const n = dubbel ? m : rng.nietNul(-9, 9)
    const b = m + n
    const c = m * n

    return {
      vraag: `${toonSom([term(1, { [x]: 2 }), term(b, { [x]: 1 }), term(c)])} = 0`,
      antwoord: oplossing(x, -m, -n),
      stappen: [
        { doe: `Som-product: twee getallen met som ${b} en product ${c}`, werd: `${m} en ${n}` },
        { doe: 'Ontbinden in factoren', werd: `${paar(x, m, n)} = 0` },
        {
          doe: 'Een product is 0 als één van de factoren 0 is',
          werd: `${toonSom([term(1, { [x]: 1 }), term(m)])} = 0 of ${toonSom([term(1, { [x]: 1 }), term(n)])} = 0`,
        },
        { doe: 'Los allebei op', werd: oplossing(x, -m, -n) },
      ],
      valkuilen: [
        { fout: oplossing(x, m, n), heet: 'Tekenfout: uit (x + 3) = 0 volgt x = −3, niet x = 3.' },
      ],
      tip: 'A · B = 0 betekent dat A = 0 óf B = 0.',
    }
  },

  // ax + q = x² + r
  (rng) => {
    const x = rng.kies(['b', 'x', 'a'])
    const m = rng.nietNul(-8, 8)
    let n = rng.nietNul(-8, 8)
    if (n === m) n = m + 1
    const a = m + n
    const q = rng.getal(-30, 30)
    const r = q + m * n

    return {
      vraag: `${toonSom([term(a, { [x]: 1 }), term(q)])} = ${toonSom([term(1, { [x]: 2 }), term(r)])}`,
      antwoord: oplossing(x, m, n),
      stappen: [
        {
          doe: 'Breng alles naar één kant met de balansmethode',
          werd: `${toonSom([term(1, { [x]: 2 }), term(-a, { [x]: 1 }), term(r - q)])} = 0`,
        },
        { doe: `Som-product: som ${-a} en product ${r - q}`, werd: `${-m} en ${-n}` },
        { doe: 'Ontbinden', werd: `${paar(x, -m, -n)} = 0` },
        { doe: 'Elke factor apart op 0 stellen', werd: oplossing(x, m, n) },
      ],
      valkuilen: [
        { fout: oplossing(x, -m, -n), heet: 'Tekenfout bij het oplossen van de losse haakjes.' },
      ],
      tip: 'Eerst alles naar één kant, dan pas ontbinden.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '7d',
  hoofdstuk: 8,
  titel: 'Vergelijkingen oplossen',
  waarover: 'ontbinden en dan elke factor op nul stellen',
  uitleg: [
    {
      kop: 'Wat je zoekt',
      tekst: 'Bij een vergelijking oplossen zoek je alle waarden van de letter waarvoor de vergelijking klopt.',
      voorbeeld: 'x² − 16x + 64 = 0 → x = 8',
    },
    {
      kop: 'Eerst alles naar één kant',
      tekst: 'Staat er iets aan beide kanten, gebruik dan de balansmethode zodat er = 0 komt te staan.',
      voorbeeld: 'b + 28 = b² − 2 → −b² + b + 30 = 0',
    },
    {
      kop: 'De nulproductregel',
      tekst:
        'Na het ontbinden staat er een vermenigvuldiging die 0 moet zijn. Dat kan alleen als één van de factoren 0 is — dus stel ze allebei apart op nul.',
      voorbeeld: '(x + 3)(x + 2) = 0 → x = −3 ∨ x = −2',
    },
    {
      kop: 'Twee antwoorden is normaal',
      tekst:
        'Meestal komen er twee oplossingen uit. Soms vallen ze samen en is er maar één. Schrijf ze met ∨ (of) ertussen.',
      voorbeeld: 'x = 6 ∨ x = −5',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '7d',
      opdracht: 'Los op',
      invoer: 'typen',
      soort: 'oplossingen',
      ...bouw,
    }
  },
}
