import { useEffect, useState } from 'react'
import type { Onderwerp, Rondesoort } from './stof/types.ts'
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
  sleutelVoor,
  type Voortgang,
} from './opslag/voortgang.ts'
import Pad from './schermen/Pad.tsx'
import Onderwerpscherm from './schermen/Onderwerp.tsx'
import Les from './schermen/Les.tsx'
import Ronde from './schermen/Ronde.tsx'
import Slot from './schermen/Slot.tsx'
import Proeftoets, { Nabespreking } from './schermen/Proeftoets.tsx'

type Scherm =
  | { naam: 'pad' }
  | { naam: 'onderwerp'; code: string }
  | { naam: 'les'; code: string }
  | { naam: 'ronde'; code: string; soort: Rondesoort; poging: number }
  | {
      naam: 'slot'
      code: string
      soort: Rondesoort
      gewonnen: boolean
      fouten: number
      sterren: number
    }
  | { naam: 'proeftoets'; soort: Rondesoort; poging: number }
  | { naam: 'nabespreking'; soort: Rondesoort; gegevens: Gegeven[] }

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

  if (scherm.naam === 'onderwerp') {
    const onderwerp = zoek(scherm.code)
    if (!onderwerp) return null
    return (
      <Onderwerpscherm
        onderwerp={onderwerp}
        voortgang={voortgang}
        opTerug={() => setScherm({ naam: 'pad' })}
        opLes={() => setScherm({ naam: 'les', code: onderwerp.code })}
        opRonde={(soort) => setScherm({ naam: 'ronde', code: onderwerp.code, soort, poging: 0 })}
      />
    )
  }

  if (scherm.naam === 'les') {
    const onderwerp = zoek(scherm.code)
    if (!onderwerp) return null
    return (
      <Les
        onderwerp={onderwerp}
        opTerug={() => setScherm({ naam: 'onderwerp', code: onderwerp.code })}
        opStart={(soort) => setScherm({ naam: 'ronde', code: onderwerp.code, soort, poging: 0 })}
      />
    )
  }

  if (scherm.naam === 'ronde') {
    const onderwerp = zoek(scherm.code)
    if (!onderwerp) return null
    const soort = scherm.soort
    return (
      <Ronde
        key={`${onderwerp.code}-${soort}-${scherm.poging}`}
        onderwerp={onderwerp}
        soort={soort}
        herhaling={herhalingVoor(onderwerp.code, voortgang)}
        opTerug={() => setScherm({ naam: 'onderwerp', code: onderwerp.code })}
        opMisser={(code) => setVoortgang((v) => misser(v, code))}
        opKlaar={(gewonnen, fouten) => {
          const nieuw = gewonnen
            ? rondeGehaald(voortgang, onderwerp.code, soort, fouten)
            : rondeVerloren(voortgang, onderwerp.code, fouten)
          setVoortgang(nieuw)
          setScherm({
            naam: 'slot',
            code: onderwerp.code,
            soort,
            gewonnen,
            fouten,
            sterren: nieuw.sterren[sleutelVoor(onderwerp.code, soort)] ?? 0,
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
        soort={scherm.soort}
        gewonnen={scherm.gewonnen}
        fouten={scherm.fouten}
        sterren={scherm.sterren}
        opNogEen={(soort) =>
          setScherm({ naam: 'ronde', code: onderwerp.code, soort, poging: Date.now() })
        }
        opTerug={() => setScherm({ naam: 'onderwerp', code: onderwerp.code })}
      />
    )
  }

  if (scherm.naam === 'proeftoets') {
    const beschikbaar = ONDERWERPEN.filter((o) => isOpen(ONDERWERPEN, o.code, voortgang))
    const soort = scherm.soort
    return (
      <Proeftoets
        key={`${soort}-${scherm.poging}`}
        onderwerpen={beschikbaar.length > 0 ? beschikbaar : ONDERWERPEN}
        foutenbak={voortgang.foutenbak}
        soort={soort}
        opTerug={() => setScherm({ naam: 'pad' })}
        opKlaar={(gegevens) => {
          setVoortgang((v) => {
            const bak = { ...v.foutenbak }
            for (const g of gegevens) {
              if (!g.goed) bak[g.opgave.code] = (bak[g.opgave.code] ?? 0) + 1
            }
            return { ...v, foutenbak: bak, xp: v.xp + gegevens.filter((g) => g.goed).length }
          })
          setScherm({ naam: 'nabespreking', soort, gegevens })
        }}
      />
    )
  }

  if (scherm.naam === 'nabespreking') {
    return (
      <Nabespreking
        gegevens={scherm.gegevens}
        soort={scherm.soort}
        opTerug={() => setScherm({ naam: 'pad' })}
        opNogEen={(soort) => setScherm({ naam: 'proeftoets', soort, poging: Date.now() })}
      />
    )
  }

  return (
    <Pad
      voortgang={voortgang}
      opKies={(onderwerp) => setScherm({ naam: 'onderwerp', code: onderwerp.code })}
      opProeftoets={(soort) => setScherm({ naam: 'proeftoets', soort, poging: Date.now() })}
    />
  )
}
