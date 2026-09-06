/**
 * Een kleine rekenmachine die wiskunde-notatie leest.
 *
 * Waarom eigenbouw: getypte antwoorden vergelijken op tekst gaat stuk. `6ab` en
 * `6ba` zijn hetzelfde, `3a - ab` en `-ab + 3a` ook, en `1 2/15` is `17/15`. We
 * ontleden beide kanten tot een boom en vullen daarna een stuk of zes keer
 * getallen in voor de letters. Komt alles overeen, dan is het antwoord goed --
 * hoe je het ook hebt opgeschreven.
 *
 * Losse letters zijn losse variabelen: `ab` betekent a·b, niet een variabele
 * die 'ab' heet. Zo doet de reader het ook.
 */

export type Knoop =
  | { t: 'getal'; waarde: number }
  | { t: 'letter'; naam: string }
  | { t: 'op'; op: '+' | '-' | '·' | '/' | '÷' | '^'; links: Knoop; rechts: Knoop }
  | { t: 'min'; van: Knoop }
  | { t: 'wortel'; van: Knoop }

/* ------------------------------------------------------------------ */
/* Normaliseren                                                        */
/* ------------------------------------------------------------------ */

const BOVEN: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁻': '-', '⁺': '+',
}

/** Zet alles wat hetzelfde bedoelt om naar één schrijfwijze. */
export function normaliseer(ruw: string): string {
  let s = ruw.toLowerCase().trim()

  // Streepjes, maaltekens, deeltekens.
  s = s.replace(/[−–—]/g, '-')
  s = s.replace(/[×∙⋅•*]/g, '·')
  // ÷ blijft ÷: dat scheidt hele breuken van elkaar en bindt losser dan de
  // breukstreep /. Zo is 2/3 ÷ 1/2 gelijk aan 4/3 en niet aan 1/3.
  s = s.replace(/:/g, '÷')

  // Woorden die mensen intypen.
  s = s.replace(/sqrt/g, '√').replace(/wortel/g, '√').replace(/\bpi\b/g, 'π')

  // Bovenschrift: x² -> x^2, 2⁻³ -> 2^-3
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (rij) => {
    let uit = '^'
    for (const teken of rij) uit += BOVEN[teken] ?? ''
    return uit
  })

  // Gemengd getal: "1 2/15" -> "(1+2/15)". Moet vóór het weghalen van spaties.
  s = s.replace(/(\d+)\s+(\d+)\s*\/\s*(\d+)/g, '($1+$2/$3)')

  // Decimale komma. Coördinaten worden elders al uit elkaar gehaald.
  s = s.replace(/,/g, '.')

  s = s.replace(/\s+/g, '')

  // Een antwoord als "y=3x+2" of "f(x)=3x+2": de linkerkant mag weg.
  s = s.replace(/^f\(.\)=/, '')
  s = s.replace(/^[a-z]=(?!=)/, '')

  return s
}

/* ------------------------------------------------------------------ */
/* Ontleden                                                            */
/* ------------------------------------------------------------------ */

type Teken =
  | { t: 'getal'; waarde: number }
  | { t: 'letter'; naam: string }
  | { t: 'op'; op: string }
  | { t: 'haakje'; open: boolean }
  | { t: 'wortel' }

function knip(s: string): Teken[] | null {
  const uit: Teken[] = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (c >= '0' && c <= '9') {
      let j = i
      while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) j++
      const waarde = Number(s.slice(i, j))
      if (!Number.isFinite(waarde)) return null
      uit.push({ t: 'getal', waarde })
      i = j
      continue
    }
    if (c >= 'a' && c <= 'z') {
      uit.push({ t: 'letter', naam: c })
      i++
      continue
    }
    if (c === 'π') {
      uit.push({ t: 'getal', waarde: Math.PI })
      i++
      continue
    }
    if (c === '√') {
      uit.push({ t: 'wortel' })
      i++
      continue
    }
    if (c === '(' || c === ')') {
      uit.push({ t: 'haakje', open: c === '(' })
      i++
      continue
    }
    if ('+-·/÷^'.includes(c)) {
      uit.push({ t: 'op', op: c })
      i++
      continue
    }
    return null // teken dat we niet kennen
  }
  return uit
}

