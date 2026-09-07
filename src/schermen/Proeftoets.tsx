import { useMemo, useState } from 'react'
import type { Onderwerp, Opgave, Rondesoort } from '../stof/types.ts'
import { kijkNa } from '../engine/antwoord.ts'
import { cijfer, maakToets, type Gegeven } from '../engine/toets.ts'
import Toetsenbord from '../ui/Toetsenbord.tsx'
import { nodigeLetters } from '../ui/toetsen.ts'

type Props = {
  onderwerpen: Onderwerp[]
  foutenbak: Record<string, number>
  soort: Rondesoort
  opTerug: () => void
  opKlaar: (gegevens: Gegeven[]) => void
}

export default function Proeftoets({ onderwerpen, foutenbak, soort, opTerug, opKlaar }: Props) {
  // Eén keer trekken bij het openen: niet bij elke hertekening opnieuw.
  const [opgaven] = useState(() => maakToets(onderwerpen, foutenbak, soort))
  const [nummer, setNummer] = useState(0)
  const [invoer, setInvoer] = useState('')
  const [gegevens, setGegevens] = useState<Gegeven[]>([])
  const [melding, setMelding] = useState<string | null>(null)

  const opgave: Opgave | undefined = opgaven[nummer]
  const letters = useMemo(() => (opgave ? nodigeLetters(opgave) : []), [opgave])

  if (!opgave) return null

  const extra: string[] = opgave.soort === 'oplossingen' ? ['=', '∨'] : []

  function verstuur(waarde: string) {
    if (!opgave) return
    const uitslag = kijkNa(waarde, opgave)
    if (!uitslag.goed && (uitslag.soort === 'leeg' || uitslag.soort === 'onleesbaar')) {
      setMelding(
        uitslag.soort === 'leeg'
          ? 'Vul een antwoord in — bij de echte toets telt een leeg vakje ook als fout.'
          : 'Dat kan ik niet lezen. Gebruik · voor keer, / voor delen en ^ voor een macht.',
      )
      return
    }

    const nieuw = [...gegevens, { opgave, ingevuld: waarde, goed: uitslag.goed }]
    setGegevens(nieuw)
    setInvoer('')
    setMelding(null)

    if (nummer + 1 >= opgaven.length) opKlaar(nieuw)
    else setNummer(nummer + 1)
  }

  const gedaan = Math.round((nummer / opgaven.length) * 100)

  return (
    <div className="scherm">
      <div className="kop">
        <button className="terug" onClick={opTerug}>
          ✕
        </button>
        <div className="balkje">
          <div style={{ width: `${gedaan}%` }} />
        </div>
        <span className="pil">
          {nummer + 1}/{opgaven.length}
        </span>
      </div>

      <div className="vraagvak">
        <div className="opdracht">
          <span className="codetag">{opgave.code}</span> {opgave.opdracht}
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
              <button key={keuze} className="keuze" onClick={() => verstuur(keuze)}>
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
          <button className="groot" onClick={() => verstuur(invoer)}>
            {nummer + 1 === opgaven.length ? 'Inleveren' : 'Volgende'}
          </button>
        </>
      )}
    </div>
  )
}

/** Het nabesprekingsscherm: wat ging er mis, en waarom. */
export function Nabespreking({
  gegevens,
  soort,
  opTerug,
  opNogEen,
}: {
  gegevens: Gegeven[]
  soort: Rondesoort
  opTerug: () => void
  opNogEen: (soort: Rondesoort) => void
}) {
  const goed = gegevens.filter((g) => g.goed).length
  const fout = gegevens.filter((g) => !g.goed)
  const andere: Rondesoort = soort === 'meerkeuze' ? 'open' : 'meerkeuze'

  return (
    <div className="scherm">
      <div className="kop">
        <button className="terug" onClick={opTerug}>
          ← pad
        </button>
      </div>

      <div style={{ textAlign: 'center', padding: '10px 0 18px' }}>
        <div className="groot-cijfer">{cijfer(gegevens)}</div>
        <h2 style={{ margin: '4px 0 0' }}>
          {goed} van de {gegevens.length} goed
        </h2>
        <p style={{ color: 'var(--zacht)', marginTop: 6 }}>
          {soort === 'meerkeuze' ? 'Meerkeuze' : 'Zelf invullen'} ·{' '}
          {fout.length === 0
            ? 'foutloos, en dit is precies de verdeling van de echte toets'
            : 'hieronder staat elke fout met de uitwerking erbij'}
        </p>
        {soort === 'meerkeuze' && (
          <p style={{ color: 'var(--zacht)', marginTop: 6, fontSize: 14 }}>
            Let op: dinsdag krijg je geen knoppen. Doe hem ook een keer zelf invullen.
          </p>
        )}
      </div>

      {fout.map((g, i) => (
        <div className="uitlegkaart" key={i}>
          <h3>
            <span className="codetag">{g.opgave.code}</span> {g.opgave.opdracht}
          </h3>
          <div className="voorbeeld">{g.opgave.vraag}</div>
          <p style={{ marginTop: 10 }}>
            Jij schreef <b style={{ color: 'var(--fout)' }}>{g.ingevuld || '(niets)'}</b>, het antwoord is{' '}
            <b style={{ color: 'var(--goed)' }}>{g.opgave.antwoord}</b>.
          </p>
          {g.opgave.stappen.map((stap, k) => (
            <div className="stap" key={k}>
              <div className="nr">{k + 1}</div>
              <div>
                <div className="doe">{stap.doe}</div>
                <div className="werd">{stap.werd}</div>
              </div>
            </div>
          ))}
          <div className="tip">{g.opgave.tip}</div>
        </div>
      ))}

      <button className="groot" onClick={() => opNogEen(soort)}>
        Nog een proeftoets
      </button>
      <button className="groot rustig" onClick={() => opNogEen(andere)}>
        {andere === 'open' ? '⌨️ Nu zelf invullen' : '🔘 Nu als meerkeuze'}
      </button>
      <button className="groot rustig" onClick={opTerug}>
        Terug naar het pad
      </button>
    </div>
  )
}
