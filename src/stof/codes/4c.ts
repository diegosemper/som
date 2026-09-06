/** 4c — Schrijf als een macht van 3 (reader opdracht 2.3.2) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { boven } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

/** 3 tot de macht e, ook als e 0 of 1 is — de vorm blijft "3^..". */
function m3(e: number): string {
  return e === 1 ? '3' : '3' + boven(e)
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // 3^a · 3^b
  (rng) => {
    const a = rng.kies([-5, -3, -2, 1, 2, 3, 4, 5])
    const b = rng.kies([-5, -3, -2, 1, 2, 3, 4])
    return {
      vraag: `${m3(a)} · ${m3(b)}`,
      antwoord: m3(a + b),
      stappen: [
        { doe: 'Gelijke grondtallen bij keer: machten optellen', werd: `3^(${a} + ${b})` },
        { doe: 'Uitrekenen', werd: m3(a + b) },
      ],
      valkuilen: [
        { fout: m3(a * b), heet: 'Bij vermenigvuldigen tel je de machten op; vermenigvuldigen doe je bij een macht van een macht.' },
        { fout: m3(a - b), heet: 'Aftrekken hoort bij delen, niet bij vermenigvuldigen.' },
      ],
      tip: 'aˣ · aʸ = aˣ⁺ʸ',
    }
  },

  // 3^a ÷ 3^b
  (rng) => {
    const a = rng.kies([-5, -2, 1, 2, 3, 5, 6])
    const b = rng.kies([-3, -2, 1, 2, 3])
    return {
      vraag: `${m3(a)} ÷ ${m3(b)}`,
      antwoord: m3(a - b),
      stappen: [
        { doe: 'Gelijke grondtallen bij delen: machten aftrekken', werd: `3^(${a} − ${b})` },
        { doe: 'Uitrekenen', werd: m3(a - b) },
      ],
      valkuilen: [
        { fout: m3(a + b), heet: 'Bij delen trek je de machten af.' },
        { fout: m3(b - a), heet: 'De volgorde is boven min onder.' },
      ],
      tip: 'aˣ ÷ aʸ = aˣ⁻ʸ',
    }
  },

  // (3^a)^b
  (rng) => {
    const a = rng.kies([-2, 1, 2, 3])
    const b = rng.kies([2, 3, 4])
    return {
      vraag: `(${m3(a)})${boven(b)}`,
      antwoord: m3(a * b),
      stappen: [
        { doe: 'Macht van een macht: de machten vermenigvuldigen', werd: `3^(${a} · ${b})` },
        { doe: 'Uitrekenen', werd: m3(a * b) },
      ],
      valkuilen: [
        { fout: m3(a + b), heet: 'Optellen hoort bij keer; bij een macht van een macht vermenigvuldig je.' },
      ],
      tip: '(aˣ)ʸ = aˣ·ʸ',
    }
  },

  // 1 ÷ 3^a  (ook als "1/3")
  (rng) => {
    const a = rng.kies([1, 2, 3, 4])
    return {
      vraag: a === 1 ? '1/3' : `1/${m3(a)}`,
      antwoord: m3(-a),
      stappen: [
        { doe: 'Schrijf de 1 als 3⁰', werd: `3⁰ / ${m3(a)}` },
        { doe: 'Machten aftrekken', werd: `3^(0 − ${a})` },
        { doe: 'Klaar', werd: m3(-a) },
      ],
      valkuilen: [
        { fout: m3(a), heet: 'Onder de streep vandaan halen maakt de macht negatief.' },
      ],
      tip: '1/aˣ = a⁻ˣ',
    }
  },

  // 27^a of 9^a
  (rng) => {
    const grond = rng.kies([9, 27, 81])
    const machtVanDrie = grond === 9 ? 2 : grond === 27 ? 3 : 4
    const a = rng.kies([1, 2, 2, 3])
    return {
      vraag: a === 1 ? String(grond) : `${grond}${boven(a)}`,
      antwoord: m3(machtVanDrie * a),
      stappen: [
        { doe: `Schrijf ${grond} eerst als macht van 3`, werd: a === 1 ? m3(machtVanDrie) : `(${m3(machtVanDrie)})${boven(a)}` },
        { doe: a === 1 ? 'Klaar' : 'Macht van een macht: vermenigvuldigen', werd: m3(machtVanDrie * a) },
      ],
      valkuilen: [
        { fout: m3(machtVanDrie + a), heet: 'Macht van een macht: die machten moet je vermenigvuldigen.' },
      ],
      tip: 'Kijk eerst of het grondtal zelf een macht van 3 is: 9 = 3², 27 = 3³, 81 = 3⁴.',
    }
  },

  // (1/9)^a
  (rng) => {
    const a = rng.kies([2, 3])
    return {
      vraag: `(1/9)${boven(a)}`,
      antwoord: m3(-2 * a),
      stappen: [
        { doe: 'Schrijf 9 als 3²', werd: `(1/3²)${boven(a)}` },
        { doe: 'De breuk weg met 1/aˣ = a⁻ˣ', werd: `(3⁻²)${boven(a)}` },
        { doe: 'Macht van een macht: vermenigvuldigen', werd: m3(-2 * a) },
      ],
      valkuilen: [
        { fout: m3(2 * a), heet: 'De breuk maakt de macht negatief.' },
        { fout: m3(-2 - a), heet: 'Machten van een macht vermenigvuldig je, niet optellen.' },
      ],
      tip: 'Eerst het grondtal omschrijven naar een macht van 3, dan pas rekenen.',
    }
  },

  // 3^a ÷ 81
  (rng) => {
    const a = rng.kies([2, 3, 5, 6])
    return {
      vraag: `${m3(a)} / 81`,
      antwoord: m3(a - 4),
      stappen: [
        { doe: '81 is 3⁴', werd: `${m3(a)} / 3⁴` },
        { doe: 'Machten aftrekken', werd: `3^(${a} − 4)` },
        { doe: 'Klaar', werd: m3(a - 4) },
      ],
      valkuilen: [
        { fout: m3(a + 4), heet: 'Onder de streep betekent aftrekken.' },
        { fout: m3(a - 81), heet: 'Schrijf 81 eerst als macht van 3: dat is 3⁴, niet 81.' },
      ],
      tip: 'Machten van 3: 3, 9, 27, 81, 243.',
    }
  },

  // (−3²)³
  (rng) => {
    const b = rng.kies([2, 3])
    const negatief = b % 2 === 1
    return {
      vraag: `(−3²)${boven(b)}`,
      antwoord: (negatief ? '−' : '') + m3(2 * b),
      stappen: [
        { doe: '−3² is −(3 · 3), dus −1 · 3²', werd: `(−1 · 3²)${boven(b)}` },
        { doe: 'Beide factoren tot de macht', werd: `(−1)${boven(b)} · 3^(2 · ${b})` },
        { doe: negatief ? 'Een oneven macht van −1 blijft −1' : 'Een even macht van −1 wordt +1', werd: (negatief ? '−' : '') + m3(2 * b) },
      ],
      valkuilen: [
        { fout: (negatief ? '' : '−') + m3(2 * b), heet: 'Let op het teken: een oneven macht houdt het minteken, een even macht maakt het plus.' },
      ],
      tip: '−3² = −9, dus −3² is −1 · 3².',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '4c',
  hoofdstuk: 2,
  titel: 'Schrijf als macht van 3',
  waarover: 'alles terugbrengen tot één macht van hetzelfde grondtal',
  uitleg: [
    {
      kop: 'Wat wordt er gevraagd',
      tekst:
        'Je moet de hele som herschrijven tot één macht van 3. Je antwoord ziet er dus altijd uit als 3 met een macht erachter — ook als dat 3⁰ of 3⁻² is.',
      voorbeeld: '3³ · (1/3)² = 3',
    },
    {
      kop: 'Stap 1: alles naar grondtal 3',
      tekst: 'Zie je 9, 27 of 81? Schrijf die eerst als macht van 3. Zie je een breuk? Maak er een negatieve macht van.',
      voorbeeld: '9 = 3²   27 = 3³   81 = 3⁴   1/3 = 3⁻¹',
    },
    {
      kop: 'Stap 2: de machtsregels',
      tekst: 'Keer: machten optellen. Delen: machten aftrekken. Macht van een macht: machten vermenigvuldigen.',
      voorbeeld: '3³ · 3⁻² = 3¹     (3⁻²)³ = 3⁻⁶',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '4c',
      opdracht: 'Schrijf als één macht van 3',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: { grondtal: 3 },
      ...bouw,
    }
  },
}
