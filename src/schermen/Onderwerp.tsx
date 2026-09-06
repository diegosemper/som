import type { Onderwerp as OnderwerpType, Rondesoort } from '../stof/types.ts'
import { sleutelVoor, type Voortgang } from '../opslag/voortgang.ts'
import { RONDE_LENGTE } from '../engine/ronde.ts'
import { gastVoor } from '../stof/gasten.ts'
import Sterren from '../ui/Sterren.tsx'

type Props = {
  onderwerp: OnderwerpType
  voortgang: Voortgang
  opLes: () => void
  opRonde: (soort: Rondesoort) => void
  opTerug: () => void
}

/**
 * Het tussenscherm van een onderwerp: hier kies je hóe je oefent.
 *
 * Meerkeuze en zelf intikken zijn twee losse rondes met eigen sterren. Bij het
 * ene onderwerp helpt kiezen (je herkent het goede antwoord), bij het andere
 * moet je het echt zelf kunnen opschrijven. Dat verschilt per persoon, dus dat
 * is geen keuze die de app voor je hoort te maken.
 */
export default function Onderwerp({ onderwerp, voortgang, opLes, opRonde, opTerug }: Props) {
  const gast = gastVoor(onderwerp.hoofdstuk)
  const sterrenVan = (soort: Rondesoort) => voortgang.sterren[sleutelVoor(onderwerp.code, soort)] ?? 0

  return (
    <div className="scherm">
      <div className="kop">
        <button className="terug" onClick={opTerug}>
          ← pad
        </button>
        <span className="rek" />
        <span className="pil">{onderwerp.code}</span>
      </div>

      <div className="onderwerpkop">
        <span className="gastemoji">{gast.emoji}</span>
        <h2>{onderwerp.titel}</h2>
        <p>{onderwerp.waarover}</p>
      </div>

      <button className="groot rustig" onClick={opLes}>
        📖 Uitleg van {gast.naam}
      </button>

      <div className="hoofdstuk" style={{ marginTop: 22 }}>
        Oefenen — kies je vorm
      </div>

      <button className="keuzekaart" onClick={() => opRonde('meerkeuze')}>
        <span className="keuzeicoon">🔘</span>
        <span className="keuzetekst">
          <b>Meerkeuze</b>
          <span>{RONDE_LENGTE} vragen · je kiest uit knoppen</span>
        </span>
        <Sterren aantal={sterrenVan('meerkeuze')} />
      </button>

      <button className="keuzekaart" onClick={() => opRonde('open')}>
        <span className="keuzeicoon">⌨️</span>
        <span className="keuzetekst">
          <b>Zelf invullen</b>
          <span>{RONDE_LENGTE} vragen · zoals op de toets</span>
        </span>
        <Sterren aantal={sterrenVan('open')} />
      </button>

      <div className="voet">
        Allebei tellen ze mee. Op het pad staat de hoogste van de twee.
      </div>
    </div>
  )
}
