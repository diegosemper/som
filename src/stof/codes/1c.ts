/** 1c — Variabelen invullen in een formule (reader 2.1) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { term, toonGetal as g, toonSom } from '../term.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const HAAKJES = 'Zet een ingevulde waarde altijd tussen haakjes. Zonder haakjes is −3² gelijk aan −9, mét haakjes is (−3)² gelijk aan 9.'

/** Paren (b, c) waarvoor (b²c² − 5c²) ÷ (−4c) een heel getal is. */
const PAREN: [number, number][] = []
for (let b = 2; b <= 7; b++) {
  for (const c of [-4, -3, -2, -1, 1, 2, 3, 4]) {
    const uit = (b * b * c * c - 5 * c * c) / (-4 * c)
    if (Number.isInteger(uit)) PAREN.push([b, c])
  }
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // a·t³ + b·t² + c·t + d
  (rng) => {
    const letter = rng.kies(['t', 'u', 'x', 'p'])
    const a = rng.kies([1, 1, 2, 3])
    const b = rng.nietNul(-6, 6)
    const c = rng.nietNul(-6, 6)
    const d = rng.getal(-8, 8)
    const w = rng.kies([-3, -2, -1, 2, 3, 4])

    const formule = toonSom([
      term(a, { [letter]: 3 }),
      term(b, { [letter]: 2 }),
      term(c, { [letter]: 1 }),
      term(d),
    ])
    const uit = a * w ** 3 + b * w ** 2 + c * w + d

    // De klassieke misser: de macht als vermenigvuldiging lezen (t³ = 3t).
    const alsMaal = a * (3 * w) + b * (2 * w) + c * w + d

    const valkuilen = [
      { fout: g(alsMaal), heet: `Je las ${letter}³ als 3 · ${letter}. Een macht is het getal met zichzelf vermenigvuldigen.` },
    ]
    if (w < 0) {
      // (−3)² als −3² lezen
      const zonderHaakjes = a * w ** 3 + b * -(w * w) + c * w + d
      if (zonderHaakjes !== uit) {
        valkuilen.push({
          fout: g(zonderHaakjes),
          heet: `Je rekende ${letter}² uit als −${Math.abs(w)}², maar bij invullen hoort het minteken erbij: (−${Math.abs(w)})² = ${w * w}.`,
        })
      }
    }

    return {
      opdracht: `Vul ${letter} = ${g(w)} in en bereken`,
      vraag: formule,
      antwoord: g(uit),
      stappen: [
        { doe: 'Vul de waarde in, mét haakjes', werd: formule.replace(new RegExp(letter, 'g'), `(${g(w)})`) },
        { doe: 'Werk de machten weg', werd: toonSom([term(a * w ** 3), term(b * w ** 2), term(c * w), term(d)]) },
        { doe: 'Optellen en aftrekken van links naar rechts', werd: g(uit) },
      ],
      valkuilen,
      tip: HAAKJES,
    }
  },

  // b²c − 3c² + b   (twee variabelen)
  (rng) => {
    const b = rng.getal(2, 6)
    const c = rng.kies([-3, -2, -1, 2, 3])
    const k = rng.getal(2, 4)
    const uit = b * b * c - k * c * c + b
    const formule = `b²c − ${k}c² + b`
    return {
      opdracht: `Vul b = ${g(b)} en c = ${g(c)} in en bereken`,
      vraag: formule,
      antwoord: g(uit),
      stappen: [
        { doe: 'Vul beide waarden in, mét haakjes', werd: `(${g(b)})²·(${g(c)}) − ${k}·(${g(c)})² + (${g(b)})` },
        { doe: 'Machten eerst', werd: `${b * b}·(${g(c)}) − ${k}·${c * c} + ${b}` },
        { doe: 'Dan vermenigvuldigen', werd: `${g(b * b * c)} − ${k * c * c} + ${b}` },
        { doe: 'Tot slot optellen en aftrekken', werd: g(uit) },
      ],
      valkuilen: [
        { fout: g(b * b * c - k * -(c * c) + b), heet: `Je las (${g(c)})² als −${Math.abs(c)}². Ingevuld hoort het minteken erbij.` },
      ],
      tip: HAAKJES,
    }
  },

  // (b²c² − 5c²) ÷ (−4c)
  (rng) => {
    const [b, c] = rng.kies(PAREN)
    const boven = b * b * c * c - 5 * c * c
    const onder = -4 * c
    const uit = boven / onder
    return {
      opdracht: `Vul b = ${g(b)} en c = ${g(c)} in en bereken`,
      vraag: `(b²c² − 5c²) ÷ (−4c)`,
      antwoord: g(uit),
      stappen: [
        { doe: 'Vul in, mét haakjes', werd: `((${g(b)})²(${g(c)})² − 5(${g(c)})²) ÷ (−4 · (${g(c)}))` },
        { doe: 'Machten uitrekenen', werd: `(${b * b} · ${c * c} − 5 · ${c * c}) ÷ ${g(onder)}` },
        { doe: 'Boven de streep afmaken', werd: `${g(boven)} ÷ ${g(onder)}` },
        { doe: 'Delen', werd: g(uit) },
      ],
      valkuilen: [
        { fout: g(-uit), heet: 'Let op het teken: er staat −4c onder de streep, en c is zelf ook negatief of positief.' },
      ],
      tip: 'Een lange breukstreep werkt als haakjes: eerst alles boven, dan alles onder, dan pas delen.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '1c',
  hoofdstuk: 2,
  titel: 'Waarden invullen',
  waarover: 'een letter vervangen door een getal',
  uitleg: [
    {
      kop: 'Een formule is een recept',
      tekst:
        'In een formule staan letters (variabelen) voor getallen. Vul je de getallen in, dan rol er een uitkomst uit. Spaar je 50 euro per maand bovenop 500, dan is B = 50m + 500.',
      voorbeeld: 'm = 6 geeft B = 50 · 6 + 500 = 800',
    },
    {
      kop: 'Altijd haakjes eromheen',
      tekst:
        'Vervang je een letter door een getal, zet er dan haakjes omheen. Bij negatieve getallen scheelt dat het verschil tussen goed en fout.',
      voorbeeld: '−3² = −9   maar   (−3)² = 9',
    },
    {
      kop: 'En dan de volgorde',
      tekst: 'Na het invullen is het gewoon een gewone som: haakjes, machten, keer en delen, en pas daarna plus en min.',
      voorbeeld: 'u = 2:  5u³ + 2u² + 8 = 5·8 + 2·4 + 8 = 56',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '1c',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
