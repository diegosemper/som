/** 6e — De functie van een lijn bepalen (reader 7.2) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { breuk, toonBreuk } from '../getal.ts'
import { term, toonGetal as g, toonSom } from '../term.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

function formule(a: number, b: number): string {
  return `y = ${toonSom([term(a, { x: 1 }), term(b)])}`
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // Twee punten, hele richtingscoëfficiënt
  (rng) => {
    const a = rng.nietNul(-5, 5)
    const b = rng.getal(-8, 8)
    const x1 = rng.getal(-4, 1)
    const x2 = x1 + rng.getal(1, 4)
    const y1 = a * x1 + b
    const y2 = a * x2 + b

    return {
      opdracht: 'Bepaal de functie van de lijn door deze twee punten',
      vraag: `(${g(x1)}, ${g(y1)}) en (${g(x2)}, ${g(y2)})`,
      antwoord: formule(a, b),
      stappen: [
        {
          doe: 'Richtingscoëfficiënt: hoeveel gaat y omhoog per stap naar rechts?',
          werd: `(${g(y2)} − ${g(y1)}) / (${g(x2)} − ${g(x1)}) = ${g(y2 - y1)}/${g(x2 - x1)} = ${g(a)}`,
        },
        { doe: 'Vul een punt in bij y = ax + b om b te vinden', werd: `${g(y1)} = ${g(a)} · ${g(x1)} + b` },
        { doe: 'Dus b is', werd: g(b) },
        { doe: 'Alles in de basisvorm zetten', werd: formule(a, b) },
      ],
      valkuilen: [
        { fout: formule(b, a), heet: 'Je hebt de rc en het startgetal verwisseld. De rc staat vóór de x.' },
        { fout: formule(a, -b), heet: 'Tekenfout bij het uitrekenen van het startgetal.' },
      ],
      tip: 'rc = verschil in y gedeeld door verschil in x. Vul daarna een punt in om b te vinden.',
    }
  },

  // Startgetal gegeven (snijpunt met de y-as) plus één punt
  (rng) => {
    const a = rng.nietNul(-4, 4)
    const b = rng.getal(-6, 6)
    const x1 = rng.nietNul(-4, 4)
    const y1 = a * x1 + b

    return {
      opdracht: 'Bepaal de functie van de lijn',
      vraag: `De lijn snijdt de y-as bij ${g(b)} en gaat door het punt (${g(x1)}, ${g(y1)})`,
      antwoord: formule(a, b),
      stappen: [
        { doe: 'De y-as snijden betekent x = 0, dus dat is meteen het startgetal b', werd: `b = ${g(b)}` },
        { doe: 'Vul het punt in bij y = ax + b', werd: `${g(y1)} = a · ${g(x1)} + ${g(b)}` },
        { doe: 'Los op naar a', werd: `a = ${g(a)}` },
        { doe: 'In de basisvorm', werd: formule(a, b) },
      ],
      valkuilen: [
        { fout: formule(b, a), heet: 'rc en startgetal verwisseld.' },
      ],
      tip: 'Het startgetal lees je af waar de lijn de y-as snijdt (dus bij x = 0).',
    }
  },

  // Gebroken richtingscoëfficiënt
  (rng) => {
    const noemer = rng.kies([2, 2, 3, 4])
    const teller = rng.nietNul(-5, 5)
    const b = rng.getal(-6, 6)
    const x1 = 0
    const x2 = noemer * rng.getal(1, 2)
    const y1 = b
    const y2 = (teller * x2) / noemer + b
    const rc = breuk(teller, noemer)
    const antwoord = `y = ${toonBreuk(rc)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`

    return {
      opdracht: 'Bepaal de functie van de lijn door deze twee punten',
      vraag: `(${g(x1)}, ${g(y1)}) en (${g(x2)}, ${g(y2)})`,
      antwoord,
      stappen: [
        {
          doe: 'Richtingscoëfficiënt uitrekenen',
          werd: `(${g(y2)} − ${g(y1)}) / (${g(x2)} − ${g(x1)}) = ${toonBreuk(rc)}`,
        },
        { doe: 'Het eerste punt heeft x = 0, dus dat is het startgetal', werd: `b = ${g(b)}` },
        { doe: 'In de basisvorm', werd: antwoord },
      ],
      valkuilen: [
        {
          fout: `y = ${toonBreuk(breuk(noemer, teller))}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`,
          heet: 'Je deelde omgekeerd: de rc is het verschil in y gedeeld door het verschil in x.',
        },
      ],
      tip: 'Een rc mag ook een breuk zijn — dan gaat de lijn minder steil omhoog.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '6e',
  hoofdstuk: 7,
  titel: 'Functie van een lijn',
  waarover: 'van twee punten naar y = ax + b',
  uitleg: [
    {
      kop: 'Wat je zoekt',
      tekst: 'Elke rechte lijn heeft de vorm y = ax + b. Je moet dus twee dingen vinden: de a en de b.',
      voorbeeld: 'y = ax + b',
    },
    {
      kop: 'De richtingscoëfficiënt',
      tekst:
        'Kijk hoeveel y verandert per stap naar rechts. Met twee punten: het verschil in y gedeeld door het verschil in x.',
      voorbeeld: 'van (−1, −1) naar (0, 2): y gaat 3 omhoog per stap, dus a = 3',
    },
    {
      kop: 'Het startgetal',
      tekst:
        'Dat is de y-waarde waar x = 0 is. Weet je die niet, vul dan een punt in de formule in en los op naar b.',
      voorbeeld: 'punt (1, 5): 5 = 3 · 1 + b → b = 2',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '6e',
      invoer: 'typen',
      soort: 'uitdrukking',
      ...bouw,
    }
  },
}
