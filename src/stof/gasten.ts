/**
 * De gastheren van het lesje.
 *
 * Ze komen allemaal uit de reader zelf: Handige Harry met zijn rekening van
 * 4000 euro, de nashi-peer (kruising van appel en peer), Jan Modaal, de
 * vogelbekmethode, de pizza's, de weegschaal. Dat is geen versiering — een som
 * die aan een verhaal hangt onthoud je, een som in een grijs kader niet.
 *
 * Alles staat hier bij elkaar en niet in de 35 opgavebestanden, zodat je een
 * grapje kunt bijschrijven zonder aan de wiskunde te komen.
 */

export type Gast = {
  naam: string
  emoji: string
  /** Wat hij zegt als je een lesje afsluit. */
  afscheid: string[]
}

const GASTEN: Record<number, Gast> = {
  1: {
    naam: 'Handige Harry',
    emoji: '🔧',
    afscheid: [
      'Zo. En nu jij, voordat ik je nog een rekening stuur.',
      'Ga maar. Ik zit hier toch alleen maar te wachten op mijn geld.',
    ],
  },
  2: {
    naam: 'Nashi',
    emoji: '🍐',
    afscheid: [
      'Ik ben half appel, half peer. Jij bent nu half wiskundige. Doorgaan.',
      'Genoeg gepraat over fruit. Aan de slag.',
    ],
  },
  3: {
    naam: 'Jan Modaal',
    emoji: '🎲',
    afscheid: [
      'Gemiddeld genomen kun je dit nu. Bewijs het even.',
      'De kans dat dit goed gaat schat ik hoog in. Ga.',
    ],
  },
  4: {
    naam: 'het Vogelbekdier',
    emoji: '🦫',
    afscheid: [
      'Boogje, boogje, klaar. Nu jij.',
      'Vergeet nooit het tweede boogje. Dat is mijn hele levensles.',
    ],
  },
  5: {
    naam: 'Pizza-Piet',
    emoji: '🍕',
    afscheid: [
      'Bestelling onderweg. Jij mag hem snijden.',
      'Gelijke punten, dan pas optellen. Onthoud dat, ik moet weg.',
    ],
  },
  6: {
    naam: 'Pizza-Piet',
    emoji: '🍕',
    afscheid: [
      'Zelfde pizza, nu met letters erop. Succes.',
      'Wegstrepen mag alleen wat overal op ligt. Ga maar oefenen.',
    ],
  },
  7: {
    naam: 'de Weegschaal',
    emoji: '⚖️',
    afscheid: [
      'Links en rechts gelijk houden. Dat is het hele trucje. Ga.',
      'Ik hang weer recht. Nu jij.',
    ],
  },
  8: {
    naam: 'Parabool-Petra',
    emoji: '🛹',
    afscheid: [
      'De halfpipe ligt klaar. Rollen maar.',
      'Twee antwoorden is normaal — een halfpipe heeft twee kanten. Ga.',
    ],
  },
}

export function gastVoor(hoofdstuk: number): Gast {
  return GASTEN[hoofdstuk] ?? GASTEN[1]
}

/**
 * Wat de gastheer zegt als het lesje begint. Eén of twee zinnen: net genoeg om
 * te weten waar het over gaat, kort genoeg om te lezen.
 */
