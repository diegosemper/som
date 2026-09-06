/**
 * Termen netjes opschrijven: 6ab, -x, 3x², 32u⁻⁴.
 *
 * De rekenaar leest bovenschrift gewoon als ^, dus wat hier uitkomt is zowel
 * mooi op het scherm als bruikbaar als antwoord.
 */

const CIJFERS = '⁰¹²³⁴⁵⁶⁷⁸⁹'

/** 2 -> "²", -3 -> "⁻³" */
export function boven(n: number): string {
  const teken = n < 0 ? '⁻' : ''
  return teken + String(Math.abs(n)).split('').map((c) => CIJFERS[Number(c)]).join('')
}

/** x met macht 1 blijft x, met macht 0 wordt 1. */
export function macht(basis: string, exponent: number): string {
  if (exponent === 0) return '1'
  if (exponent === 1) return basis
  return basis + boven(exponent)
}

export type Term = { coef: number; machten: Record<string, number> }

export function term(coef: number, machten: Record<string, number> = {}): Term {
  return { coef, machten }
}

export function toonTerm(t: Term): string {
  if (t.coef === 0) return '0'
  const staart = Object.keys(t.machten)
    .filter((l) => t.machten[l] !== 0)
    .sort()
    .map((l) => macht(l, t.machten[l]))
    .join('')

  const getal = t.coef < 0 ? '−' + Math.abs(t.coef) : String(t.coef)
  if (staart === '') return getal
  if (t.coef === 1) return staart
  if (t.coef === -1) return '−' + staart
  return getal + staart
}

/** Plakt termen aan elkaar met + en − ertussen, en laat nullen weg. */
export function toonSom(termen: Term[]): string {
  const zichtbaar = termen.filter((t) => t.coef !== 0)
  if (zichtbaar.length === 0) return '0'
  let uit = toonTerm(zichtbaar[0])
  for (const t of zichtbaar.slice(1)) {
    uit += t.coef < 0 ? ' − ' + toonTerm({ ...t, coef: -t.coef }) : ' + ' + toonTerm(t)
  }
  return uit
}

/** Twee termen zijn gelijksoortig als hun letters én machten precies gelijk zijn. */
export function gelijksoortig(a: Term, b: Term): boolean {
  const sleutel = (t: Term) =>
    Object.keys(t.machten)
      .filter((l) => t.machten[l] !== 0)
      .sort()
      .map((l) => `${l}${t.machten[l]}`)
      .join('')
  return sleutel(a) === sleutel(b)
}

/** Telt gelijksoortige termen bij elkaar op. Volgorde blijft die van het eerste voorkomen. */
export function herleid(termen: Term[]): Term[] {
  const uit: Term[] = []
  for (const t of termen) {
    const bestaand = uit.find((u) => gelijksoortig(u, t))
    if (bestaand) bestaand.coef += t.coef
    else uit.push({ coef: t.coef, machten: { ...t.machten } })
  }
  return uit.filter((t) => t.coef !== 0)
}

/** Vermenigvuldigt twee termen: 3a · 2b = 6ab, a³ · a² = a⁵ */
export function maal(a: Term, b: Term): Term {
  const machten: Record<string, number> = { ...a.machten }
  for (const l of Object.keys(b.machten)) {
    machten[l] = (machten[l] ?? 0) + b.machten[l]
  }
  return { coef: a.coef * b.coef, machten }
}

/** Getal met een minteken dat je vóór een haakje kunt zetten: −3 wordt "−3". */
export function toonGetal(n: number): string {
  return n < 0 ? '−' + Math.abs(n) : String(n)
}
