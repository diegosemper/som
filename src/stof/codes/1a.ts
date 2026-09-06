/** 1a — Rekenvolgorde en negatieve getallen (reader 1.1 en 1.2) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { toonGetal as g } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const VOLGORDE = 'Hoe Moeten We Van Die Onvoldoendes Afkomen: Haakjes, Machten/Wortels, Vermenigvuldigen/Delen, Optellen/Aftrekken.'

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // a + b · c
  (rng) => {
    const a = rng.getal(2, 15)
    const b = rng.getal(2, 9)
    const c = rng.getal(2, 9)
    return {
      vraag: `${a} + ${b} · ${c}`,
      antwoord: g(a + b * c),
      stappen: [
        { doe: 'Eerst vermenigvuldigen', werd: `${a} + ${b * c}`, waarom: 'V staat in HMWVDOA vóór O.' },
        { doe: 'Nu optellen', werd: g(a + b * c) },
      ],
      valkuilen: [
        { fout: g((a + b) * c), heet: 'Je rekende van links naar rechts. Vermenigvuldigen gaat vóór optellen.' },
      ],
      tip: VOLGORDE,
    }
  },

  // a · b + c
  (rng) => {
    const a = rng.getal(2, 9)
    const b = rng.getal(2, 9)
    const c = rng.getal(2, 15)
    return {
      vraag: `${a} · ${b} + ${c}`,
      antwoord: g(a * b + c),
      stappen: [
        { doe: 'Eerst vermenigvuldigen', werd: `${a * b} + ${c}` },
        { doe: 'Nu optellen', werd: g(a * b + c) },
      ],
      valkuilen: [
        { fout: g(a * (b + c)), heet: 'Je telde eerst op. Het vermenigvuldigen staat links en gaat voor.' },
      ],
      tip: VOLGORDE,
    }
  },

  // (a − b) · c
  (rng) => {
    const b = rng.getal(2, 9)
    const a = b + rng.getal(1, 9)
    const c = rng.getal(2, 9)
    return {
      vraag: `(${a} − ${b}) · ${c}`,
      antwoord: g((a - b) * c),
      stappen: [
        { doe: 'Eerst wat tussen de haakjes staat', werd: `${a - b} · ${c}`, waarom: 'H staat vooraan.' },
        { doe: 'Nu vermenigvuldigen', werd: g((a - b) * c) },
      ],
      valkuilen: [
        { fout: g(a - b * c), heet: 'Je liet de haakjes vallen. Alles tussen haakjes hoort bij elkaar.' },
      ],
      tip: VOLGORDE,
    }
  },

  // a + b ÷ c · d  (delen staat links, dus delen eerst)
  (rng) => {
    const a = rng.getal(4, 20)
    const c = rng.getal(2, 6)
    const k = rng.getal(2, 8)
    const b = c * k
    const d = rng.getal(2, 5)
    return {
      vraag: `${a} + ${b} ÷ ${c} · ${d}`,
      antwoord: g(a + k * d),
      stappen: [
        { doe: 'Delen en vermenigvuldigen in leesvolgorde, dus eerst het delen', werd: `${a} + ${k} · ${d}` },
        { doe: 'Dan het vermenigvuldigen', werd: `${a} + ${k * d}` },
        { doe: 'Tot slot optellen', werd: g(a + k * d) },
      ],
      valkuilen: [
        { fout: `${a}+${b}/(${c}·${d})`, heet: 'Je vermenigvuldigde eerst. Delen en keer zijn even sterk: doe wat het eerst staat.' },
      ],
      tip: 'Delen en vermenigvuldigen zijn even sterk. Werk van links naar rechts.',
    }
  },

  // a · b + c ÷ d
  (rng) => {
    const a = rng.getal(2, 9)
    const b = rng.getal(2, 9)
    const d = rng.getal(2, 6)
    const k = rng.getal(1, 8)
    const c = d * k
    return {
      vraag: `${a} · ${b} + ${c} ÷ ${d}`,
      antwoord: g(a * b + k),
      stappen: [
        { doe: 'Eerst vermenigvuldigen en delen', werd: `${a * b} + ${k}` },
        { doe: 'Nu optellen', werd: g(a * b + k) },
      ],
      valkuilen: [
        { fout: `(${a}·${b}+${c})/${d}`, heet: 'Je deelde het hele begin. De deling hoort alleen bij het getal ervoor.' },
      ],
      tip: VOLGORDE,
    }
  },

  // a − b ÷ c
  (rng) => {
    const c = rng.getal(2, 6)
    const k = rng.getal(1, 8)
    const b = c * k
    const a = rng.getal(2, 25)
    return {
      vraag: `${a} − ${b} ÷ ${c}`,
      antwoord: g(a - k),
      stappen: [
        { doe: 'Eerst delen', werd: `${a} − ${k}`, waarom: 'D gaat vóór A.' },
        { doe: 'Nu aftrekken', werd: g(a - k) },
      ],
      valkuilen: [
        { fout: `(${a}−${b})/${c}`, heet: 'Je trok eerst af. Delen gaat vóór aftrekken.' },
      ],
      tip: VOLGORDE,
    }
  },

  // a − (b + c) · d
  (rng) => {
    const a = rng.getal(2, 15)
    const b = rng.getal(1, 6)
    const c = rng.getal(1, 6)
    const d = rng.getal(2, 5)
    return {
      vraag: `${a} − (${b} + ${c}) · ${d}`,
      antwoord: g(a - (b + c) * d),
      stappen: [
        { doe: 'Eerst de haakjes', werd: `${a} − ${b + c} · ${d}` },
        { doe: 'Dan vermenigvuldigen', werd: `${a} − ${(b + c) * d}` },
        { doe: 'Tot slot aftrekken', werd: g(a - (b + c) * d) },
      ],
      valkuilen: [
        { fout: g((a - (b + c)) * d), heet: 'Je rekende van links naar rechts. Keer gaat vóór min.' },
      ],
      tip: VOLGORDE,
    }
  },

  // −a − −b
  (rng) => {
    const a = rng.getal(2, 20)
    const b = rng.getal(2, 20)
    return {
      vraag: `−${a} − −${b}`,
      antwoord: g(-a + b),
      stappen: [
        { doe: 'Min en min wordt plus', werd: `−${a} + ${b}`, waarom: 'IJsblokjes weghalen maakt het water warmer.' },
        { doe: 'Uitrekenen', werd: g(-a + b) },
      ],
      valkuilen: [
        { fout: g(-a - b), heet: 'Twee mintekens naast elkaar worden samen plus.' },
      ],
      tip: 'Negatief en negatief samen wordt positief.',
    }
  },

  // a − −b
  (rng) => {
    const a = rng.getal(2, 20)
    const b = rng.getal(2, 15)
    return {
      vraag: `${a} − −${b}`,
      antwoord: g(a + b),
      stappen: [
        { doe: 'Min en min wordt plus', werd: `${a} + ${b}` },
        { doe: 'Uitrekenen', werd: g(a + b) },
      ],
      valkuilen: [{ fout: g(a - b), heet: 'Twee mintekens naast elkaar worden samen plus.' }],
      tip: 'Negatief en negatief samen wordt positief.',
    }
  },

  // −a · −b  of  a · −b
  (rng) => {
    const a = rng.getal(2, 12)
    const b = rng.getal(2, 12)
    const beideNegatief = rng.kans(0.5)
    if (beideNegatief) {
      return {
        vraag: `−${a} · −${b}`,
        antwoord: g(a * b),
        stappen: [
          { doe: 'Min keer min is plus', werd: `${a} · ${b}` },
          { doe: 'Uitrekenen', werd: g(a * b) },
        ],
        valkuilen: [{ fout: g(-a * b), heet: 'Min keer min geeft juist een positief antwoord.' }],
        tip: 'Twee mintekens heffen elkaar op.',
      }
    }
    return {
      vraag: `${a} · −${b}`,
      antwoord: g(-a * b),
      stappen: [
        { doe: 'Plus keer min is min', werd: `−(${a} · ${b})` },
        { doe: 'Uitrekenen', werd: g(-a * b) },
      ],
      valkuilen: [{ fout: g(a * b), heet: 'Eén minteken blijft een minteken: de uitkomst is negatief.' }],
      tip: 'Eén min in een vermenigvuldiging maakt het antwoord negatief.',
    }
  },

  // −a ÷ −b  of  −a ÷ b
  (rng) => {
    const b = rng.getal(2, 9)
    const k = rng.getal(2, 9)
    const a = b * k
    const beideNegatief = rng.kans(0.5)
    if (beideNegatief) {
      return {
        vraag: `−${a} ÷ −${b}`,
        antwoord: g(k),
        stappen: [
          { doe: 'Min gedeeld door min is plus', werd: `${a} ÷ ${b}` },
          { doe: 'Uitrekenen', werd: g(k) },
        ],
        valkuilen: [{ fout: g(-k), heet: 'Min gedeeld door min geeft een positief antwoord.' }],
        tip: 'Twee mintekens heffen elkaar op.',
      }
    }
    return {
      vraag: `−${a} ÷ ${b}`,
      antwoord: g(-k),
      stappen: [
        { doe: 'Min gedeeld door plus blijft min', werd: `−(${a} ÷ ${b})` },
        { doe: 'Uitrekenen', werd: g(-k) },
      ],
      valkuilen: [{ fout: g(k), heet: 'Eén minteken blijft staan: de uitkomst is negatief.' }],
      tip: 'Eén min in een deling maakt het antwoord negatief.',
    }
  },

  // −a + b · c
  (rng) => {
    const a = rng.getal(2, 12)
    const b = rng.getal(2, 9)
    const c = rng.getal(2, 9)
    return {
      vraag: `−${a} + ${b} · ${c}`,
      antwoord: g(-a + b * c),
      stappen: [
        { doe: 'Eerst vermenigvuldigen', werd: `−${a} + ${b * c}` },
        { doe: 'Nu optellen', werd: g(-a + b * c) },
      ],
      valkuilen: [
        { fout: g((-a + b) * c), heet: 'Je rekende van links naar rechts. Keer gaat vóór plus.' },
      ],
      tip: VOLGORDE,
    }
  },

  // −a − b + c ÷ d
  (rng) => {
    const a = rng.getal(2, 12)
    const b = rng.getal(2, 12)
    const d = rng.getal(2, 6)
    const k = rng.getal(1, 8)
    const c = d * k
    return {
      vraag: `−${a} − ${b} + ${c} ÷ ${d}`,
      antwoord: g(-a - b + k),
      stappen: [
        { doe: 'Eerst delen', werd: `−${a} − ${b} + ${k}` },
        { doe: 'Dan van links naar rechts optellen en aftrekken', werd: `${g(-a - b)} + ${k}` },
        { doe: 'Uitrekenen', werd: g(-a - b + k) },
      ],
      valkuilen: [
        { fout: g(-a + b + k), heet: 'Let op het minteken vóór het tweede getal: dat moet er nog af.' },
      ],
      tip: VOLGORDE,
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '1a',
  hoofdstuk: 1,
  titel: 'Rekenvolgorde',
  waarover: 'HMWVDOA, en rekenen met negatieve getallen',
  uitleg: [
    {
      kop: 'De volgorde ligt vast',
      tekst:
        'Je mag een som niet zomaar van links naar rechts uitrekenen. Er is een vaste volgorde: Haakjes, Machten en Wortels, Vermenigvuldigen en Delen, Optellen en Aftrekken.',
      voorbeeld: 'Hoe Moeten We Van Die Onvoldoendes Afkomen',
    },
    {
      kop: 'Even sterk? Dan lezen',
      tekst:
        'Vermenigvuldigen en delen zijn even sterk. Staan ze allebei in de som, doe dan wat het eerst staat — van links naar rechts. Hetzelfde geldt voor optellen en aftrekken.',
      voorbeeld: '5 + 6 ÷ 2 · 5 = 5 + 3 · 5 = 5 + 15 = 20',
    },
    {
      kop: 'Min en min wordt plus',
      tekst:
        'Twee mintekens naast elkaar heffen elkaar op. Denk aan een bak water met ijsblokjes: haal je ijs weg, dan wordt het water warmer.',
      voorbeeld: '4 − −2 = 4 + 2 = 6     −10 − −6 = −4',
    },
    {
      kop: 'Keer en delen met mintekens',
      tekst:
        'Eén minteken maakt de uitkomst negatief, twee mintekens maken hem positief. Dat geldt bij vermenigvuldigen én bij delen.',
      voorbeeld: '4 · −2 = −8     −4 · −2 = 8     −24 ÷ −6 = 4',
    },
    {
      kop: 'Onzichtbare haakjes',
      tekst:
        'Een lange breukstreep en een wortelstreep werken als haakjes: alles wat erboven, eronder of eronder staat hoort bij elkaar.',
      voorbeeld: '(6·2)/(5−3) = 12/2 = 6',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '1a',
      opdracht: 'Bereken',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