const INTRO: Record<string, string[]> = {
  '1a': [
    'Ik heb ooit een rekening gestuurd van 4000 euro. Voorrijden 60, veertig uur à 40. Ik tikte 60 + 40 · 40 in en telde eerst op.',
    'Het was 1660. Sindsdien reken ik in de goede volgorde. Kijk mee.',
  ],
  '1b': [
    'Machten. 2⁴ is niet 8, hoe graag ik dat ook op mijn factuur zou zetten.',
    'En let op dat minteken. Daar gaan er meer onderuit dan op mijn ladder.',
  ],
  '1c': [
    'Een formule is een recept. Jij levert de getallen, hij levert de uitkomst.',
    'Zet er wel haakjes omheen. Anders krijg je −9 waar 9 moest staan, en dan klopt de hele taart niet.',
  ],
  '5a': [
    'Ik ben een kruising van een appel en een peer. Mij hoef je niets te vertellen over dingen die wel of niet bij elkaar horen.',
    'Appels bij appels. Bananen bij bananen. En nooit door elkaar.',
  ],
  '5b': [
    'Nu met machten erbij. x² en x zijn familie, maar geen tweeling.',
    'Eerst het maalteken, dan pas kijken wat je mag optellen.',
  ],
  '4a': [
    'Machten vermenigvuldigen? Dan tel je ze op. Ja, dat klinkt verkeerd.',
    'Maar a³ · a² is gewoon a·a·a·a·a. Vijf stuks. Tel maar na.',
  ],
  '4b': [
    'Delen is aftrekken. En alles onder de streep mag naar boven — als het een minteken meeneemt.',
    'Zo krijg je elke breuk weg.',
  ],
  '4c': [
    'Alles wordt hier een macht van 3. Een 9? Dat is 3². Een 81? 3⁴.',
    'Zelfs een kale 1 doet mee: dat is 3⁰. Iedereen naar hetzelfde grondtal en dan pas rekenen.',
  ],
  '4d': [
    'Een macht van een macht: die vermenigvuldig je.',
    'En bij (2x)² krijgt die 2 ook een klap. Dat is 4x², niet 2x². Daar struikelt bijna iedereen.',
  ],
  '4e': [
    'Nu alles tegelijk. Breuk weg, haakjes weg, machten optellen.',
    'Drie regels. Meer is het niet, hoe eng het er ook uitziet.',
  ],
  '3a': [
    'Ik ben het gemiddelde. Alles bij elkaar, gedeeld door hoeveel het er zijn.',
    'Maar zet één miljonair in mijn dorp en ik lieg alsof het gedrukt staat.',
  ],
  '3b': [
    'De mediaan. Iedereen op een rij van klein naar groot, en dan pak je wie in het midden staat.',
    'Sorteren is stap één. Wie dat overslaat, pakt gewoon de verkeerde persoon.',
  ],
  '3c': [
    'De modus is wat het vaakst voorkomt. Dat ben ik dus letterlijk.',
    'Let op: het gaat om de wáárde, niet om hoe vaak hij voorkomt.',
  ],
  '3d': [
    'Dobbelstenen. Zes kanten, zes uitkomsten. Twee stenen samen: zesendertig.',
    'Kans is niets anders dan: hoeveel gunstig, gedeeld door hoeveel mogelijk.',
  ],
  '3e': [
    'Een kaartspel: 52 stuks, vier soorten van dertien.',
    'En pas op met "of". Dan tel je de schoppenaas zo twee keer, en er is er maar één.',
  ],
  '1d': [
    'Ik ben een vogelbekdier en ik werk haakjes weg. Dat is mijn hele functie in dit boek.',
    'Twee boogjes: van het getal naar het eerste element, en naar het tweede. Vergeet er nooit één.',
  ],
  '1e': [
    'Twee paar haakjes? Dan vier boogjes.',
    'Elk element links gaat langs elk element rechts. Vier vermenigvuldigingen, altijd.',
  ],
  '7a': [
    'Nu andersom: haakjes plaatsen in plaats van weghalen.',
    'Zoek wat in álle elementen zit en zet dat ervoor. Het grootste dat past, anders kan het nog korter.',
  ],
  '2a': [
    'Breuken zijn pizzapunten. Even veel punten per pizza? Dan kun je gewoon optellen.',
    'Anders snijd je ze eerst gelijk. Nooit tellers én noemers optellen — dan bezorg ik de verkeerde pizza.',
  ],
  '2b': [
    'Keer is recht door zee: boven keer boven, onder keer onder.',
    'Delen? Draai de tweede pizza om en vermenigvuldig. Dat is echt alles.',
  ],
  '2c': [
    'Zelfde pizza, nu met letters erop.',
    'Wegstrepen mag alleen wat op élk stuk ligt. Ligt er op één stuk geen kaas, dan gaat de kaas er niet af.',
  ],
  '2d': [
    'Optellen met letters. Noemers keer elkaar, en de tellers gaan mee.',
    'Wat je onder doet, doe je boven ook. Anders klopt de bestelling niet meer.',
  ],
  '2e': [
    'Keer en delen met letters erbij.',
    'Omdraaien, uitvermenigvuldigen, wegstrepen. In die volgorde.',
  ],
  '6a': [
    'Ik ben een weegschaal. Links en rechts even zwaar, anders sla ik door.',
    'Haal je links iets weg, dan rechts precies hetzelfde. Meer is de balansmethode niet.',
  ],
  '6b': [
    'Staan er haakjes in? Die eerst weg, aan allebei de kanten.',
    'Pas daarna ga ik balanceren. Andersom val ik om.',
  ],
  '6c': [
    'Nu hang ik scheef. Dat is een ongelijkheid.',
    'Los eerst op alsof er = staat, en kijk daarna welke kant het op valt met een proefwaarde.',
  ],
  '6d': [
    'y = ax + b. De a is hoe steil het gaat, de b is waar je begint.',
    'Staat het anders opgeschreven? Balanceer de y eerst in zijn eentje naar links.',
  ],
  '6e': [
    'Twee punten, één lijn. Meer heb je niet nodig.',
    'Hoeveel gaat y omhoog per stap naar rechts? Dat is je a. Dan één punt invullen voor de b.',
  ],
  '7b': [
    'Som-product. Zoek twee getallen die opgeteld b geven én vermenigvuldigd c.',
    'Vind je die, dan schuif je ze zo tussen twee paar haakjes. Klaar.',
  ],
  '7c': [
    'Staat er een getal vóór de x²? Die eerst eruit — en aan het eind weer terug.',
    'En zie je x⁴ en x²? Noem x² even t. Dan is het opeens een gewone som.',
  ],
  '5c': [
    'Waar raakt mijn halfpipe de grond? Daar is y nul.',
    'En waar hij de verticale as snijdt, is x nul. Twee vragen, twee invullingen.',
  ],
  '5d': [
    'Een rechte lijn dwars door de halfpipe. Waar kruisen ze?',
    'Stel ze aan elkaar gelijk, breng alles naar één kant, en ontbind.',
  ],
  '5e': [
    'y = b(x − r)ᵍ + h. Breedte, richting, graad, hoogte.',
    'Vier dingen aflezen en invullen. Let alleen op dat minteken bij de r.',
  ],
  '7d': [
    'Ontbinden, en dan elke haak apart op nul.',
    'Want A · B = 0 kan alleen als er eentje nul is. Dat is de hele truc.',
  ],
  '7e': [
    'Eerst alles naar één kant, dan pas ontbinden.',
    'En deel nooit links en rechts door de letter. Dan gooi je zomaar een antwoord weg.',
  ],
}

