/** Entree voor de rendertest; wordt door scripts/rendertest.mjs gebundeld. */

import { renderToString } from 'react-dom/server'
import App from '../src/App.tsx'
import Les from '../src/schermen/Les.tsx'
import Onderwerpscherm from '../src/schermen/Onderwerp.tsx'
import { ONDERWERPEN } from '../src/stof/index.ts'
import { lees } from '../src/opslag/voortgang.ts'

const html = renderToString(<App />)

// Het lesje en het keuzescherm van elk onderwerp moeten ook tekenen.
const lesFouten: string[] = []
const voortgang = lees()
for (const onderwerp of ONDERWERPEN) {
  try {
    const les = renderToString(
      <Les onderwerp={onderwerp} opStart={() => {}} opTerug={() => {}} />,
    )
    if (les.length < 200) lesFouten.push(`${onderwerp.code}: lesje tekent bijna niets`)

    const keuze = renderToString(
      <Onderwerpscherm
        onderwerp={onderwerp}
        voortgang={voortgang}
        opLes={() => {}}
        opRonde={() => {}}
        opTerug={() => {}}
      />,
    )
    if (!keuze.includes('Meerkeuze') || !keuze.includes('Zelf invullen')) {
      lesFouten.push(`${onderwerp.code}: keuzescherm mist een van de twee vormen`)
    }
  } catch (fout) {
    lesFouten.push(`${onderwerp.code}: ${(fout as Error).message}`)
  }
}

const eisen: [string, boolean][] = [
  ['de titel SOM staat op het scherm', html.includes('SOM')],
  ['het eerste onderwerp is zichtbaar', html.includes('Rekenvolgorde')],
  ['de proeftoetsknop staat er', html.includes('Proeftoets')],
  // Let op: bij server-rendering zet React losse tekstknopen uit elkaar, dus
  // "Hoofdstuk 1" staat niet aaneengesloten in de HTML.
  ['er staan hoofdstukken', html.includes('Hoofdstuk')],
  ['de hoofdstuknamen staan erbij', html.includes('Kansen') && html.includes('Lijnen')],
  ['er is echt inhoud', html.length > 2000],
  ['de rang staat op het pad', html.includes('xp')],
  ['alle lesjes tekenen', lesFouten.length === 0],
]

if (lesFouten.length > 0) {
  for (const fout of lesFouten) console.error('  ! ' + fout)
}

const mislukt = eisen.filter(([, klopt]) => !klopt)
if (mislukt.length > 0) {
  console.error('\nRendertest mislukt:\n')
  for (const [wat] of mislukt) console.error('  - ' + wat)
  process.exit(1)
}

console.log(`Rendertest in orde: het pad tekent ${html.length} tekens HTML.`)
