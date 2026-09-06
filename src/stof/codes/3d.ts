/** 3d — Kans bij een worp met dobbelstenen (reader 3.4) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { breuk, toonBreuk } from '../getal.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const DOBBEL = [4, 6, 6, 6, 8, 12, 20]

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // Som van twee d6
  (rng) => {
    const doel = rng.getal(2, 12)
    const gunstig = 6 - Math.abs(doel - 7)
    const kans = breuk(gunstig, 36)
    return {
      opdracht: 'Bereken de kans (geef een breuk)',
      vraag: `Je gooit met twee gewone dobbelstenen (d6). Hoe groot is de kans op ${doel} ogen in totaal?`,
      antwoord: toonBreuk(kans),
      stappen: [
        { doe: 'Tel alle mogelijke uitkomsten', werd: '6 · 6 = 36' },
        { doe: `Tel de manieren om ${doel} te gooien`, werd: `${gunstig} van de 36` },
        { doe: 'Kans is gunstig gedeeld door alles', werd: `${gunstig}/36` },
        { doe: 'Vereenvoudigen', werd: toonBreuk(kans) },
      ],
      valkuilen: [
        { fout: `${gunstig}/12`, heet: 'Er zijn 36 mogelijke uitkomsten bij twee dobbelstenen, niet 12.' },
        { fout: '1/6', heet: 'Niet elke som is even waarschijnlijk: 7 kan op zes manieren, 2 maar op één.' },
      ],
      tip: 'Twee dobbelstenen geven 6 · 6 = 36 mogelijke uitkomsten.',
    }
  },

  // Eén worp met een dX
  (rng) => {
    const zijden = rng.kies(DOBBEL)
    const doel = rng.getal(1, zijden)
    const kans = breuk(1, zijden)
    return {
      opdracht: 'Bereken de kans (geef een breuk)',
      vraag: `Je gooit één keer met een d${zijden}. Hoe groot is de kans dat je ${doel} gooit?`,
      antwoord: toonBreuk(kans),
      stappen: [
        { doe: `Een d${zijden} heeft ${zijden} kanten die allemaal even veel kans maken`, werd: `${zijden} mogelijke uitkomsten` },
        { doe: `Er is er precies één die ${doel} geeft`, werd: toonBreuk(kans) },
      ],
      valkuilen: [
        { fout: toonBreuk(breuk(doel, zijden)), heet: 'Het gegooide getal zelf telt niet mee in de kans: er is maar één gunstige kant.' },
      ],
      tip: 'Kans = aantal gunstige uitkomsten gedeeld door alle mogelijke uitkomsten.',
    }
  },

  // Hoger dan n
  (rng) => {
    const zijden = rng.kies([6, 6, 8, 12, 20])
    const grens = rng.getal(1, zijden - 2)
    const gunstig = zijden - grens
    const kans = breuk(gunstig, zijden)
    return {
      opdracht: 'Bereken de kans (geef een breuk)',
      vraag: `Je gooit één keer met een d${zijden}. Hoe groot is de kans dat je hoger dan ${grens} gooit?`,
      antwoord: toonBreuk(kans),
      stappen: [
        { doe: `Welke uitkomsten zijn hoger dan ${grens}?`, werd: `${grens + 1} tot en met ${zijden}, dat zijn er ${gunstig}` },
        { doe: `Deel door het totaal aantal kanten`, werd: `${gunstig}/${zijden}` },
        { doe: 'Vereenvoudigen', werd: toonBreuk(kans) },
      ],
      valkuilen: [
        { fout: toonBreuk(breuk(gunstig + 1, zijden)), heet: `"Hoger dan ${grens}" betekent zonder de ${grens} zelf.` },
        { fout: toonBreuk(breuk(grens, zijden)), heet: 'Je telde juist de uitkomsten die te laag zijn.' },
      ],
      tip: '"Hoger dan" telt het genoemde getal zelf niet mee, "minstens" wel.',
    }
  },

  // Twee keer hetzelfde
  (rng) => {
    const zijden = rng.kies([4, 6, 6, 8])
    const kans = breuk(zijden, zijden * zijden)
    return {
      opdracht: 'Bereken de kans (geef een breuk)',
      vraag: `Je gooit twee keer met een d${zijden}. Hoe groot is de kans dat je twee keer hetzelfde gooit?`,
      antwoord: toonBreuk(kans),
      stappen: [
        { doe: 'Alle mogelijke uitkomsten', werd: `${zijden} · ${zijden} = ${zijden * zijden}` },
        { doe: 'De eerste worp mag alles zijn; de tweede moet gelijk zijn', werd: `${zijden} gunstige paren` },
        { doe: 'Vereenvoudigen', werd: toonBreuk(kans) },
      ],
      valkuilen: [
        { fout: toonBreuk(breuk(1, zijden * zijden)), heet: 'Er zijn meerdere paren die gelijk zijn, niet alleen dubbel-één.' },
      ],
      tip: `De eerste worp maakt niet uit; de tweede moet hem volgen: kans 1/${zijden}.`,
    }
  },

  // Minstens één keer een bepaald getal in twee worpen
  (rng) => {
    const zijden = rng.kies([4, 6, 6, 8])
    const doel = rng.getal(1, zijden)
    const totaal = zijden * zijden
    const geen = (zijden - 1) * (zijden - 1)
    const kans = breuk(totaal - geen, totaal)
    return {
      opdracht: 'Bereken de kans (geef een breuk)',
      vraag: `Je gooit twee keer met een d${zijden}. Hoe groot is de kans op minstens één keer ${doel}?`,
      antwoord: toonBreuk(kans),
      stappen: [
        { doe: 'Reken eerst de kans uit op géén enkele keer ' + doel, werd: `${zijden - 1}/${zijden} · ${zijden - 1}/${zijden} = ${geen}/${totaal}` },
        { doe: 'Alles samen is 1, dus trek die kans daarvan af', werd: `${totaal}/${totaal} − ${geen}/${totaal} = ${totaal - geen}/${totaal}` },
        { doe: 'Vereenvoudigen', werd: toonBreuk(kans) },
      ],
      valkuilen: [
        { fout: toonBreuk(breuk(2, zijden)), heet: 'Kansen mag je niet zomaar optellen: dan tel je de dubbele worp twee keer mee.' },
        { fout: toonBreuk(breuk(geen, totaal)), heet: `Dat is de kans op géén enkele ${doel}. Die moet je nog van 1 aftrekken.` },
      ],
      tip: 'Bij "minstens één" is het handiger om de kans op géén te berekenen en die van 1 af te trekken.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '3d',
  hoofdstuk: 3,
  titel: 'Kans met dobbelstenen',
  waarover: 'gunstig gedeeld door mogelijk, en de regels en/of',
  uitleg: [
    {
      kop: 'De basis',
      tekst:
        'Een kans is het aantal gunstige uitkomsten gedeeld door het totaal aantal mogelijke uitkomsten. Een d6 heeft er 6, twee d6-en samen 6 · 6 = 36.',
      voorbeeld: 'kans op 7 ogen met twee dobbelstenen: 6/36 = 1/6',
    },
    {
      kop: 'Regel 1: en',
      tekst: 'Moet gebeurtenis A én gebeurtenis B gebeuren, dan vermenigvuldig je de kansen.',
      voorbeeld: 'twee keer een 6: 1/6 · 1/6 = 1/36',
    },
    {
      kop: 'Regel 2: of',
      tekst: 'Mag het A óf B zijn, dan tel je de kansen op.',
      voorbeeld: '1/36 + 5/36 + 5/36 = 11/36',
    },
    {
      kop: 'De omweg bij "minstens één"',
      tekst:
        'Reken uit hoe groot de kans is dat het níet gebeurt, en trek dat van 1 af. Dat is bijna altijd korter dan alle gevallen aflopen.',
      voorbeeld: '1 − (5/6 · 5/6) = 36/36 − 25/36 = 11/36',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '3d',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
