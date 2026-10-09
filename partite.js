/* ==========================================================================
   BASKET GRANDI VALLI — calendario prima squadra (CSI A2, girone Blu)
   ------------------------------------------------------------------------
   Questo è l'UNICO file da modificare per aggiornare calendario e risultati.
   La pagina Calendario e il box "Prossima partita" in home si aggiornano da soli.

   - Risultato:  risultato: [punti casa, punti ospite]    es. [72, 65]
   - Squadra senza logo:  logo: null  → viene mostrato un "?"
   - Palestra: di default è quella della squadra di casa (campo "palestra"
     in BGV_SQUADRE). Per una partita giocata altrove aggiungi
     palestra: 'chiave' alla singola partita.
   - Date AAAA-MM-GG, ora HH:MM (ora italiana)
   - Classifica: in fondo al file (BGV_CLASSIFICA). Copia i valori ufficiali
     CSI dopo ogni giornata e aggiorna la data in "aggiornata".
   ========================================================================== */

window.BGV_PALESTRE = {
  gazzo:      { nome: 'Palazzetto dello Sport di Gazzo Veronese', indirizzo: 'Via Maestri del Lavoro 1, 37060 Correzzo, Gazzo Veronese (VR)', luogo: 'Gazzo Veronese' },
  ostiglia:   { nome: 'Piscine e Palazzetto dello Sport',          indirizzo: 'Via S. Rocco 5A, 46035 Ostiglia (MN)',                         luogo: 'Ostiglia (MN)' },
  cerea:      { nome: 'Scuola Media Fratelli Sommariva',           indirizzo: 'Via Gandhi 1, 37053 Cerea (VR)',                               luogo: 'Cerea' },
  zevio:      { nome: 'Palazzetto dello Sport di Zevio',           indirizzo: 'Via Aldo Moro 44, 37059 Zevio (VR)',                           luogo: 'Zevio' },
  campagnola: { nome: 'Palestra di Campagnola di Zevio',           indirizzo: 'Via Verga, 37056 Campagnola di Zevio (VR)',                    luogo: 'Campagnola di Zevio' },
  oppeano:    { nome: 'Campo Sportivo di Vallese',                 indirizzo: 'Via della Resurrezione, 37050 Vallese di Oppeano (VR)',        luogo: 'Vallese di Oppeano' },
  isola:      { nome: 'Palazzetto dello Sport di Isola della Scala', indirizzo: 'Via Tiro a Segno 14, 37063 Isola della Scala (VR)',         luogo: 'Isola della Scala' },
  mantova:    { nome: 'Palestra Usvardi',                          indirizzo: 'Via Grayson, 46100 Mantova (MN)',                              luogo: 'Mantova' },
  monteforte: { nome: "Palazzetto Comunale di Monteforte d'Alpone", indirizzo: "Via Adolfo Consolini, 37032 Monteforte d'Alpone (VR)",       luogo: "Monteforte d'Alpone" },
  marconi:    { nome: 'Palestra Scuola Marconi',                   indirizzo: 'Piazzale Romano Guardini 1, 37138 Verona (VR)',                luogo: 'Verona' },
  fincato:    { nome: 'Palestra Scuole Fincato Rosani',            indirizzo: 'Via Badile 95, 37131 Verona (VR)',                             luogo: 'Verona' },
  bovolino:   { nome: 'Palazzetto Bovolino (Ist. Agrario Bentegodi)', indirizzo: "Viale dell'Agricoltura 1, 37060 Buttapietra (VR)",        luogo: 'Buttapietra' }
};

