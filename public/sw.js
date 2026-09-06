/**
 * Kleine service worker zodat SOM ook zonder internet werkt.
 *
 * De bestandsnamen van Vite bevatten een hash, dus die mogen uit de cache
 * komen zonder na te denken. Voor de pagina zelf proberen we eerst het net,
 * want anders zie je na een nieuwe versie nog de oude app.
 */

const CACHE = 'som-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (gebeurtenis) => {
  gebeurtenis.waitUntil(
    (async () => {
      const namen = await caches.keys()
      await Promise.all(namen.filter((n) => n !== CACHE).map((n) => caches.delete(n)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (gebeurtenis) => {
  const verzoek = gebeurtenis.request
  if (verzoek.method !== 'GET') return
  if (new URL(verzoek.url).origin !== self.location.origin) return

  // De pagina zelf: eerst het net, anders wat we hebben.
  if (verzoek.mode === 'navigate') {
    gebeurtenis.respondWith(
      (async () => {
        try {
          const vers = await fetch(verzoek)
          const bak = await caches.open(CACHE)
          bak.put(verzoek, vers.clone())
          return vers
        } catch {
          const bewaard = await caches.match(verzoek)
          return bewaard ?? (await caches.match('./index.html')) ?? Response.error()
        }
      })(),
    )
    return
  }

  // Alles met een hash in de naam: uit de cache mag altijd.
  gebeurtenis.respondWith(
    (async () => {
      const bewaard = await caches.match(verzoek)
      if (bewaard) return bewaard
      try {
        const vers = await fetch(verzoek)
        const bak = await caches.open(CACHE)
        bak.put(verzoek, vers.clone())
        return vers
      } catch {
        return Response.error()
      }
    })(),
  )
})
