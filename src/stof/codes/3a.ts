/** 3a — Gemiddelde, ook gewogen (reader 3.1) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { breuk, toonGemengd } from '../getal.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const som = (lijst: number[]) => lijst.reduce((a, b) => a + b, 0)

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // Cijfers of leeftijden
  (rng) => {
    const soort = rng.kies([
      { wat: 'toetscijfers', eenheid: '', min: 4, max: 10, aantal: rng.getal(4, 6) },
      { wat: 'leeftijden van de spelers', eenheid: ' jaar', min: 15, max: 24, aantal: 5 },
    ])
    const lijst = Array.from({ length: soort.aantal }, () => rng.getal(soort.min, soort.max))
    const totaal = som(lijst)
    const gem = breuk(totaal, lijst.length)

    return {
      opdracht: `Bereken het gemiddelde van deze ${soort.wat}`,
      vraag: lijst.join(', '),
      antwoord: toonGemengd(gem),
      stappen: [
        { doe: 'Tel alle waarden bij elkaar op', werd: `${lijst.join(' + ')} = ${totaal}` },
        { doe: `Deel door het aantal waarden (${lijst.length})`, werd: `${totaal} / ${lijst.length}` },
        { doe: 'Uitrekenen', werd: toonGemengd(gem) },
      ],
      valkuilen: [
        { fout: String(totaal), heet: 'Je bent halverwege gestopt: de som moet nog gedeeld worden door het aantal.' },
        { fout: toonGemengd(breuk(totaal, lijst.length - 1)), heet: `Je deelde door ${lijst.length - 1}. Er zijn ${lijst.length} waarden.` },
      ],
      tip: 'Gemiddelde = de som van alle waarden gedeeld door het aantal waarden.',
    }
  },

  // Snelheden — komt meestal rond uit
  (rng) => {
    const aantal = rng.kies([5, 6])
    const basis = rng.getal(100, 125)
    const lijst = Array.from({ length: aantal }, () => basis + rng.getal(-15, 15))
    const totaal = som(lijst)
    const gem = breuk(totaal, aantal)

    return {
      opdracht: 'Bereken de gemiddelde snelheid (km/u)',
      vraag: lijst.map((n) => `${n}`).join(', '),
      antwoord: toonGemengd(gem),
      stappen: [
        { doe: 'Alle snelheden optellen', werd: `${lijst.join(' + ')} = ${totaal}` },
        { doe: `Delen door het aantal metingen (${aantal})`, werd: `${totaal} / ${aantal}` },
        { doe: 'Uitrekenen', werd: toonGemengd(gem) },
      ],
      valkuilen: [
        { fout: String(totaal), heet: 'Nog delen door het aantal metingen.' },
      ],
      tip: 'Gemiddelde = som van de metingen gedeeld door het aantal metingen.',
    }
  },

  // Gewogen gemiddelde
  (rng) => {
    const huiswerk = rng.getal(4, 9)
    const toets1 = rng.getal(4, 9)
    const toets2 = rng.getal(4, 9)
    const eind = rng.getal(4, 10)
    const wH = 2
    const wT = 3
    const wE = 4
    const totaalPunten = huiswerk * wH + toets1 * wT + toets2 * wT + eind * wE
    const totaalGewicht = wH + wT + wT + wE
    const gem = breuk(totaalPunten, totaalGewicht)

    return {
      opdracht: 'Bereken het gewogen gemiddelde',
      vraag: `huiswerk ${huiswerk} (×2), toetsen ${toets1} en ${toets2} (elk ×3), eindtoets ${eind} (×4)`,
      antwoord: toonGemengd(gem),
      stappen: [
        {
          doe: 'Vermenigvuldig elk cijfer met hoe vaak het meetelt',
          werd: `${huiswerk}·2 + ${toets1}·3 + ${toets2}·3 + ${eind}·4 = ${totaalPunten}`,
        },
        { doe: 'Tel de gewichten op', werd: `2 + 3 + 3 + 4 = ${totaalGewicht}` },
        { doe: 'Deel het totaal door het totale gewicht', werd: `${totaalPunten} / ${totaalGewicht}` },
        { doe: 'Uitrekenen', werd: toonGemengd(gem) },
      ],
      valkuilen: [
        {
          fout: toonGemengd(breuk(huiswerk + toets1 + toets2 + eind, 4)),
          heet: 'Je nam het gewone gemiddelde. De cijfers tellen niet even zwaar mee.',
        },
        {
          fout: toonGemengd(breuk(totaalPunten, 4)),
          heet: `Je deelde door 4 (het aantal cijfers). Je moet delen door het totale gewicht: ${totaalGewicht}.`,
        },
      ],
      tip: 'Gewogen gemiddelde: elk cijfer keer zijn gewicht, alles optellen, delen door de som van de gewichten.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '3a',
  hoofdstuk: 3,
  titel: 'Gemiddelde',
  waarover: 'de som gedeeld door het aantal — ook gewogen',
  uitleg: [
    {
      kop: 'Hoe je het uitrekent',
      tekst: 'Tel alle waarden bij elkaar op en deel dat totaal door hoeveel waarden er zijn.',
      voorbeeld: '(6 + 7 + 8 + 9) / 4 = 30/4 = 7½',
    },
    {
      kop: 'Antwoord als breuk',
      tekst:
        'Het komt lang niet altijd rond uit. Schrijf dan een breuk of een gemengd getal, en vereenvoudig hem zo ver mogelijk.',
      voorbeeld: '30/4 = 15/2 = 7 1/2',
    },
    {
      kop: 'Gewogen gemiddelde',
      tekst:
        'Telt iets meerdere keren mee, vermenigvuldig het dan met dat aantal. Deel daarna niet door het aantal cijfers, maar door de som van alle gewichten.',
      voorbeeld: 'cijfer 6 (×2) en 9 (×4): (12 + 36) / 6 = 8',
    },
    {
      kop: 'Let op uitschieters',
      tekst:
        'Eén heel hoge waarde trekt het gemiddelde omhoog. Daarom kijk je bij scheve verdelingen ook naar de mediaan.',
      voorbeeld: 'vier salarissen van ±2000 en één van 30000: gemiddelde 7500',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '3a',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
