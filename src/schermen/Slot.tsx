import type { Onderwerp } from '../stof/types.ts'

type Props = {
  onderwerp: Onderwerp
  gewonnen: boolean
  fouten: number
  sterren: number
  opNogEen: () => void
  opTerug: () => void
}

export default function Slot({ onderwerp, gewonnen, fouten, sterren, opNogEen, opTerug }: Props) {
  return (
    <div className="scherm">
      <div className="slot">
        <div className="groot-cijfer">{gewonnen ? (fouten === 0 ? '🎯' : '✅') : '💔'}</div>
        <h2>{gewonnen ? (fouten === 0 ? 'Foutloos!' : 'Ronde gehaald') : 'Hartjes op'}</h2>
        <p>
          {gewonnen
            ? fouten === 0
              ? `${onderwerp.titel} zit erin — twaalf op twaalf. Doe hem nog eens foutloos voor de derde ster.`
              : `${fouten === 1 ? 'Eén fout' : `${fouten} fouten`} onderweg. Foutloos geeft twee sterren.`
            : `Deze ging niet. Loop het lesje nog eens door en probeer opnieuw — je verliest niets.`}
        </p>

        {gewonnen && (
          <div className="slotsterren">
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < sterren ? '' : 'leeg'}>
                ★
              </span>
            ))}
          </div>
        )}
      </div>

      <button className="groot" onClick={opNogEen}>
        {gewonnen ? 'Nog een ronde' : 'Opnieuw proberen'}
      </button>
      <button className="groot rustig" onClick={opTerug}>
        Terug naar het pad
      </button>
    </div>
  )
}
