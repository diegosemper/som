/** 1b — Machten en wortels (reader 1.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { boven, toonGetal as g } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const KWADRAAT = 'Een macht is het grondtal net zo vaak met zichzelf vermenigvuldigen als de macht aangeeft.'

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // n² en n³
  (rng) => {
    const derde = rng.kans(0.35)
    const n = derde ? rng.getal(2, 6) : rng.getal(2, 13)
    const exp = derde ? 3 : 2
    const uit = Math.pow(n, exp)
    const uitgeschreven = Array(exp).fill(n).join(' · ')
    return {
      vraag: `${n}${boven(exp)}`,
      antwoord: g(uit),
      stappen: [
        { doe: `${n} tot de macht ${exp} betekent ${exp} keer de ${n}`, werd: uitgeschreven },
        { doe: 'Uitrekenen', werd: g(uit) },
      ],
      valkuilen: [
        { fout: g(n * exp), heet: `Je deed ${n} · ${exp}. Een macht is vermenigvuldigen mét zichzelf, niet mét de macht.` },
      ],
      tip: KWADRAAT,
    }
  },

  // 2^k, 3^k, 5^k
  (rng) => {
    const basis = rng.kies([2, 2, 3, 5])
    const exp = basis === 2 ? rng.getal(4, 7) : basis === 3 ? rng.getal(3, 5) : rng.getal(3, 4)
    const uit = Math.pow(basis, exp)
    return {
      vraag: `${basis}${boven(exp)}`,
      antwoord: g(uit),
      stappen: [
        { doe: `${exp} keer de ${basis} met elkaar vermenigvuldigen`, werd: Array(exp).fill(basis).join(' · ') },
        { doe: 'Uitrekenen', werd: g(uit) },
      ],
      valkuilen: [{ fout: g(basis * exp), heet: 'Grondtal keer macht is niet hetzelfde als grondtal tot de macht.' }],
      tip: 'De machtentabel van 2, 3 en 5 leer je uit je hoofd — die komen steeds terug.',
    }
  },

  // n⁰ = 1
  (rng) => {
    const n = rng.getal(2, 900)
    return {
      vraag: `${n}⁰`,
      antwoord: '1',
      stappen: [
        { doe: 'Elk grondtal (behalve 0) tot de macht 0 is 1', werd: '1', waarom: 'a⁰ = 1, dat is een afspraak.' },
      ],
      valkuilen: [
        { fout: '0', heet: 'Macht 0 geeft geen 0 maar 1.' },
        { fout: g(n), heet: 'Macht 0 laat het grondtal niet staan: de uitkomst is altijd 1.' },
      ],
      tip: 'a⁰ = 1, behalve als a zelf 0 is.',
    }
  },

  // 1^k = 1
  (rng) => {
    const k = rng.getal(5, 1200)
    return {
      vraag: `1${boven(k)}`,
      antwoord: '1',
      stappen: [{ doe: '1 keer 1 keer 1 … blijft altijd 1', werd: '1' }],
      valkuilen: [{ fout: g(k), heet: 'Het grondtal is 1, dus hoe vaak je ook vermenigvuldigt: 1.' }],
      tip: 'Kijk altijd eerst naar het grondtal, dan pas naar de macht.',
    }
  },

  // √ van een kwadraat
  (rng) => {
    const n = rng.getal(3, 13) // vanaf 3, anders is "delen door 2" toevallig goed
    const onder = n * n
    return {
      vraag: `√${onder}`,
      antwoord: g(n),
      stappen: [
        { doe: 'Welk getal keer zichzelf geeft ' + onder + '?', werd: `${n} · ${n} = ${onder}` },
        { doe: 'Dus de wortel is', werd: g(n) },
      ],
      valkuilen: [{ fout: g(onder / 2), heet: 'Worteltrekken is niet delen door 2.' }],
      tip: 'Staat er geen graad bij de wortel, dan is het een tweedegraads wortel.',
    }
  },

  // hogeregraads wortel
  (rng) => {
    const graad = rng.kies([3, 3, 4])
    const n = graad === 3 ? rng.getal(2, 5) : rng.getal(2, 3)
    const onder = Math.pow(n, graad)

    // Alleen hele getallen als valkuil, en nooit toevallig het goede antwoord.
    const kandidaten: { fout: number; heet: string }[] = [
      { fout: onder / graad, heet: 'De graad zegt hoe váák je vermenigvuldigt; het is geen deling.' },
      { fout: Math.sqrt(onder), heet: `Je nam de tweedegraads wortel. Hier staat een ${graad}e-graads wortel.` },
      { fout: onder / 2, heet: 'Worteltrekken is niet delen door 2.' },
    ].filter((k) => Number.isInteger(k.fout) && k.fout !== n)

    return {
      vraag: `${boven(graad)}√${onder}`,
      antwoord: g(n),
      stappen: [
        { doe: `De graad is ${graad}: welk getal moet je ${graad} keer met zichzelf vermenigvuldigen?`, werd: `${Array(graad).fill(n).join(' · ')} = ${onder}` },
        { doe: 'Dus', werd: g(n) },
      ],
      valkuilen: kandidaten.map((k) => ({ fout: g(k.fout), heet: k.heet })),
      tip: 'De graad staat klein boven het wortelteken.',
    }
  },

  // (√n)²
  (rng) => {
    const n = rng.getal(2, 13)
    const onder = n * n
    return {
      vraag: `(√${onder})²`,
      antwoord: g(onder),
      stappen: [
        { doe: 'Eerst de wortel', werd: `${n}²` },
        { doe: 'Dan het kwadraat', werd: g(onder) },
      ],
      valkuilen: [{ fout: g(n), heet: 'Je bent halverwege gestopt: het kwadraat maakt de wortel weer ongedaan.' }],
      tip: 'Kwadrateren en worteltrekken heffen elkaar op.',
    }
  },

  // −n²  tegenover  (−n)²
  (rng) => {
    const n = rng.getal(2, 9)
    const metHaakjes = rng.kans(0.5)
    if (metHaakjes) {
      return {
        vraag: `(−${n})²`,
        antwoord: g(n * n),
        stappen: [
          { doe: 'De haakjes zeggen: het minteken hoort erbij', werd: `−${n} · −${n}` },
          { doe: 'Min keer min is plus', werd: g(n * n) },
        ],
        valkuilen: [{ fout: g(-(n * n)), heet: 'Met haakjes hoort het minteken bij het grondtal: min keer min is plus.' }],
        tip: '(−3)² = 9, maar −3² = −9. Kijk naar de haakjes.',
      }
    }
    return {
      vraag: `−${n}²`,
      antwoord: g(-(n * n)),
      stappen: [
        { doe: 'Zonder haakjes hoort de macht alleen bij de ' + n, werd: `−(${n} · ${n})` },
        { doe: 'Uitrekenen', werd: g(-(n * n)) },
      ],
      valkuilen: [{ fout: g(n * n), heet: 'Zonder haakjes hoort het minteken níet bij het kwadraat: −3² = −9.' }],
      tip: '(−3)² = 9, maar −3² = −9. Kijk naar de haakjes.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '1b',
  hoofdstuk: 1,
  titel: 'Machten en wortels',
  waarover: 'grondtal, macht, graad — en het verschil tussen −3² en (−3)²',
  uitleg: [
    {
      kop: 'Wat is een macht',
      tekst:
        'Je vermenigvuldigt het grondtal net zo vaak met zichzelf als de macht aangeeft. Het kleine getal rechtsboven is de macht, het grote getal is het grondtal.',
      voorbeeld: '2⁴ = 2 · 2 · 2 · 2 = 16     5³ = 125',
    },
    {
      kop: 'Macht 0 geeft altijd 1',
      tekst: 'Elk grondtal groter dan 0 tot de macht 0 is 1. Dus 23⁰ = 1 en 635⁰ = 1. Alleen 0⁰ heeft geen waarde.',
      voorbeeld: 'a⁰ = 1',
    },
    {
      kop: 'Wortels zijn het omgekeerde',
      tekst:
        'Bij worteltrekken vraag je: welk getal moet ik met zichzelf vermenigvuldigen om dít te krijgen? Het kleine getal boven het wortelteken heet de graad en zegt hoe vaak.',
      voorbeeld: '√4 = 2     ³√8 = 2     ⁴√16 = 2',
    },
    {
      kop: 'Let op de haakjes',
      tekst:
        'Zonder haakjes hoort de macht alleen bij het getal, niet bij het minteken. Dit is de fout die op toetsen het vaakst gemaakt wordt.',
      voorbeeld: '−3² = −(3 · 3) = −9     (−3)² = −3 · −3 = 9',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '1b',
      opdracht: 'Bereken',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
