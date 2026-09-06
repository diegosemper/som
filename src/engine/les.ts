/**
 * Het lesje: uitleg als een spelletje in plaats van een muur tekst.
 *
 * Een lesje is een rijtje beurten dat je één voor één doortikt. Je leest nooit
 * meer dan één idee tegelijk, je ziet één som helemaal uitgewerkt worden, en je
 * moet halverwege zelf iets kiezen. Dat laatste is de kern: de foute keuzes zijn
 * de échte valkuilen van de opgavemaker, dus je maakt de fout hier — waar het
 * niets kost — in plaats van straks in de ronde.
 */

import type { Onderwerp, Stap } from '../stof/types.ts'
import { maakRng, type Rng } from '../stof/rng.ts'
import { gastVoor, introVoor, LOF, receptVoor, TROOST } from '../stof/gasten.ts'

export type Optie = {
  tekst: string
  goed: boolean
  reactie: string
}

export type Beurt =
  | { soort: 'praat'; tekst: string }
  | { soort: 'regel'; kop: string; tekst: string; voorbeeld?: string }
  | { soort: 'recept'; stappen: string[] }
  | { soort: 'uitwerking'; opdracht: string; vraag: string; stappen: Stap[]; tip: string }
  | { soort: 'kies'; opdracht: string; vraag: string; opties: Optie[] }

/** Een opgave zoeken die genoeg valkuilen heeft om een keuze van te maken. */
function opgaveMetValkuilen(onderwerp: Onderwerp, rng: Rng) {
  let beste = onderwerp.maak(rng)
  for (let poging = 0; poging < 12; poging++) {
    if (beste.valkuilen.length >= 2) return beste
    const volgende = onderwerp.maak(rng)
    if (volgende.valkuilen.length > beste.valkuilen.length) beste = volgende
  }
  return beste
}

function maakKeuze(onderwerp: Onderwerp, rng: Rng): Beurt | null {
  const opgave = opgaveMetValkuilen(onderwerp, rng)

  const juist: Optie = {
    tekst: opgave.antwoord,
    goed: true,
    reactie: rng.kies(LOF) + ' ' + opgave.tip,
  }

  const mis: Optie[] = []
  if (opgave.invoer === 'keuze' && opgave.keuzes) {
    for (const keuze of opgave.keuzes) {
      if (keuze === opgave.antwoord) continue
      const val = opgave.valkuilen.find((v) => v.fout === keuze)
      mis.push({
        tekst: keuze,
        goed: false,
        reactie: `${rng.kies(TROOST)} ${val ? val.heet : opgave.tip}`,
      })
    }
  } else {
    for (const val of opgave.valkuilen) {
      if (val.fout === juist.tekst) continue
      if (mis.some((o) => o.tekst === val.fout)) continue
      mis.push({ tekst: val.fout, goed: false, reactie: `${rng.kies(TROOST)} ${val.heet}` })
    }
  }

  if (mis.length === 0) return null

  // Het goede antwoord eerst apart houden: anders kan het bij het afkappen
  // wegvallen en staat er een vraag zonder juist antwoord.
  const opties = rng.schud([juist, ...rng.schud(mis).slice(0, 2)])

  return {
    soort: 'kies',
    opdracht: opgave.opdracht,
    vraag: opgave.vraag,
    opties,
  }
}

/**
 * Bouwt het lesje. De uitleg komt uit het onderwerp zelf, het uitgewerkte
 * voorbeeld en de keuzevraag worden ter plekke gegenereerd — dus elk lesje dat
 * je opnieuw opent gebruikt andere getallen.
 */
export function bouwLes(onderwerp: Onderwerp, zaad: number = Date.now()): Beurt[] {
  const rng = maakRng(zaad)
  const gast = gastVoor(onderwerp.hoofdstuk)
  const beurten: Beurt[] = []

  for (const zin of introVoor(onderwerp.code)) {
    beurten.push({ soort: 'praat', tekst: zin })
  }

  // Eerst wát je moet doen, dan pas waaróm. Wie het stappenplan al heeft
  // gezien, leest de regels daarna met een doel in zijn hoofd.
  const recept = receptVoor(onderwerp.code)
  if (recept.length > 0) beurten.push({ soort: 'recept', stappen: recept })

  for (const kaart of onderwerp.uitleg) {
    beurten.push({
      soort: 'regel',
      kop: kaart.kop,
      tekst: kaart.tekst,
      voorbeeld: kaart.voorbeeld,
    })
  }

  const voorbeeld = onderwerp.maak(rng)
  beurten.push({
    soort: 'uitwerking',
    opdracht: voorbeeld.opdracht,
    vraag: voorbeeld.vraag,
    stappen: voorbeeld.stappen,
    tip: voorbeeld.tip,
  })

  const keuze = maakKeuze(onderwerp, rng)
  if (keuze) beurten.push(keuze)

  beurten.push({ soort: 'praat', tekst: rng.kies(gast.afscheid) })

  return beurten
}
