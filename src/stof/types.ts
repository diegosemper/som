/**
 * De vorm van de stof. Geen React, geen spelregels -- alleen wiskunde.
 *
 * Eén `Onderwerp` is één opgavecode uit de oefentool (1a t/m 7e, zie blz. 7 van
 * de reader). Dat is precies de indeling waar de toets uit getrokken wordt.
 */

import type { Rng } from './rng.ts'

/** Eén regel van de uitwerking. `werd` is hoe de som er ná deze stap uitziet. */
export type Stap = {
  doe: string
  werd: string
  waarom?: string
}

/** Een fout die veel gemaakt wordt, met de uitkomst die eruit rolt. */
export type Valkuil = {
  fout: string
  heet: string
}

/**
 * De twee manieren waarop je een onderwerp kunt oefenen. Welke beter werkt
 * verschilt per onderwerp én per persoon: bij gemiddelden is kiezen prima, bij
 * herleiden wil je het zelf opschrijven.
 */
export type Rondesoort = 'meerkeuze' | 'open'

/** Hoe het antwoord nagekeken wordt. */
export type Soort =
  | 'getal' // 20, -13, 7 1/2
  | 'uitdrukking' // 6ab, 3x^2 - 2x, 32u^-4
  | 'coordinaat' // (-3, 0) of (-3,0) en (2,0)
  | 'oplossingen' // x = -3 ∨ x = -2
  | 'keuze' // knoppen, exacte tekst

/**
 * Eisen aan de vórm van het antwoord, los van de waarde.
 *
 * Nodig omdat de opgave zelf altijd "dezelfde waarde" heeft als het antwoord:
 * zonder deze eisen zou het overtikken van de vraag goedgekeurd worden.
 */
export type Vormeis = {
  geenBreuk?: boolean
  geenHaakjes?: boolean
  geenMaal?: boolean
  /** Er mag geen ÷ meer in staan: de deling moet uitgewerkt zijn. */
  geenDeelteken?: boolean
  alleenGetal?: boolean
  grondtal?: number // "schrijf als een macht van 3"
  /**
   * Hoeveel losse termen het antwoord hoogstens mag hebben. Wordt automatisch
   * gevuld met het aantal termen van het juiste antwoord, zodat "3a − 4b + 2a"
   * niet als herleiding van zichzelf doorgaat.
   */
  maxTermen?: number
  /** Wat er bij ontbinden in factoren buiten de haakjes hoort te staan. */
  factor?: string
  /** Antwoord moet als gemengd getal: 17/15 mag niet, 1 2/15 wel. */
  gemengd?: boolean
  /** Antwoord moet juist als één breuk: 1 3/5 mag niet, 8/5 wel. */
  alsBreuk?: boolean
  /**
   * Ruwe maat voor "kan het nog korter": een niet-vereenvoudigde breuk is in
   * de praktijk altijd langer opgeschreven dan de vereenvoudigde. Wordt met
   * ruime marge gezet, en een overtreding kost geen hartje.
   */
  hoogstensTekens?: number
  /** Er mag geen letter meer zijn die boven én onder de streep in élke term zit. */
  geenGedeeldeLetter?: boolean
}

export type Opgave = {
  code: string
  opdracht: string // "Bereken", "Herleid", "Ontbind in factoren"
  vraag: string
  invoer: 'typen' | 'keuze'
  keuzes?: string[]
  antwoord: string
  soort: Soort
  vorm?: Vormeis
  stappen: Stap[]
  valkuilen: Valkuil[]
  tip: string
}

/** Een uitlegkaartje: één idee, past op een telefoonscherm. */
export type Kaart = {
  kop: string
  tekst: string
  voorbeeld?: string
}

export type Onderwerp = {
  code: string
  hoofdstuk: number
  titel: string
  waarover: string
  uitleg: Kaart[]
  maak: (rng: Rng) => Opgave
}
