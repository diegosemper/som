/** 6b — Balansmethode met haakjes (reader 7.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { breuk, toonGemengd } from '../getal.ts'
import { term, toonGetal as g, toonSom } from '../term.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k1(ax + b) = k2(cx + d)
  (rng) => {
    const x = rng.kies(['b', 'x', 'a', 'p'])
    const k1 = rng.nietNul(-5, 5)
    const k2 = rng.nietNul(-5, 5)
    const a = rng.nietNul(-4, 4)
    const c = rng.nietNul(-4, 4)
    const b = rng.getal(-9, 9)
    const d = rng.getal(-9, 9)

    const linksX = k1 * a
    const rechtsX = k2 * c
    if (linksX === rechtsX) {
      // Geen oplossing of oneindig veel: maak er een gewone som van.
      return patroonEenvoudig(rng, x)
    }
    const opl = breuk(k2 * d - k1 * b, linksX - rechtsX)

    return {
      opdracht: `Los op (geef de waarde van ${x})`,
      vraag: `${g(k1)}(${toonSom([term(a, { [x]: 1 }), term(b)])}) = ${g(k2)}(${toonSom([term(c, { [x]: 1 }), term(d)])})`,
      antwoord: toonGemengd(opl),
      stappen: [
        {
          doe: 'Eerst de haakjes wegwerken, aan beide kanten',
          werd: `${toonSom([term(linksX, { [x]: 1 }), term(k1 * b)])} = ${toonSom([term(rechtsX, { [x]: 1 }), term(k2 * d)])}`,
        },
        {
          doe: `Alle ${x}-en naar links, alle getallen naar rechts (tekens klappen om)`,
          werd: `${toonSom([term(linksX - rechtsX, { [x]: 1 })])} = ${g(k2 * d - k1 * b)}`,
        },
        { doe: `Delen door ${g(linksX - rechtsX)}`, werd: toonGemengd(opl) },
      ],
      valkuilen: [
        { fout: toonGemengd(breuk(k2 * d - k1 * b, linksX + rechtsX)), heet: `De ${x}-en moet je van elkaar aftrekken, niet optellen.` },
        { fout: toonGemengd(breuk(k1 * b - k2 * d, linksX - rechtsX)), heet: 'Tekenfout bij het overbrengen van de getallen.' },
      ],
      tip: 'Eerst haakjes weg, dan pas balanceren.',
    }
  },

  // k(ax + b) = c
  (rng) => patroonEenvoudig(rng, rng.kies(['x', 'y', 'q'])),
]

function patroonEenvoudig(rng: Rng, x: string): Bouwsel {
  const k = rng.nietNul(-6, 6)
  const a = rng.nietNul(-5, 5)
  const b = rng.getal(-9, 9)
  const opl = rng.nietNul(-8, 8)
  const c = k * (a * opl + b)

  return {
    opdracht: `Los op (geef de waarde van ${x})`,
    vraag: `${g(k)}(${toonSom([term(a, { [x]: 1 }), term(b)])}) = ${g(c)}`,
    antwoord: g(opl),
    stappen: [
      { doe: 'Haakjes wegwerken', werd: `${toonSom([term(k * a, { [x]: 1 }), term(k * b)])} = ${g(c)}` },
      { doe: `Breng ${g(k * b)} naar de andere kant`, werd: `${toonSom([term(k * a, { [x]: 1 })])} = ${g(c - k * b)}` },
      { doe: `Deel door ${g(k * a)}`, werd: g(opl) },
    ],
    valkuilen: [
      { fout: g(-opl), heet: 'Tekenfout: let op de mintekens bij het wegwerken van de haakjes.' },
      { fout: toonGemengd(breuk(c, k * a)), heet: `Je vergat de ${g(k * b)} eerst weg te werken.` },
    ],
    tip: 'Werk eerst de haakjes weg; daarna is het een gewone balanssom.',
  }
}

export const onderwerp: Onderwerp = {
  code: '6b',
  hoofdstuk: 7,
  titel: 'Balansmethode met haakjes',
  waarover: 'eerst haakjes weg, dan balanceren',
  uitleg: [
    {
      kop: 'Volgorde',
      tekst:
        'Staan er haakjes in de vergelijking, werk die dan eerst aan beide kanten weg. Pas daarna ga je balanceren.',
      voorbeeld: '−2(2b − 5) = −2(3b + 4) → −4b + 10 = −6b − 8',
    },
    {
      kop: 'Letters naar één kant',
      tekst:
        'Breng alle termen met de letter naar de ene kant en alle losse getallen naar de andere. Elk teken dat oversteekt, klapt om.',
      voorbeeld: '−4b + 6b = −8 − 10 → 2b = −18',
    },
    {
      kop: 'Tot slot delen',
      tekst: 'Deel beide kanten door het getal dat vóór de letter staat.',
      voorbeeld: '2b = −18 → b = −9',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '6b',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
