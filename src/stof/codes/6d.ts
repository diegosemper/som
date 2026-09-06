/** 6d — Richtingscoëfficiënt en startgetal (reader 7.1 en 7.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { term, toonGetal as g, toonSom } from '../term.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // y = ax + b -- gewoon aflezen
  (rng) => {
    const a = rng.nietNul(-9, 9)
    const b = rng.getal(-12, 12)
    const rcGevraagd = rng.kans(0.5)
    return {
      opdracht: rcGevraagd ? 'Wat is de richtingscoëfficiënt?' : 'Wat is het startgetal?',
      vraag: `y = ${toonSom([term(a, { x: 1 }), term(b)])}`,
      antwoord: g(rcGevraagd ? a : b),
      stappen: rcGevraagd
        ? [{ doe: 'De rc is het getal dat vóór de x staat', werd: g(a) }]
        : [
            { doe: 'Het startgetal vind je door x = 0 in te vullen', werd: `y = ${a} · 0 + ${g(b)}` },
            { doe: 'Uitrekenen', werd: g(b) },
          ],
      valkuilen: [
        { fout: g(rcGevraagd ? b : a), heet: rcGevraagd ? 'Dat is het startgetal. De rc staat vóór de x.' : 'Dat is de richtingscoëfficiënt. Het startgetal is het losse getal.' },
      ],
      tip: 'In y = ax + b is a de richtingscoëfficiënt en b het startgetal.',
    }
  },

  // px + qy = r  ->  eerst naar de vorm y = ax + b
  (rng) => {
    const q = rng.kies([-4, -3, -2, 2, 3, 4])
    const a = rng.nietNul(-6, 6)
    const b = rng.getal(-9, 9)
    // y = ax + b  <=>  -a·q·x + q·y = q·b
    const p = -a * q
    const r = q * b
    const rcGevraagd = rng.kans(0.6)

    return {
      opdracht: rcGevraagd ? 'Bepaal de richtingscoëfficiënt' : 'Bepaal het startgetal',
      vraag: `${toonSom([term(p, { x: 1 }), term(q, { y: 1 })])} = ${g(r)}`,
      antwoord: g(rcGevraagd ? a : b),
      stappen: [
        { doe: 'Breng de x-term naar de andere kant', werd: `${toonSom([term(q, { y: 1 })])} = ${toonSom([term(-p, { x: 1 }), term(r)])}` },
        { doe: `Deel alle elementen door ${g(q)}`, werd: `y = ${toonSom([term(a, { x: 1 }), term(b)])}` },
        { doe: rcGevraagd ? 'Nu kun je de rc aflezen' : 'Nu kun je het startgetal aflezen', werd: g(rcGevraagd ? a : b) },
      ],
      valkuilen: [
        { fout: g(rcGevraagd ? p : r), heet: 'Je las het af vóór het delen. Breng de formule eerst in de vorm y = ax + b.' },
        { fout: g(-(rcGevraagd ? a : b)), heet: 'Tekenfout bij het delen door een negatief getal.' },
      ],
      tip: 'Zet de formule altijd eerst in de vorm y = ax + b. Dan kun je alles aflezen.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '6d',
  hoofdstuk: 7,
  titel: 'Richtingscoëfficiënt',
  waarover: 'de a en de b uit y = ax + b halen',
  uitleg: [
    {
      kop: 'De basisvorm',
      tekst:
        'Een lijn schrijf je als y = ax + b. De a is de richtingscoëfficiënt (hoeveel y stijgt per stap naar rechts), de b is het startgetal (waar de lijn de y-as snijdt).',
      voorbeeld: 'y = 3x + 2: rc = 3, startgetal = 2',
    },
    {
      kop: 'Stijgen of dalen',
      tekst: 'Gaat de lijn omhoog, dan is de rc positief. Gaat hij omlaag, dan is de rc negatief.',
      voorbeeld: 'y = −2x + 5 daalt met 2 per stap',
    },
    {
      kop: 'Staat hij anders opgeschreven?',
      tekst:
        'Gebruik de balansmethode om de y alleen links te krijgen. Vergeet niet álle elementen te delen, ook het losse getal.',
      voorbeeld: '16x − 2y = −16 → −2y = −16x − 16 → y = 8x + 8',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '6d',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
