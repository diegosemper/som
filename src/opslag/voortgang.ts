/**
 * Voortgang in localStorage. Niet meer dan een paar lijstjes -- alles wat de
 * app kan onthouden staat hier, en het mag altijd leeg zijn.
 */

import type { Rondesoort } from '../stof/types.ts'

const SLEUTEL = 'som-voortgang-1'

export type Voortgang = {
  /** Aantal sterren, 0 t/m 3, per onderwerp én rondesoort ("1a:open"). */
  sterren: Record<string, number>
  /** Hoe vaak een ronde foutloos was, om de derde ster te verdienen. */
  foutloos: Record<string, number>
  /** Hoe vaak er in een onderwerp misgegrepen is; hoger = vaker herhalen. */
  foutenbak: Record<string, number>
  xp: number
  streak: number
  /** Laatste dag waarop er geoefend is, als 2026-09-06. */
  laatsteDag: string
  /** Aantal rondes vandaag. */
  vandaag: number
}

const LEEG: Voortgang = {
  sterren: {},
  foutloos: {},
  foutenbak: {},
  xp: 0,
  streak: 0,
  laatsteDag: '',
  vandaag: 0,
}

/** Meerkeuze en zelf intikken tellen apart: het is niet dezelfde prestatie. */
export function sleutelVoor(code: string, soort: Rondesoort): string {
  return `${code}:${soort}`
}

/** Wat er op het pad bij een onderwerp komt te staan: de beste van de twee. */
export function sterrenVoor(v: Voortgang, code: string): number {
  return Math.max(
    v.sterren[sleutelVoor(code, 'meerkeuze')] ?? 0,
    v.sterren[sleutelVoor(code, 'open')] ?? 0,
    // Voortgang van vóór de splitsing stond onder de kale code.
    v.sterren[code] ?? 0,
  )
}

export function vandaagTekst(nu = new Date()): string {
  return `${nu.getFullYear()}-${String(nu.getMonth() + 1).padStart(2, '0')}-${String(nu.getDate()).padStart(2, '0')}`
}

function gisterenTekst(nu = new Date()): string {
  const g = new Date(nu)
  g.setDate(g.getDate() - 1)
  return vandaagTekst(g)
}

export function lees(): Voortgang {
  try {
    const ruw = localStorage.getItem(SLEUTEL)
    if (!ruw) return { ...LEEG }
    return { ...LEEG, ...(JSON.parse(ruw) as Partial<Voortgang>) }
  } catch {
    return { ...LEEG }
  }
}

export function schrijf(v: Voortgang): void {
  try {
    localStorage.setItem(SLEUTEL, JSON.stringify(v))
  } catch {
    // Privémodus of vol geheugen: dan speel je zonder dat het bewaard wordt.
  }
}

/** Zet de dagteller en de streak goed voor vandaag. */
export function dagBijwerken(v: Voortgang): Voortgang {
  const nu = vandaagTekst()
  if (v.laatsteDag === nu) return v
  const streak = v.laatsteDag === gisterenTekst() ? v.streak : 0
  return { ...v, laatsteDag: nu, vandaag: 0, streak }
}

/** Verwerkt een gehaalde ronde. */
export function rondeGehaald(
  v: Voortgang,
  code: string,
  soort: Rondesoort,
  fouten: number,
): Voortgang {
  const nieuw = dagBijwerken({ ...v })
  const sleutel = sleutelVoor(code, soort)
  const foutloosNu = fouten === 0
  const foutloosTeller = (nieuw.foutloos[sleutel] ?? 0) + (foutloosNu ? 1 : 0)

  let sterren = Math.max(nieuw.sterren[sleutel] ?? 0, 1)
  if (foutloosNu) sterren = Math.max(sterren, 2)
  if (foutloosTeller >= 2) sterren = Math.max(sterren, 3)

  return {
    ...nieuw,
    sterren: { ...nieuw.sterren, [sleutel]: sterren },
    foutloos: { ...nieuw.foutloos, [sleutel]: foutloosTeller },
    xp: nieuw.xp + 10 + (foutloosNu ? 5 : 0),
    vandaag: nieuw.vandaag + 1,
    streak: nieuw.vandaag === 0 ? nieuw.streak + 1 : nieuw.streak,
  }
}

/** Verwerkt een mislukte ronde: geen sterren, wel onthouden dat het lastig was. */
export function rondeVerloren(v: Voortgang, code: string, fouten: number): Voortgang {
  const nieuw = dagBijwerken({ ...v })
  return {
    ...nieuw,
    foutenbak: { ...nieuw.foutenbak, [code]: (nieuw.foutenbak[code] ?? 0) + fouten },
  }
}

export function misser(v: Voortgang, code: string): Voortgang {
  return { ...v, foutenbak: { ...v.foutenbak, [code]: (v.foutenbak[code] ?? 0) + 1 } }
}

export function wisAlles(): void {
  try {
    localStorage.removeItem(SLEUTEL)
  } catch {
    // niets aan te doen
  }
}
