/** 7a — Ontbinden in factoren: buiten haakjes halen (reader 4.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { ggd } from '../getal.ts'
import { term, toonSom, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip' | 'vorm'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k1·x + k2   ->  d(k1/d·x + k2/d)
  (rng) => {
    const x = rng.kies(['u', 'x', 'a', 'q'])
    const d = rng.kies([3, 4, 5, 6, 7, 8, 9])
    const p = rng.getal(2, 9)
    const q = rng.getal(2, 9)
    const k1 = d * p
    const k2 = d * q
    if (ggd(p, q) !== 1) {
      // Nog een gemeenschappelijke deler: neem die meteen mee.
      const extra = ggd(p, q)
      const dd = d * extra
      const binnen = toonSom([term(p / extra, { [x]: 1 }), term(q / extra)])
      return {
        vraag: toonSom([term(k1, { [x]: 1 }), term(k2)]),
        antwoord: `${dd}(${binnen})`,
        vorm: { factor: String(dd) },
        stappen: [
          { doe: `Zoek de grootste gemeenschappelijke deler van ${k1} en ${k2}`, werd: String(dd) },
          { doe: 'Deel beide elementen daardoor', werd: `${k1} ÷ ${dd} = ${k1 / dd} en ${k2} ÷ ${dd} = ${k2 / dd}` },
          { doe: 'Zet de factor voor de haakjes', werd: `${dd}(${binnen})` },
        ],
        valkuilen: [
          {
            fout: `${dd}(${toonSom([term(k1 / dd, { [x]: 1 }), term(k2)])})`,
            heet: 'Je deelde alleen het eerste element. Álle elementen binnen de haakjes moeten door de factor.',
          },
          {
            fout: `${dd}(${toonSom([term(k1, { [x]: 1 }), term(k2 / dd)])})`,
            heet: 'Het eerste element is niet gedeeld. Wat je buiten de haakjes zet, haal je overal uit.',
          },
        ],
        tip: 'Zoek altijd de grótste gemeenschappelijke deler, anders kan het nog korter.',
      }
    }
    const binnen = toonSom([term(p, { [x]: 1 }), term(q)])
    return {
      vraag: toonSom([term(k1, { [x]: 1 }), term(k2)]),
      antwoord: `${d}(${binnen})`,
      vorm: { factor: String(d) },
      stappen: [
        { doe: `Zoek de grootste gemeenschappelijke deler van ${k1} en ${k2}`, werd: String(d) },
        { doe: 'Deel beide elementen daardoor', werd: `${k1} ÷ ${d} = ${p} en ${k2} ÷ ${d} = ${q}` },
        { doe: 'Zet de gevonden factor voor de haakjes', werd: `${d}(${binnen})` },
      ],
      valkuilen: [
        {
          fout: `${d}(${toonSom([term(p, { [x]: 1 }), term(k2)])})`,
          heet: 'Je deelde alleen het eerste element. Álle elementen binnen de haakjes moeten door de factor.',
        },
        {
          fout: `${d}(${toonSom([term(k1, { [x]: 1 }), term(q)])})`,
          heet: 'Het eerste element is niet gedeeld. Wat je buiten de haakjes zet, haal je overal uit.',
        },
      ],
      tip: 'Zoek de grootste gemeenschappelijke deler en deel álle elementen daardoor.',
    }
  },

  // x² − k·x  ->  x(x − k)
  (rng) => {
    const x = rng.kies(['q', 'x', 'p', 'b'])
    const k = rng.nietNul(-32, 32)
    const binnen = toonSom([term(1, { [x]: 1 }), term(k)])
    return {
      vraag: toonSom([term(1, { [x]: 2 }), term(k, { [x]: 1 })]),
      antwoord: `${x}(${binnen})`,
      vorm: { factor: x },
      stappen: [
        { doe: 'De getallen hebben niets gemeenschappelijks, maar beide elementen hebben een ' + x, werd: x },
        { doe: `Deel beide door ${x}`, werd: `${x}² ÷ ${x} = ${x} en ${toonTerm(term(k, { [x]: 1 }))} ÷ ${x} = ${k}` },
        { doe: 'Zet de letter voor de haakjes', werd: `${x}(${binnen})` },
      ],
      valkuilen: [
        {
          fout: `${x}(${toonSom([term(1, { [x]: 2 }), term(k)])})`,
          heet: `Ook ${x}² moet door ${x} gedeeld worden — daar blijft ${x} van over, niet ${x}².`,
        },
        {
          fout: `${x}(${toonSom([term(1, { [x]: 1 }), term(k, { [x]: 1 })])})`,
          heet: `Het tweede element is niet gedeeld: ${toonTerm(term(k, { [x]: 1 }))} ÷ ${x} is ${k}.`,
        },
      ],
      tip: 'Een gemeenschappelijke factor kan ook een letter zijn.',
    }
  },

  // k1·ab + k2·b²  ->  d·b(...)
  (rng) => {
    const [a, b] = rng.kies([['a', 'b'], ['x', 'y'], ['p', 'q']])
    const d = rng.kies([2, 3, 4, 5, 6])
    const p = rng.getal(2, 6)
    const q = rng.getal(1, 6)
    const echt = d * ggd(p, q)
    const binnen = toonSom([
      term((d * p) / echt, { [a]: 1 }),
      term((d * q) / echt, { [b]: 1 }),
    ])
    const buiten = toonTerm(term(echt, { [b]: 1 }))
    return {
      vraag: toonSom([term(d * p, { [a]: 1, [b]: 1 }), term(d * q, { [b]: 2 })]),
      antwoord: `${buiten}(${binnen})`,
      vorm: { factor: buiten },
      stappen: [
        { doe: `Grootste gemeenschappelijke deler van de getallen ${d * p} en ${d * q}`, werd: String(echt) },
        { doe: `Welke letter zit in beide elementen?`, werd: b },
        { doe: 'Samen dus buiten de haakjes', werd: buiten },
        { doe: 'Deel elk element door die factor', werd: `${buiten}(${binnen})` },
      ],
      valkuilen: [
        {
          fout: `${echt}(${binnen})`,
          heet: `De ${b} zit in beide elementen, dus die gaat ook mee naar buiten de haakjes.`,
        },
      ],
      tip: 'De gemeenschappelijke factor kan een getal én een letter zijn.',
    }
  },

  // a² + a⁴  ->  a²(1 + a²)
  (rng) => {
    const a = rng.kies(['a', 'x', 'u', 't'])
    const laag = rng.getal(1, 3)
    const hoog = laag + rng.getal(1, 3)
    const binnen = toonSom([term(1), term(1, { [a]: hoog - laag })])
    const buiten = toonTerm(term(1, { [a]: laag }))
    return {
      vraag: toonSom([term(1, { [a]: laag }), term(1, { [a]: hoog })]),
      antwoord: `${buiten}(${binnen})`,
      vorm: { factor: buiten },
      stappen: [
        { doe: 'Wat hebben beide elementen gemeenschappelijk? De laagste macht', werd: buiten },
        {
          doe: 'Deel beide daardoor',
          werd: `${toonTerm(term(1, { [a]: laag }))} ÷ ${buiten} = 1 en ${toonTerm(term(1, { [a]: hoog }))} ÷ ${buiten} = ${toonTerm(term(1, { [a]: hoog - laag }))}`,
        },
        { doe: 'Vergeet de 1 niet', werd: `${buiten}(${binnen})` },
      ],
      valkuilen: [
        {
          fout: `${buiten}(${toonTerm(term(1, { [a]: hoog - laag }))})`,
          heet: 'Je vergat de 1. Haal je een element helemaal weg, dan blijft daar een 1 staan — geen leegte.',
        },
      ],
      tip: 'Haal je een element helemaal weg, dan blijft er een 1 achter — niet niets.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '7a',
  hoofdstuk: 4,
  titel: 'Buiten haakjes halen',
  waarover: 'ontbinden in factoren, deel 1',
  uitleg: [
    {
      kop: 'Het omgekeerde van haakjes wegwerken',
      tekst:
        'Nu zet je haakjes juist neer. Je zoekt wat alle elementen gemeen hebben en zet dat vóór de haakjes.',
      voorbeeld: '3x + 3 = 3(x + 1)',
    },
    {
      kop: 'Zoek de grootste',
      tekst:
        'Neem de grootste gemeenschappelijke deler. Haal je maar een deel eruit, dan kan het nog korter en is het niet volledig ontbonden.',
      voorbeeld: '9x + 6 = 3(3x + 2)   (niet 1(9x + 6))',
    },
    {
      kop: 'Getallen én letters',
      tekst:
        'Het gemeenschappelijke kan een getal zijn, een letter, of allebei. Zit in elk element een x, dan gaat die ook mee naar buiten.',
      voorbeeld: '24x² + 8xy = 8x(3x + y)',
    },
    {
      kop: 'De achterblijvende 1',
      tekst: 'Haal je een heel element buiten de haakjes, dan blijft daar een 1 staan — geen leegte.',
      voorbeeld: 'a² + a⁴ = a²(1 + a²)',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '7a',
      opdracht: 'Ontbind in factoren',
      invoer: 'typen',
      soort: 'uitdrukking',
      ...bouw,
    }
  },
}
