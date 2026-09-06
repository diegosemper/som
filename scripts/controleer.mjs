/**
 * Kijkt de stof na vóórdat er gebouwd wordt.
 *
 * Twee dingen:
 *   1. Per onderwerp tweehonderd gegenereerde sommen: klopt het antwoord met
 *      zichzelf, worden de valkuilen afgekeurd, eindigt de uitwerking op het
 *      antwoord, en wordt het overtikken van de vraag níet goedgekeurd.
 *   2. De opgaven uit de syllabus met de officiële antwoorden achterin. Als de
 *      rekenaar het daar niet mee eens is, klopt de rekenaar niet.
 *
 * Node leest de TypeScript hier rechtstreeks (node 22 haalt de types eruit),
 * daarom staan de imports voluit mét .ts erachter.
 */

import { ONDERWERPEN } from '../src/stof/index.ts'
import { READEROPGAVEN } from '../src/stof/reader.ts'
import { kijkNa, zelfdeAntwoord } from '../src/engine/antwoord.ts'
import { normaliseer } from '../src/engine/rekenaar.ts'
import { maakRng } from '../src/stof/rng.ts'

const PER_ONDERWERP = 200

const klachten = []
const meld = (waar, wat) => klachten.push(`${waar}: ${wat}`)

const RAAR = /NaN|undefined|Infinity/

/* ---------------- 1. de opgavemakers ---------------- */

let gemaakt = 0

for (const onderwerp of ONDERWERPEN) {
  for (let i = 0; i < PER_ONDERWERP; i++) {
    const rng = maakRng(7919 * i + onderwerp.code.charCodeAt(0) * 131 + onderwerp.code.charCodeAt(1))
    const opgave = onderwerp.maak(rng)
    gemaakt++
    const waar = `${onderwerp.code} #${i} "${opgave.vraag}"`

    if (!opgave.vraag || !opgave.antwoord || !opgave.opdracht) {
      meld(waar, 'lege vraag, opdracht of antwoord')
      continue
    }
    const alles = [opgave.vraag, opgave.antwoord, opgave.opdracht, ...opgave.stappen.map((s) => s.werd + s.doe)].join(' ')
    if (RAAR.test(alles)) {
      meld(waar, 'er staat NaN, undefined of Infinity in de opgave')
      continue
    }

    // Het eigen antwoord moet goedgekeurd worden.
    const eigen = kijkNa(opgave.antwoord, opgave)
    if (!eigen.goed) {
      meld(waar, `eigen antwoord "${opgave.antwoord}" wordt afgekeurd (${eigen.soort}${eigen.soort === 'vorm' ? ': ' + eigen.uitleg : ''})`)
    }

    // Elke valkuil moet afgekeurd worden.
    for (const valkuil of opgave.valkuilen) {
      if (!valkuil.heet) meld(waar, 'valkuil zonder uitleg')
      const oordeel = kijkNa(valkuil.fout, opgave)
      if (oordeel.goed) meld(waar, `valkuil "${valkuil.fout}" wordt goedgekeurd`)
    }

    // De uitwerking moet ergens heen leiden.
    if (opgave.stappen.length === 0) {
      meld(waar, 'geen uitwerking')
    } else {
      const laatste = opgave.stappen[opgave.stappen.length - 1]
      if (!laatste.werd) meld(waar, 'laatste stap is leeg')
      else if (!zelfdeAntwoord(laatste.werd, opgave.antwoord, opgave.soort)) {
        meld(waar, `laatste stap "${laatste.werd}" komt niet uit op "${opgave.antwoord}"`)
      }
    }

    // De vraag overtikken mag nooit goed zijn -- behalve als dat het antwoord ís.
    if (normaliseer(opgave.vraag) !== normaliseer(opgave.antwoord)) {
      if (kijkNa(opgave.vraag, opgave).goed) {
        meld(waar, 'de vraag zelf wordt als goed antwoord geaccepteerd')
      }
    }

    if (!opgave.tip) meld(waar, 'geen tip')
  }
}

/* ---------------- 2. de reader ---------------- */

for (const opgave of READEROPGAVEN) {
  if (!zelfdeAntwoord(opgave.som, opgave.antwoord, 'uitdrukking')) {
    meld(`reader ${opgave.waar}`, `"${opgave.som}" komt bij ons niet uit op "${opgave.antwoord}"`)
  }
}

/* ---------------- uitslag ---------------- */

if (klachten.length > 0) {
  console.error(`\n${klachten.length} probleem(en) gevonden:\n`)
  for (const klacht of klachten.slice(0, 40)) console.error('  - ' + klacht)
  if (klachten.length > 40) console.error(`  ... en nog ${klachten.length - 40}`)
  console.error('')
  process.exit(1)
}

console.log(
  `Controle in orde: ${ONDERWERPEN.length} onderwerpen, ${gemaakt} gegenereerde sommen, ${READEROPGAVEN.length} opgaven uit de reader.`,
)
