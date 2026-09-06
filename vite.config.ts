import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Het stempel van deze bouw. Zit in de code én in versie.json. */
const STEMPEL = Date.now().toString(36)

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'versiebestand',
      generateBundle(_opties, bundel) {
        if (bundel['versie.json']) return
        this.emitFile({
          type: 'asset',
          fileName: 'versie.json',
          source: JSON.stringify({ build: STEMPEL }),
        })
      },
    },
  ],
  define: { __BUILD__: JSON.stringify(STEMPEL) },
  // Relatieve paden, zodat de app zowel op localhost als op
  // https://<naam>.github.io/<repo>/ werkt zonder aanpassing.
  base: './',
  server: { port: 5175 },
})
