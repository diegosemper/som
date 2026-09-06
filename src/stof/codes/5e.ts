/** 5e — Functie bepalen van een hogeregraadsgrafiek (reader 8.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { boven, term, toonGetal as g, toonSom } from '../term.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

/** y = b(x − r)^g + h, netjes opgeschreven. */
function functie(b: number, r: number, graad: number, h: number): string {
  const binnen = toonSom([term(1, { x: 1 }), term(-r)])
  const kern = `(${binnen})${boven(graad)}`
  const voor = b === 1 ? '' : b === -1 ? '−' : g(b)
  const staart = h === 0 ? '' : h < 0 ? ` − ${Math.abs(h)}` : ` + ${h}`
  return `y = ${voor}${kern}${staart}`
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  (rng) => {
    const graad = rng.kies([2, 2, 2, 3])
    const b = rng.kies([1, 1, 2, 3, -1, -2])
    const r = rng.getal(-4, 4)
    const h = rng.getal(-4, 4)

    // Een punt op de grafiek, één stap naast de top.
    const stap = rng.kies([1, 1, 2])
    const px = r + stap
    const py = b * Math.pow(stap, graad) + h

    const topnaam = graad === 2 ? 'de top' : 'het buigpunt'

    return {
      opdracht: 'Bepaal de functie. Gebruik y = b(x − r)ᵍ + h',
      vraag: `Een ${graad === 2 ? 'parabool' : 'derdegraadsgrafiek'} met ${topnaam} in (${g(r)}, ${g(h)}), die ook door (${g(px)}, ${g(py)}) gaat`,
      antwoord: functie(b, r, graad, h),
      stappen: [
        { doe: 'De graad lees je af aan de vorm', werd: `g = ${graad}`, waarom: graad === 2 ? 'Een parabool is tweedegraads.' : 'De langgerekte s-vorm hoort bij een derdegraadsfunctie.' },
        { doe: `De hoogte is de y-coördinaat van ${topnaam}`, werd: `h = ${g(h)}` },
        { doe: `De richting is de x-coördinaat van ${topnaam}`, werd: `r = ${g(r)}` },
        {
          doe: 'Zet dat in de formule',
          werd: `y = b(${toonSom([term(1, { x: 1 }), term(-r)])})${boven(graad)}${h === 0 ? '' : h < 0 ? ` − ${Math.abs(h)}` : ` + ${h}`}`,
        },
        {
          doe: `Vul het punt (${g(px)}, ${g(py)}) in om b te vinden`,
          werd: `${g(py)} = b · ${Math.pow(stap, graad)} ${h === 0 ? '' : h < 0 ? `− ${Math.abs(h)}` : `+ ${h}`}`,
        },
        { doe: 'Dus b is', werd: functie(b, r, graad, h) },
      ],
      valkuilen: [
        { fout: functie(b, -r, graad, h), heet: 'Let op het teken van r: in (x − r) betekent r = −2 dat er (x + 2) staat.' },
        { fout: functie(1, r, graad, h), heet: 'Je vergat de breedte b te bepalen met het gegeven punt.' },
      ],
      tip: 'y = b(x − r)ᵍ + h: b = breedte, r = richting, g = graad, h = hoogte.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '5e',
  hoofdstuk: 8,
  titel: 'Functie van een grafiek',
  waarover: 'y = b(x − r)ᵍ + h invullen',
  uitleg: [
    {
      kop: 'De formule',
      tekst:
        'Elke hogeregraadsgrafiek kun je beschrijven met y = b(x − r)ᵍ + h. Daarin is b de breedte, r de richting, g de graad en h de hoogte.',
      voorbeeld: 'y = b(x − r)ᵍ + h',
    },
    {
      kop: 'Graad, hoogte, richting',
      tekst:
        'De graad zie je aan de vorm: een parabool is 2, een langgerekte s is 3. De hoogte en de richting lees je af aan de top (of het buigpunt): dat zijn de y- en de x-coördinaat.',
      voorbeeld: 'top (−2, −3): r = −2 en h = −3',
    },
    {
      kop: 'Let op het teken van r',
      tekst:
        'In de formule staat (x − r). Is r negatief, dan staat er dus een plus: (x − (−2)) wordt (x + 2).',
      voorbeeld: 'y = b(x + 2)² − 3',
    },
    {
      kop: 'De breedte als laatste',
      tekst: 'Vul een punt in dat op de grafiek ligt en los de vergelijking op naar b.',
      voorbeeld: 'punt (−1, 0): 0 = b · 1 − 3 → b = 3',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '5e',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: { maxTermen: 4 },
      ...bouw,
    }
  },
}