/** Leest een genormaliseerde uitdrukking. Geeft null als het geen som is. */
export function ontleed(ruw: string): Knoop | null {
  const s = normaliseer(ruw)
  if (!s) return null
  const tekens = knip(s)
  if (!tekens || tekens.length === 0) return null

  let p = 0
  const nu = () => tekens[p]
  const stuk = (): boolean => {
    const t = nu()
    return (
      !!t &&
      (t.t === 'getal' ||
        t.t === 'letter' ||
        t.t === 'wortel' ||
        (t.t === 'haakje' && t.open))
    )
  }

  function som(): Knoop | null {
    let links = product()
    if (!links) return null
    for (;;) {
      const t = nu()
      if (!t || t.t !== 'op' || (t.op !== '+' && t.op !== '-')) break
      const op: '+' | '-' = t.op === '+' ? '+' : '-'
      p++
      const rechts = product()
      if (!rechts) return null
      links = { t: 'op', op, links, rechts }
    }
    return links
  }

  /**
   * Keer en gedeeld-door, van links naar rechts. Het deelteken ÷ hoort hier
   * thuis en niet bij de breukstreep: 24 ÷ 3 · 2 is 16, en 2/3 ÷ 1/2 is 4/3.
   */
  function product(): Knoop | null {
    let links = breuk()
    if (!links) return null
    for (;;) {
      const t = nu()
      if (!t || t.t !== 'op' || (t.op !== '·' && t.op !== '÷')) break
      const op: '·' | '÷' = t.op === '·' ? '·' : '÷'
      p++
      const rechts = breuk()
      if (!rechts) return null
      links = { t: 'op', op, links, rechts }
    }
    return links
  }

  /** De breukstreep bindt strakker dan ÷, zodat 3/x ÷ 5/y werkt zoals bedoeld. */
  function breuk(): Knoop | null {
    let links = blok()
    if (!links) return null
    for (;;) {
      const t = nu()
      if (!t || t.t !== 'op' || t.op !== '/') break
      p++
      const rechts = blok()
      if (!rechts) return null
      links = { t: 'op', op: '/', links, rechts }
    }
    return links
  }

  /**
   * Een blok is een rijtje factoren dat aan elkaar geplakt staat zonder
   * maalteken: 3ab, 2x², 5(x+1). Zo'n blok hoort bij elkaar en gaat vóór een
   * deelteken. Daarom is 6x² ÷ 3x gelijk aan 2x en niet aan 2x³ -- precies
   * zoals de reader het bedoelt.
   */
  function blok(): Knoop | null {
    let links = voorteken()
    if (!links) return null
    while (stuk()) {
      const rechts = macht()
      if (!rechts) return null
      links = { t: 'op', op: '·', links, rechts }
    }
    return links
  }

  function voorteken(): Knoop | null {
    const t = nu()
    if (t && t.t === 'op' && t.op === '-') {
      p++
      const van = voorteken()
      return van ? { t: 'min', van } : null
    }
    if (t && t.t === 'op' && t.op === '+') {
      p++
      return voorteken()
    }
    return macht()
  }

  function macht(): Knoop | null {
    const basis = deel()
    if (!basis) return null
    const t = nu()
    if (t && t.t === 'op' && t.op === '^') {
      p++
      const exponent = voorteken() // rechts-associatief, en 2^-3 mag
      if (!exponent) return null
      return { t: 'op', op: '^', links: basis, rechts: exponent }
    }
    return basis
  }

  function deel(): Knoop | null {
    const t = nu()
    if (!t) return null
    if (t.t === 'getal') {
      p++
      return { t: 'getal', waarde: t.waarde }
    }
    if (t.t === 'letter') {
      p++
      return { t: 'letter', naam: t.naam }
    }
    if (t.t === 'wortel') {
      p++
      const van = deel()
      return van ? { t: 'wortel', van } : null
    }
    if (t.t === 'haakje' && t.open) {
      p++
      const binnen = som()
      if (!binnen) return null
      const sluit = nu()
      if (!sluit || sluit.t !== 'haakje' || sluit.open) return null
      p++
      return binnen
    }
    return null
  }

  const boom = som()
  if (!boom || p !== tekens.length) return null
  return boom
}

