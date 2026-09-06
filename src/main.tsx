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
