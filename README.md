# Basket Grandi Valli (BGV)

Sito ufficiale della società di pallacanestro **Basket Grandi Valli** — Roncanova (VR), attiva dal 1996.

Sito statico (HTML + CSS + JS puro, nessuna build necessaria).

## Struttura del progetto

```
.
├── index.html      → pagina unica con tutte le sezioni
├── style.css       → stili
├── script.js       → menu mobile, anno footer, animazioni allo scroll
├── assets/
│   ├── logo-bgv.png          → logo storico della società
│   ├── logo30-stemma.png     → stemma ufficiale 30° anniversario (usato nell'hero)
│   ├── logo30-testo.png      → logo testuale "30° Anniversario" (disponibile per altri usi)
│   ├── divisa-bgv.jpeg       → render della divisa ufficiale nero/arancione
│   ├── tezenis-partnership.jpg → locandina partnership Tezenis Basketball Academy
│   └── squadre/
│       ├── csi-a2.jpg
│       ├── under-17.jpg
│       ├── under-15.jpg
│       ├── under-13.jpg
│       ├── aquilotti.jpg
│       └── scoiattoli.jpg
├── vercel.json     → configurazione minima per Vercel
└── README.md
```

Tutte le squadre hanno la loro foto reale in `assets/squadre/`.

## Come pubblicare il sito

### 1. Caricare il sito su GitHub

Da questa cartella, sul tuo computer:

```bash
git init
git add .
git commit -m "Primo commit: sito Basket Grandi Valli"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/NOME-REPOSITORY.git
git push -u origin main
```

Sostituisci `TUO-USERNAME` e `NOME-REPOSITORY` con i tuoi dati. Se non hai ancora creato il repository, vai su [github.com/new](https://github.com/new), crealo (senza README, .gitignore o licenza, perché sono già presenti qui) e poi copia l'URL da usare al posto di `origin`.

### 2. Collegare il repository a Vercel

1. Vai su [vercel.com](https://vercel.com) e accedi (puoi farlo direttamente con il tuo account GitHub).
2. Clicca **Add New… → Project**.
3. Seleziona il repository GitHub appena creato e clicca **Import**.
4. Vercel rileverà che è un sito statico: lascia tutti i campi di build vuoti/predefiniti (non serve nessun "Build Command" né "Output Directory" particolare — la root del progetto contiene già `index.html`).
5. Clicca **Deploy**.

Dopo qualche secondo il sito sarà online con un indirizzo del tipo `nome-progetto.vercel.app`. Da Vercel puoi anche collegare un dominio personalizzato (es. `basketgrandivalli.it`) dalla sezione **Settings → Domains**.

Ogni volta che farai `git push` su GitHub, Vercel pubblicherà automaticamente la nuova versione.

## Sezione Risultati

La sezione "Risultati" è per ora solo uno **slot grafico**: mostra l'impaginazione (riquadro, freccette, pallini) ma non è ancora collegata a nessuna immagine reale né è funzionante. È un segnaposto in attesa di decidere come gestire l'inserimento delle foto dei risultati (es. caricamento da una cartella, o un carosello interattivo). Quando si deciderà l'approccio, andrà implementata la logica corrispondente.

## Modificare i contenuti

- **Testi e squadre**: modifica direttamente `index.html` (sezione `#squadre`).
- **Mappa**: l'indirizzo è incorporato come iframe di Google Maps nella sezione `#contatti`; per cambiarlo basta sostituire l'indirizzo nell'URL dell'`iframe`.
- **Colori e font**: tutte le variabili sono in cima a `style.css` (blocco `:root`).
- **Instagram / telefono / presidente**: sempre in `index.html`, sezione `#contatti`.

## Note tecniche

- Nessuna dipendenza da installare, nessun framework: si può aprire `index.html` anche direttamente nel browser.
- I font (Anton, Fraunces, Inter) sono caricati da Google Fonts via CDN.
- Il sito è responsive ed è stato pensato per restare leggibile anche con animazioni disattivate (`prefers-reduced-motion`).
