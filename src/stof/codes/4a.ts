/** 4a — Machtsregel voor vermenigvuldigen: aˣ · aʸ = aˣ⁺ʸ (reader 2.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { macht, term, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const REGEL = 'aˣ · aʸ = aˣ⁺ʸ — bij vermenigvuldigen tel je de machten op. Alleen bij gelijke grondtallen!'

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k1·x^e1 · k2·x^e2
  (rng) => {
    const x = rng.kies(['x', 'a', 'u', 'p'])
    const k1 = rng.getal(2, 6)
    const k2 = rng.getal(2, 6)
    const e1 = rng.getal(1, 4)
    const e2 = rng.getal(1, 4)
    const links = term(k1, { [x]: e1 })
    const rechts = term(k2, { [x]: e2 })
    const uit = term(k1 * k2, { [x]: e1 + e2 })
    return {
      vraag: `${toonTerm(links)} · ${toonTerm(rechts)}`,
      antwoord: toonTerm(uit),
      stappen: [
        { doe: 'Getallen keer getallen', werd: `${k1} · ${k2} = ${k1 * k2}` },
        { doe: 'Machten van hetzelfde grondtal optellen', werd: `${x}${e1 === 1 ? '' : '^' + e1} · ${x}${e2 === 1 ? '' : '^' + e2} = ${macht(x, e1 + e2)}` },
        { doe: 'Samen', werd: toonTerm(uit) },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 * k2, { [x]: e1 * e2 })), heet: 'Je vermenigvuldigde de machten. Bij keer moet je ze optéllen.' },
        { fout: toonTerm(term(k1 + k2, { [x]: e1 + e2 })), heet: 'De getallen vóór de letter moet je vermenigvuldigen, niet optellen.' },
      ],
      tip: REGEL,
    }
  },

  // b^e1 · b^e2 met een getal als grondtal, soms een negatieve macht
  (rng) => {
    const b = rng.kies([2, 2, 3, 5])
    const e1 = rng.getal(2, 5)
    const e2 = rng.kies([1, 2, 3, -1, -2])
    const uit = e1 + e2
    return {
      vraag: `${macht(String(b), e1)} · ${macht(String(b), e2)}`,
      antwoord: macht(String(b), uit),
      stappen: [
        { doe: 'Gelijke grondtallen, dus machten optellen', werd: `${b}^(${e1} + ${e2})` },
        { doe: 'Uitrekenen', werd: macht(String(b), uit) },
      ],
      valkuilen: [
        { fout: macht(String(b), e1 * e2), heet: 'Machten optellen, niet vermenigvuldigen.' },
        { fout: macht(String(b * b), uit), heet: 'Het grondtal blijft hetzelfde; alleen de macht verandert.' },
      ],
      tip: REGEL,
    }
  },

  // k1·a · k2·b · k3·a
  (rng) => {
    const [a, b] = rng.kies([['a', 'b'], ['x', 'y'], ['p', 'q']])
    const k1 = rng.getal(2, 5)
    const k2 = rng.getal(2, 5)
    const k3 = rng.getal(2, 5)
    const uit = term(k1 * k2 * k3, { [a]: 2, [b]: 1 })
    return {
      vraag: `${toonTerm(term(k1, { [a]: 1 }))} · ${toonTerm(term(k2, { [b]: 1 }))} · ${toonTerm(term(k3, { [a]: 1 }))}`,
      antwoord: toonTerm(uit),
      stappen: [
        { doe: 'Eerst de eerste twee', werd: toonTerm(term(k1 * k2, { [a]: 1, [b]: 1 })) },
        { doe: `Dan keer ${toonTerm(term(k3, { [a]: 1 }))}`, werd: toonTerm(uit), waarom: `${a} · ${a} = ${a}²` },
      ],
      valkuilen: [
        { fout: toonTerm(term(k1 * k2 * k3, { [a]: 1, [b]: 1 })), heet: `Twee keer de letter ${a} geeft ${a}², niet ${a}.` },
        { fout: toonTerm(term(k1 + k2 + k3, { [a]: 2, [b]: 1 })), heet: 'De getallen moeten keer elkaar, niet opgeteld.' },
      ],
      tip: REGEL,
    }
  },

  // a^e1·b · a^e2
  (rng) => {
    const [a, b] = rng.kies([['a', 'b'], ['x', 'y'], ['u', 'v']])
    const e1 = rng.getal(1, 3)
    const e2 = rng.getal(1, 3)
    const uit = term(1, { [a]: e1 + e2, [b]: 1 })
    return {
      vraag: `${toonTerm(term(1, { [a]: e1, [b]: 1 }))} · ${toonTerm(term(1, { [a]: e2 }))}`,
      antwoord: toonTerm(uit),
      stappen: [
        { doe: `Alleen de ${a}-en hebben hetzelfde grondtal`, werd: `${macht(a, e1)} · ${macht(a, e2)} = ${macht(a, e1 + e2)}` },
        { doe: `De ${b} blijft gewoon staan`, werd: toonTerm(uit) },
      ],
      valkuilen: [
        { fout: toonTerm(term(1, { [a]: e1 * e2, [b]: 1 })), heet: 'Machten optellen bij vermenigvuldigen, niet vermenigvuldigen.' },
        { fout: toonTerm(term(1, { [a]: e1 + e2, [b]: 2 })), heet: `Er is maar één ${b}: die macht verandert niet.` },
      ],
      tip: 'De machtsregels gelden alleen bij gelijke grondtallen.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '4a',
  hoofdstuk: 2,
  titel: 'Machten vermenigvuldigen',
  waarover: 'aˣ · aʸ = aˣ⁺ʸ',
  uitleg: [
    {
      kop: 'De regel',
      tekst:
        'Vermenigvuldig je twee machten met hetzelfde grondtal, dan tel je de machten op. Dat is logisch: a³ · a² is a·a·a · a·a, dus vijf keer a.',
      voorbeeld: 'aˣ · aʸ = aˣ⁺ʸ     2³ · 2² = 2⁵',
    },
    {
      kop: 'Alleen bij gelijke grondtallen',
      tekst: 'De machtsregels werken alleen als het grondtal hetzelfde is. a³ · b² kun je niet samenvoegen.',
      voorbeeld: 'a³ · a² = a⁵     maar a³ · b² blijft a³b²',
    },
    {
      kop: 'Getallen apart',
      tekst: 'De getallen vóór de letters vermenigvuldig je gewoon met elkaar; de letters volgen de machtsregel.',
      voorbeeld: '4a · 4b · 2a = 32a²b',
    },
    {
      kop: 'Negatieve machten doen mee',
      tekst: 'Ook een negatieve macht tel je gewoon op. Let goed op de tekens.',
      voorbeeld: '2³ · 2⁻² = 2³⁺⁻² = 2¹ = 2',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '4a',
      opdracht: 'Herleid',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: { geenMaal: true },
      ...bouw,
    }
  },
}
