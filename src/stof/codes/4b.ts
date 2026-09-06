/** 4b — Machtsregels voor delen: aˣ ÷ aʸ = aˣ⁻ʸ en 1/aˣ = a⁻ˣ (reader 2.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { macht, term, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const REGEL = 'aˣ ÷ aʸ = aˣ⁻ʸ — bij delen trek je de machten van elkaar af.'

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // x^e1 ÷ x^e2
  (rng) => {
    const x = rng.kies(['u', 'x', 'a', 'b'])
    const e1 = rng.getal(4, 9)
    const e2 = rng.getal(1, 5)
    return {
      vraag: `${macht(x, e1)} ÷ ${macht(x, e2)}`,
      antwoord: macht(x, e1 - e2),
      stappen: [
        { doe: 'Delen door een macht is keer de negatieve macht', werd: `${macht(x, e1)} · ${macht(x, -e2)}` },
        { doe: 'Dan de machten optellen', werd: `${x}^(${e1} − ${e2})` },
        { doe: 'Uitrekenen', werd: macht(x, e1 - e2) },
      ],
      valkuilen: [
        { fout: macht(x, e1 + e2), heet: 'Bij delen moet je de machten aftrekken, niet optellen.' },
        { fout: macht(x, e2 - e1), heet: 'Je trok de verkeerde kant op af: het is boven min onder.' },
      ],
      tip: REGEL,
    }
  },

  // k1·x^e1 ÷ k2·x^e2
  (rng) => {
    const x = rng.kies(['x', 'y', 'a'])
    const k2 = rng.getal(2, 5)
    const k1 = k2 * rng.getal(2, 5)
    const e2 = rng.getal(1, 3)
    const e1 = e2 + rng.getal(1, 3)
    return {
      vraag: `${toonTerm(term(k1, { [x]: e1 }))} ÷ ${toonTerm(term(k2, { [x]: e2 }))}`,
      antwoord: toonTerm(term(k1 / k2, { [x]: e1 - e2 })),
      stappen: [
        { doe: 'Eerst de getallen delen', werd: `${k1} ÷ ${k2} = ${k1 / k2}` },
        { doe: 'Dan de machten aftrekken', werd: `${macht(x, e1)} ÷ ${macht(x, e2)} = ${macht(x, e1 - e2)}` },
        { doe: 'Samen', werd: toonTerm(term(k1 / k2, { [x]: e1 - e2 })) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 / k2, { [x]: e1 + e2 })), heet: 'Machten aftrekken bij delen, niet optellen.' },
        { fout: toonTerm(term(k1 - k2, { [x]: e1 - e2 })), heet: 'De getallen moet je delen, niet aftrekken.' },
      ],
      tip: REGEL,
    }
  },

  // n ÷ x^e  ->  n·x^-e
  (rng) => {
    const x = rng.kies(['n', 'a', 'u', 'y'])
    const n = rng.getal(2, 12)
    const e = rng.getal(2, 5)
    return {
      vraag: `${n} ÷ ${macht(x, e)}`,
      antwoord: toonTerm(term(n, { [x]: -e })),
      stappen: [
        { doe: 'Gebruik 1/aˣ = a⁻ˣ', werd: `${n} · ${macht(x, -e)}` },
        { doe: 'Opschrijven zonder breuk', werd: toonTerm(term(n, { [x]: -e })) },
      ],
      valkuilen: [
        { fout: toonTerm(term(n, { [x]: e })), heet: 'Onder de streep vandaan halen betekent: de macht wordt negatief.' },
      ],
      tip: '1/aˣ = a⁻ˣ. Zo krijg je breuken weg.',
    }
  },

  // b^e1 ÷ b^e2 met getallen
  (rng) => {
    const b = rng.kies([2, 2, 3, 5])
    const e1 = rng.getal(3, 6)
    const e2 = rng.getal(1, 3)
    return {
      vraag: `${macht(String(b), e1)} ÷ ${macht(String(b), e2)}`,
      antwoord: macht(String(b), e1 - e2),
      stappen: [
        { doe: 'Gelijke grondtallen, dus machten aftrekken', werd: `${b}^(${e1} − ${e2})` },
        { doe: 'Uitrekenen', werd: macht(String(b), e1 - e2) },
      ],
      valkuilen: [
        { fout: macht(String(b), e1 + e2), heet: 'Bij delen trek je af.' },
        { fout: macht(String(b), Math.round(e1 / e2)), heet: 'Je deelde de machten. Delen van machten betekent aftrekken van de exponenten.' },
      ],
      tip: REGEL,
    }
  },

  // 1 ÷ b^e
  (rng) => {
    const b = rng.kies([2, 3, 5])
    const e = rng.getal(2, 4)
    return {
      vraag: `1 ÷ ${macht(String(b), e)}`,
      antwoord: macht(String(b), -e),
      stappen: [
        { doe: 'Schrijf de 1 als een macht van hetzelfde grondtal', werd: `${b}⁰ ÷ ${macht(String(b), e)}`, waarom: 'a⁰ = 1' },
        { doe: 'Machten aftrekken', werd: `${b}^(0 − ${e})` },
        { doe: 'Klaar', werd: macht(String(b), -e) },
      ],
      valkuilen: [
        { fout: macht(String(b), e), heet: 'De macht moet negatief worden: 1/aˣ = a⁻ˣ.' },
      ],
      tip: 'Het getal 1 kun je altijd schrijven als grondtal tot de macht 0.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '4b',
  hoofdstuk: 2,
  titel: 'Machten delen',
  waarover: 'aˣ ÷ aʸ = aˣ⁻ʸ en negatieve machten',
  uitleg: [
    {
      kop: 'De regel',
      tekst: 'Deel je twee machten met hetzelfde grondtal, dan trek je de machten van elkaar af: boven min onder.',
      voorbeeld: 'a⁵ ÷ a³ = a²     u⁸ ÷ u⁵ = u³',
    },
    {
      kop: 'Weg met de breukstreep',
      tekst:
        'Een getal onder de streep kun je naar boven halen door de macht negatief te maken. Zo krijg je breuken weg.',
      voorbeeld: '1/aˣ = a⁻ˣ     8/n³ = 8n⁻³',
    },
    {
      kop: 'En terug',
      tekst: 'Andersom werkt het ook: een negatieve macht mag je weer als breuk schrijven.',
      voorbeeld: '1/a⁻ˣ = aˣ',
    },
    {
      kop: 'De truc met 1',
      tekst:
        'Omdat elk grondtal tot de macht 0 gelijk is aan 1, mag je een losse 1 herschrijven naar het grondtal dat je nodig hebt.',
      voorbeeld: '1/2³ = 2⁰/2³ = 2⁰⁻³ = 2⁻³',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '4b',
      opdracht: 'Schrijf zo simpel mogelijk, zonder breuken',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: { geenBreuk: true },
      ...bouw,
    }
  },
}
