/** 4e — Schrijf zo simpel mogelijk, zonder haakjes en breuken (reader 2.3.2) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { boven, macht, plak, term, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k1·x^a · k2·x^b
  (rng) => {
    const x = rng.kies(['x', 'u', 'a'])
    const k1 = rng.getal(2, 6)
    const k2 = rng.getal(2, 6)
    const a = rng.getal(1, 4)
    const b = rng.getal(1, 4)
    return {
      vraag: `${toonTerm(term(k1, { [x]: a }))} · ${toonTerm(term(k2, { [x]: b }))}`,
      antwoord: toonTerm(term(k1 * k2, { [x]: a + b })),
      stappen: [
        { doe: 'Getallen keer getallen', werd: `${k1} · ${k2} = ${k1 * k2}` },
        { doe: 'Machten optellen', werd: macht(x, a + b) },
        { doe: 'Samen', werd: toonTerm(term(k1 * k2, { [x]: a + b })) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 * k2, { [x]: a * b })), heet: 'Bij keer tel je de machten op.' },
      ],
      tip: 'aˣ · aʸ = aˣ⁺ʸ',
    }
  },

  // k1·x^a ÷ k2·x^b
  (rng) => {
    const x = rng.kies(['x', 'y', 'b'])
    const k2 = rng.getal(2, 4)
    const k1 = k2 * rng.getal(2, 5)
    const a = rng.getal(2, 6)
    const b = rng.getal(1, 4)
    return {
      vraag: `${toonTerm(term(k1, { [x]: a }))} ÷ ${toonTerm(term(k2, { [x]: b }))}`,
      antwoord: toonTerm(term(k1 / k2, { [x]: a - b })),
      stappen: [
        { doe: 'Getallen delen', werd: `${k1} ÷ ${k2} = ${k1 / k2}` },
        { doe: 'Machten aftrekken', werd: macht(x, a - b) },
        { doe: 'Samen', werd: toonTerm(term(k1 / k2, { [x]: a - b })) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 / k2, { [x]: a + b })), heet: 'Bij delen trek je de machten af.' },
      ],
      tip: 'aˣ ÷ aʸ = aˣ⁻ʸ',
    }
  },

  // a / b^n
  (rng) => {
    const [a, b] = rng.kies([['a', 'b'], ['x', 'y'], ['p', 'q']])
    const n = rng.getal(2, 4)
    return {
      vraag: `${a} / ${macht(b, n)}`,
      antwoord: a + macht(b, -n),
      stappen: [
        { doe: 'De noemer naar boven halen', werd: `${a} · ${macht(b, -n)}`, waarom: '1/aˣ = a⁻ˣ' },
        { doe: 'Aan elkaar schrijven', werd: a + macht(b, -n) },
      ],
      valkuilen: [
        { fout: a + macht(b, n), heet: 'Van onder de streep naar boven betekent: de macht wordt negatief.' },
      ],
      tip: 'Een breukstreep weg je met een negatieve macht.',
    }
  },

  // (u^-a)^b / (k·u)^-c   -- het voorbeeld uit de reader
  (rng) => {
    const u = rng.kies(['u', 'x', 't'])
    const a = rng.getal(2, 3)
    const b = rng.getal(2, 3)
    const c = rng.getal(3, 5)
    const k = 2
    const coef = Math.pow(k, c)
    const exponent = c - a * b
    return {
      vraag: `(${macht(u, -a)})${boven(b)} / (${k}${u})${boven(-c)}`,
      antwoord: plak(String(coef), macht(u, exponent)),
      stappen: [
        { doe: 'De breukstreep weg: delen door a⁻ˣ is keer aˣ', werd: `(${macht(u, -a)})${boven(b)} · (${k}${u})${boven(c)}` },
        { doe: 'Haakjes weg met de machtsregel voor machtverheffen', werd: `${macht(u, -a * b)} · ${k}${boven(c)} · ${macht(u, c)}` },
        { doe: 'Machten van dezelfde letter optellen', werd: `${macht(u, exponent)} · ${k}${boven(c)}` },
        { doe: `En ${k}${boven(c)} uitrekenen`, werd: plak(String(coef), macht(u, exponent)) },
      ],
      valkuilen: [
        { fout: plak(String(coef), macht(u, -a * b - c)), heet: 'Onder de streep stond een negatieve macht: die wordt positief als je hem naar boven haalt.' },
        { fout: plak(String(k), macht(u, exponent)), heet: `De ${k} krijgt de macht ook: (${k}${u})${boven(c)} is ${plak(String(coef), macht(u, c))}.` },
      ],
      tip: 'Eerst de breuk weg, dan de haakjes weg, dan de machten optellen.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '4e',
  hoofdstuk: 2,
  titel: 'Zo simpel mogelijk',
  waarover: 'alle machtsregels door elkaar, zonder haakjes en breuken',
  uitleg: [
    {
      kop: 'De volgorde van aanpak',
      tekst:
        'Eerst de breukstreep weg (negatieve macht), dan de haakjes weg (machten vermenigvuldigen), dan gelijke grondtallen samenvoegen (machten optellen). Tot slot reken je de losse getallen uit.',
      voorbeeld: '(u⁻³)³ / (2u)⁻⁵ = 32u⁻⁴',
    },
    {
      kop: 'De drie regels op een rij',
      tekst: 'Meer heb je niet nodig. Ze gelden alleen bij gelijke grondtallen.',
      voorbeeld: 'aˣ · aʸ = aˣ⁺ʸ     aˣ ÷ aʸ = aˣ⁻ʸ     (aˣ)ʸ = aˣ·ʸ',
    },
    {
      kop: 'Getallen vergeten',
      tekst: 'Een macht buiten de haakjes hoort ook bij het getal binnen de haakjes. (2u)⁵ is 2⁵u⁵ = 32u⁵.',
      voorbeeld: '(2u)⁵ = 32u⁵',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '4e',
      opdracht: 'Schrijf zo simpel mogelijk, zonder haakjes en breuken',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: { geenBreuk: true, geenHaakjes: true, geenMaal: true },
      ...bouw,
    }
  },
}
