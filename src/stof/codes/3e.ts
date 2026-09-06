/** 3e — Kans bij het trekken van een kaart (reader 3.5) */

import type { Onderwerp, Opgave } from '../types.ts'
import type { Rng } from '../rng.ts'
import { breuk, toonBreuk } from '../getal.ts'

type Bouwsel = Pick<Opgave, 'opdracht' | 'vraag' | 'antwoord' | 'stappen' | 'valkuilen' | 'tip'>

const KLEUREN = ['harten', 'ruiten', 'schoppen', 'klaveren']
const WAARDEN = ['aas', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'boer', 'vrouw', 'heer']

const patronen: ((rng: Rng) => Bouwsel)[] = [
  // Eén kleur
  (rng) => {
    const kleur = rng.kies(KLEUREN)
    return {
      opdracht: 'Bereken de kans (geef een breuk)',
      vraag: `Je trekt één kaart uit een spel van 52. Hoe groot is de kans op ${kleur}?`,
      antwoord: toonBreuk(breuk(13, 52)),
      stappen: [
        { doe: `Hoeveel ${kleur} zitten er in een spel?`, werd: '13' },
        { doe: 'Deel door het totaal', werd: '13/52' },
        { doe: 'Vereenvoudigen', werd: toonBreuk(breuk(13, 52)) },
      ],
      valkuilen: [
        { fout: toonBreuk(breuk(1, 52)), heet: 'Er zijn 13 kaarten van die soort, niet één.' },
        { fout: toonBreuk(breuk(1, 13)), heet: 'Je deelde 13 door 52 verkeerd om. 13/52 is 1/4.' },
      ],
      tip: 'Vier soorten van 13 kaarten: elke soort is dus een kwart van het spel.',
    }
  },

  // Eén waarde
  (rng) => {
    const waarde = rng.kies(WAARDEN)
    return {
      opdracht: 'Bereken de kans (geef een breuk)',
      vraag: `Je trekt één kaart uit een spel van 52. Hoe groot is de kans op een ${waarde}?`,
      antwoord: toonBreuk(breuk(4, 52)),
      stappen: [
        { doe: `Van elke waarde zijn er vier — één per soort`, werd: `4 ${waarde}en` },
        { doe: 'Deel door het totaal', werd: '4/52' },
        { doe: 'Vereenvoudigen', werd: toonBreuk(breuk(4, 52)) },
      ],
      valkuilen: [
        { fout: toonBreuk(breuk(1, 52)), heet: 'Er zijn vier van die kaart, één in elke soort.' },
        { fout: toonBreuk(breuk(13, 52)), heet: '13 is het aantal kaarten per soort, niet per waarde.' },
      ],
      tip: 'Elke waarde komt vier keer voor: harten, ruiten, schoppen, klaveren.',
    }
  },

  // Rood of zwart, of een plaatje
  (rng) => {
    const soort = rng.kies([
      { wat: 'een rode kaart', gunstig: 26, hoe: 'harten en ruiten zijn rood: 13 + 13' },
      { wat: 'een zwarte kaart', gunstig: 26, hoe: 'schoppen en klaveren zijn zwart: 13 + 13' },
      { wat: 'een plaatje', gunstig: 12, hoe: 'per soort drie plaatjes (boer, vrouw, heer): 4 · 3' },
      { wat: 'een kaart met waarde hoger dan 7', gunstig: 12, hoe: 'dat zijn de 8, 9 en 10 van elke soort: 4 · 3' },
    ])
    const kans = breuk(soort.gunstig, 52)
    return {
      opdracht: 'Bereken de kans (geef een breuk)',
      vraag: `Je trekt één kaart uit een spel van 52. Hoe groot is de kans op ${soort.wat}?`,
      antwoord: toonBreuk(kans),
      stappen: [
        { doe: 'Tel de gunstige kaarten', werd: `${soort.hoe} = ${soort.gunstig}` },
        { doe: 'Deel door het totaal', werd: `${soort.gunstig}/52` },
        { doe: 'Vereenvoudigen', werd: toonBreuk(kans) },
      ],
      valkuilen: [
        { fout: toonBreuk(breuk(soort.gunstig, 13)), heet: 'Een spel heeft 52 kaarten; deel daardoor.' },
      ],
      tip: 'De azen rekenen we niet tot de plaatjes, en de aas telt als 1.',
    }
  },

  // Eén bepaalde kaart: kleur én waarde
  (rng) => {
    const kleur = rng.kies(KLEUREN)
    const waarde = rng.kies(WAARDEN)
    return {
      opdracht: 'Bereken de kans (geef een breuk)',
      vraag: `Hoe groot is de kans dat je de ${waarde} van ${kleur} trekt?`,
      antwoord: toonBreuk(breuk(1, 52)),
      stappen: [
        { doe: `Kans op ${kleur}`, werd: '13/52 = 1/4' },
        { doe: `Kans op een ${waarde}`, werd: '4/52 = 1/13' },
        { doe: 'Allebei tegelijk: de kansen vermenigvuldigen (1/4 · 1/13)', werd: toonBreuk(breuk(1, 52)) },
      ],
      valkuilen: [
        { fout: toonBreuk(breuk(17, 52)), heet: 'Bij "én" moet je vermenigvuldigen, niet optellen.' },
        { fout: toonBreuk(breuk(4, 52)), heet: 'Er is maar één zo\'n kaart in het hele spel.' },
      ],
      tip: 'Gebeurtenis A én gebeurtenis B: kansen met elkaar vermenigvuldigen.',
    }
  },

  // Kleur óf waarde -- met de overlap eraf
  (rng) => {
    const kleur = rng.kies(KLEUREN)
    const waarde = rng.kies(WAARDEN)
    const kans = breuk(13 + 4 - 1, 52)
    return {
      opdracht: 'Bereken de kans (geef een breuk)',
      vraag: `Hoe groot is de kans dat je óf een ${kleur}kaart óf een ${waarde} trekt?`,
      antwoord: toonBreuk(kans),
      stappen: [
        { doe: `Kans op ${kleur}`, werd: '13/52' },
        { doe: `Kans op een ${waarde}`, werd: '4/52' },
        { doe: 'Bij "of" optellen', werd: '13/52 + 4/52 = 17/52' },
        {
          doe: `Maar de ${waarde} van ${kleur} zit in allebei — die telde je dubbel`,
          werd: '17/52 − 1/52 = 16/52',
          waarom: 'Kansberekeningsregel 3: dubbel tellen voorkomen.',
        },
        { doe: 'Vereenvoudigen', werd: toonBreuk(kans) },
      ],
      valkuilen: [
        { fout: toonBreuk(breuk(17, 52)), heet: `Je telde de ${waarde} van ${kleur} dubbel: die zit in beide groepen. Er moet 1/52 af.` },
        { fout: toonBreuk(breuk(1, 52)), heet: 'Bij "of" tel je op; vermenigvuldigen hoort bij "en".' },
      ],
      tip: 'Bij "of" optellen — maar haal er af wat in allebei zit.',
    }
  },
]

