/**
 * Het pad loopt van hoofdstuk 1 naar 8, maar niets zit op slot.
 *
 * Eerder ging een onderwerp pas open als het vorige een ster had. Dat werkt
 * averechts als je een dag voor de toets juist dát ene hoofdstuk wilt oefenen
 * waar je op vastloopt. De volgorde is een advies, geen hek.
 */

import type { Onderwerp } from '../stof/types.ts'
import type { Voortgang } from '../opslag/voortgang.ts'

export function isOpen(_onderwerpen: Onderwerp[], _code: string, _v: Voortgang): boolean {
  return true
}

/** Het eerste onderwerp dat nog geen drie sterren heeft: daar ga je verder. */
export function volgendeStap(onderwerpen: Onderwerp[], v: Voortgang): Onderwerp | undefined {
  for (const o of onderwerpen) {
    if ((v.sterren[o.code] ?? 0) < 3) return o
  }
  return undefined
}

export function totaalSterren(onderwerpen: Onderwerp[], v: Voortgang): { gehaald: number; mogelijk: number } {
  let gehaald = 0
  for (const o of onderwerpen) gehaald += v.sterren[o.code] ?? 0
  return { gehaald, mogelijk: onderwerpen.length * 3 }
}
