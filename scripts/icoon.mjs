/**
 * Tekent het app-icoon: een amber vlak met een deelteken erin.
 *
 * Handmatig een PNG schrijven scheelt een beeldbewerker in de gereedschapskist,
 * en het icoon verandert toch nooit meer. Draai dit alleen als je het ontwerp
 * aanpast: `node scripts/icoon.mjs`.
 */

import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HIER = dirname(fileURLToPath(import.meta.url))
const PUBLIEK = join(HIER, '..', 'public')

const ACHTER = [0x10, 0x13, 0x1b, 0xff]
const AMBER = [0xff, 0xb0, 0x20, 0xff]

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const lengte = Buffer.alloc(4)
  lengte.writeUInt32BE(data.length)
  const lijf = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(lijf))
  return Buffer.concat([lengte, lijf, crc])
}

/** Amber vierkant, donker deelteken: streep met een stip erboven en eronder. */
function tekenen(n) {
  const pixels = Buffer.alloc(n * n * 4)
  const mid = n / 2
  const streepBreed = n * 0.46
  const streepHoog = Math.max(2, n * 0.075)
  const stipStraal = n * 0.072
  const stipAfstand = n * 0.17

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let kleur = AMBER

      const inStreep =
        Math.abs(x - mid) <= streepBreed / 2 && Math.abs(y - mid) <= streepHoog / 2
      const inStipBoven = Math.hypot(x - mid, y - (mid - stipAfstand)) <= stipStraal
      const inStipOnder = Math.hypot(x - mid, y - (mid + stipAfstand)) <= stipStraal
      if (inStreep || inStipBoven || inStipOnder) kleur = ACHTER

      const p = (y * n + x) * 4
      pixels[p] = kleur[0]
      pixels[p + 1] = kleur[1]
      pixels[p + 2] = kleur[2]
      pixels[p + 3] = kleur[3]
    }
  }

  // Elke rij krijgt een filterbyte 0 ervoor.
  const rijen = Buffer.alloc(n * (n * 4 + 1))
  for (let y = 0; y < n; y++) {
    rijen[y * (n * 4 + 1)] = 0
    pixels.copy(rijen, y * (n * 4 + 1) + 1, y * n * 4, (y + 1) * n * 4)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(n, 0)
  ihdr.writeUInt32BE(n, 4)
  ihdr[8] = 8 // bits per kanaal
  ihdr[9] = 6 // RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(rijen, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync(PUBLIEK, { recursive: true })
for (const maat of [180, 192, 512]) {
  writeFileSync(join(PUBLIEK, `icoon-${maat}.png`), tekenen(maat))
}
console.log('Iconen geschreven naar public/.')