export function introVoor(code: string): string[] {
  return INTRO[code] ?? ['Even kijken hoe dit werkt.']
}

/**
 * Het stappenplan per onderwerp: wat je letterlijk moet dóen bij zo'n som.
 *
 * Dit is het belangrijkste stuk van het lesje. Uitleg begrijpen is niet
 * hetzelfde als weten waar je moet beginnen; deze lijstjes zijn het recept dat
 * je in je hoofd afdraait zodra je de opgave ziet. De reader doet dit ook, in
 * de rubrieken 'Wat moet je doen als je gevraagd wordt...'.
 */
const RECEPT: Record<string, string[]> = {
  '1a': [
    'Staan er haakjes? Die eerst uitrekenen.',
    'Dan machten en wortels.',
    'Dan keer en delen — van links naar rechts, wat het eerst staat.',
    'Pas daarna plus en min, ook van links naar rechts.',
  ],
  '1b': [
    'Kijk wat het grondtal is en wat de macht.',
    'Schrijf uit: het grondtal net zo vaak keer zichzelf als de macht zegt.',
    'Bij een wortel vraag je andersom: welk getal keer zichzelf geeft dit?',
    'Haakjes om een minteken? Dan hoort dat minteken erbij.',
  ],
  '1c': [
    'Schrijf de formule over.',
    'Zet de waarde op elke plek van de letter — mét haakjes eromheen.',
    'Machten eerst, dan keer en delen, dan plus en min.',
  ],
  '5a': [
    'Doe eerst alle maaltekens.',
    'Zoek termen met precies dezelfde letters én dezelfde machten.',
    'Tel alleen die bij elkaar op; de rest laat je staan.',
  ],
  '5b': [
    'Eerst het maalteken: getallen keer elkaar, machten optellen.',
    'Kijk daarna welke termen gelijksoortig zijn.',
    'Alleen die optellen — de macht verandert daarbij niet.',
  ],
  '4a': [
    'Check of het grondtal aan beide kanten hetzelfde is.',
    'Vermenigvuldig de getallen vóór de letters met elkaar.',
    'Tel de machten op.',
  ],
  '4b': [
    'Check of het grondtal hetzelfde is.',
    'Deel de getallen door elkaar.',
    'Trek de machten af: boven min onder.',
    'Staat er nog een breuk? Haal hem naar boven met een negatieve macht.',
  ],
  '4c': [
    'Schrijf elk getal als macht van 3: 9 = 3², 27 = 3³, 81 = 3⁴, 1 = 3⁰.',
    'Zie je een breuk? Maak er een negatieve macht van.',
    'Keer: machten optellen. Delen: aftrekken. Macht van een macht: vermenigvuldigen.',
  ],
  '4d': [
    'Breuk binnen de haakjes? Eerst omschrijven naar een negatieve macht.',
    'Geef élke factor binnen de haakjes de macht van buiten — ook het getal.',
    'Machten van een macht vermenigvuldig je.',
  ],
  '4e': [
    'Breukstreep weg met een negatieve macht.',
    'Haakjes weg: machten vermenigvuldigen.',
    'Gelijke grondtallen samenvoegen: machten optellen.',
    'Tot slot de losse getallen uitrekenen.',
  ],
  '3a': [
    'Tel alle waarden bij elkaar op.',
    'Deel door hoeveel waarden er zijn.',
    'Telt iets zwaarder mee? Keer het gewicht, en deel door de som van de gewichten.',
  ],
  '3b': [
    'Zet alles op volgorde van klein naar groot. Altijd eerst.',
    'Oneven aantal? Pak de middelste.',
    'Even aantal? Neem het gemiddelde van de twee middelste.',
  ],
  '3c': [
    'Tel per waarde hoe vaak hij voorkomt.',
    'Pak de waarde die het vaakst voorkomt.',
    'Geef de wáárde als antwoord, niet hoe vaak hij voorkwam.',
  ],
  '3d': [
    'Tel hoeveel uitkomsten er in totaal mogelijk zijn (twee d6 = 36).',
    'Tel hoeveel daarvan gunstig zijn.',
    'Deel gunstig door mogelijk en vereenvoudig de breuk.',
    'Staat er "minstens één"? Reken de kans op géén uit en trek die van 1 af.',
  ],
  '3e': [
    'Tel de gunstige kaarten: 13 per soort, 4 per waarde, 12 plaatjes, 26 rood.',
    'Deel door 52 en vereenvoudig.',
    'Bij "en" vermenigvuldig je de kansen; bij "of" tel je ze op.',
    'Bij "of": haal eraf wat in allebei de groepen zit.',
  ],
  '1d': [
    'Kijk wat er vóór de haakjes staat.',
    'Vermenigvuldig dat met het eerste element binnen de haakjes.',
    'En daarna met het tweede — vergeet die nooit.',
    'Schrijf de twee uitkomsten achter elkaar op.',
  ],
  '1e': [
    'Neem het eerste element links en ga langs beide elementen rechts.',
    'Neem het tweede element links en ga weer langs beide.',
    'Schrijf alle vier de uitkomsten achter elkaar.',
    'Voeg de gelijksoortige termen samen.',
  ],
  '7a': [
    'Zoek de grootste gemeenschappelijke deler van de getallen.',
    'Zoek de letter die in álle elementen zit (en de laagste macht ervan).',
    'Zet die twee samen vóór de haakjes.',
    'Deel elk element door die factor en zet de rest tussen de haakjes.',
  ],
  '2a': [
    'Zijn de noemers gelijk? Zo nee: vermenigvuldig ze met elkaar.',
    'Pas de tellers met precies hetzelfde aan.',
    'Tel de tellers op of trek ze af; de noemer blijft staan.',
    'Vereenvoudig het antwoord zo ver mogelijk.',
  ],
  '2b': [
    'Vermenigvuldigen: boven keer boven, onder keer onder.',
    'Delen: draai de tweede breuk om en vermenigvuldig.',
    'Vereenvoudig, en haal de helen eruit als de teller groter is.',
  ],
  '2c': [
    'Kijk of teller en noemer door hetzelfde getal deelbaar zijn.',
    'Zoek een letter die in álle elementen zit — alleen die mag je wegstrepen.',
    'Twijfel je? Haal de factor eerst buiten haakjes, dan zie je het.',
  ],
  '2d': [
    'Vermenigvuldig de noemers met elkaar.',
    'Elke teller gaat keer de andere noemer.',
    'Tel de tellers bij elkaar op.',
    'Vereenvoudig: eerst de getallen, dan pas letters wegstrepen.',
  ],
  '2e': [
    'Staat er een deelteken? Draai de tweede breuk om.',
    'Boven keer boven, onder keer onder.',
    'Deel de getallen en streep letters weg die boven én onder staan.',
  ],
  '6a': [
    'Breng de losse getallen naar één kant — het teken klapt om.',
    'Breng alle letters naar de andere kant.',
    'Deel beide kanten door het getal dat vóór de letter staat.',
  ],
  '6b': [
    'Werk eerst de haakjes weg, aan allebei de kanten.',
    'Letters naar links, getallen naar rechts (tekens klappen om).',
    'Deel door het getal vóór de letter.',
  ],
  '6c': [
    'Los eerst op alsof er een = teken staat.',
    'Neem een waarde kleiner dan die uitkomst en vul die in.',
    'Klopt het? Dan is het "kleiner dan". Klopt het niet? Dan "groter dan".',
  ],
  '6d': [
    'Zorg dat de y alleen aan de linkerkant staat.',
    'Deel álle elementen door het getal dat vóór de y stond.',
    'Lees af: a is de richtingscoëfficiënt, b het startgetal.',
  ],
  '6e': [
    'Reken de rc uit: verschil in y gedeeld door verschil in x.',
    'Vul één punt in bij y = ax + b.',
    'Los op naar b en schrijf het geheel als y = ax + b.',
  ],
  '7b': [
    'Kijk wat b is (het getal bij de x) en wat c is (het losse getal).',
    'Zoek twee getallen die opgeteld b geven en vermenigvuldigd c.',
    'Zet ze neer als (x + m)(x + n).',
    'Controleer door de haakjes weer weg te werken.',
  ],
  '7c': [
    'Staat er een getal vóór de x²? Zet dat eerst buiten haakjes.',
    'Zie je x⁴ en x²? Noem x² even t — dan is het een gewone som.',
    'Pas de som-productmethode toe.',
    'Zet aan het eind alles terug wat je apart had gezet.',
  ],
  '5c': [
    'Snijpunt met de y-as: vul x = 0 in.',
    'Snijpunt met de x-as: stel de formule op 0.',
    'Ontbind in factoren en stel elke haak apart op nul.',
    'Schrijf altijd de complete coördinaten op: (x, y).',
  ],
  '5d': [
    'Stel de twee formules aan elkaar gelijk.',
    'Breng alles naar één kant, zodat er = 0 staat.',
    'Ontbind en stel elke haak op nul: dat zijn je x-waarden.',
    'De y-waarde is de hoogte van de lijn — bij allebei dezelfde.',
  ],
  '5e': [
    'Lees de graad af: parabool = 2, langgerekte s = 3.',
    'De top (of het buigpunt) geeft r (de x) en h (de y).',
    'Vul dat in bij y = b(x − r)ᵍ + h — let op het teken van r.',
    'Vul een punt van de grafiek in en los op naar b.',
  ],
  '7d': [
    'Breng alles naar één kant zodat er = 0 staat.',
    'Ontbind met de som-productmethode.',
    'Stel elke haak apart op nul.',
    'Schrijf beide antwoorden op, met ∨ ertussen.',
  ],
  '7e': [
    'Breng alles naar één kant.',
    'Staat er een getal vóór de x²? Eerst buiten haakjes.',
    'Ontbind in factoren.',
    'Elke haak op nul — en deel nooit door de letter.',
  ],
}

export function receptVoor(code: string): string[] {
  return RECEPT[code] ?? []
}

/** Kort applaus bij een goed antwoord in het lesje. */
export const LOF = [
  'Ja.',
  'Precies.',
  'Klopt.',
  'Zo is het.',
  'Goed gezien.',
  'Netjes.',
]

/** En als het misgaat in het lesje: geen drama, het is nog uitleg. */
export const TROOST = [
  'Nee — en precies daarom staan we hier.',
  'Bijna. Kijk even mee.',
  'Dat is de klassieke. Let op:',
  'Nee. Maar dat dacht bijna iedereen.',
]
