/** Breuken en delers. */

export function ggd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const r = a % b
    a = b
    b = r
  }
  return a || 1
}

export function kgv(a: number, b: number): number {
  return Math.abs(a * b) / ggd(a, b)
}

export type Breuk = { teller: number; noemer: number }

export function breuk(teller: number, noemer: number): Breuk {
  return vereenvoudig({ teller, noemer })
}

export function vereenvoudig(b: Breuk): Breuk {
  const teken = b.noemer < 0 ? -1 : 1
  const d = ggd(b.teller, b.noemer)
  return { teller: (teken * b.teller) / d, noemer: (teken * b.noemer) / d }
}

/** "3/4", "5", "−3/4" */
export function toonBreuk(b: Breuk): string {
  const v = vereenvoudig(b)
  if (v.noemer === 1) return v.teller < 0 ? '−' + Math.abs(v.teller) : String(v.teller)
  const teken = v.teller < 0 ? '−' : ''
  return `${teken}${Math.abs(v.teller)}/${v.noemer}`
}

/** "1 2/15" als de teller groter is dan de noemer, anders gewoon de breuk. */
export function toonGemengd(b: Breuk): string {
  const v = vereenvoudig(b)
  if (v.noemer === 1) return String(v.teller)
  const heel = Math.trunc(Math.abs(v.teller) / v.noemer)
  const rest = Math.abs(v.teller) % v.noemer
  if (heel === 0) return toonBreuk(v)
  const teken = v.teller < 0 ? '−' : ''
  if (rest === 0) return `${teken}${heel}`
  return `${teken}${heel} ${rest}/${v.noemer}`
}

/** Alle delers van n, klein naar groot. */
export function delers(n: number): number[] {
  const uit: number[] = []
  for (let d = 1; d <= Math.abs(n); d++) if (n % d === 0) uit.push(d)
  return uit
}
