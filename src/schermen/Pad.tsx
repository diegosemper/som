import type { Onderwerp, Rondesoort } from '../stof/types.ts'
import { sterrenVoor, type Voortgang } from '../opslag/voortgang.ts'
import { hoofdstukken, ONDERWERPEN } from '../stof/index.ts'
import { totaalSterren, volgendeStap } from '../engine/pad.ts'
import { rangVoor } from '../ui/praat.ts'
import Sterren from '../ui/Sterren.tsx'

type Props = {
  voortgang: Voortgang
  opKies: (onderwerp: Onderwerp) => void
  opProeftoets: (soort: Rondesoort) => void
}

export default function Pad({ voortgang, opKies, opProeftoets }: Props) {
  const groepen = hoofdstukken()
  const nu = volgendeStap(ONDERWERPEN, voortgang)
  const totaal = totaalSterren(ONDERWERPEN, voortgang)
  const rang = rangVoor(voortgang.xp)

  return (
    <div className="scherm">
      <div className="kop">
        <h1>SOM</h1>
        <span className="rek" />
        <span className="pil vuur">🔥 {voortgang.streak}</span>
        <span className="pil">
          ★ {totaal.gehaald}/{totaal.mogelijk}
        </span>
      </div>

      <div className="rang">
        {voortgang.xp} xp · <b>{rang.naam}</b>
        {rang.volgende !== null && ` · nog ${rang.volgende - voortgang.xp} tot de volgende rang`}
      </div>

      {groepen.map((groep) => (
        <div key={groep.nummer}>
          <div className="hoofdstuk">
            Hoofdstuk {groep.nummer} — {groep.naam}
          </div>
          {groep.onderwerpen.map((o) => {
            const sterren = sterrenVoor(voortgang, o.code)
            const klassen = ['tegel', sterren > 0 ? 'af' : '', nu?.code === o.code ? 'nu' : '']
              .filter(Boolean)
              .join(' ')
            return (
              <button key={o.code} className={klassen} onClick={() => opKies(o)}>
                <span className="code">{o.code}</span>
                <span>
                  <div className="titel">{o.titel}</div>
                  <div className="onder">{o.waarover}</div>
                </span>
                <Sterren aantal={sterren} />
              </button>
            )
          })}
        </div>
      ))}

      <div className="hoofdstuk" style={{ marginTop: 22 }}>
        Proeftoets — 20 sommen, geen hartjes
      </div>

      <button className="keuzekaart" onClick={() => opProeftoets('meerkeuze')}>
        <span className="keuzeicoon">🔘</span>
        <span className="keuzetekst">
          <b>Meerkeuze</b>
          <span>alle hoofdstukken door elkaar, met knoppen</span>
        </span>
      </button>

      <button className="keuzekaart" onClick={() => opProeftoets('open')}>
        <span className="keuzeicoon">⌨️</span>
        <span className="keuzetekst">
          <b>Zelf invullen</b>
          <span>zoals de echte toets — dit is de eerlijke test</span>
        </span>
      </button>

      <div className="voet">
        Stof: Startvaardigheden Wiskunde HBO-ICT · codes zoals in de oefentool
      </div>
    </div>
  )
}
