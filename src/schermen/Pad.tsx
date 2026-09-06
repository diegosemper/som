import type { Onderwerp } from '../stof/types.ts'
import type { Voortgang } from '../opslag/voortgang.ts'
import { hoofdstukken, ONDERWERPEN } from '../stof/index.ts'
import { isOpen, totaalSterren, volgendeStap } from '../engine/pad.ts'
import Sterren from '../ui/Sterren.tsx'

type Props = {
  voortgang: Voortgang
  opKies: (onderwerp: Onderwerp) => void
}

export default function Pad({ voortgang, opKies }: Props) {
  const groepen = hoofdstukken()
  const nu = volgendeStap(ONDERWERPEN, voortgang)
  const totaal = totaalSterren(ONDERWERPEN, voortgang)

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

      {groepen.map((groep) => (
        <div key={groep.nummer}>
          <div className="hoofdstuk">
            Hoofdstuk {groep.nummer} — {groep.naam}
          </div>
          {groep.onderwerpen.map((o) => {
            const open = isOpen(ONDERWERPEN, o.code, voortgang)
            const sterren = voortgang.sterren[o.code] ?? 0
            const klassen = [
              'tegel',
              open ? '' : 'dicht',
              sterren > 0 ? 'af' : '',
              nu?.code === o.code ? 'nu' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <button key={o.code} className={klassen} disabled={!open} onClick={() => opKies(o)}>
                <span className="code">{open ? o.code : '🔒'}</span>
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

      <div className="voet">
        Stof: Startvaardigheden Wiskunde HBO-ICT · codes zoals in de oefentool
      </div>
    </div>
  )
}
