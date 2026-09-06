import type { Onderwerp } from '../stof/types.ts'

type Props = {
  onderwerp: Onderwerp
  opStart: () => void
  opTerug: () => void
}

export default function Uitleg({ onderwerp, opStart, opTerug }: Props) {
  return (
    <div className="scherm">
      <div className="kop">
        <button className="terug" onClick={opTerug}>
          ← terug
        </button>
      </div>

      <div className="hoofdstuk">Opgave {onderwerp.code}</div>
      <h2 style={{ margin: '0 0 16px', fontSize: 26 }}>{onderwerp.titel}</h2>

      {onderwerp.uitleg.map((kaart, i) => (
        <div className="uitlegkaart" key={i}>
          <h3>{kaart.kop}</h3>
          <p>{kaart.tekst}</p>
          {kaart.voorbeeld && <div className="voorbeeld">{kaart.voorbeeld}</div>}
        </div>
      ))}

      <button className="groot" onClick={opStart}>
        Beginnen — 8 sommen
      </button>
    </div>
  )
}