/* ------------------------------------------------------------------ */
/* Uitrekenen                                                          */
/* ------------------------------------------------------------------ */

export function reken(k: Knoop, waarden: Record<string, number>): number {
  switch (k.t) {
    case 'getal':
      return k.waarde
    case 'letter':
      return waarden[k.naam] ?? NaN
    case 'min':
      return -reken(k.van, waarden)
    case 'wortel':
      return Math.sqrt(reken(k.van, waarden))
    case 'op': {
      const a = reken(k.links, waarden)
      const b = reken(k.rechts, waarden)
      switch (k.op) {
        case '+': return a + b
        case '-': return a - b
        case '·': return a * b
        case '/':
        case '÷':
          return b === 0 ? NaN : a / b
        case '^': return Math.pow(a, b)
      }
    }
  }
}

export function letters(k: Knoop, uit = new Set<string>()): Set<string> {
  switch (k.t) {
    case 'letter': uit.add(k.naam); break
    case 'min': letters(k.van, uit); break
    case 'wortel': letters(k.van, uit); break
    case 'op': letters(k.links, uit); letters(k.rechts, uit); break
    case 'getal': break
  }
  return uit
}

/* ------------------------------------------------------------------ */
/* Vergelijken                                                         */
/* ------------------------------------------------------------------ */

const GRONDTAL = [2.3, 3.7, 5.9, 7.1, 11.3, 13.7, 17.9, 19.3]

/** Waarden voor proef nummer `ronde`, per letter een andere. */
function proefwaarden(namen: string[], ronde: number): Record<string, number> {
  const uit: Record<string, number> = {}
  namen.forEach((naam, i) => {
    uit[naam] = GRONDTAL[(i + ronde * 3) % GRONDTAL.length] + ronde * 0.13 + i * 0.07
  })
  return uit
}

function bijnaGelijk(a: number, b: number): boolean {
  const schaal = Math.max(1, Math.abs(a), Math.abs(b))
  return Math.abs(a - b) <= 1e-9 * schaal
}

/**
 * Zijn twee uitdrukkingen wiskundig hetzelfde? Vult zes keer andere getallen in
 * voor de letters. Bij elke proef moeten ze gelijk uitkomen; minstens vier
 * proeven moeten een geldig getal opleveren (delen door nul telt niet mee).
 */
export function zelfdeWaarde(links: string, rechts: string): boolean {
  const a = ontleed(links)
  const b = ontleed(rechts)
  if (!a || !b) return false

  const namen = [...new Set([...letters(a), ...letters(b)])].sort()
  if (namen.length === 0) {
    const va = reken(a, {})
    const vb = reken(b, {})
    return Number.isFinite(va) && Number.isFinite(vb) && bijnaGelijk(va, vb)
  }

  let geldig = 0
  for (let ronde = 0; ronde < 6; ronde++) {
    const waarden = proefwaarden(namen, ronde)
    const va = reken(a, waarden)
    const vb = reken(b, waarden)
    if (!Number.isFinite(va) || !Number.isFinite(vb)) continue
    if (!bijnaGelijk(va, vb)) return false
    geldig++
  }
  return geldig >= 4
}

/** Is het een geldige uitdrukking? Gebruikt om gebrabbel af te vangen. */
export function leesbaar(ruw: string): boolean {
  return ontleed(ruw) !== null
}
