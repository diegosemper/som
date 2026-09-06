/** Entree voor de rendertest; wordt door scripts/rendertest.mjs gebundeld. */

import { renderToString } from 'react-dom/server'
import App from '../src/App.tsx'

const html = renderToString(<App />)

const eisen: [string, boolean][] = [
  ['de titel SOM staat op het scherm', html.includes('SOM')],
  ['het eerste onderwerp is zichtbaar', html.includes('Rekenvolgorde')],
  ['de proeftoetsknop staat er', html.includes('Proeftoets')],
  // Let op: bij server-rendering zet React losse tekstknopen uit elkaar, dus
  // "Hoofdstuk 1" staat niet aaneengesloten in de HTML.
  ['er staan hoofdstukken', html.includes('Hoofdstuk')],
  ['de hoofdstuknamen staan erbij', html.includes('Kansen') && html.includes('Lijnen')],
  ['er is echt inhoud', html.length > 2000],
]

const mislukt = eisen.filter(([, klopt]) => !klopt)
if (mislukt.length > 0) {
  console.error('\nRendertest mislukt:\n')
  for (const [wat] of mislukt) console.error('  - ' + wat)
  process.exit(1)
}

console.log(`Rendertest in orde: het pad tekent ${html.length} tekens HTML.`)
