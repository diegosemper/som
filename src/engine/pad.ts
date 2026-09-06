/**
 * Welk onderwerp is open? Het pad loopt vast van hoofdstuk 1 naar 8. Een
 * onderwerp gaat open zodra het vorige minstens één ster heeft.
 */

import type { Onderwerp } from '../stof/types.ts'
import type { Voortgang } from '../opslag/voortgang.ts'

export function isOpen(onderwerpen: Onderwerp[], code: string, v: Voortgang): boolean {
  const i = onderwerpen.findIndex((o) => o.code === code)
  if (i <= 0) return true
  const vorige = onderwerpen[i - 1]
  return (v.sterren[vorige.code] ?? 0) >= 1
}

/** Het eerste onderwerp dat nog geen drie sterren heeft: daar ga je verder. */
export function volgendeStap(onderwerpen: Onderwerp[], v: Voortgang): Onderwerp | undefined {
  for (const o of onderwerpen) {
    if (!isOpen(onderwerpen, o.code, v)) return undefined
    if ((v.sterren[o.code] ?? 0) < 3) return o
  }
  return undefined
}

export function totaalSterren(onderwerpen: Onderwerp[], v: Voortgang): { gehaald: number; mogelijk: number } {
  let gehaald = 0
  for (const o of onderwerpen) gehaald += v.sterren[o.code] ?? 0
  return { gehaald, mogelijk: onderwerpen.length * 3 }
}
