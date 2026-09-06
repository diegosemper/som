/** 4d — Machten van machten en van breuken (reader opdracht 2.3.3 a-d, h) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { boven, macht, plak, term, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

/** k tot de macht n, maar als n negatief is blijft het als macht staan. */
function getalMacht(k: number, n: number): string {
  return n >= 0 ? String(Math.pow(k, n)) : String(k) + boven(n)
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // (k·x^e)^n
  (rng) => {
    const x = rng.kies(['x', 'u', 'p', 'a'])
    const k = rng.getal(2, 4)
    const e = rng.getal(1, 3)
    const n = rng.kies([2, 2, 3, -2, -3, -4])
    const binnen = toonTerm(term(k, { [x]: e }))
    const antwoord = plak(getalMacht(k, n), macht(x, e * n))
    return {
      vraag: `(${binnen})${boven(n)}`,
      antwoord,
      stappen: [
        { doe: 'De macht buiten de haakjes gaat over álle factoren binnen', werd: `${k}${boven(n)} · (${macht(x, e)})${boven(n)}`, waarom: '(ab)ˣ = aˣbˣ' },
        { doe: 'Macht van een macht: vermenigvuldigen', werd: `${getalMacht(k, n)} · ${macht(x, e * n)}` },
        { doe: 'Samen', werd: antwoord },
      ],
      valkuilen: [
        { fout: plak(String(k), macht(x, e * n)), heet: `Het getal ${k} krijgt de macht ook: (${k}${x})² is ${k * k}${x}², niet ${k}${x}².` },
        { fout: plak(getalMacht(k, n), macht(x, e + n)), heet: 'Macht van een macht: die machten vermenigvuldig je.' },
      ],
      tip: '(aˣ)ʸ = aˣ·ʸ en (ab)ˣ = aˣbˣ',
    }
  },

  // (1/y)^n
  (rng) => {
    const y = rng.kies(['y', 'u', 't', 'b'])
    const n = rng.getal(2, 5)
    return {
      vraag: `(1/${y})${boven(n)}`,
      antwoord: macht(y, -n),
      stappen: [
        { doe: 'Eerst de breuk weg: 1/a = a⁻¹', werd: `(${macht(y, -1)})${boven(n)}` },
        { doe: 'Macht van een macht: vermenigvuldigen', werd: macht(y, -n) },
      ],
      valkuilen: [
        { fout: macht(y, n), heet: 'Wat onder de streep stond, krijgt een negatieve macht.' },
      ],
      tip: '1/aˣ = a⁻ˣ',
    }
  },

  // (x/y)^n
  (rng) => {
    const [x, y] = rng.kies([['x', 'y'], ['a', 'b'], ['p', 'q']])
    const n = rng.getal(2, 4)
    return {
      vraag: `(${x}/${y})${boven(n)}`,
      antwoord: macht(x, n) + macht(y, -n),
      stappen: [
        { doe: 'De macht gaat over teller én noemer', werd: `${macht(x, n)} / ${macht(y, n)}` },
        { doe: 'De noemer naar boven halen met 1/aˣ = a⁻ˣ', werd: macht(x, n) + macht(y, -n) },
      ],
      valkuilen: [
        { fout: macht(x, n) + macht(y, n), heet: 'De noemer krijgt een négatieve macht als hij naar boven gaat.' },
      ],
      tip: '(a/b)ˣ = aˣ · b⁻ˣ',
    }
  },

  // (t^-e)^n
  (rng) => {
    const t = rng.kies(['t', 'u', 'x'])
    const e = rng.getal(1, 4)
    const n = rng.getal(2, 4)
    return {
      vraag: `(${macht(t, -e)})${boven(n)}`,
      antwoord: macht(t, -e * n),
      stappen: [
        { doe: 'Macht van een macht: vermenigvuldigen', werd: `${t}^(−${e} · ${n})` },
        { doe: 'Uitrekenen', werd: macht(t, -e * n) },
      ],
      valkuilen: [
        { fout: macht(t, e * n), heet: 'Min keer plus blijft min: de macht blijft negatief.' },
        { fout: macht(t, -e + n), heet: 'Bij een macht van een macht vermenigvuldig je, niet optellen.' },
      ],
      tip: '(aˣ)ʸ = aˣ·ʸ, ook met negatieve machten.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '4d',
  hoofdstuk: 2,
  titel: 'Macht van een macht',
  waarover: '(2x)², (1/y)², (2x²)⁻⁴',
  uitleg: [
    {
      kop: 'De regel',
      tekst: 'Een macht van een macht: die machten vermenigvuldig je met elkaar.',
      voorbeeld: '(2⁴)² = 2⁴·² = 2⁸',
    },
    {
      kop: 'Alles binnen de haakjes doet mee',
      tekst:
        'Staat er een getal én een letter binnen de haakjes, dan krijgen ze allebei de macht. Dit is de fout die het vaakst gemaakt wordt.',
      voorbeeld: '(2x)² = 2²x² = 4x²   (niet 2x²)',
    },
    {
      kop: 'Breuken binnen de haakjes',
      tekst: 'Maak van de breuk eerst een negatieve macht, dan is het gewoon een macht van een macht.',
      voorbeeld: '(1/y)² = (y⁻¹)² = y⁻²',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '4d',
      opdracht: 'Schrijf zo simpel mogelijk, zonder haakjes en breuken',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: { geenBreuk: true, geenHaakjes: true },
      ...bouw,
    }
  },
}
