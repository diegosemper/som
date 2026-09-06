/**
 * Nakijken. Niet "fout" zeggen als het goed is, en niet "goed" als het toevallig
 * hetzelfde getal oplevert maar niet de gevraagde vorm heeft.
 */

import type { Opgave, Soort, Vormeis } from '../stof/types.ts'
import { ggd } from '../stof/getal.ts'
import { letters, normaliseer, ontleed, reken, zelfdeWaarde } from './rekenaar.ts'

export type Oordeel =
  | { goed: true }
  /** Waarde klopt, maar de opgave vroeg een andere schrijfwijze. Kost geen hartje. */
  | { goed: false; soort: 'vorm'; uitleg: string }
  /** Precies de fout die veel gemaakt wordt -- die noemen we bij naam. */
  | { goed: false; soort: 'valkuil'; heet: string }
  | { goed: false; soort: 'leeg' }
  | { goed: false; soort: 'onleesbaar' }
  | { goed: false; soort: 'fout' }

/* ------------------------------------------------------------------ */
/* Losse waarden eruit peuteren                                        */
/* ------------------------------------------------------------------ */

function waarde(stuk: string): number | null {
  const boom = ontleed(stuk)
  if (!boom) return null
  const n = reken(boom, {})
  return Number.isFinite(n) ? n : null
}

/** "x = -3 ∨ x = -2", "-3 of -2", "-3, -2" -> [-3, -2] */
function oplossingen(ruw: string): number[] | null {
  const delen = ruw
    .toLowerCase()
    .replace(/[∨|]/g, ' of ')
    .replace(/\ben\b/g, ' of ')
    .replace(/[;,]/g, ' of ')
    .split(/\bof\b/)
    .map((d) => d.replace(/^\s*[a-z]\s*=/, '').trim())
    .filter((d) => d.length > 0)

  if (delen.length === 0) return null
  const uit: number[] = []
  for (const deel of delen) {
    const n = waarde(deel)
    if (n === null) return null
    uit.push(n)
  }
  return uit.sort((a, b) => a - b)
}

/** "(-3, 0) en (2, 0)" -> [[-3,0],[2,0]] */
function coordinaten(ruw: string): [number, number][] | null {
  const groepen = [...ruw.matchAll(/\(([^()]*)\)/g)].map((m) => m[1])
  const brokken = groepen.length > 0 ? groepen : [ruw]

  const uit: [number, number][] = []
  for (const brok of brokken) {
    const delen = brok.split(/[;,]/).map((d) => d.trim()).filter(Boolean)
    if (delen.length !== 2) return null
    const x = waarde(delen[0])
    const y = waarde(delen[1])
    if (x === null || y === null) return null
    uit.push([x, y])
  }
  if (uit.length === 0) return null
  return uit.sort((a, b) => a[0] - b[0] || a[1] - b[1])
}

function dichtbij(a: number, b: number): boolean {
  return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
}

/** Zijn twee antwoorden inhoudelijk hetzelfde, gegeven de soort? */
export function zelfdeAntwoord(a: string, b: string, soort: Soort): boolean {
  if (soort === 'keuze') {
    return a.trim().toLowerCase() === b.trim().toLowerCase()
  }
  if (soort === 'coordinaat') {
    const ca = coordinaten(a)
    const cb = coordinaten(b)
    if (!ca || !cb || ca.length !== cb.length) return false
    return ca.every((paar, i) => dichtbij(paar[0], cb[i][0]) && dichtbij(paar[1], cb[i][1]))
  }
  if (soort === 'oplossingen') {
    const oa = oplossingen(a)
    const ob = oplossingen(b)
    if (!oa || !ob) return false
    // Dubbele wortel: "x = 8" mag ook als het antwoord "x = 8 ∨ x = 8" is.
    const uniekA = [...new Set(oa.map((n) => n.toFixed(9)))]
    const uniekB = [...new Set(ob.map((n) => n.toFixed(9)))]
    if (uniekA.length !== uniekB.length) return false
    return uniekA.every((n, i) => n === uniekB[i])
  }
  return zelfdeWaarde(a, b)
}

/* ------------------------------------------------------------------ */
/* Vormeisen                                                           */
/* ------------------------------------------------------------------ */

/**
 * Hoeveel losse termen staan er? Telt de plussen en minnen op diepte nul, dus
 * niet die binnen haakjes of in een exponent.
 */
