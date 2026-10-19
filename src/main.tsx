import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './ui/thema.css'

createRoot(document.getElementById('wortel')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Offline kunnen oefenen. Alleen in de gebouwde app: in dev zou de cache
// alleen maar in de weg zitten.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Geen offline-modus dan; de app werkt verder gewoon.
    })
  })
}

// Staat er online een nieuwere versie dan deze? Dan één keer herladen. Zonder
// dit blijft een open tabblad (of SOM binnen de studieplanning) de oude app
// draaien, met bijvoorbeeld de oude opslagsleutel.
async function controleerVersie() {
  try {
    const antwoord = await fetch('./versie.json', { cache: 'no-store' })
    const { build } = (await antwoord.json()) as { build?: string }
    if (!build || build === __BUILD__) return
    // Hooguit één keer per nieuwe versie, zodat het nooit blijft herladen.
    if (sessionStorage.getItem('som-herladen') === build) return
    sessionStorage.setItem('som-herladen', build)
    location.reload()
  } catch {
    // Offline of geen versie.json: gewoon verder met deze versie.
  }
}

if (import.meta.env.PROD) {
  controleerVersie()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') controleerVersie()
  })
}
