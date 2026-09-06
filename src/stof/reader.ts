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

  // Opdracht 5.1 — breuken vereenvoudigen
  { waar: '5.1a', som: '5/15', antwoord: '1/3' },
  { waar: '5.1b', som: '10/30', antwoord: '1/3' },
  { waar: '5.1c', som: '24/48', antwoord: '1/2' },
  { waar: '5.1d', som: '3/12', antwoord: '1/4' },
  { waar: '5.1e', som: '24/32', antwoord: '3/4' },
  { waar: '5.1f', som: '21/49', antwoord: '3/7' },

  // Opdracht 5.2 — optellen en aftrekken
  { waar: '5.2a', som: '3/8 + 5/8', antwoord: '1' },
  { waar: '5.2b', som: '1/2 + 1/4', antwoord: '3/4' },
  { waar: '5.2c', som: '2/3 − 1/6', antwoord: '1/2' },
  { waar: '5.2d', som: '1/4 + 2/5', antwoord: '13/20' },
  { waar: '5.2e', som: '3/8 + 1/7', antwoord: '29/56' },
  { waar: '5.2f', som: '5/6 − 5/8', antwoord: '5/24' },

  // Opdracht 5.3.1 — helen eruit halen
  { waar: '5.3.1a', som: '15/5', antwoord: '3' },
  { waar: '5.3.1b', som: '30/13', antwoord: '2 4/13' },
  { waar: '5.3.1c', som: '43/9', antwoord: '4 7/9' },
  { waar: '5.3.1d', som: '12/7', antwoord: '1 5/7' },
  { waar: '5.3.1e', som: '24/18', antwoord: '1 1/3' },
  { waar: '5.3.1f', som: '49/21', antwoord: '2 1/3' },

  // Opdracht 5.3.2 — als één breuk
  { waar: '5.3.2a', som: '1 3/5', antwoord: '8/5' },
  { waar: '5.3.2b', som: '2 3/8', antwoord: '19/8' },
  { waar: '5.3.2c', som: '1 7/9', antwoord: '16/9' },
  { waar: '5.3.2d', som: '5 2/3', antwoord: '17/3' },
  { waar: '5.3.2e', som: '3 6/11', antwoord: '39/11' },
  { waar: '5.3.2f', som: '4 4/5', antwoord: '24/5' },

  // Opdracht 5.4 — keer en gedeeld
  { waar: '5.4a', som: '5/6 · 2/3', antwoord: '5/9' },
  { waar: '5.4b', som: '2/8 · 3/5', antwoord: '3/20' },
  { waar: '5.4c', som: '3/4 · 7/9', antwoord: '7/12' },
  { waar: '5.4d', som: '2/3 ÷ 1/2', antwoord: '1 1/3' },
  { waar: '5.4e', som: '8/9 ÷ 1/4', antwoord: '3 5/9' },
  { waar: '5.4f', som: '3/4 ÷ 5/7', antwoord: '1 1/20' },
  { waar: '5.4.3', som: '1/3 + 2/5 ÷ 1/2', antwoord: '1 2/15' },

  // Opdracht 6.1 — letterbreuken vereenvoudigen
  { waar: '6.1a', som: 'x² / x³', antwoord: '1/x' },
  { waar: '6.1b', som: '3x² / 9y²', antwoord: 'x²/(3y²)' },
  { waar: '6.1c', som: '2y / 6xy', antwoord: '1/(3x)' },
  { waar: '6.1d', som: '(2x² + 4x) / 8x³', antwoord: '(x + 2)/(4x²)' },
  { waar: '6.1e', som: '(2x²y + 3xy) / 4y²', antwoord: '(2x² + 3x)/(4y)' },
  { waar: '6.1f', som: '(3ab + 6a³b) / 12a²b²', antwoord: '(1 + 2a²)/(4ab)' },

  // Opdracht 6.2 — letterbreuken optellen
  { waar: '6.2a', som: '2/x + 3/4', antwoord: '(3x + 8)/(4x)' },
  { waar: '6.2b', som: '3/x + 4/y', antwoord: '(4x + 3y)/(xy)' },
  { waar: '6.2c', som: '3x/y + 2y/4x', antwoord: '(6x² + y²)/(2xy)' },
  { waar: '6.2d', som: '2/xy + 8x/y²', antwoord: '(8x² + 2y)/(xy²)' },
  { waar: '6.2e', som: '3x/8y + 5/2x', antwoord: '(3x² + 20y)/(8xy)' },
  { waar: '6.2f', som: '5/2x − 3/6y', antwoord: '(5y − x)/(2xy)' },

  // Opdracht 6.3 — letterbreuken keer en gedeeld
  { waar: '6.3a', som: '2x/3y · 3/x', antwoord: '2/y' },
  { waar: '6.3b', som: '5x/y ÷ 3y/x', antwoord: '5x²/(3y²)' },
  { waar: '6.3c', som: '4x²y/5x + 3x/5y', antwoord: '(4xy² + 3x)/(5y)' },
  { waar: '6.3d', som: '3/x ÷ 5/y', antwoord: '3y/(5x)' },
  { waar: '6.3e', som: '2x/y ÷ 3y²/5xy', antwoord: '10x²/(3y²)' },
  { waar: '6.3f', som: '8x/5 ÷ 5y/4x', antwoord: '32x²/(25y)' },
  { waar: '6.3.slot', som: '4r/q + −2r/3q · 1/r', antwoord: '(12r − 2)/(3q)' },

  // Opdracht 7.1 — invullen in een lineaire formule
  { waar: '7.1a', som: '−2(−3) + 5', antwoord: '11' },
  { waar: '7.1b', som: '8(−3) − 3', antwoord: '−27' },

  // Hoofdstuk 8 — voorbeelden uit de tekst
  { waar: '8.1', som: '3(x + 1)(x + 3)', antwoord: '3x² + 12x + 9' },
  { waar: '8.5a', som: '(x + 2)(x + 3)', antwoord: 'x² + 5x + 6' },
  { waar: '8.5b', som: '(x + 5)(x + 3)', antwoord: 'x² + 8x + 15' },
  { waar: '8.5c', som: '2(x − 3)(x + 8)', antwoord: '2x² + 10x − 48' },
  { waar: '8.5d', som: '(x² + 1)(x² + 1)', antwoord: 'x⁴ + 2x² + 1' },
  { waar: '8.6', som: '(x − 8)(x − 8)', antwoord: 'x² − 16x + 64' },
  { waar: '8.7', som: '−1(b − 6)(b + 5)', antwoord: '−b² + b + 30' },
]