export function aantalTermen(genormaliseerd: string): number {
  let diepte = 0
  let scheidingen = 0
  for (let i = 0; i < genormaliseerd.length; i++) {
    const c = genormaliseerd[i]
    if (c === '(') diepte++
    else if (c === ')') diepte--
    else if ((c === '+' || c === '-') && diepte === 0 && i > 0) {
      const vorige = genormaliseerd[i - 1]
      if (vorige !== '^' && vorige !== '(' && vorige !== '·' && vorige !== '/') scheidingen++
    }
  }
  return scheidingen + 1
}

/**
 * Wat staat er buiten de haakjes? Bij "4b(3a + b)" is dat 4b, bij "(3a + b)4b"
 * ook. Zo kunnen we nakijken of er volledig ontbonden is: wie 3(21u + 6)
 * opschrijft heeft wel de goede waarde, maar niet de grootste factor.
 *
 * Numeriek de deler van de inhoud zoeken werkt niet: x + 19 is bij handig
 * gekozen proefwaarden ook altijd deelbaar door 3, terwijl er niets uit kan.
 */
function buitenDeHaakjes(ingevuld: string): string | null {
  const s = normaliseer(ingevuld)
  const open = s.indexOf('(')
  if (open === -1) return null

  let diepte = 0
  let sluit = -1
  for (let i = open; i < s.length; i++) {
    if (s[i] === '(') diepte++
    else if (s[i] === ')') {
      diepte--
      if (diepte === 0) {
        sluit = i
        break
      }
    }
  }
  if (sluit === -1) return null

  const voor = s.slice(0, open).replace(/·$/, '')
  const na = s.slice(sluit + 1).replace(/^·/, '')
  const delen = [voor, na].filter((d) => d.length > 0)
  return delen.length === 0 ? '1' : delen.join('·')
}

/** Splitst op de plussen en minnen die niet binnen haakjes staan. */
function losseTermen(deel: string): string[] {
  const uit: string[] = []
  let diepte = 0
  let begin = 0
  for (let i = 0; i < deel.length; i++) {
    const c = deel[i]
    if (c === '(') diepte++
    else if (c === ')') diepte--
    else if ((c === '+' || c === '-') && diepte === 0 && i > 0) {
      const vorige = deel[i - 1]
      if (vorige !== '^' && vorige !== '(' && vorige !== '·' && vorige !== '/' && vorige !== '÷') {
        uit.push(deel.slice(begin, i))
        begin = i + 1
      }
    }
  }
  uit.push(deel.slice(begin))
  return uit.filter((t) => t.length > 0)
}

/** Welke letters zitten in élke term van dit stuk? Alleen die kun je wegstrepen. */
function overalAanwezig(deel: string): Set<string> {
  const kaal = deel.replace(/^\((.*)\)$/, '$1')
  const termen = losseTermen(kaal)
  let gedeeld: Set<string> | null = null
  for (const t of termen) {
    const boom = ontleed(t)
    const hier: Set<string> = boom ? letters(boom) : new Set<string>()
    if (gedeeld === null) {
      gedeeld = hier
    } else {
      const vorige: string[] = [...gedeeld]
      gedeeld = new Set<string>(vorige.filter((l) => hier.has(l)))
    }
  }
  return gedeeld ?? new Set<string>()
}

/**
 * Staat er boven én onder de streep een letter die in álle termen zit? Dan kan
 * er nog weggestreept worden -- precies de regel uit de reader: wat je bij het
 * ene element wegstreept, moet je bij alle elementen weg kunnen strepen.
 */
function nogWegTeStrepen(ingevuld: string): boolean {
  const s = normaliseer(ingevuld)
  let diepte = 0
  let streep = -1
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') diepte++
    else if (s[i] === ')') diepte--
    else if ((s[i] === '/' || s[i] === '÷') && diepte === 0) {
      streep = i
      break
    }
  }
  if (streep === -1) return false

  const boven = overalAanwezig(s.slice(0, streep))
  const onder = overalAanwezig(s.slice(streep + 1))
  return [...boven].some((l) => onder.has(l))
}

