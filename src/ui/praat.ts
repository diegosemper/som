/**
 * De stem van het spel: korte reacties en rangen.
 *
 * Kort houden is het hele punt. Een grap die je bij de derde som al kent is
 * geen grap meer, dus liever tien zinnen van drie woorden dan drie alinea's.
 */

const GOED = [
  'Goed.',
  'Klopt.',
  'Precies.',
  'Netjes.',
  'Meteen raak.',
  'Ja hoor.',
  'Zo doe je dat.',
  'Klopt als een bus.',
  'Prima.',
  'Volgende.',
]

const REEKS: Record<number, string> = {
  3: '3 op rij 🔥',
  4: '4 op rij — lekker bezig',
  5: '5 op rij, je bent los 🔥',
  6: '6 op rij. Indrukwekkend.',
  7: '7 op rij. Doe eens rustig.',
  8: '8 op rij — foutloos in zicht',
}

const MIS = [
  'Hm.',
  'Nee, net niet.',
  'Bijna.',
  'Daar ging het mis.',
  'Nog even kijken.',
]

/** Wat er opflitst na een goed antwoord. Bij een reeks wint de reeks. */
export function juich(reeks: number, kiezer: number): string {
  const bij = REEKS[reeks]
  if (bij) return bij
  return GOED[kiezer % GOED.length]
}

export function troost(kiezer: number): string {
  return MIS[kiezer % MIS.length]
}

/* ------------------------------------------------------------------ */
/* Rangen                                                              */
/* ------------------------------------------------------------------ */

const RANGEN: { vanaf: number; naam: string }[] = [
  { vanaf: 0, naam: 'Rekenmachine-ontkenner' },
  { vanaf: 40, naam: 'Volgorde-volger' },
  { vanaf: 100, naam: 'Haakjesfluisteraar' },
  { vanaf: 180, naam: 'Machtsregel-monteur' },
  { vanaf: 280, naam: 'Breukentemmer' },
  { vanaf: 400, naam: 'Kansrekenaar' },
  { vanaf: 550, naam: 'Balansmeester' },
  { vanaf: 750, naam: 'Parabooldompteur' },
  { vanaf: 1000, naam: 'Som-productprofessor' },
  { vanaf: 1400, naam: 'Dinsdag komt niet meer aan' },
]

export function rangVoor(xp: number): { naam: string; volgende: number | null } {
  let huidig = RANGEN[0]
  let volgende: number | null = null
  for (const rang of RANGEN) {
    if (xp >= rang.vanaf) huidig = rang
    else {
      volgende = rang.vanaf
      break
    }
  }
  return { naam: huidig.naam, volgende }
}
