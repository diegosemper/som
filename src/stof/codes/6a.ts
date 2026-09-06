/** 6a — Balansmethode: vergelijkingen oplossen (reader 7.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { breuk, toonGemengd } from '../getal.ts'
import { term, toonGetal as g, toonSom } from '../term.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // ax + b = cx + d
  (rng) => {
    const x = rng.kies(['x', 'm', 'b', 'a'])
    const a = rng.nietNul(-8, 8)
    let c = rng.nietNul(-8, 8)
    if (c === a) c = a + 1
    const opl = rng.nietNul(-8, 8)
    const b = rng.getal(-20, 20)
    const d = a * opl + b - c * opl

    const links = toonSom([term(a, { [x]: 1 }), term(b)])
    const rechts = toonSom([term(c, { [x]: 1 }), term(d)])

    return {
      opdracht: `Los op (geef de waarde van ${x})`,
      vraag: `${links} = ${rechts}`,
      antwoord: g(opl),
      stappen: [
        { doe: `Haal ${g(b)} van beide kanten af`, werd: `${toonSom([term(a, { [x]: 1 })])} = ${toonSom([term(c, { [x]: 1 }), term(d - b)])}` },
        { doe: `Haal ${toonSom([term(c, { [x]: 1 })])} van beide kanten af`, werd: `${toonSom([term(a - c, { [x]: 1 })])} = ${g(d - b)}` },
        { doe: `Deel beide kanten door ${g(a - c)}`, werd: g(opl) },
      ],
      valkuilen: [
        { fout: g(-opl), heet: 'Tekenfout: als je een getal naar de andere kant brengt, klapt het teken om.' },
        { fout: toonGemengd(breuk(d - b, a + c)), heet: `Je telde de ${x}-en op in plaats van ze af te trekken.` },
      ],
      tip: 'Wat je links doet, doe je ook rechts. Zo houd je de balans in evenwicht.',
    }
  },

  // ax − b = c   (eenvoudiger instapniveau)
  (rng) => {
    const x = rng.kies(['m', 'x', 'p'])
    const a = rng.kies([2, 3, 4, 5, 6, 8])
    const opl = rng.nietNul(-9, 9)
    const b = rng.getal(-25, 25)
    const c = a * opl + b

    return {
      opdracht: `Los op (geef de waarde van ${x})`,
      vraag: `${toonSom([term(a, { [x]: 1 }), term(b)])} = ${g(c)}`,
      antwoord: g(opl),
      stappen: [
        { doe: `Breng ${g(b)} naar de andere kant — het teken klapt om`, werd: `${toonSom([term(a, { [x]: 1 })])} = ${g(c)} ${b < 0 ? '+' : '−'} ${Math.abs(b)}` },
        { doe: 'Uitrekenen', werd: `${toonSom([term(a, { [x]: 1 })])} = ${g(c - b)}` },
        { doe: `Deel beide kanten door ${a}`, werd: g(opl) },
      ],
      valkuilen: [
        { fout: g(c + b), heet: `Je vergat nog door ${a} te delen.` },
        { fout: toonGemengd(breuk(c + b, a)), heet: 'Tekenfout bij het overbrengen: het teken klapt om.' },
      ],
      tip: 'Een getal dat je naar de andere kant van het = teken brengt, verandert van teken.',
    }
  },

  // Snijpunt van twee lijnen: geef de x-waarde
  (rng) => {
    const a = rng.kies([20, 30, 40, 50, 60])
    const c = rng.kies([10, 15, 20, 25, 35])
    const echt = a === c ? a + 10 : a
    const b = rng.kies([100, 150, 200, 250])
    const d = rng.kies([300, 350, 400, 450])
    const opl = breuk(d - b, echt - c)

    return {
      opdracht: 'Twee abonnementen. Na hoeveel maanden kosten ze evenveel?',
      vraag: `A = ${echt}m + ${b}   en   B = ${c}m + ${d}`,
      antwoord: toonGemengd(opl),
      stappen: [
        { doe: 'Stel de twee formules aan elkaar gelijk', werd: `${echt}m + ${b} = ${c}m + ${d}` },
        { doe: `Haal ${b} van beide kanten af`, werd: `${echt}m = ${c}m + ${d - b}` },
        { doe: `Haal ${c}m van beide kanten af`, werd: `${echt - c}m = ${d - b}` },
        { doe: `Deel door ${echt - c}`, werd: toonGemengd(opl) },
      ],
      valkuilen: [
        { fout: toonGemengd(breuk(d + b, echt + c)), heet: 'Alles optellen werkt niet: je moet gelijke termen juist naar één kant halen.' },
      ],
      tip: 'Het snijpunt vind je door beide formules aan elkaar gelijk te stellen.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '6a',
  hoofdstuk: 7,
  titel: 'Balansmethode',
  waarover: 'vergelijkingen oplossen door beide kanten gelijk te houden',
  uitleg: [
    {
      kop: 'Denk aan een weegschaal',
      tekst:
        'Links en rechts van het = teken staat evenveel. Doe je links iets, dan moet je rechts precies hetzelfde doen — anders slaat de balans door.',
      voorbeeld: '50m + 200 = 30m + 350',
    },
    {
      kop: 'Doel: de letter alleen',
      tekst:
        'Haal eerst de losse getallen weg bij de letter, en breng daarna alle letters naar één kant. Deel tot slot door het getal dat vóór de letter staat.',
      voorbeeld: '20m = 150 → m = 7,5',
    },
    {
      kop: 'De snelle manier',
      tekst:
        'Je mag ook onthouden dat het + of − teken omklapt als je een getal naar de andere kant brengt. Dat is precies hetzelfde, maar sneller.',
      voorbeeld: '6m − 6 = 12 wordt 6m = 12 + 6',
    },
    {
      kop: 'Waarvoor je het gebruikt',
      tekst:
        'Het snijpunt van twee lijnen vind je door de formules aan elkaar gelijk te stellen. De uitkomst is de x-waarde van dat snijpunt.',
      voorbeeld: 'A = B → m = 7,5, en dan y = 575',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '6a',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
