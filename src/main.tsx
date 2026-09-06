import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './ui/thema.css'

createRoot(document.getElementById('wortel')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
