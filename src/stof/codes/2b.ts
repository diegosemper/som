/** 2b — Breuken vermenigvuldigen, delen en gehelen (reader 5.3 en 5.4) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { breuk, ggd, toonBreuk, toonGemengd } from '../getal.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip' | 'vorm'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // Vermenigvuldigen
  (rng) => {
    const t1 = rng.getal(1, 8)
    const n1 = rng.getal(2, 9)
    const t2 = rng.getal(1, 8)
    const n2 = rng.getal(2, 9)
    const uit = breuk(t1 * t2, n1 * n2)
    return {
      opdracht: 'Schrijf als één breuk en vereenvoudig zo ver mogelijk',
      vraag: `${t1}/${n1} · ${t2}/${n2}`,
      antwoord: toonGemengd(uit),
      stappen: [
        { doe: 'Tellers keer elkaar', werd: `${t1} · ${t2} = ${t1 * t2}` },
        { doe: 'Noemers keer elkaar', werd: `${n1} · ${n2} = ${n1 * n2}` },
        { doe: 'Vereenvoudigen', werd: toonGemengd(uit) },
      ],
      valkuilen: [
        { fout: `${t1 * t2}/${n1 + n2}`, heet: 'Ook de noemers moeten met elkaar vermenigvuldigd worden.' },
        { fout: toonGemengd(breuk(t1 * n2, n1 * t2)), heet: 'Omdraaien hoort bij delen, niet bij vermenigvuldigen.' },
      ],
      tip: 'Vermenigvuldigen: tellers keer elkaar, noemers keer elkaar.',
    }
  },

  // Delen
  (rng) => {
    const t1 = rng.getal(1, 8)
    const n1 = rng.getal(2, 9)
    const t2 = rng.getal(1, 8)
    const n2 = rng.getal(2, 9)
    const uit = breuk(t1 * n2, n1 * t2)
    return {
      opdracht: 'Schrijf als één breuk en vereenvoudig zo ver mogelijk',
      vraag: `${t1}/${n1} ÷ ${t2}/${n2}`,
      antwoord: toonGemengd(uit),
      stappen: [
        { doe: 'Delen door een breuk is vermenigvuldigen met het omgekeerde', werd: `${t1}/${n1} · ${n2}/${t2}` },
        { doe: 'Tellers keer elkaar, noemers keer elkaar', werd: `${t1 * n2}/${n1 * t2}` },
        { doe: 'Vereenvoudigen', werd: toonGemengd(uit) },
      ],
      valkuilen: [
        { fout: toonGemengd(breuk(t1 * t2, n1 * n2)), heet: 'Je vergat de tweede breuk om te draaien.' },
        { fout: toonGemengd(breuk(n1 * t2, t1 * n2)), heet: 'Je draaide de verkeerde breuk om: alleen die achter het deelteken.' },
      ],
      tip: 'Delen door iets is vermenigvuldigen met het omgekeerde.',
    }
  },

  // Onechte breuk -> gemengd getal
  (rng) => {
    const noemer = rng.getal(3, 13)
    const heel = rng.getal(1, 5)
    const rest = rng.getal(1, noemer - 1)
    const teller = heel * noemer + rest
    return {
      opdracht: 'Vereenvoudig: haal de helen eruit',
      vraag: `${teller}/${noemer}`,
      antwoord: toonGemengd(breuk(teller, noemer)),
      vorm: { gemengd: true },
      stappen: [
        { doe: `Hoe vaak past ${noemer} in ${teller}?`, werd: `${heel} keer, want ${heel} · ${noemer} = ${heel * noemer}` },
        { doe: 'Wat blijft er over?', werd: `${teller} − ${heel * noemer} = ${rest}` },
        { doe: 'Samen opschrijven en de rest vereenvoudigen', werd: toonGemengd(breuk(teller, noemer)) },
      ],
      valkuilen: [
        { fout: `${heel}`, heet: 'De rest hoort er ook bij: er blijft nog een stuk over.' },
      ],
      tip: 'Kijk hoe vaak de noemer in de teller past; wat overblijft wordt de nieuwe teller.',
    }
  },

  // Gemengd getal -> één breuk
  (rng) => {
    const heel = rng.getal(1, 5)
    const noemer = rng.getal(3, 11)
    // Het breukdeel moet al vereenvoudigd zijn, anders is het antwoord dat ook niet.
    const kandidaten = []
    for (let t = 1; t < noemer; t++) if (ggd(t, noemer) === 1) kandidaten.push(t)
    const teller = rng.kies(kandidaten)
    const uit = heel * noemer + teller
    return {
      opdracht: 'Schrijf als één breuk',
      vraag: `${heel} ${teller}/${noemer}`,
      antwoord: `${uit}/${noemer}`,
      vorm: { alsBreuk: true },
      stappen: [
        { doe: `Schrijf de ${heel} als breuk met noemer ${noemer}`, werd: `${heel * noemer}/${noemer}` },
        { doe: 'Tel de twee breuken bij elkaar op', werd: `${heel * noemer}/${noemer} + ${teller}/${noemer}` },
        { doe: 'Klaar', werd: `${uit}/${noemer}` },
      ],
      valkuilen: [
        { fout: `${heel + teller}/${noemer}`, heet: `Je telde ${heel} en ${teller} op. De hele moet éérst een breuk worden: ${heel} = ${heel * noemer}/${noemer}.` },
      ],
      tip: 'Eén hele is noemer/noemer. Dus 1 3/4 = 4/4 + 3/4 = 7/4.',
    }
  },

  // Optellen én delen in één opgave
  (rng) => {
    const a = rng.getal(1, 4)
    const b = rng.getal(2, 6)
    const c = rng.getal(1, 5)
    const d = rng.getal(2, 6)
    const e = rng.getal(1, 4)
    const f = rng.getal(2, 6)

    const deling = breuk(c * f, d * e)
    const uit = breuk(a * deling.noemer + deling.teller * b, b * deling.noemer)

    return {
      opdracht: 'Bereken en schrijf als één breuk',
      vraag: `${a}/${b} + ${c}/${d} ÷ ${e}/${f}`,
      antwoord: toonGemengd(uit),
      stappen: [
        { doe: 'HMWVDOA: eerst de deling', werd: `${c}/${d} · ${f}/${e} = ${toonBreuk(deling)}` },
        { doe: 'De som wordt', werd: `${a}/${b} + ${toonBreuk(deling)}` },
        { doe: 'Noemers gelijk maken en optellen', werd: `${a * deling.noemer}/${b * deling.noemer} + ${deling.teller * b}/${b * deling.noemer}` },
        { doe: 'Vereenvoudigen', werd: toonGemengd(uit) },
      ],
      valkuilen: [
        {
          fout: toonGemengd(breuk((a * d + c * b) * f, b * d * e)),
          heet: 'Je telde eerst op. Delen gaat vóór optellen.',
        },
      ],
      tip: 'Ook bij breuken geldt HMWVDOA: eerst keer en delen, dan pas plus en min.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '2b',
  hoofdstuk: 5,
  titel: 'Breuken keer en gedeeld',
  waarover: 'vermenigvuldigen, delen, en helen eruit halen',
  uitleg: [
    {
      kop: 'Vermenigvuldigen',
      tekst: 'Tellers met elkaar, noemers met elkaar. Daarna vereenvoudigen.',
      voorbeeld: '2/3 · 3/4 = 6/12 = 1/2',
    },
    {
      kop: 'Delen',
      tekst: 'Delen door een breuk is hetzelfde als vermenigvuldigen met het omgekeerde. Draai de tweede breuk om.',
      voorbeeld: '1/4 ÷ 2/3 = 1/4 · 3/2 = 3/8',
    },
    {
      kop: 'Helen eruit halen',
      tekst: 'Is de teller groter dan de noemer, kijk dan hoe vaak de noemer erin past. Wat overblijft is de nieuwe teller.',
      voorbeeld: '48/9 = 5 3/9 = 5 1/3',
    },
    {
      kop: 'En weer terug',
      tekst: 'Eén hele is noemer/noemer. Schrijf de hele eerst als breuk en tel dan op.',
      voorbeeld: '1 3/4 = 4/4 + 3/4 = 7/4',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '2b',
      invoer: 'typen',
      soort: 'getal',
      ...bouw,
      vorm: { alleenGetal: true, ...bouw.vorm },
    }
  },
}
