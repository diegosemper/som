/** 1e — Dubbele haakjes wegwerken (reader 4.2) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { term, toonGetal as g, toonSom, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // (x + p)(x + q)
  (rng) => {
    const x = rng.kies(['x', 'a', 'p', 'b'])
    const p = rng.nietNul(-9, 9)
    const q = rng.nietNul(-9, 9)

    const links = toonSom([term(1, { [x]: 1 }), term(p)])
    const rechts = toonSom([term(1, { [x]: 1 }), term(q)])
    const uit = [term(1, { [x]: 2 }), term(p + q, { [x]: 1 }), term(p * q)]

    return {
      vraag: `(${links})(${rechts})`,
      antwoord: toonSom(uit),
      stappen: [
        {
          doe: `Eerste boog: de ${x} van links langs beide elementen rechts`,
          werd: toonSom([term(1, { [x]: 2 }), term(q, { [x]: 1 })]),
        },
        {
          doe: `Tweede boog: de ${g(p)} van links langs beide elementen rechts`,
          werd: toonSom([term(p, { [x]: 1 }), term(p * q)]),
        },
        {
          doe: 'Alles achter elkaar zetten',
          werd: toonSom([term(1, { [x]: 2 }), term(q, { [x]: 1 }), term(p, { [x]: 1 }), term(p * q)]),
        },
        { doe: `De losse ${x}-en bij elkaar optellen`, werd: toonSom(uit) },
      ],
      valkuilen: [
        {
          fout: toonSom([term(1, { [x]: 2 }), term(p * q)]),
          heet: 'Je deed alleen de buitenste en de binnenste niet — de twee middelste termen ontbreken.',
        },
        {
          fout: toonSom([term(1, { [x]: 2 }), term(p + q, { [x]: 1 }), term(-p * q)]),
          heet: 'Tekenfout in het laatste getal: let op min keer min.',
        },
        {
          fout: toonSom([term(1, { [x]: 2 }), term(p * q, { [x]: 1 }), term(p + q)]),
          heet: 'Je hebt optellen en vermenigvuldigen verwisseld: de middelste term is de som, het laatste getal het product.',
        },
      ],
      tip: 'Vier vermenigvuldigingen: elk element links gaat langs elk element rechts.',
    }
  },

  // (ax + p)(x + q)
  (rng) => {
    const x = rng.kies(['x', 'a', 'y'])
    const a = rng.getal(2, 5)
    const p = rng.nietNul(-7, 7)
    const q = rng.nietNul(-7, 7)

    const links = toonSom([term(a, { [x]: 1 }), term(p)])
    const rechts = toonSom([term(1, { [x]: 1 }), term(q)])
    const uit = [term(a, { [x]: 2 }), term(a * q + p, { [x]: 1 }), term(p * q)]

    return {
      vraag: `(${links})(${rechts})`,
      antwoord: toonSom(uit),
      stappen: [
        {
          doe: `Eerste boog: ${toonTerm(term(a, { [x]: 1 }))} langs beide elementen rechts`,
          werd: toonSom([term(a, { [x]: 2 }), term(a * q, { [x]: 1 })]),
        },
        {
          doe: `Tweede boog: ${g(p)} langs beide elementen rechts`,
          werd: toonSom([term(p, { [x]: 1 }), term(p * q)]),
        },
        {
          doe: 'Alles achter elkaar',
          werd: toonSom([term(a, { [x]: 2 }), term(a * q, { [x]: 1 }), term(p, { [x]: 1 }), term(p * q)]),
        },
        { doe: `De losse ${x}-en samenvoegen`, werd: toonSom(uit) },
      ],
      valkuilen: [
        {
          fout: toonSom([term(a, { [x]: 2 }), term(p * q)]),
          heet: 'De twee middelste termen ontbreken.',
        },
        {
          fout: toonSom([term(a, { [x]: 2 }), term(q + p, { [x]: 1 }), term(p * q)]),
          heet: `Je vergat de ${a} mee te nemen bij het kruislings vermenigvuldigen.`,
        },
      ],
      tip: 'Vier vermenigvuldigingen: elk element links gaat langs elk element rechts.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '1e',
  hoofdstuk: 4,
  titel: 'Dubbele haakjes',
  waarover: '(x + 3)(x − 2) uitwerken',
  uitleg: [
    {
      kop: 'Twee paar haakjes',
      tekst:
        'Staan er twee paar haakjes naast elkaar, dan gaat elk element uit het linkerpaar langs elk element uit het rechterpaar. Dat zijn dus vier vermenigvuldigingen.',
      voorbeeld: '(x + 3)(x − 2)',
    },
    {
      kop: 'Stap voor stap',
      tekst: 'Eerst de linker x langs beide, dan het linkergetal langs beide. Schrijf alles achter elkaar op.',
      voorbeeld: 'x·x + x·−2 + 3·x + 3·−2 = x² − 2x + 3x − 6',
    },
    {
      kop: 'Tot slot samenvoegen',
      tekst: 'Alleen de termen met precies dezelfde letter én macht mag je bij elkaar optellen.',
      voorbeeld: 'x² − 2x + 3x − 6 = x² + x − 6',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '1e',
      opdracht: 'Werk de haakjes weg',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: { geenHaakjes: true, geenMaal: true },
      ...bouw,
    }
  },
}
