/* ==========================================================================
   BASKET GRANDI VALLI — calendario prima squadra (CSI A2, girone Blu)
   ------------------------------------------------------------------------
   Questo è l'UNICO file da modificare per aggiornare calendario e risultati.
   La pagina Calendario e il box "Prossima partita" in home si aggiornano da soli.

   - Per inserire un risultato: risultato: [punti casa, punti ospite]
       es. { giornata: 1, ..., risultato: [72, 65] }
   - Per una squadra senza logo: logo: null  → viene mostrato un "?"
   - Date in formato AAAA-MM-GG, ora in formato HH:MM (ora italiana)
   ========================================================================== */

window.BGV_SQUADRE = {
  bgv:        { nome: 'BGV',                      logo: '/assets/logo-bgv.png' },
  cowboys:    { nome: 'Cadidavid Cowboys',        logo: '/assets/loghi/cadidavid-cowboys.jpg' },
  mantova:    { nome: 'Mantova Giants',           logo: '/assets/loghi/mantova-giants.jpg' },
  ostiglia:   { nome: 'Basket Ostiglia',          logo: '/assets/loghi/ostiglia.jpg' },
  campagnola: { nome: 'Campagnola Beers Brother', logo: null },
  cerea:      { nome: 'Cerea Basket',             logo: '/assets/loghi/cerea.jpg' },
  greengiants:{ nome: 'Green Giants Usacli',      logo: null },
  zevio:      { nome: 'Zevio',                    logo: '/assets/loghi/zevio.jpg' },
  pgsamba:    { nome: 'Pgsamba',                  logo: null },
  oppeano:    { nome: 'Pol. Oppeano',             logo: '/assets/loghi/oppeano.jpg' },
  sanantonio: { nome: 'San Antonio',              logo: '/assets/loghi/san-antonio.jpg' },
  vigasio:    { nome: 'Vigasio Vipers',           logo: '/assets/loghi/vigasio-vipers.png' }
};

window.BGV_PALESTRE = {
  gazzo:    { nome: 'Palazzetto dello Sport di Gazzo Veronese', indirizzo: 'Via Maestri del Lavoro 1, 37060 Correzzo, Gazzo Veronese (VR)', luogo: 'Gazzo Veronese' },
  ostiglia: { nome: 'Palazzetto dello Sport di Ostiglia',       indirizzo: 'Via S. Rocco 5a, 46035 Ostiglia (MN)', luogo: 'Ostiglia (MN)' },
  cerea:    { nome: 'Scuola Media Fratelli Sommariva',          indirizzo: 'Via Gandhi 1, 37053 Cerea (VR)', luogo: 'Cerea' },
  zevio:    { nome: 'Palazzetto dello Sport di Zevio',          indirizzo: 'Via Aldo Moro 44, 37059 Zevio (VR)', luogo: 'Zevio' },
  oppeano:  { nome: 'Campo Sportivo di Vallese',                indirizzo: 'Via della Resurrezione, 37050 Vallese di Oppeano (VR)', luogo: 'Vallese di Oppeano' },
  vigasio:  { nome: 'Palazzetto dello Sport di Isola della Scala', indirizzo: 'Via Tiro a Segno 14, 37063 Isola della Scala (VR)', luogo: 'Isola della Scala' }
};

window.BGV_PARTITE = [
  { tipo: 'Fuori campionato', data: '2026-10-09', ora: '21:00', casa: 'bgv',        ospite: 'cowboys',     palestra: 'gazzo' },

  { giornata: 1,  data: '2026-10-16', ora: '21:00', casa: 'bgv',        ospite: 'mantova',     palestra: 'gazzo' },
  { giornata: 2,  data: '2026-10-23', riposo: true },
  { giornata: 3,  data: '2026-10-29', ora: '21:15', casa: 'ostiglia',   ospite: 'bgv',         palestra: 'ostiglia' },
  { giornata: 4,  data: '2026-11-06', ora: '21:00', casa: 'bgv',        ospite: 'campagnola',  palestra: 'gazzo' },
  { giornata: 5,  data: '2026-11-12', ora: '21:30', casa: 'cerea',      ospite: 'bgv',         palestra: 'cerea' },
  { giornata: 6,  data: '2026-11-20', ora: '21:00', casa: 'bgv',        ospite: 'greengiants', palestra: 'gazzo' },
  { giornata: 7,  data: '2026-11-27', ora: '21:00', casa: 'zevio',      ospite: 'bgv',         palestra: 'zevio' },
  { giornata: 8,  data: '2026-12-04', ora: '21:00', casa: 'bgv',        ospite: 'pgsamba',     palestra: 'gazzo' },
  { giornata: 9,  data: '2026-12-10', ora: '21:00', casa: 'oppeano',    ospite: 'bgv',         palestra: 'oppeano' },
  { giornata: 10, data: '2027-01-15', ora: '21:00', casa: 'bgv',        ospite: 'sanantonio',  palestra: 'gazzo' },
  { giornata: 11, data: '2027-01-22', ora: '21:30', casa: 'vigasio',    ospite: 'bgv',         palestra: 'vigasio' }
];
