/**
 * Eigen toetsenbord. Op een telefoon staat het systeemtoetsenbord altijd in de
 * weg en heeft het geen ^, √ of ·.
 *
 * Bovenaan staan de letters die je voor dít antwoord nodig hebt, zodat je niet
 * hoeft te zoeken. Met de abc-knop klapt het hele alfabet uit — want de app mag
 * je nooit tegenhouden omdat een letter toevallig niet in het lijstje stond.
 */

import { useState } from 'react'

type Props = {
  letters: string[]
  extra: string[]
  waarde: string
  zet: (nieuw: string) => void
}

const ALFABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

export default function Toetsenbord({ letters, extra, waarde, zet }: Props) {
  const [alfabetOpen, setAlfabetOpen] = useState(false)

  const tik = (teken: string) => zet(waarde + teken)
  const wis = () => zet(waarde.slice(0, -1))

  const rijen: string[][] = [
    ['1', '2', '3', '4', '5'],
    ['6', '7', '8', '9', '0'],
    ['−', '+', '·', '/', '^'],
    ['(', ')', '√', ',', '⌫'],
  ]

  return (
    <div className="toetsen">
      <div className="rij">
        {letters.map((l) => (
          <button key={l} className="toets zacht" onClick={() => tik(l)}>
            {l}
          </button>
        ))}
        {extra.map((e) => (
          <button key={e} className="toets zacht" onClick={() => tik(e)}>
            {e}
          </button>
        ))}
        <button
          className={'toets abc' + (alfabetOpen ? ' aan' : '')}
          onClick={() => setAlfabetOpen(!alfabetOpen)}
          aria-label="alle letters"
        >
          abc
        </button>
      </div>

      {alfabetOpen && (
        <div className="alfabet">
          {ALFABET.map((l) => (
            <button key={l} className="toets" onClick={() => tik(l)}>
              {l}
            </button>
          ))}
        </div>
      )}

      {rijen.map((rij, i) => (
        <div className="rij" key={i}>
          {rij.map((teken) =>
            teken === '⌫' ? (
              <button key={teken} className="toets wis" onClick={wis} aria-label="wissen">
                ⌫
              </button>
            ) : (
              <button key={teken} className="toets" onClick={() => tik(teken)}>
                {teken}
              </button>
            ),
          )}
        </div>
      ))}
    </div>
  )
}
