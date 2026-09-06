/** 7c — Som-product met een factor ervoor, en de vervangingsregel (reader 8.5) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { macht, term, toonSom } from '../term.ts'
import { paar } from './7b.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k·x² + k·b·x + k·c
  (rng) => {
    const x = rng.kies(['x', 'a', 'p'])
    const k = rng.kies([2, 2, 3, 4, 5])
    const m = rng.nietNul(-8, 8)
    const n = rng.nietNul(-8, 8)
    const b = m + n
    const c = m * n

    const vraag = toonSom([term(k, { [x]: 2 }), term(k * b, { [x]: 1 }), term(k * c)])
    const antwoord = `${k}${paar(x, m, n)}`

    return {
      vraag,
      antwoord,
      stappen: [
        {
          doe: `Alle drie de elementen zijn deelbaar door ${k}: zet die buiten haakjes`,
          werd: `${k}(${toonSom([term(1, { [x]: 2 }), term(b, { [x]: 1 }), term(c)])})`,
        },
        {
          doe: `Nu de som-productmethode: twee getallen met som ${b} en product ${c}`,
          werd: `${m} en ${n}`,
        },
        { doe: `Vergeet de ${k} niet terug te zetten`, werd: antwoord },
      ],
      valkuilen: [
        { fout: paar(x, m, n), heet: `Je vergat de ${k} die je aan het begin buiten haakjes hebt gezet.` },
        { fout: `${k}${paar(x, -m, -n)}`, heet: 'De tekens binnen de haakjes kloppen niet.' },
      ],
      tip: 'Eerst het gemeenschappelijke getal eruit, dan som-product, en dat getal er weer bij.',
    }
  },

  // x⁴ + bx² + c  (vervangingsregel)
  (rng) => {
    const x = rng.kies(['x', 'u', 'a'])
    const m = rng.getal(1, 6)
    const n = rng.getal(1, 6)
    const b = m + n
    const c = m * n

    const vraag = toonSom([term(1, { [x]: 4 }), term(b, { [x]: 2 }), term(c)])
    const stuk = (k: number) => `(${toonSom([term(1, { [x]: 2 }), term(k)])})`
    const antwoord = stuk(m) + stuk(n)

    return {
      vraag,
      antwoord,
      stappen: [
        {
          doe: `De exponenten 4 en 2 verhouden zich als 2:1, dus mag je ${macht(x, 2)} vervangen door t`,
          werd: `t² + ${b}t + ${c}`,
          waarom: `${macht(x, 4)} is ${macht(x, 2)} in het kwadraat, dus t².`,
        },
        { doe: `Som-product: twee getallen met som ${b} en product ${c}`, werd: `${m} en ${n}` },
        { doe: 'Ontbonden in t', werd: `(t + ${m})(t + ${n})` },
        { doe: `Zet t weer terug naar ${macht(x, 2)}`, werd: antwoord },
      ],
      valkuilen: [
        { fout: paar(x, m, n), heet: `Je zette ${x} terug in plaats van ${macht(x, 2)}.` },
      ],
      tip: 'Vervangingsregel: mag alleen als de exponenten zich verhouden als 2:1.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '7c',
  hoofdstuk: 8,
  titel: 'Ontbinden, lastiger',
  waarover: 'eerst een factor eruit, of de vervangingsregel',
  uitleg: [
    {
      kop: 'Eerst naar de vorm x² + bx + c',
      tekst:
        'De som-productmethode werkt alleen als er precies één x² staat. Staat er 2x², haal die 2 dan eerst buiten haakjes — bij álle elementen.',
      voorbeeld: '2x² + 10x − 48 = 2(x² + 5x − 24)',
    },
    {
      kop: 'En weer terugzetten',
      tekst: 'Die factor die je eruit haalde, hoort aan het eind weer voor de haakjes. Dat vergeten is de meest gemaakte fout.',
      voorbeeld: '2(x − 3)(x + 8)',
    },
    {
      kop: 'De vervangingsregel',
      tekst:
        'Zie je x⁴ en x², dan verhouden de exponenten zich als 2:1. Noem x² even t, ontbind, en zet t daarna weer terug.',
      voorbeeld: 'x⁴ + 2x² + 1 → t² + 2t + 1 = (t+1)(t+1) → (x²+1)(x²+1)',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '7c',
      opdracht: 'Ontbind in factoren',
      invoer: 'typen',
      soort: 'uitdrukking',
      ...bouw,
    }
  },
}
