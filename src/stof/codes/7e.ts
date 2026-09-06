/** 7e — Vergelijkingen oplossen: gemengde vormen (reader 8.7) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { term, toonGetal as g, toonSom } from '../term.ts'
import { paar } from './7b.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

function oplossing(x: string, w1: number, w2: number): string {
  return w1 === w2 ? `${x} = ${g(w1)}` : `${x} = ${g(w1)} ∨ ${x} = ${g(w2)}`
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k·x² + k·bx + k·c = 0  (eerst een factor eruit)
  (rng) => {
    const x = rng.kies(['x', 'p', 'a'])
    const k = rng.kies([2, 2, 3, 4])
    const m = rng.nietNul(-7, 7)
    let n = rng.nietNul(-7, 7)
    if (n === m) n = m + 1
    const b = m + n
    const c = m * n

    return {
      vraag: `${toonSom([term(k, { [x]: 2 }), term(k * b, { [x]: 1 }), term(k * c)])} = 0`,
      antwoord: oplossing(x, -m, -n),
      stappen: [
        {
          doe: `Zet ${k} buiten haakjes`,
          werd: `${k}(${toonSom([term(1, { [x]: 2 }), term(b, { [x]: 1 }), term(c)])}) = 0`,
        },
        { doe: `Som-product: som ${b} en product ${c}`, werd: `${m} en ${n}` },
        { doe: 'Ontbinden', werd: `${k}${paar(x, m, n)} = 0` },
        {
          doe: `De ${k} kan nooit 0 zijn, dus één van de haakjes moet 0 zijn`,
          werd: oplossing(x, -m, -n),
        },
      ],
      valkuilen: [
        { fout: oplossing(x, m, n), heet: 'Tekenfout: uit (x + 3) = 0 volgt x = −3.' },
      ],
      tip: 'Een getal buiten de haakjes kan nooit nul zijn — dat verandert de oplossingen niet.',
    }
  },

  // x² = ax + c
  (rng) => {
    const x = rng.kies(['x', 'b', 'y'])
    const m = rng.nietNul(-8, 8)
    let n = rng.nietNul(-8, 8)
    if (n === m) n = m + 1
    const a = m + n
    const c = -m * n

    return {
      vraag: `${toonSom([term(1, { [x]: 2 })])} = ${toonSom([term(a, { [x]: 1 }), term(c)])}`,
      antwoord: oplossing(x, m, n),
      stappen: [
        {
          doe: 'Alles naar links brengen',
          werd: `${toonSom([term(1, { [x]: 2 }), term(-a, { [x]: 1 }), term(-c)])} = 0`,
        },
        { doe: `Som-product: som ${-a} en product ${-c}`, werd: `${-m} en ${-n}` },
        { doe: 'Ontbinden', werd: `${paar(x, -m, -n)} = 0` },
        { doe: 'Elke factor op nul stellen', werd: oplossing(x, m, n) },
      ],
      valkuilen: [
        { fout: oplossing(x, -m, -n), heet: 'Tekenfout bij het overbrengen naar de andere kant.' },
        { fout: `${x} = ${g(a)}`, heet: 'Je mag niet links en rechts door x delen — dan raak je een oplossing kwijt.' },
      ],
      tip: 'Deel nooit beide kanten door de letter: dan verlies je een oplossing.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '7e',
  hoofdstuk: 8,
  titel: 'Vergelijkingen, lastiger',
  waarover: 'balansmethode plus ontbinden in één opgave',
  uitleg: [
    {
      kop: 'Altijd eerst = 0',
      tekst:
        'Breng alles naar één kant zodat er = 0 staat. Pas dan kun je ontbinden en de nulproductregel gebruiken.',
      voorbeeld: 'x² = 3x + 10 → x² − 3x − 10 = 0',
    },
    {
      kop: 'Staat er een getal vóór de x²?',
      tekst:
        'Zet dat eerst buiten haakjes. Dat getal kan zelf nooit nul zijn, dus het verandert niets aan de oplossingen.',
      voorbeeld: '2x² + 10x − 48 = 0 → 2(x − 3)(x + 8) = 0 → x = 3 ∨ x = −8',
    },
    {
      kop: 'Nooit door de letter delen',
      tekst:
        'Deel je x² = 3x aan beide kanten door x, dan ben je de oplossing x = 0 kwijt. Breng alles naar één kant en haal x buiten haakjes.',
      voorbeeld: 'x² = 3x → x² − 3x = 0 → x(x − 3) = 0 → x = 0 ∨ x = 3',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '7e',
      opdracht: 'Los op',
      invoer: 'typen',
      soort: 'oplossingen',
      ...bouw,
    }
  },
}