window.BGV_SQUADRE = {
  bgv:        { nome: 'BGV',                      logo: '/assets/logo-bgv.png',                 palestra: 'gazzo' },
  cowboys:    { nome: 'Cadidavid Cowboys',        logo: '/assets/loghi/cadidavid-cowboys.jpg', palestra: 'bovolino' },
  mantova:    { nome: 'Mantova Giants',           logo: '/assets/loghi/mantova-giants.jpg',    palestra: 'mantova' },
  ostiglia:   { nome: 'Basket Ostiglia',          logo: '/assets/loghi/ostiglia.jpg',          palestra: 'ostiglia' },
  campagnola: { nome: 'Campagnola Beers Brother', logo: null,                                  palestra: 'campagnola' },
  cerea:      { nome: 'Cerea Basket',             logo: '/assets/loghi/cerea.jpg',             palestra: 'cerea' },
  greengiants:{ nome: 'Green Giants Usacli',      logo: null,                                  palestra: 'marconi' },
  zevio:      { nome: 'Zevio',                    logo: '/assets/loghi/zevio.jpg',             palestra: 'zevio' },
  pgsamba:    { nome: 'Pgsamba',                  logo: null,                                  palestra: 'fincato' },
  oppeano:    { nome: 'Pol. Oppeano',             logo: '/assets/loghi/oppeano.jpg',           palestra: 'oppeano' },
  sanantonio: { nome: 'San Antonio',              logo: '/assets/loghi/san-antonio.jpg',       palestra: 'monteforte' },
  vigasio:    { nome: 'Vigasio Vipers',           logo: '/assets/loghi/vigasio-vipers.png',    palestra: 'isola' }
};

window.BGV_PARTITE = [
  { tipo: 'Coppa CSI Verona', data: '2026-10-09', ora: '21:00', casa: 'bgv',        ospite: 'cowboys', risultato: [70, 65] },

  { giornata: 1,  data: '2026-10-16', ora: '21:00', casa: 'bgv',        ospite: 'mantova' },
  { giornata: 2,  data: '2026-10-23', riposo: true },
  { giornata: 3,  data: '2026-10-29', ora: '21:15', casa: 'ostiglia',   ospite: 'bgv' },
  { giornata: 4,  data: '2026-11-06', ora: '21:00', casa: 'bgv',        ospite: 'campagnola' },
  { giornata: 5,  data: '2026-11-12', ora: '21:30', casa: 'cerea',      ospite: 'bgv' },
  { giornata: 6,  data: '2026-11-20', ora: '21:00', casa: 'bgv',        ospite: 'greengiants' },
  { giornata: 7,  data: '2026-11-27', ora: '21:00', casa: 'zevio',      ospite: 'bgv' },
  { giornata: 8,  data: '2026-12-04', ora: '21:00', casa: 'bgv',        ospite: 'pgsamba' },
  { giornata: 9,  data: '2026-12-10', ora: '21:00', casa: 'oppeano',    ospite: 'bgv' },
  { giornata: 10, data: '2027-01-15', ora: '21:00', casa: 'bgv',        ospite: 'sanantonio' },
  { giornata: 11, data: '2027-01-22', ora: '21:30', casa: 'vigasio',    ospite: 'bgv' }
];

/* --------------------------------------------------------------------------
   CLASSIFICA — CSI A2 girone Blu
   pt = punti, g = giocate, v = vinte, p = perse, pf = punti fatti, ps = punti subiti
   L'ordine si calcola da solo (punti, poi differenza canestri).
   -------------------------------------------------------------------------- */
window.BGV_CLASSIFICA = {
  aggiornata: '',   // es. '2026-10-17' — lascia vuoto finché non si gioca
  squadre: [
    { squadra: 'bgv',         pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 },
    { squadra: 'mantova',     pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 },
    { squadra: 'ostiglia',    pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 },
    { squadra: 'campagnola',  pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 },
    { squadra: 'cerea',       pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 },
    { squadra: 'greengiants', pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 },
    { squadra: 'zevio',       pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 },
    { squadra: 'pgsamba',     pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 },
    { squadra: 'oppeano',     pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 },
    { squadra: 'sanantonio',  pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 },
    { squadra: 'vigasio',     pt: 0, g: 0, v: 0, p: 0, pf: 0, ps: 0 }
  ]
};
