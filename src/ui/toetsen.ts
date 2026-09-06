/**
 * Welke toetsen heb je nodig voor een antwoord?
 *
 * Staat los van het toetsenbord-component zodat `npm run controleer` kan
 * nakijken of elk antwoord ook echt te typen is. Dat is geen theoretisch
 * risico: eerder haalde het toetsenbord de letters uit de vraag én de
 * opdrachtzin en kapte af op zes, waardoor bij "Werk de haakjes weg" de
 * letters van die zin het wonnen van de m en de n die je nodig had.
 */

import type { Opgave } from '../stof/types.ts'

/** Tekens die het toetsenbord kan produceren, na normaliseren. */
export const TYPEBAAR = new Set([
  ...'0123456789abcdefghijklmnopqrstuvwxyz',
  ...'.+-·/^()√',
])

/**
 * De letters die in het antwoord voorkomen. Bewust uit het antwoord en niet uit
 * de vraag: de vraag bevat hele Nederlandse zinnen.
 */
export function nodigeLetters(opgave: Opgave): string[] {
  return [...lettersIn(opgave.antwoord)].sort()
}

export function lettersIn(tekst: string): Set<string> {
  const gevonden = new Set<string>()
  for (const teken of tekst.toLowerCase()) {
    if (teken >= 'a' && teken <= 'z') gevonden.add(teken)
  }
  return gevonden
}
