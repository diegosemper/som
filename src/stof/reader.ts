/**
 * De opgaven uit de syllabus, met de officiële antwoorden van blz. 67-70.
 *
 * Dit is de scherpste test die we hebben: als de rekenaar het niet eens is met
 * het antwoordenblad van de reader, dan klopt de rekenaar niet. `npm run
 * controleer` draait deze lijst en breekt de bouw als er één niet uitkomt.
 *
 * Wortels met een graad staan hier in machtsvorm (⁴√16 als 16^(1/4)), want dat
 * is wat de rekenaar leest. De wiskunde blijft dezelfde.
 */

export type Readeropgave = { waar: string; som: string; antwoord: string }

export const READEROPGAVEN: Readeropgave[] = [
  // Opdracht 1.1 — rekenvolgorde
  { waar: '1.1a', som: '5 + 3 · 2', antwoord: '11' },
  { waar: '1.1b', som: '8 · 4 + 5', antwoord: '37' },
  { waar: '1.1c', som: '(3 − 2) · 4', antwoord: '4' },
  { waar: '1.1d', som: '12 + 24 / 3 · 2', antwoord: '28' },
  { waar: '1.1e', som: '5 · 2 + 6 / 3', antwoord: '12' },
  { waar: '1.1f', som: '5 · 10 + 2 / 2', antwoord: '51' },
  { waar: '1.1g', som: '12 − 15 / 3', antwoord: '7' },
  { waar: '1.1h', som: '8 + (2 + 3) − 5', antwoord: '8' },
  { waar: '1.1i', som: '5 − (2 + 3) · 5', antwoord: '−20' },
  { waar: '1.1j', som: '25 − 5 · 4', antwoord: '5' },

  // Opdracht 1.2 — negatieve getallen
  { waar: '1.2a', som: '−5 − 8', antwoord: '−13' },
  { waar: '1.2b', som: '−5 − −7', antwoord: '2' },
  { waar: '1.2c', som: '−24 / −6', antwoord: '4' },
  { waar: '1.2d', som: '8 − −4', antwoord: '12' },
  { waar: '1.2e', som: '12 / −3', antwoord: '−4' },
  { waar: '1.2f', som: '28 / 4', antwoord: '7' },
  { waar: '1.2g', som: '5 · −2', antwoord: '−10' },
  { waar: '1.2h', som: '−6 − −5', antwoord: '−1' },
  { waar: '1.2i', som: '−3 · −12', antwoord: '36' },
  { waar: '1.2j', som: '−8 · −3', antwoord: '24' },
  { waar: '1.2k', som: '−5 · −5', antwoord: '25' },
  { waar: '1.2l', som: '−18 + 5', antwoord: '−13' },
  { waar: '1.2m', som: '−7 + −3', antwoord: '−10' },
  { waar: '1.2n', som: '−15 / 3', antwoord: '−5' },
  { waar: '1.2o', som: '−22 − −12', antwoord: '−10' },

  // Opdracht 1.3.2 — machten en wortels
  { waar: '1.3.2a', som: '3²', antwoord: '9' },
  { waar: '1.3.2b', som: '5²', antwoord: '25' },
  { waar: '1.3.2c', som: '8²', antwoord: '64' },
  { waar: '1.3.2d', som: '1⁵', antwoord: '1' },
  { waar: '1.3.2e', som: '1^1167', antwoord: '1' },
  { waar: '1.3.2f', som: '512⁰', antwoord: '1' },
  { waar: '1.3.2g', som: '√25', antwoord: '5' },
  { waar: '1.3.2h', som: '√16', antwoord: '4' },
  { waar: '1.3.2i', som: '16^(1/4)', antwoord: '2' },
  { waar: '1.3.2j', som: '√(3²)', antwoord: '3' },
  { waar: '1.3.2k', som: '(√4)²', antwoord: '4' },
  { waar: '1.3.2l', som: '√64', antwoord: '8' },

  // Opdracht 2.1 — invullen
  { waar: '2.1a', som: '(2)³ − 6(2)² + 4(2)', antwoord: '−8' },
  { waar: '2.1b', som: '((5)²(−2)² − 5(−2)²) / (−4 · (−2))', antwoord: '10' },

  // Opdracht 2.2 — herleiden
  { waar: '2.2a', som: 'b + b + b + c + c', antwoord: '3b + 2c' },
  { waar: '2.2b', som: '2b + 3b', antwoord: '5b' },
  { waar: '2.2d', som: '3a − 4b + 2a', antwoord: '5a − 4b' },
  { waar: '2.2e', som: '3x² + 2x²', antwoord: '5x²' },
  { waar: '2.2f', som: 'x² − 2x + 3x²', antwoord: '4x² − 2x' },
  { waar: '2.2g', som: '−4f + 5f · 2g', antwoord: '−4f + 10fg' },
  { waar: '2.2h', som: 'ab + 2a · 4b', antwoord: '9ab' },
  { waar: '2.2i', som: '10y + 3y − 5', antwoord: '13y − 5' },
  { waar: '2.2j', som: '2x · 5y + 7x²y', antwoord: '10xy + 7x²y' },
  { waar: '2.2l', som: '4b² + 8b² − 4b', antwoord: '12b² − 4b' },
  { waar: '2.2m', som: '6y² − 2y² + x²', antwoord: '4y² + x²' },

  // Opdracht 2.3.1
  { waar: '2.3.1a', som: '2x · 3x', antwoord: '6x²' },
  { waar: '2.3.1b', som: '2x² + x · 3x', antwoord: '5x²' },

  // Opdracht 2.3.2 — schrijf als macht van 3
  { waar: '2.3.2a', som: '3² · 3³', antwoord: '3⁵' },
  { waar: '2.3.2b', som: '3 · 3⁴', antwoord: '3⁵' },
  { waar: '2.3.2c', som: '3³ · 3⁻²', antwoord: '3' },
  { waar: '2.3.2d', som: '3⁵ / 3²', antwoord: '3³' },
  { waar: '2.3.2e', som: '3⁻⁵ / 3³', antwoord: '3⁻⁸' },
  { waar: '2.3.2f', som: '3⁻² / 3⁻²', antwoord: '3⁰' },
  { waar: '2.3.2g', som: '1/3', antwoord: '3⁻¹' },
  { waar: '2.3.2h', som: '3 / 3²', antwoord: '3⁻¹' },
  { waar: '2.3.2i', som: '3⁵ / 3³', antwoord: '3²' },
  { waar: '2.3.2j', som: '(3)²', antwoord: '3²' },
  { waar: '2.3.2k', som: '(−3²)³', antwoord: '−3⁶' },
  { waar: '2.3.2l', som: '(3⁻²)³', antwoord: '3⁻⁶' },
  { waar: '2.3.2m', som: '27²', antwoord: '3⁶' },
  { waar: '2.3.2n', som: '(1/9)²', antwoord: '3⁻⁴' },
  { waar: '2.3.2o', som: '3² / 81', antwoord: '3⁻²' },

  // Opdracht 2.3.3 — zo simpel mogelijk
  { waar: '2.3.3a', som: '(2x)²', antwoord: '4x²' },
  { waar: '2.3.3b', som: '(1/y)²', antwoord: 'y⁻²' },
  { waar: '2.3.3c', som: '(x/y)²', antwoord: 'x²y⁻²' },
  { waar: '2.3.3d', som: '(2x²)⁻⁴', antwoord: '2⁻⁴x⁻⁸' },
  { waar: '2.3.3e', som: 'b² / b⁴', antwoord: 'b⁻²' },
  { waar: '2.3.3f', som: '2x² · 3x³', antwoord: '6x⁵' },
  { waar: '2.3.3g', som: '6x² / 3x', antwoord: '2x' },
  { waar: '2.3.3h', som: '(t⁻²)³', antwoord: 't⁻⁶' },
  { waar: '2.3.3i', som: 'a / b²', antwoord: 'ab⁻²' },

  // Opdracht 4.1.1 — één paar haakjes
  { waar: '4.1.1a', som: '2(3x + 5)', antwoord: '6x + 10' },
  { waar: '4.1.1b', som: '−3(3x + 6)', antwoord: '−9x − 18' },
  { waar: '4.1.1c', som: '−4(2x − 7)', antwoord: '−8x + 28' },
  { waar: '4.1.1d', som: '2(4x − 8)', antwoord: '8x − 16' },
  { waar: '4.1.1e', som: '−4(2x − 9)', antwoord: '−8x + 36' },
  { waar: '4.1.1f', som: '−8(3x + 5)', antwoord: '−24x − 40' },

  // Opdracht 4.1.3 — haakjes met letters ervoor
  { waar: '4.1.3a', som: '2x(3x + 5)', antwoord: '6x² + 10x' },
  { waar: '4.1.3b', som: '4a(5a² + 6a)', antwoord: '20a³ + 24a²' },
  { waar: '4.1.3c', som: '−3c(−8c + 3)', antwoord: '24c² − 9c' },
  { waar: '4.1.3d', som: '−8m(3m + 5n)', antwoord: '−24m² − 40mn' },
  { waar: '4.1.3e', som: '−2p(−3p − 5p)', antwoord: '16p²' },
  { waar: '4.1.3f', som: '3x³(−5x² + 8x)', antwoord: '−15x⁵ + 24x⁴' },

  // Opdracht 4.2 — dubbele haakjes (voorbeeld uit de tekst)
  { waar: '4.2', som: '(x + 3)(x − 2)', antwoord: 'x² + x − 6' },

  // Opdracht 4.3 — ontbinden in factoren
  { waar: '4.3a', som: '63u + 18', antwoord: '9(7u + 2)' },
  { waar: '4.3b', som: 'q² − 32q', antwoord: 'q(q − 32)' },
  { waar: '4.3c', som: '12ab + 4b²', antwoord: '4b(3a + b)' },
  { waar: '4.3d', som: 'a² + a⁴', antwoord: 'a²(a² + 1)' },
]
