import { useMemo, useState } from 'react'
import type { Onderwerp, Rondesoort } from '../stof/types.ts'
import { bouwLes, type Optie } from '../engine/les.ts'
import { RONDE_LENGTE } from '../engine/ronde.ts'
import { gastVoor } from '../stof/gasten.ts'

type Props = {
  onderwerp: Onderwerp
  opStart: (soort: Rondesoort) => void
  opTerug: () => void
}

export default function Les({ onderwerp, opStart, opTerug }: Props) {
  const beurten = useMemo(() => bouwLes(onderwerp), [onderwerp])
  const gast = gastVoor(onderwerp.hoofdstuk)

  const [nummer, setNummer] = useState(0)
  const [stappenOpen, setStappenOpen] = useState(1)
  const [gekozen, setGekozen] = useState<Optie | null>(null)

  const beurt = beurten[nummer]
  if (!beurt) return null

  const laatste = nummer === beurten.length - 1

  function verder() {
    setNummer(nummer + 1)
    setStappenOpen(1)
    setGekozen(null)
  }

  // Bij een keuzevraag mag je pas door als je gekozen hebt; bij een uitwerking
  // pas als je hem helemaal hebt doorgeklikt.
  const stappenKlaar = beurt.soort !== 'uitwerking' || stappenOpen >= beurt.stappen.length
  const keuzeKlaar = beurt.soort !== 'kies' || gekozen !== null
  const magVerder = stappenKlaar && keuzeKlaar

  return (
    <div className="scherm">
      <div className="kop">
        <button className="terug" onClick={opTerug}>
          ✕
        </button>
        <div className="stipjes">
          {beurten.map((_, i) => (
            <span key={i} className={i <= nummer ? 'stip aan' : 'stip'} />
          ))}
        </div>
        <span className="pil">{onderwerp.code}</span>
      </div>

      <div className="lesvak">
        {beurt.soort === 'praat' && (
          <div className="bubbel">
            <div className="gast">
              <span className="gastemoji">{gast.emoji}</span>
              <span className="gastnaam">{gast.naam}</span>
            </div>
            <p>{beurt.tekst}</p>
          </div>
        )}

        {beurt.soort === 'regel' && (
          <div className="uitlegkaart">
            <h3>{beurt.kop}</h3>
            <p>{beurt.tekst}</p>
            {beurt.voorbeeld && <div className="voorbeeld">{beurt.voorbeeld}</div>}
          </div>
        )}

        {beurt.soort === 'recept' && (
          <div className="recept">
            <div className="lesje-kop">Zo pak je zo'n som aan</div>
            <ol>
              {beurt.stappen.map((stap, i) => (
                <li key={i}>{stap}</li>
              ))}
            </ol>
            <div className="receptvoet">Dit lijstje draai je straks in je hoofd af.</div>
          </div>
        )}

        {beurt.soort === 'uitwerking' && (
          <div>
            <div className="lesje-kop">Zo gaat dat dan</div>
            <div className="opdracht">{beurt.opdracht}</div>
            <div className={beurt.vraag.length > 30 ? 'vraag lang' : 'vraag'}>{beurt.vraag}</div>
            <div style={{ marginTop: 12 }}>
              {beurt.stappen.slice(0, stappenOpen).map((stap, i) => (
                <div className="stap" key={i}>
                  <div className="nr">{i + 1}</div>
                  <div>
                    <div className="doe">{stap.doe}</div>
                    <div className="werd">{stap.werd}</div>
                    {stap.waarom && <div className="waarom">{stap.waarom}</div>}
                  </div>
                </div>
              ))}
            </div>
            {!stappenKlaar && (
              <button className="groot rustig" onClick={() => setStappenOpen(stappenOpen + 1)}>
                En dan? →
              </button>
            )}
            {stappenKlaar && <div className="tip">{beurt.tip}</div>}
          </div>
        )}

        {beurt.soort === 'kies' && (
          <div>
            <div className="lesje-kop">Even checken</div>
            <div className="opdracht">{beurt.opdracht}</div>
            <div className={beurt.vraag.length > 30 ? 'vraag lang' : 'vraag'}>{beurt.vraag}</div>

            <div className="keuzes" style={{ marginTop: 14 }}>
              {beurt.opties.map((optie) => {
                const isGekozen = gekozen?.tekst === optie.tekst
                const kleur = !gekozen ? '' : optie.goed ? ' juist' : isGekozen ? ' mis' : ' flauw'
                return (
                  <button
                    key={optie.tekst}
                    className={'keuze' + kleur}
                    disabled={gekozen !== null}
                    onClick={() => setGekozen(optie)}
                  >
                    {optie.tekst}
                  </button>
                )
              })}
            </div>

            {gekozen && (
              <div className={'reactie' + (gekozen.goed ? ' oke' : '')}>
                <span className="gastemoji klein">{gast.emoji}</span> {gekozen.reactie}
              </div>
            )}
          </div>
        )}
      </div>

      {magVerder && !laatste && (
        <button className="groot" onClick={verder}>
          Verder
        </button>
      )}

      {magVerder && laatste && (
        <>
          <button className="groot groen" onClick={() => opStart('meerkeuze')}>
            🔘 Meerkeuze — {RONDE_LENGTE} vragen
          </button>
          <button className="groot rustig" onClick={() => opStart('open')}>
            ⌨️ Zelf invullen — {RONDE_LENGTE} vragen
          </button>
        </>
      )}
    </div>
  )
}
