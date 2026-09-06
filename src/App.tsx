import { useEffect, useState } from 'react'
import type { Onderwerp } from './stof/types.ts'
import { ONDERWERPEN } from './stof/index.ts'
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

type Scherm =
  | { naam: 'pad' }
  | { naam: 'uitleg'; code: string }
  | { naam: 'ronde'; code: string; poging: number }
  | { naam: 'slot'; code: string; gewonnen: boolean; fouten: number; sterren: number }

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
        opTerug={() => setScherm({ naam: 'pad' })}
        opMisser={() => setVoortgang((v) => misser(v, onderwerp.code))}
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

  return (
    <Pad
      voortgang={voortgang}
      opKies={(onderwerp) => setScherm({ naam: 'uitleg', code: onderwerp.code })}
    />
  )
}
