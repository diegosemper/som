import { useEffect, useMemo, useState } from 'react'
import type { Onderwerp } from '../stof/types.ts'
import { afloop, goed, huidige, mis, startRonde, type Rondestand } from '../engine/ronde.ts'
import { kijkNa, type Oordeel } from '../engine/antwoord.ts'
import Toetsenbord from '../ui/Toetsenbord.tsx'

type Props = {
  onderwerp: Onderwerp
  opTerug: () => void
  opKlaar: (gewonnen: boolean, fouten: number) => void
  opMisser: () => void
}

/** De letters die in deze vraag voorkomen; die zet het toetsenbord klaar. */
function lettersUit(tekst: string): string[] {
  const gevonden = new Set<string>()
  for (const teken of tekst.toLowerCase()) {
    if (teken >= 'a' && teken <= 'z') gevonden.add(teken)
  }
  return [...gevonden].sort().slice(0, 6)
}

export default function Ronde({ onderwerp, opTerug, opKlaar, opMisser }: Props) {
  const [stand, setStand] = useState<Rondestand>(() => startRonde(onderwerp))
  const [invoer, setInvoer] = useState('')
  const [melding, setMelding] = useState<string | null>(null)
  const [oordeel, setOordeel] = useState<Oordeel | null>(null)

  const opgave = huidige(stand)
  const status = afloop(stand)

  useEffect(() => {
    if (status !== 'bezig') opKlaar(status === 'gewonnen', stand.fouten)
    // opKlaar verandert niet tussendoor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const letters = useMemo(
    () => (opgave ? lettersUit(opgave.vraag + ' ' + opgave.opdracht) : []),
    [opgave],
  )

  if (!opgave || status !== 'bezig') return null

  const extra: string[] = []
  if (opgave.soort === 'oplossingen') extra.push('=', '∨')

  function controleer() {
    if (!opgave) return
    const uitslag = kijkNa(invoer, opgave)
    if (uitslag.goed) {
      setStand(goed(stand))
      setInvoer('')
      setMelding(null)
      return
    }
    if (uitslag.soort === 'vorm') {
      setMelding(uitslag.uitleg)
      return
    }
    if (uitslag.soort === 'leeg') {
      setMelding('Vul eerst een antwoord in.')
      return
    }
    if (uitslag.soort === 'onleesbaar') {
      setMelding('Dat kan ik niet lezen. Gebruik · voor keer, / voor delen en ^ voor een macht.')
      return
    }
    opMisser()
    setOordeel(uitslag)
  }

  function verder() {
    setStand(mis(stand))
    setInvoer('')
    setMelding(null)
    setOordeel(null)
  }

  const voortgang = Math.round((stand.klaar / stand.totaal) * 100)

  return (
    <div className="scherm">
      <div className="kop">
        <button className="terug" onClick={opTerug}>
          ✕
        </button>
        <div className="balkje">
          <div style={{ width: `${voortgang}%` }} />
        </div>
        <span className="hartjes">
          {'♥'.repeat(Math.max(0, stand.levens))}
          <span style={{ color: '#39415a' }}>{'♥'.repeat(Math.max(0, 3 - stand.levens))}</span>
        </span>
      </div>

      <div className="vraagvak">
        <div className="opdracht">{opgave.opdracht}</div>
        <div
          className={
            opgave.vraag.length > 40 ? 'vraag verhaal' : opgave.vraag.length > 22 ? 'vraag lang' : 'vraag'
          }
        >
          {opgave.vraag}
        </div>
      </div>

      <div className={'antwoordvak' + (invoer ? '' : ' leeg') + (melding ? ' mis' : '')}>
        {invoer || 'jouw antwoord'}
      </div>
      {melding && <div className="melding">{melding}</div>}

      <Toetsenbord
        letters={letters}
        extra={extra}
        waarde={invoer}
        zet={(nieuw) => {
          setInvoer(nieuw)
          setMelding(null)
        }}
      />

      <button className={'groot' + (invoer ? '' : ' uit')} onClick={controleer}>
        Controleer
      </button>

      {oordeel && !oordeel.goed && (
        <div className="blad">
          <div className="binnen">
            <div className="bladkop mis">
              {oordeel.soort === 'valkuil' ? 'Bijna — bekende valkuil' : 'Niet goed'}
            </div>
            {oordeel.soort === 'valkuil' && <div className="valkuil">{oordeel.heet}</div>}
            <div className="juist">
              Het antwoord is <span>{opgave.antwoord}</span>
            </div>

            {opgave.stappen.map((stap, i) => (
              <div className="stap" key={i}>
                <div className="nr">{i + 1}</div>
                <div>
                  <div className="doe">{stap.doe}</div>
                  <div className="werd">{stap.werd}</div>
                  {stap.waarom && <div className="waarom">{stap.waarom}</div>}
                </div>
              </div>
            ))}

            <div className="tip">{opgave.tip}</div>
            <button className="groot" onClick={verder}>
              Snap ik — deze som komt zo terug
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
