/** 2a — Breuken vereenvoudigen, optellen en aftrekken (reader 5.1 en 5.2) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { breuk, ggd, toonBreuk, toonGemengd } from '../getal.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

/**
 * De valkuil "maar half vereenvoudigd": deel door de kleinste priemfactor in
 * plaats van door de grootste gemeenschappelijke deler. Levert alleen een
 * valkuil op als dat ook echt een ándere breuk geeft.
 */
function halveStap(teller: number, noemer: number, factor: number) {
  for (const priem of [2, 3, 5, 7]) {
    if (factor % priem === 0 && factor !== priem) {
      return [
        {
          fout: `${teller / priem}/${noemer / priem}`,
          heet: 'Je bent halverwege gestopt: deel door het grótste gemeenschappelijke getal.',
        },
      ]
    }
  }
  return []
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // Vereenvoudigen
  (rng) => {
    const kern = rng.kies([
      [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [3, 7], [5, 8], [4, 9],
    ])
    const factor = rng.getal(2, 9)
    const teller = kern[0] * factor
    const noemer = kern[1] * factor
    return {
      opdracht: 'Vereenvoudig de breuk',
      vraag: `${teller}/${noemer}`,
      antwoord: toonBreuk(breuk(teller, noemer)),
      stappen: [
        { doe: 'Zoek het grootste getal waar teller én noemer door deelbaar zijn', werd: String(ggd(teller, noemer)) },
        { doe: 'Deel allebei door dat getal', werd: `${teller} ÷ ${factor} = ${kern[0]} en ${noemer} ÷ ${factor} = ${kern[1]}` },
        { doe: 'Kan het nog verder? Nee', werd: toonBreuk(breuk(teller, noemer)) },
      ],
      valkuilen: halveStap(teller, noemer, factor),
      tip: 'Blijf checken: kan het nog verder? Pas als er geen deler meer is, ben je klaar.',
    }
  },

  // Zelfde noemer optellen of aftrekken
  (rng) => {
    const noemer = rng.getal(4, 12)
    const a = rng.getal(1, noemer - 1)
    const min = rng.kans(0.4)
    const b = min ? rng.getal(1, a) : rng.getal(1, noemer - 1)
    const uit = breuk(min ? a - b : a + b, noemer)
    return {
      opdracht: 'Schrijf als één breuk en vereenvoudig zo ver mogelijk',
      vraag: `${a}/${noemer} ${min ? '−' : '+'} ${b}/${noemer}`,
      antwoord: toonGemengd(uit),
      stappen: [
        { doe: 'De noemers zijn al gelijk, dus alleen de tellers doen mee', werd: `${min ? a - b : a + b}/${noemer}` },
        { doe: 'Vereenvoudigen', werd: toonGemengd(uit) },
      ],
      valkuilen: [
        { fout: `${min ? a - b : a + b}/${noemer * 2}`, heet: 'De noemer blijft staan; alleen de tellers tel je op.' },
      ],
      tip: 'Gelijke noemers? Dan tel je alleen de tellers op of trek je ze af.',
    }
  },

  // Verschillende noemers
  (rng) => {
    const n1 = rng.getal(2, 9)
    let n2 = rng.getal(2, 9)
    if (n2 === n1) n2 = n1 + 1
    const t1 = rng.getal(1, n1 - 1 || 1)
    const t2 = rng.getal(1, n2 - 1 || 1)
    const min = rng.kans(0.4) && t1 * n2 > t2 * n1
    const noemer = n1 * n2
    const teller = min ? t1 * n2 - t2 * n1 : t1 * n2 + t2 * n1
    const uit = breuk(teller, noemer)
    return {
      opdracht: 'Schrijf als één breuk en vereenvoudig zo ver mogelijk',
      vraag: `${t1}/${n1} ${min ? '−' : '+'} ${t2}/${n2}`,
      antwoord: toonGemengd(uit),
      stappen: [
        { doe: 'Maak de noemers gelijk door ze met elkaar te vermenigvuldigen', werd: `${n1} · ${n2} = ${noemer}` },
        {
          doe: 'Wat je met de noemer doet, doe je ook met de teller',
          werd: `${t1 * n2}/${noemer} ${min ? '−' : '+'} ${t2 * n1}/${noemer}`,
        },
        { doe: 'Nu de tellers optellen of aftrekken', werd: `${teller}/${noemer}` },
        { doe: 'Vereenvoudigen', werd: toonGemengd(uit) },
      ],
      valkuilen: [
        {
          fout: `${min ? t1 - t2 : t1 + t2}/${min ? n1 - n2 : n1 + n2}`,
          heet: 'Je telde tellers én noemers op. Eerst de noemers gelíjk maken, dan pas de tellers optellen.',
        },
      ],
      tip: 'Ongelijke noemers? Vermenigvuldig ze met elkaar en pas de tellers mee aan.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '2a',
  hoofdstuk: 5,
  titel: 'Breuken optellen',
  waarover: 'vereenvoudigen, gelijknamig maken, optellen en aftrekken',
  uitleg: [
    {
      kop: 'Teller en noemer',
      tekst:
        'Boven de streep staat de teller: hoeveel stukken je hebt. Onder de streep de noemer: uit hoeveel stukken het geheel bestaat.',
      voorbeeld: '3/6 van een pizza is een halve pizza',
    },
    {
      kop: 'Vereenvoudigen',
      tekst:
        'Deel teller en noemer door hetzelfde getal — zoek het grootste dat past. Blijf daarna checken of het nog verder kan.',
      voorbeeld: '14/21 = 2/3     56/64 = 7/8',
    },
    {
      kop: 'Optellen mag alleen bij gelijke noemers',
      tekst: 'Zijn de noemers gelijk, dan tel je alleen de tellers op. De noemer blijft staan.',
      voorbeeld: '3/8 + 2/8 = 5/8',
    },
    {
      kop: 'Ongelijke noemers eerst gelijk maken',
      tekst:
        'De makkelijkste manier: vermenigvuldig de noemers met elkaar. Wat je met de noemer doet, moet je ook met de teller doen.',
      voorbeeld: '5/8 + 1/6 = 30/48 + 8/48 = 38/48 = 19/24',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '2a',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
