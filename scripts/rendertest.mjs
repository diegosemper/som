/**
 * Tekent de app één keer met react-dom/server en kijkt of er iets op het
 * scherm komt. Types nakijken vangt geen lege pagina; dit wel.
 */

import { build } from 'esbuild'
import { rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HIER = dirname(fileURLToPath(import.meta.url))
// Binnen het project schrijven, anders vindt node de react-pakketten niet.
const uit = join(HIER, '..', 'node_modules', '.som-rendertest.mjs')

try {
  await build({
    entryPoints: [join(HIER, 'rendertest-entry.tsx')],
    outfile: uit,
    bundle: true,
    format: 'esm',
    platform: 'node',
    jsx: 'automatic',
    logLevel: 'error',
    // React zelf blijft een gewone import; alleen onze eigen code wordt gebundeld.
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/server'],
  })
  await import(pathToFileURL(uit).href)
} finally {
  rmSync(uit, { force: true })
}
