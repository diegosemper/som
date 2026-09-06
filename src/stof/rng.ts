/**
 * Toevalsgenerator met een zaadje, zodat `npm run controleer` elke keer
 * dezelfde tweehonderd sommen nakijkt en een fout niet één keer opduikt en
 * daarna weer weg is.
 */

export type Rng = {
  /** Heel getal van min t/m max, beide meegerekend. */
  getal(min: number, max: number): number
  /** Zelfde, maar nooit nul. */
  nietNul(min: number, max: number): number
  kies<T>(lijst: readonly T[]): T
  schud<T>(lijst: readonly T[]): T[]
  kans(p: number): boolean
}

export function maakRng(zaad: number): Rng {
  let a = zaad >>> 0
  const volgende = () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  const getal = (min: number, max: number) => min + Math.floor(volgende() * (max - min + 1))

  return {
    getal,
    nietNul(min, max) {
      for (let poging = 0; poging < 50; poging++) {
        const n = getal(min, max)
        if (n !== 0) return n
      }
      return min === 0 ? 1 : min
    },
    kies(lijst) {
      return lijst[getal(0, lijst.length - 1)]
    },
    schud(lijst) {
      const uit = [...lijst]
      for (let i = uit.length - 1; i > 0; i--) {
        const j = getal(0, i)
        const bewaar = uit[i]
        uit[i] = uit[j]
        uit[j] = bewaar
      }
      return uit
    },
    kans(p) {
      return volgende() < p
    },
  }
}
