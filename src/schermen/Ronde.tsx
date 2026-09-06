import { useEffect, useMemo, useState } from 'react'
import type { Onderwerp } from '../stof/types.ts'
import { afloop, goed, huidige, LEVENS, mis, startRonde, type Rondestand } from '../engine/ronde.ts'
import { kijkNa, type Oordeel } from '../engine/antwoord.ts'
import { receptVoor } from '../stof/gasten.ts'
import { juich, troost } from '../ui/praat.ts'
import Toetsenbord from '../ui/Toetsenbord.tsx'
import { nodigeLetters } from '../ui/toetsen.ts'

type Props = {
  onderwerp: Onderwerp
  /** Onderwerpen uit de foutenbak die tussendoor terugkomen. */
  herhaling: Onderwerp[]
  opTerug: () => void
  opKlaar: (gewonnen: boolean, fouten: number) => void
  opMisser: (code: string) => void
}

export default function Ronde({ onderwerp, herhaling, opTerug, opKlaar, opMisser }: Props) {
  const [stand, setStand] = useState<Rondestand>(() => startRonde(onderwerp, Date.now(), herhaling))
  const [invoer, setInvoer] = useState('')
  const [melding, setMelding] = useState<string | null>(null)
  const [oordeel, setOordeel] = useState<Oordeel | null>(null)
  const [flits, setFlits] = useState<{ tekst: string; id: number } | null>(null)

  useEffect(() => {
    if (!flits) return
    const klok = setTimeout(() => setFlits(null), 900)
    return () => clearTimeout(klok)
  }, [flits])

  const opgave = huidige(stand)
  const status = afloop(stand)

  useEffect(() => {
    if (status !== 'bezig') opKlaar(status === 'gewonnen', stand.fouten)
    // opKlaar verandert niet tussendoor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const letters = useMemo(() => (opgave ? nodigeLetters(opgave) : []), [opgave])

  if (!opgave || status !== 'bezig') return null

  const extra: string[] = []
  if (opgave.soort === 'oplossingen') extra.push('=', '∨')

  function beoordeel(waarde: string) {
    if (!opgave) return
    const uitslag = kijkNa(waarde, opgave)
    if (uitslag.goed) {
      const volgende = goed(stand)
      setStand(volgende)
      setInvoer('')
      setMelding(null)
      setFlits({ tekst: juich(volgende.reeks, volgende.klaar), id: Date.now() })
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
    opMisser(opgave.code)
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
          <span style={{ color: '#39415a' }}>
            {'♥'.repeat(Math.max(0, LEVENS - stand.levens))}
          </span>
        </span>
      </div>

      <div className="vraagvak">
        <div className="opdracht">
          {opgave.invoer === 'keuze' && <span className="codetag kies">kies er één</span>}{' '}
          {opgave.code !== onderwerp.code && (
            <span className="codetag herhaal">herhaling {opgave.code}</span>
          )}{' '}
          {opgave.opdracht}
        </div>
        <div
          className={
            opgave.vraag.length > 40 ? 'vraag verhaal' : opgave.vraag.length > 22 ? 'vraag lang' : 'vraag'
          }
        >
          {opgave.vraag}
        </div>
      </div>

      {opgave.invoer === 'keuze' ? (
        <>
          {melding && <div className="melding">{melding}</div>}
          <div className="keuzes">
            {(opgave.keuzes ?? []).map((keuze) => (
              <button key={keuze} className="keuze" onClick={() => beoordeel(keuze)}>
                {keuze}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
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

          <button className={'groot' + (invoer ? '' : ' uit')} onClick={() => beoordeel(invoer)}>
            Controleer
          </button>
        </>
      )}

      {flits && (
        <div className="flits" key={flits.id}>
          {flits.tekst}
        </div>
      )}

      {oordeel && !oordeel.goed && (
        <div className="blad">
          <div className="binnen">
            <div className="bladkop mis">
              {oordeel.soort === 'valkuil'
                ? 'Bekende valkuil — daar trapt bijna iedereen in'
                : troost(stand.fouten)}
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

            {receptVoor(opgave.code).length > 0 && (
              <details className="stappenplan">
                <summary>Stappenplan voor dit soort sommen</summary>
                <ol>
                  {receptVoor(opgave.code).map((stap, i) => (
                    <li key={i}>{stap}</li>
                  ))}
                </ol>
              </details>
            )}

            <button className="groot" onClick={verder}>
              Snap ik — deze som komt zo terug
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
