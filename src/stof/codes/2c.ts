/** 2c — Breuken met letters vereenvoudigen (reader 6.1) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { ggd } from '../getal.ts'
import { normaliseer } from '../../engine/rekenaar.ts'
import { macht, term, toonSom, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k1·xy / k2·x
  (rng) => {
    const [x, y] = rng.kies([['x', 'y'], ['a', 'b'], ['p', 'q']])
    const d = rng.getal(1, 5)
    const p = rng.getal(1, 5)
    const q = rng.getal(2, 6)
    const deler = ggd(p, q)
    const boven = toonTerm(term(d * p, { [x]: 1, [y]: 1 }))
    const onder = toonTerm(term(d * q, { [x]: 1 }))
    const uitBoven = toonTerm(term(p / deler, { [y]: 1 }))
    const uitOnder = q / deler
    const antwoord = uitOnder === 1 ? uitBoven : `${uitBoven}/${uitOnder}`
    return {
      vraag: `${boven} / ${onder}`,
      antwoord,
      stappen: [
        { doe: `Grootste gemeenschappelijke deler van ${d * p} en ${d * q}`, werd: String(d * deler) },
        { doe: 'Welke letter zit boven én onder?', werd: x },
        { doe: `Deel teller en noemer allebei door ${toonTerm(term(d * deler, { [x]: 1 }))}`, werd: antwoord },
      ],
      valkuilen: [
        { fout: `${toonTerm(term(p / deler, { [x]: 1, [y]: 1 }))}/${uitOnder}`, heet: `De ${x} valt boven én onder weg, dus die blijft niet staan.` },
      ],
      tip: 'Wegstrepen mag alleen als het in álle elementen van teller én noemer zit.',
    }
  },

  // x^a / x^b
  (rng) => {
    const x = rng.kies(['x', 'u', 'a'])
    const a = rng.getal(1, 4)
    const b = rng.getal(1, 4)
    const antwoord = a >= b ? macht(x, a - b) : `1/${macht(x, b - a)}`
    return {
      vraag: `${macht(x, a)} / ${macht(x, b)}`,
      antwoord,
      stappen: [
        { doe: 'Schrijf beide uit', werd: `${Array(a).fill(x).join('·')} / ${Array(b).fill(x).join('·')}` },
        { doe: `Streep ${Math.min(a, b)} keer een ${x} weg boven en onder`, werd: antwoord },
      ],
      valkuilen: [
        { fout: macht(x, a + b), heet: 'Bij delen trek je de machten af, niet optellen.' },
      ],
      tip: 'aˣ / aʸ = aˣ⁻ʸ',
    }
  },

  // (k1·x² + k2·x) / (k3·x³)
  (rng) => {
    const x = rng.kies(['x', 'a', 'u'])
    const d = rng.getal(1, 3)
    const p = rng.getal(1, 4)
    const q = rng.getal(1, 6)
    const r = rng.getal(2, 5)
    if (ggd(ggd(p, q), r) !== 1) {
      // Zorg dat er precies één gemeenschappelijke factor is.
      return maakEenvoudig(x, d, 1, q, r)
    }
    return maakEenvoudig(x, d, p, q, r)
  },
]

/** (d·p·x² + d·q·x) / (d·r·x³) = (p·x + q) / (r·x²) */
function maakEenvoudig(x: string, d: number, p: number, q: number, r: number): Bouwsel {
  const boven = toonSom([term(d * p, { [x]: 2 }), term(d * q, { [x]: 1 })])
  const onder = toonTerm(term(d * r, { [x]: 3 }))
  const uitBoven = toonSom([term(p, { [x]: 1 }), term(q)])
  const uitOnder = toonTerm(term(r, { [x]: 2 }))
  const antwoord = `(${uitBoven})/(${uitOnder})`
  return {
    vraag: `(${boven}) / (${onder})`,
    antwoord,
    stappen: [
      { doe: 'Kijk of alle drie de elementen door hetzelfde getal deelbaar zijn', werd: d === 1 ? 'nee, alleen door 1' : `ja, door ${d}` },
      { doe: `Streep één ${x} weg — die zit in élk element`, werd: `(${uitBoven})/(${uitOnder})` },
      { doe: 'Verder kan het niet: de + in de teller blokkeert meer wegstrepen', werd: antwoord },
    ],
    valkuilen: [
      {
        fout: `${toonSom([term(p, { [x]: 1 }), term(q)])}/${toonTerm(term(r, { [x]: 3 }))}`,
        heet: 'Wat je boven wegstreept, moet je ook onder wegstrepen — even vaak.',
      },
    ],
    tip: 'Je mag alleen wegstrepen wat in álle elementen zit, boven én onder.',
  }
}

export const onderwerp: Onderwerp = {
  code: '2c',
  hoofdstuk: 6,
  titel: 'Letterbreuken vereenvoudigen',
  waarover: 'wegstrepen wat overal in zit',
  uitleg: [
    {
      kop: 'Zoek wat overal in zit',
      tekst:
        'Net als bij gewone breuken deel je teller en noemer door hetzelfde. Dat mag een getal zijn, een letter, of allebei.',
      voorbeeld: '3xy / 6x = y/2',
    },
    {
      kop: 'Wegstrepen mag alleen overal tegelijk',
      tekst:
        'Staat er een plus in de teller, dan moet de letter in élk element zitten voordat je hem mag wegstrepen. Anders mag het niet.',
      voorbeeld: '(xy² + 2x²y) / 3x²y² = (y + 2x) / 3xy',
    },
    {
      kop: 'Twijfel je? Haal eerst buiten haakjes',
      tekst:
        'Als je de gemeenschappelijke factor eerst buiten haakjes zet, zie je meteen wat je boven en onder mag wegstrepen.',
      voorbeeld: 'xy(y + 2x) / xy(3xy) = (y + 2x) / 3xy',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '2c',
      opdracht: 'Vereenvoudig zo ver mogelijk',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: {
        geenGedeeldeLetter: true,
        // Krap: een niet-vereenvoudigde breuk is altijd langer dan de
        // vereenvoudigde, en te streng zijn kost hier geen hartje.
        hoogstensTekens: normaliseer(bouw.antwoord).length + 1,
      },
      ...bouw,
    }
  },
}
