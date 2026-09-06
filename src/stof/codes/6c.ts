/** 6c — Ongelijkheden oplossen (reader 7.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { term, toonGetal as g, toonSom } from '../term.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'keuzes' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  (rng) => {
    const x = rng.kies(['a', 'x', 'b', 'p'])
    const teken = rng.kies(['>', '<'])

    // Zorg voor een hele oplossing.
    const a = rng.nietNul(-6, 6)
    let c = rng.nietNul(-6, 6)
    if (c === a) c = a + 1
    const opl = rng.nietNul(-12, 12)
    const b = rng.getal(-15, 15)
    const d = a * opl + b - c * opl

    const links = toonSom([term(a, { [x]: 1 }), term(b)])
    const rechts = toonSom([term(c, { [x]: 1 }), term(d)])

    // (a − c)·x  teken  (d − b). Delen door een negatief getal draait het teken om.
    const noemer = a - c
    const draait = noemer < 0
    const uitTeken = draait ? (teken === '>' ? '<' : '>') : teken

    const goed = `${x} ${uitTeken} ${g(opl)}`
    const andersom = `${x} ${uitTeken === '>' ? '<' : '>'} ${g(opl)}`
    const verkeerdGetal = `${x} ${uitTeken} ${g(-opl)}`
    const allebeiFout = `${x} ${uitTeken === '>' ? '<' : '>'} ${g(-opl)}`

    return {
      opdracht: 'Voor welke waarden klopt deze ongelijkheid?',
      vraag: `${links} ${teken} ${rechts}`,
      antwoord: goed,
      keuzes: rng.schud([goed, andersom, verkeerdGetal, allebeiFout]),
      stappen: [
        { doe: 'Doe eerst alsof er een = teken staat en los op', werd: `${links} = ${rechts}` },
        { doe: `Alles met ${x} naar links, getallen naar rechts`, werd: `${toonSom([term(noemer, { [x]: 1 })])} = ${g(d - b)}` },
        { doe: `Delen door ${g(noemer)}`, werd: `${x} = ${g(opl)}` },
        {
          doe: draait
            ? `Je deelde door een negatief getal, dus het teken klapt om`
            : `Vul een waarde kleiner dan ${g(opl)} in en kijk of het klopt`,
          werd: goed,
          waarom: draait
            ? 'Bij delen of vermenigvuldigen met een negatief getal draait > om in < en andersom.'
            : 'Klopt het voor die proefwaarde, dan weet je aan welke kant de oplossing ligt.',
        },
      ],
      valkuilen: [
        { fout: andersom, heet: 'Het teken staat de verkeerde kant op. Vul een proefwaarde in om het te controleren.' },
      ],
      tip: 'Los eerst op alsof het = is. Bepaal daarna de richting met een proefwaarde.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '6c',
  hoofdstuk: 7,
  titel: 'Ongelijkheden',
  waarover: 'groter dan, kleiner dan, en welke kant het teken op staat',
  uitleg: [
    {
      kop: 'De tekens',
      tekst: '> is groter dan, < is kleiner dan. Ezelsbruggetje: in de k van kleiner zit zo\'n driehoekje.',
      voorbeeld: '≥ groter dan of gelijk aan, ≤ kleiner dan of gelijk aan',
    },
    {
      kop: 'Stap 1: doe alsof er = staat',
      tekst: 'Los de ongelijkheid eerst op als gewone vergelijking met de balansmethode. Dat geeft de grenswaarde.',
      voorbeeld: 'a + 11 > 3a − 11 → a = 11',
    },
    {
      kop: 'Stap 2: welke kant op?',
      tekst:
        'Vul een waarde in die kleiner is dan de grens. Klopt de ongelijkheid, dan is de oplossing "kleiner dan". Klopt hij niet, dan "groter dan".',
      voorbeeld: 'a = 10: 21 > 19 klopt, dus a < 11',
    },
    {
      kop: 'Let op negatieve getallen',
      tekst: 'Deel je beide kanten door een negatief getal, dan klapt het teken om.',
      voorbeeld: '−2a > 4 wordt a < −2',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '6c',
      invoer: 'keuze',
      soort: 'keuze',
      ...bouw,
    }
  },
}
