/** 2d — Letterbreuken optellen en aftrekken (reader 6.2) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { ggd } from '../getal.ts'
import { normaliseer } from '../../engine/rekenaar.ts'
import { term, toonSom, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k1/x + k2/g   (getal als tweede noemer)
  (rng) => {
    const x = rng.kies(['x', 'a', 'u'])
    const k1 = rng.getal(2, 6)
    const k2 = rng.getal(2, 6)
    const g = rng.getal(2, 6)
    const boven = toonSom([term(k1 * g), term(k2, { [x]: 1 })])
    const onder = toonTerm(term(g, { [x]: 1 }))
    return {
      vraag: `${k1}/${x} + ${k2}/${g}`,
      antwoord: `(${boven})/(${onder})`,
      stappen: [
        { doe: 'Noemers gelijk maken: vermenigvuldig ze met elkaar', werd: `${x} · ${g} = ${onder}` },
        { doe: 'Tellers mee aanpassen', werd: `${k1 * g}/${onder} + ${toonTerm(term(k2, { [x]: 1 }))}/${onder}` },
        { doe: 'Tellers optellen', werd: `(${boven})/(${onder})` },
      ],
      valkuilen: [
        { fout: `${k1 + k2}/(${x}+${g})`, heet: 'Tellers én noemers optellen mag niet. Eerst de noemers gelijk maken.' },
      ],
      tip: 'Noemers gelijk maken doe je door ze met elkaar te vermenigvuldigen.',
    }
  },

  // k1/x + k2/y
  (rng) => {
    const [x, y] = rng.kies([['x', 'y'], ['a', 'b'], ['p', 'q']])
    const k1 = rng.getal(2, 7)
    const k2 = rng.getal(2, 7)
    const boven = toonSom([term(k1, { [y]: 1 }), term(k2, { [x]: 1 })])
    const onder = toonTerm(term(1, { [x]: 1, [y]: 1 }))
    return {
      vraag: `${k1}/${x} + ${k2}/${y}`,
      antwoord: `(${boven})/(${onder})`,
      stappen: [
        { doe: 'Noemers met elkaar vermenigvuldigen', werd: `${x} · ${y} = ${onder}` },
        { doe: 'Elke teller keer de andere noemer', werd: `${toonTerm(term(k1, { [y]: 1 }))}/${onder} + ${toonTerm(term(k2, { [x]: 1 }))}/${onder}` },
        { doe: 'Tellers optellen', werd: `(${boven})/(${onder})` },
      ],
      valkuilen: [
        { fout: `${k1 + k2}/(${x}${y})`, heet: 'De tellers moeten eerst met de andere noemer vermenigvuldigd worden.' },
      ],
      tip: 'Wat je met de noemer doet, doe je ook met de teller.',
    }
  },

  // k1·x/y + k2·y/(k3·x)  -> deelbaar resultaat
  (rng) => {
    const [x, y] = rng.kies([['x', 'y'], ['a', 'b']])
    const k1 = rng.getal(2, 5)
    const k2 = rng.getal(2, 6)
    const k3 = rng.getal(2, 4)
    // k1x/y + k2y/(k3x) = (k1·k3·x² + k2·y²) / (k3·x·y)
    const t1 = k1 * k3
    const t2 = k2
    const n = k3
    const deler = ggd(ggd(t1, t2), n)
    const boven = toonSom([term(t1 / deler, { [x]: 2 }), term(t2 / deler, { [y]: 2 })])
    const onder = toonTerm(term(n / deler, { [x]: 1, [y]: 1 }))
    return {
      vraag: `${toonTerm(term(k1, { [x]: 1 }))}/${y} + ${toonTerm(term(k2, { [y]: 1 }))}/${toonTerm(term(k3, { [x]: 1 }))}`,
      antwoord: `(${boven})/(${onder})`,
      stappen: [
        { doe: 'Noemers met elkaar vermenigvuldigen', werd: `${y} · ${toonTerm(term(k3, { [x]: 1 }))} = ${toonTerm(term(k3, { [x]: 1, [y]: 1 }))}` },
        { doe: 'Tellers mee aanpassen en optellen', werd: `(${toonSom([term(t1, { [x]: 2 }), term(t2, { [y]: 2 })])})/(${toonTerm(term(n, { [x]: 1, [y]: 1 }))})` },
        {
          doe: deler > 1 ? `Alle elementen zijn deelbaar door ${deler}` : 'Kan er nog iets weg? Geen gemeenschappelijke letter in alle elementen',
          werd: `(${boven})/(${onder})`,
        },
      ],
      valkuilen: [
        {
          fout: `(${toonSom([term(t1 / deler, { [x]: 1 }), term(t2 / deler, { [y]: 1 })])})/(${onder})`,
          heet: `Let op de machten: ${x} · ${x} geeft ${x}².`,
        },
      ],
      tip: 'Je mag pas letters wegstrepen als ze in álle elementen zitten.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '2d',
  hoofdstuk: 6,
  titel: 'Letterbreuken optellen',
  waarover: 'noemers gelijk maken met letters erin',
  uitleg: [
    {
      kop: 'Zelfde regel als bij getallen',
      tekst:
        'Optellen kan pas als de noemers exact gelijk zijn. De makkelijkste manier om dat te bereiken: vermenigvuldig de noemers met elkaar.',
      voorbeeld: '2/8x + x/6y → noemer 48xy',
    },
    {
      kop: 'De teller gaat mee',
      tekst: 'Vermenigvuldig je de noemer met iets, dan moet de teller met precies hetzelfde vermenigvuldigd worden.',
      voorbeeld: '2/8x wordt 2·6y / 8x·6y = 12y/48xy',
    },
    {
      kop: 'Daarna pas vereenvoudigen',
      tekst:
        'Kijk of alle getallen door hetzelfde deelbaar zijn. Letters wegstrepen mag alleen als ze in álle elementen van de breuk zitten.',
      voorbeeld: '(8x² + 12y) / 48xy = (2x² + 3y) / 12xy',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '2d',
      opdracht: 'Schrijf als één breuk en vereenvoudig zo ver mogelijk',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: { hoogstensTekens: normaliseer(bouw.antwoord).length + 5 },
      ...bouw,
    }
  },
}