function vormFout(ingevuld: string, eis: Vormeis | undefined): string | null {
  if (!eis) return null
  const s = normaliseer(ingevuld)

  if (eis.geenBreuk && (s.includes('/') || s.includes('÷'))) {
    return 'De waarde klopt, maar er mag geen breuk in staan. Gebruik een negatieve macht: 1/a³ is a⁻³.'
  }
  if (eis.geenHaakjes && s.includes('(')) {
    return 'De waarde klopt, maar de haakjes moeten weggewerkt zijn.'
  }
  if (eis.geenMaal && s.includes('·')) {
    return 'De waarde klopt, maar het maalteken moet uitgerekend zijn.'
  }
  if (eis.geenDeelteken && s.includes('÷')) {
    return 'De waarde klopt, maar de deling moet uitgewerkt zijn tot één breuk.'
  }
  if (eis.alleenGetal) {
    const heel = /^-?\d+(\.\d+)?$/.test(s)
    const breuk = /^-?(\d+)\/(\d+)$/.exec(s)
    const gemengd = /^-?\((\d+)\+(\d+)\/(\d+)\)$/.exec(s)
    if (breuk) {
      if (ggd(Number(breuk[1]), Number(breuk[2])) !== 1) {
        return 'Bijna: die breuk kan nog vereenvoudigd worden.'
      }
    } else if (gemengd) {
      if (ggd(Number(gemengd[2]), Number(gemengd[3])) !== 1 || Number(gemengd[2]) >= Number(gemengd[3])) {
        return 'Bijna: haal de hele eruit en vereenvoudig de breuk.'
      }
    } else if (!heel) {
      return 'Er wordt één uitgerekend getal gevraagd, niet de som zelf.'
    }
  }
  if (eis.maxTermen !== undefined && aantalTermen(s) > eis.maxTermen) {
    return 'De waarde klopt, maar het kan nog korter: er staan termen tussen die je bij elkaar kunt nemen.'
  }
  if (eis.geenGedeeldeLetter && nogWegTeStrepen(ingevuld)) {
    return 'Er staat boven én onder de streep nog een letter die je kunt wegstrepen.'
  }
  if (eis.hoogstensTekens !== undefined && s.length > eis.hoogstensTekens) {
    return 'De waarde klopt, maar het kan nog korter: vereenvoudig verder.'
  }
  if (eis.gemengd && /^-?\d+\/\d+$/.test(s)) {
    const [teller, noemer] = s.replace('-', '').split('/').map(Number)
    if (teller >= noemer) {
      return 'De waarde klopt, maar haal de hele eruit: schrijf het als gemengd getal.'
    }
  }
  if (eis.alsBreuk && !/^-?\d+\/\d+$/.test(s)) {
    return 'Schrijf het als één breuk, dus als teller/noemer.'
  }
  if (eis.factor !== undefined) {
    const buiten = buitenDeHaakjes(ingevuld)
    if (buiten === null) {
      return 'Er wordt om haakjes gevraagd: zet de gemeenschappelijke factor ervoor.'
    }
    if (!zelfdeWaarde(buiten, eis.factor)) {
      return 'De waarde klopt, maar je hebt niet de grootste gemeenschappelijke factor buiten de haakjes gezet.'
    }
  }
  if (eis.grondtal !== undefined) {
    const g = eis.grondtal
    const past = new RegExp(`^-?${g}(\\^-?\\d+)?$`).test(s)
    if (!past) {
      return `De waarde klopt, maar schrijf hem als één macht van ${g}, dus in de vorm ${g}^…`
    }
  }
  return null
}

/* ------------------------------------------------------------------ */
/* Het oordeel                                                         */
/* ------------------------------------------------------------------ */

export function kijkNa(ingevuld: string, opgave: Opgave): Oordeel {
  const ruw = ingevuld.trim()
  if (!ruw) return { goed: false, soort: 'leeg' }

  if (zelfdeAntwoord(ruw, opgave.antwoord, opgave.soort)) {
    const klacht = vormFout(ruw, opgave.vorm)
    if (klacht) return { goed: false, soort: 'vorm', uitleg: klacht }
    return { goed: true }
  }

  for (const valkuil of opgave.valkuilen) {
    if (zelfdeAntwoord(ruw, valkuil.fout, opgave.soort)) {
      return { goed: false, soort: 'valkuil', heet: valkuil.heet }
    }
  }

  if (opgave.soort === 'uitdrukking' || opgave.soort === 'getal') {
    if (!ontleed(ruw)) return { goed: false, soort: 'onleesbaar' }
  }

  return { goed: false, soort: 'fout' }
}
