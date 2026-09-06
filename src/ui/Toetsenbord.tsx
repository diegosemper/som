/**
 * Eigen toetsenbord. Op een telefoon staat het systeemtoetsenbord altijd in de
 * weg en heeft het geen ^, √ of ·. Dit bord toont alleen de letters die in de
 * vraag voorkomen, dus je hoeft nooit te zoeken.
 */

type Props = {
  letters: string[]
  extra: string[]
  waarde: string
  zet: (nieuw: string) => void
}

export default function Toetsenbord({ letters, extra, waarde, zet }: Props) {
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
      {(letters.length > 0 || extra.length > 0) && (
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
