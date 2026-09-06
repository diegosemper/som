/** 2e — Letterbreuken vermenigvuldigen en delen (reader 6.3) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { ggd } from '../getal.ts'
import { normaliseer } from '../../engine/rekenaar.ts'
import { term, toonTerm } from '../term.ts'

type Bouwsel = Pick<Opgave, 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

/** Schrijft teller/noemer op, en laat de noemer weg als die 1 is. */
function alsBreuk(boven: string, onder: string): string {
  return onder === '1' ? boven : `${boven}/${onder}`
}

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // k1·x/(k2·y) · k3/x
  (rng) => {
    const [x, y] = rng.kies([['x', 'y'], ['a', 'b'], ['p', 'q']])
    const k1 = rng.getal(2, 6)
    const k2 = rng.getal(2, 6)
    const k3 = rng.getal(2, 6)
    const tellerGetal = k1 * k3
    const deler = ggd(tellerGetal, k2)
    const boven = String(tellerGetal / deler)
    const onder = toonTerm(term(k2 / deler, { [y]: 1 }))
    return {
      vraag: `${toonTerm(term(k1, { [x]: 1 }))}/${toonTerm(term(k2, { [y]: 1 }))} · ${k3}/${x}`,
      antwoord: alsBreuk(boven, onder),
      stappen: [
        { doe: 'Tellers keer elkaar, noemers keer elkaar', werd: `${toonTerm(term(tellerGetal, { [x]: 1 }))}/${toonTerm(term(k2, { [x]: 1, [y]: 1 }))}` },
        { doe: `De ${x} staat boven én onder: wegstrepen`, werd: `${tellerGetal}/${toonTerm(term(k2, { [y]: 1 }))}` },
        { doe: deler > 1 ? `Nog delen door ${deler}` : 'Verder kan het niet', werd: alsBreuk(boven, onder) },
      ],
      valkuilen: [
        { fout: `${tellerGetal}/${toonTerm(term(k2, { [x]: 1, [y]: 1 }))}`, heet: `De ${x} valt boven en onder tegen elkaar weg.` },
      ],
      tip: 'Vermenigvuldigen: tellers keer elkaar, noemers keer elkaar. Daarna pas wegstrepen.',
    }
  },

  // k1·x/y ÷ k2·y/x
  (rng) => {
    const [x, y] = rng.kies([['x', 'y'], ['a', 'b']])
    const k1 = rng.getal(2, 6)
    const k2 = rng.getal(2, 6)
    const deler = ggd(k1, k2)
    const boven = toonTerm(term(k1 / deler, { [x]: 2 }))
    const onder = toonTerm(term(k2 / deler, { [y]: 2 }))
    return {
      vraag: `${toonTerm(term(k1, { [x]: 1 }))}/${y} ÷ ${toonTerm(term(k2, { [y]: 1 }))}/${x}`,
      antwoord: alsBreuk(boven, onder),
      stappen: [
        { doe: 'Delen is vermenigvuldigen met het omgekeerde', werd: `${toonTerm(term(k1, { [x]: 1 }))}/${y} · ${x}/${toonTerm(term(k2, { [y]: 1 }))}` },
        { doe: 'Tellers keer elkaar, noemers keer elkaar', werd: `${toonTerm(term(k1, { [x]: 2 }))}/${toonTerm(term(k2, { [y]: 2 }))}` },
        { doe: deler > 1 ? `Getallen delen door ${deler}` : 'Verder kan het niet', werd: alsBreuk(boven, onder) },
      ],
      valkuilen: [
        { fout: alsBreuk(toonTerm(term(k1 / deler, { [x]: 1, [y]: 1 })), toonTerm(term(k2 / deler, { [x]: 1, [y]: 1 }))), heet: 'Je vergat de tweede breuk om te draaien.' },
      ],
      tip: 'Delen door een breuk: draai de tweede om en vermenigvuldig.',
    }
  },

  // k1/x ÷ k2/y
  (rng) => {
    const [x, y] = rng.kies([['x', 'y'], ['a', 'b'], ['p', 'q']])
    const k1 = rng.getal(2, 8)
    const k2 = rng.getal(2, 8)
    const deler = ggd(k1, k2)
    const boven = toonTerm(term(k1 / deler, { [y]: 1 }))
    const onder = toonTerm(term(k2 / deler, { [x]: 1 }))
    return {
      vraag: `${k1}/${x} ÷ ${k2}/${y}`,
      antwoord: alsBreuk(boven, onder),
      stappen: [
        { doe: 'Draai de tweede breuk om', werd: `${k1}/${x} · ${y}/${k2}` },
        { doe: 'Tellers keer elkaar, noemers keer elkaar', werd: `${toonTerm(term(k1, { [y]: 1 }))}/${toonTerm(term(k2, { [x]: 1 }))}` },
        { doe: deler > 1 ? `Getallen delen door ${deler}` : 'Klaar', werd: alsBreuk(boven, onder) },
      ],
      valkuilen: [
        { fout: alsBreuk(String(k1 / deler), toonTerm(term(k2 / deler, { [x]: 1, [y]: 1 }))), heet: `De ${y} komt boven te staan als je omdraait.` },
      ],
      tip: 'Delen door iets is vermenigvuldigen met het omgekeerde.',
    }
  },

  // k1·x/y ÷ (k2·y²/(k3·x·y))
  (rng) => {
    const [x, y] = rng.kies([['x', 'y'], ['a', 'b']])
    const k1 = rng.getal(2, 5)
    const k2 = rng.getal(2, 5)
    const k3 = rng.getal(2, 5)
    // k1x/y ÷ (k2y²/(k3xy)) = k1x/y · k3xy/(k2y²) = k1k3x²y / (k2y³) = k1k3x² / (k2y²)
    const deler = ggd(k1 * k3, k2)
    const boven = toonTerm(term((k1 * k3) / deler, { [x]: 2 }))
    const onder = toonTerm(term(k2 / deler, { [y]: 2 }))
    return {
      vraag: `${toonTerm(term(k1, { [x]: 1 }))}/${y} ÷ ${toonTerm(term(k2, { [y]: 2 }))}/${toonTerm(term(k3, { [x]: 1, [y]: 1 }))}`,
      antwoord: alsBreuk(boven, onder),
      stappen: [
        { doe: 'Tweede breuk omdraaien', werd: `${toonTerm(term(k1, { [x]: 1 }))}/${y} · ${toonTerm(term(k3, { [x]: 1, [y]: 1 }))}/${toonTerm(term(k2, { [y]: 2 }))}` },
        { doe: 'Tellers keer elkaar, noemers keer elkaar', werd: `${toonTerm(term(k1 * k3, { [x]: 2, [y]: 1 }))}/${toonTerm(term(k2, { [y]: 3 }))}` },
        { doe: `Eén ${y} boven en onder wegstrepen`, werd: `${toonTerm(term(k1 * k3, { [x]: 2 }))}/${toonTerm(term(k2, { [y]: 2 }))}` },
        { doe: deler > 1 ? `Getallen delen door ${deler}` : 'Klaar', werd: alsBreuk(boven, onder) },
      ],
      valkuilen: [
        { fout: alsBreuk(toonTerm(term((k1 * k3) / deler, { [x]: 2, [y]: 1 })), toonTerm(term(k2 / deler, { [y]: 3 }))), heet: `Je vergat de ${y} boven en onder tegen elkaar weg te strepen.` },
      ],
      tip: 'Eerst omdraaien en uitvermenigvuldigen, dan pas wegstrepen.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '2e',
  hoofdstuk: 6,
  titel: 'Letterbreuken keer en gedeeld',
  waarover: 'vermenigvuldigen, delen en wegstrepen',
  uitleg: [
    {
      kop: 'Vermenigvuldigen',
      tekst: 'Tellers met elkaar, noemers met elkaar — precies zoals bij gewone breuken.',
      voorbeeld: '3/5xy · 2y/4x = 6y / 20x²y = 3 / 10x²',
    },
    {
      kop: 'Delen',
      tekst: 'Draai de tweede breuk om en vermenigvuldig. Alleen de breuk áchter het deelteken gaat om.',
      voorbeeld: '1y/4x ÷ 2x²y/3z = 1y/4x · 3z/2x²y',
    },
    {
      kop: 'Vergeet het vereenvoudigen niet',
      tekst:
        'Kijk daarna altijd of er getallen deelbaar zijn en of er letters boven én onder staan die je kunt wegstrepen.',
      voorbeeld: '3yz / 8x³y = 3z / 8x³',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '2e',
      opdracht: 'Schrijf als één breuk en vereenvoudig zo ver mogelijk',
      invoer: 'typen',
      soort: 'uitdrukking',
      vorm: {
        geenMaal: true,
        geenDeelteken: true,
        hoogstensTekens: normaliseer(bouw.antwoord).length + 3,
      },
      ...bouw,
    }
  },
}
