import { useEffect, useState } from 'react'
import type { Onderwerp } from './stof/types.ts'
import { ONDERWERPEN } from './stof/index.ts'
import { isOpen } from './engine/pad.ts'
import type { Gegeven } from './engine/toets.ts'
import {
  dagBijwerken,
  lees,
  misser,
  rondeGehaald,
  rondeVerloren,
  schrijf,
  type Voortgang,
} from './opslag/voortgang.ts'
import Pad from './schermen/Pad.tsx'
import Uitleg from './schermen/Uitleg.tsx'
import Ronde from './schermen/Ronde.tsx'
import Slot from './schermen/Slot.tsx'
import Proeftoets, { Nabespreking } from './schermen/Proeftoets.tsx'

type Scherm =
  | { naam: 'pad' }
  | { naam: 'uitleg'; code: string }
  | { naam: 'ronde'; code: string; poging: number }
  | { naam: 'slot'; code: string; gewonnen: boolean; fouten: number; sterren: number }
  | { naam: 'proeftoets'; poging: number }
  | { naam: 'nabespreking'; gegevens: Gegeven[] }

/** De twee onderwerpen waar tot nu toe het vaakst op misgegrepen is. */
function herhalingVoor(code: string, voortgang: Voortgang): Onderwerp[] {
  return Object.entries(voortgang.foutenbak)
    .filter(([andere]) => andere !== code)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([andere]) => ONDERWERPEN.find((o) => o.code === andere))
    .filter((o): o is Onderwerp => o !== undefined)
    .filter((o) => isOpen(ONDERWERPEN, o.code, voortgang))
}

export default function App() {
  const [voortgang, setVoortgang] = useState<Voortgang>(() => dagBijwerken(lees()))
  const [scherm, setScherm] = useState<Scherm>({ naam: 'pad' })

  useEffect(() => {
    schrijf(voortgang)
  }, [voortgang])

  const zoek = (code: string): Onderwerp | undefined => ONDERWERPEN.find((o) => o.code === code)

  if (ONDERWERPEN.length === 0) {
    return <div className="scherm">Nog geen onderwerpen geladen.</div>
  }

  if (scherm.naam === 'uitleg') {
    const onderwerp = zoek(scherm.code)
    if (!onderwerp) return null
    return (
      <Uitleg
        onderwerp={onderwerp}
        opTerug={() => setScherm({ naam: 'pad' })}
        opStart={() => setScherm({ naam: 'ronde', code: onderwerp.code, poging: 0 })}
      />
    )
  }

  if (scherm.naam === 'ronde') {
    const onderwerp = zoek(scherm.code)
    if (!onderwerp) return null
    return (
      <Ronde
        key={`${onderwerp.code}-${scherm.poging}`}
        onderwerp={onderwerp}
        herhaling={herhalingVoor(onderwerp.code, voortgang)}
        opTerug={() => setScherm({ naam: 'pad' })}
        opMisser={(code) => setVoortgang((v) => misser(v, code))}
        opKlaar={(gewonnen, fouten) => {
          const nieuw = gewonnen
            ? rondeGehaald(voortgang, onderwerp.code, fouten)
            : rondeVerloren(voortgang, onderwerp.code, fouten)
          setVoortgang(nieuw)
          setScherm({
            naam: 'slot',
            code: onderwerp.code,
            gewonnen,
            fouten,
            sterren: nieuw.sterren[onderwerp.code] ?? 0,
          })
        }}
      />
    )
  }

  if (scherm.naam === 'slot') {
    const onderwerp = zoek(scherm.code)
    if (!onderwerp) return null
    return (
      <Slot
        onderwerp={onderwerp}
        gewonnen={scherm.gewonnen}
        fouten={scherm.fouten}
        sterren={scherm.sterren}
        opNogEen={() => setScherm({ naam: 'ronde', code: onderwerp.code, poging: Date.now() })}
        opTerug={() => setScherm({ naam: 'pad' })}
      />
    )
  }

  if (scherm.naam === 'proeftoets') {
    const beschikbaar = ONDERWERPEN.filter((o) => isOpen(ONDERWERPEN, o.code, voortgang))
    return (
      <Proeftoets
        key={scherm.poging}
        onderwerpen={beschikbaar.length > 0 ? beschikbaar : ONDERWERPEN}
        foutenbak={voortgang.foutenbak}
        opTerug={() => setScherm({ naam: 'pad' })}
        opKlaar={(gegevens) => {
          setVoortgang((v) => {
            const bak = { ...v.foutenbak }
            for (const g of gegevens) {
              if (!g.goed) bak[g.opgave.code] = (bak[g.opgave.code] ?? 0) + 1
            }
            return { ...v, foutenbak: bak, xp: v.xp + gegevens.filter((g) => g.goed).length }
          })
          setScherm({ naam: 'nabespreking', gegevens })
        }}
      />
    )
  }

  if (scherm.naam === 'nabespreking') {
    return (
      <Nabespreking
        gegevens={scherm.gegevens}
        opTerug={() => setScherm({ naam: 'pad' })}
        opNogEen={() => setScherm({ naam: 'proeftoets', poging: Date.now() })}
      />
    )
  }

  return (
    <Pad
      voortgang={voortgang}
      opKies={(onderwerp) => setScherm({ naam: 'uitleg', code: onderwerp.code })}
      opProeftoets={() => setScherm({ naam: 'proeftoets', poging: Date.now() })}
    />
  )
}