export const onderwerp: Onderwerp = {
  code: '3e',
  hoofdstuk: 3,
  titel: 'Kans met kaarten',
  waarover: '52 kaarten, en dubbel tellen voorkomen',
  uitleg: [
    {
      kop: 'Het spel',
      tekst:
        '52 kaarten in vier soorten (harten, ruiten, schoppen, klaveren) van elk 13. Harten en ruiten zijn rood, schoppen en klaveren zwart. Jokers doen niet mee.',
      voorbeeld: '13 per soort, 4 per waarde',
    },
    {
      kop: 'Plaatjes en waarden',
      tekst:
        'De plaatjes zijn boer, vrouw en heer: drie per soort, dus twaalf in totaal. De aas telt als 1 en hoort niet bij de plaatjes.',
      voorbeeld: 'kans op een plaatje: 12/52 = 3/13',
    },
    {
      kop: 'En / of',
      tekst: 'Moeten twee dingen allebei gelden, dan vermenigvuldig je de kansen. Mag het één van de twee zijn, dan tel je op.',
      voorbeeld: 'schoppen én aas: 1/4 · 1/13 = 1/52',
    },
    {
      kop: 'Niet dubbel tellen',
      tekst:
        'Bij "of" zit soms een kaart in allebei de groepen. Die heb je dan twee keer geteld, dus die kans moet er weer af.',
      voorbeeld: 'schoppen óf aas: 13/52 + 4/52 − 1/52 = 16/52 = 4/13',
    },
  ],
  maak(rng) {
    const bouw = rng.kies(patronen)(rng)
    return {
      code: '3e',
      invoer: 'typen',
      soort: 'getal',
      vorm: { alleenGetal: true },
      ...bouw,
    }
  },
}
