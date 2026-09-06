/** 5a — Herleiden: rekenen met letters (reader 2.2 en 2.3.1) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { herleid, term, toonSom, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip' | 'vorm'>

const APPELS = 'Alleen termen met precies dezelfde letters én machten mag je bij elkaar optellen. Appels en bananen niet.'

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k1·L + k2·M + k3·L
  (rng) => {
    const [l, m] = rng.kies([['a', 'b'], ['x', 'y'], ['b', 'c'], ['f', 'g']])
    const k1 = rng.nietNul(-8, 8)
    const k2 = rng.nietNul(-8, 8)
    const k3 = rng.nietNul(-8, 8)
    const stukken = [term(k1, { [l]: 1 }), term(k2, { [m]: 1 }), term(k3, { [l]: 1 })]
    const uit = herleid(stukken)
    return {
      vraag: toonSom(stukken),
      antwoord: toonSom(uit),
      stappen: [
        { doe: `Zoek de termen met dezelfde letter: die met ${l}`, werd: `${toonTerm(stukken[0])} en ${toonTerm(stukken[2])}` },
        { doe: 'Tel die coëfficiënten bij elkaar op', werd: toonTerm(term(k1 + k3, { [l]: 1 })) },
        { doe: `De ${m} staat er alleen voor en blijft staan`, werd: toonSom(uit) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 + k2 + k3, { [l]: 1 })), heet: `Je telde de ${m} mee bij de ${l}. Verschillende letters kun je niet optellen.` },
      ],
      tip: APPELS,
    }
  },

  // k1·L² + k2·L² + k3·M²  (machten meetellen)
  (rng) => {
    const [l, m] = rng.kies([['y', 'x'], ['b', 'a'], ['x', 'y']])
    const k1 = rng.nietNul(-9, 9)
    const k2 = rng.nietNul(-9, 9)
    const k3 = rng.nietNul(-6, 6)
    const machtM = rng.kies([1, 2])
    const stukken = [term(k1, { [l]: 2 }), term(k2, { [l]: 2 }), term(k3, { [m]: machtM })]
    const uit = herleid(stukken)
    return {
      vraag: toonSom(stukken),
      antwoord: toonSom(uit),
      stappen: [
        { doe: `De twee termen met ${l}² zijn gelijksoortig`, werd: toonTerm(term(k1 + k2, { [l]: 2 })) },
        { doe: 'De rest blijft ongemoeid', werd: toonSom(uit) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 + k2 + k3, { [l]: 2 })), heet: 'Andere letter of andere macht = andere soort. Niet optellen.' },
      ],
      tip: APPELS,
    }
  },

  // k1·f + k2·f · k3·g   (eerst vermenigvuldigen!)
  (rng) => {
    const [f, gLetter] = rng.kies([['f', 'g'], ['a', 'b'], ['m', 'n'], ['x', 'y']])
    const k1 = rng.nietNul(-6, 6)
    const k2 = rng.getal(2, 6)
    const k3 = rng.getal(2, 6)
    const vraag = `${toonTerm(term(k1, { [f]: 1 }))} + ${toonTerm(term(k2, { [f]: 1 }))} · ${toonTerm(term(k3, { [gLetter]: 1 }))}`
    const uit = [term(k1, { [f]: 1 }), term(k2 * k3, { [f]: 1, [gLetter]: 1 })]
    return {
      vraag,
      antwoord: toonSom(uit),
      vorm: { geenMaal: true },
      stappen: [
        { doe: 'Rekenvolgorde: eerst het vermenigvuldigen', werd: `${toonTerm(term(k1, { [f]: 1 }))} + ${toonTerm(term(k2 * k3, { [f]: 1, [gLetter]: 1 }))}`, waarom: 'V gaat vóór O.' },
        { doe: `${f} en ${f}${gLetter} zijn niet gelijksoortig, dus verder kan het niet`, werd: toonSom(uit) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 + k2 * k3, { [f]: 1, [gLetter]: 1 })), heet: `${f} en ${f}${gLetter} zijn verschillende soorten: die kun je niet optellen.` },
        { fout: toonSom([term(k1, { [f]: 1 }), term(k2 + k3, { [f]: 1, [gLetter]: 1 })]), heet: 'Bij vermenigvuldigen moet je de getallen keer elkaar doen, niet optellen.' },
      ],
      tip: 'Vermenigvuldigen mag altijd — a · b = ab. Optellen alleen bij gelijke soorten.',
    }
  },

  // ab + k1·a · k2·b
  (rng) => {
    const [a, b] = rng.kies([['a', 'b'], ['x', 'y'], ['p', 'q']])
    const k1 = rng.getal(2, 5)
    const k2 = rng.getal(2, 5)
    const vraag = `${a}${b} + ${toonTerm(term(k1, { [a]: 1 }))} · ${toonTerm(term(k2, { [b]: 1 }))}`
    const uit = [term(1 + k1 * k2, { [a]: 1, [b]: 1 })]
    return {
      vraag,
      antwoord: toonSom(uit),
      vorm: { geenMaal: true },
      stappen: [
        { doe: 'Eerst vermenigvuldigen', werd: `${a}${b} + ${toonTerm(term(k1 * k2, { [a]: 1, [b]: 1 }))}` },
        { doe: `Nu zijn beide termen ${a}${b}: optellen mag`, werd: toonSom(uit) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 * k2, { [a]: 1, [b]: 1 })), heet: `Je vergat de losse ${a}${b} aan het begin mee te tellen (die heeft coëfficiënt 1).` },
      ],
      tip: APPELS,
    }
  },

  // k1·x · k2·y + k3·x²y
  (rng) => {
    const [x, y] = rng.kies([['x', 'y'], ['a', 'b'], ['p', 'q']])
    const k1 = rng.getal(2, 6)
    const k2 = rng.getal(2, 6)
    const k3 = rng.nietNul(-8, 8)
    const vraag = `${toonTerm(term(k1, { [x]: 1 }))} · ${toonTerm(term(k2, { [y]: 1 }))} + ${toonTerm(term(k3, { [x]: 2, [y]: 1 }))}`
    const uit = [term(k1 * k2, { [x]: 1, [y]: 1 }), term(k3, { [x]: 2, [y]: 1 })]
    return {
      vraag,
      antwoord: toonSom(uit),
      vorm: { geenMaal: true },
      stappen: [
        { doe: 'Eerst vermenigvuldigen', werd: `${toonTerm(term(k1 * k2, { [x]: 1, [y]: 1 }))} + ${toonTerm(term(k3, { [x]: 2, [y]: 1 }))}` },
        { doe: `${x}${y} en ${x}²${y} zijn niet gelijksoortig — klaar`, werd: toonSom(uit) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 * k2 + k3, { [x]: 1, [y]: 1 })), heet: `Let op de macht: ${x}${y} en ${x}²${y} zijn verschillende soorten.` },
      ],
      tip: APPELS,
    }
  },

  // Kan niet verder
  (rng) => {
    const [a, b] = rng.kies([['c', 'a'], ['m', 'n'], ['x', 'y'], ['p', 'r']])
    const k1 = rng.nietNul(-8, 8)
    const k2 = rng.nietNul(-8, 8)
    const stukken = [term(k1, { [a]: 1 }), term(k2, { [b]: 1 })]
    return {
      vraag: toonSom(stukken),
      antwoord: toonSom(stukken),
      stappen: [
        { doe: `${a} en ${b} zijn verschillende soorten`, werd: toonSom(stukken), waarom: 'Appels en bananen tel je niet bij elkaar op.' },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 + k2, { [a]: 1 })), heet: 'Verschillende letters mag je niet samenvoegen.' },
        { fout: toonTerm(term(k1 + k2, { [a]: 1, [b]: 1 })), heet: 'Optellen maakt er geen product van: dit blijft twee losse termen.' },
      ],
      tip: 'Soms is het antwoord: dit kan niet eenvoudiger. Schrijf dan gewoon de som over.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '5a',
  hoofdstuk: 2,
  titel: 'Herleiden met letters',
  waarover: 'gelijksoortige termen samenvoegen',
  uitleg: [
    {
      kop: 'Appels en bananen',
      tekst:
        'Je mag alleen termen bij elkaar optellen die exact dezelfde letters én dezelfde machten hebben. 2a + 3a = 5a, maar 5b + 3a blijft 5b + 3a.',
      voorbeeld: '2a + 3a = 5a     5b + 3a = 5b + 3a',
    },
    {
      kop: 'Machten tellen mee',
      tekst: 'a³ en a² zijn verschillende soorten. Die kun je pas optellen als je weet welk getal a is.',
      voorbeeld: '2a² + 3a = 2a² + 3a (klaar)',
    },
    {
      kop: 'Vermenigvuldigen mag altijd',
      tekst:
        'Optellen van verschillende letters kan niet, maar vermenigvuldigen wel. a · b wordt gewoon ab — een nieuwe soort, zoals de nashi-peer.',
      voorbeeld: '3a · 2b = 6ab',
    },
    {
      kop: 'Denk aan de volgorde',
      tekst: 'Staat er een maalteken in de som, dan doe je dat eerst — pas daarna optellen.',
      voorbeeld: '2a · 3b + 3b = 6ab + 3b',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '5a',
      opdracht: 'Herleid indien mogelijk',
      invoer: 'typen',
      soort: 'uitdrukking',
      ...bouw,
    }
  },
}
