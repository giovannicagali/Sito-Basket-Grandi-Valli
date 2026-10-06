// Basket Grandi Valli — interazioni di base

document.addEventListener('DOMContentLoaded', function () {

  // Anno corrente nel footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menu mobile
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Tab calendario & risultati
  var calTabsWrap = document.getElementById('calTabs');
  if (calTabsWrap) {
    var calTabs = calTabsWrap.querySelectorAll('.cal-tab');
    var calPanels = document.querySelectorAll('.cal-panel');
    calTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var team = tab.getAttribute('data-team');
        calTabs.forEach(function (t) { t.classList.remove('is-active'); });
        calPanels.forEach(function (p) { p.classList.remove('is-active'); });
        tab.classList.add('is-active');
        var panel = document.getElementById('panel-' + team);
        if (panel) panel.classList.add('is-active');
      });
    });
  }


  // Instagram — muro a due file alimentato dal widget esterno.
  // Incolla qui l'indirizzo del feed (es. Behold: https://feeds.behold.so/XXXXXXXX)
  var IG_FEED_URL = 'https://feeds.behold.so/WPlVGJehRqXpt8NA4iar';
  var IG_POSTS = 10; // post mostrati (5 per fila)

  var igRows = document.getElementById('igRows');
  var igWall = document.getElementById('igWall');

  if (igRows && igWall) {
    var rowA = document.getElementById('igRowA');
    var rowB = document.getElementById('igRowB');

    function igSkeletons() {
      [rowA, rowB].forEach(function (row) {
        row.innerHTML = '';
        for (var i = 0; i < 6; i++) {
          var s = document.createElement('span');
          s.className = 'ig-skel';
          s.style.animationDelay = (i * 0.15) + 's';
          row.appendChild(s);
        }
      });
    }

    function igFallback() {
      igRows.setAttribute('data-state', 'empty');
      igWall.setAttribute('data-fallback', 'true');
    }

    function igTile(post) {
      var a = document.createElement('a');
      a.className = 'ig-tile';
      a.href = post.permalink || 'https://instagram.com/basketgrandivalli';
      a.target = '_blank';
      a.rel = 'noopener';
      var img = document.createElement('img');
      img.src = post.thumbnailUrl || post.mediaUrl || post.media_url || '';
      img.alt = (post.prunedCaption || post.caption || 'Post Instagram di Basket Grandi Valli').slice(0, 110);
      img.loading = 'lazy';
      a.appendChild(img);
      return a;
    }

    function igRender(posts) {
      if (!posts || !posts.length) { igFallback(); return; }
      var list = posts.slice(0, IG_POSTS);
      var half = Math.ceil(list.length / 2);
      var sets = [list.slice(0, half), list.slice(half).length ? list.slice(half) : list.slice(0, half)];

      [rowA, rowB].forEach(function (row, idx) {
        row.innerHTML = '';
        // doppia sequenza: serve per far ripartire lo scorrimento senza stacchi
        sets[idx].concat(sets[idx]).forEach(function (post) {
          row.appendChild(igTile(post));
        });
      });
      igRows.setAttribute('data-state', 'ready');
    }

    if (!IG_FEED_URL) {
      igFallback();
    } else {
      igSkeletons();
      fetch(IG_FEED_URL)
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (data) { igRender(Array.isArray(data) ? data : (data.posts || [])); })
        .catch(igFallback);
    }
  }

});


// ==========================================================================
// Calendario prima squadra — dati in partite.js
// Rende la lista partite (/risultati) e il box "Prossima partita" (home).
// ==========================================================================
(function () {
  var PARTITE = window.BGV_PARTITE, SQUADRE = window.BGV_SQUADRE, PALESTRE = window.BGV_PALESTRE;
  if (!PARTITE || !SQUADRE) return;

  var GIORNI = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  var GIORNI_LUNGHI = ['domenica', 'luned\u00ec', 'marted\u00ec', 'mercoled\u00ec', 'gioved\u00ec', 'venerd\u00ec', 'sabato'];
  var MESI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  var DURATA_MIN = 120; // una partita resta "prossima" fino a 2 ore dopo la palla a due

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function inizio(m) {
    var d = m.data.split('-'), o = (m.ora || '23:59').split(':');
    return new Date(+d[0], +d[1] - 1, +d[2], +o[0], +o[1]);
  }
  function finita(m, ora) { return ora.getTime() > inizio(m).getTime() + DURATA_MIN * 60000; }
  function etichetta(m) { return m.giornata ? m.giornata + '\u00aa giornata' : (m.tipo || 'Partita'); }
  function competizione(m) { return m.giornata ? 'CSI A2 \u00b7 ' + etichetta(m) : etichetta(m); }
  function inCasa(m) { return m.casa === 'bgv'; }
  function avversario(m) { return SQUADRE[inCasa(m) ? m.ospite : m.casa]; }

  function logo(key, size) {
    var s = SQUADRE[key] || { nome: '?', logo: null };
    var st = size ? ' style="width:' + size + 'px;height:' + size + 'px"' : '';
    if (!s.logo) return '<span class="team-logo is-empty"' + st + ' role="img" aria-label="Logo ' + s.nome + ' non disponibile">?</span>';
    return '<span class="team-logo"' + st + '><img src="' + s.logo + '" alt="Logo ' + s.nome + '" loading="lazy"></span>';
  }
  function gcal(m) {
    var a = inizio(m), b = new Date(a.getTime() + 90 * 60000);
    var f = function (d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00'; };
    var p = palestra(m);
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(SQUADRE[m.casa].nome + ' vs ' + SQUADRE[m.ospite].nome) +
      '&dates=' + f(a) + '/' + f(b) + '&ctz=Europe/Rome' +
      '&details=' + encodeURIComponent(competizione(m) + ' \u00b7 Basket Grandi Valli') +
      '&location=' + encodeURIComponent((p.nome || '') + ', ' + (p.indirizzo || ''));
  }
  function mappa(p) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.nome + ', ' + p.indirizzo); }

  function palestra(m) {
    var k = m.palestra || (SQUADRE[m.casa] || {}).palestra;
    return (PALESTRE && PALESTRE[k]) || { nome: '?', indirizzo: '', luogo: '?' };
  }

  var adesso = new Date();
  var prossima = null;
  for (var i = 0; i < PARTITE.length; i++) {
    if (!PARTITE[i].riposo && !finita(PARTITE[i], adesso)) { prossima = PARTITE[i]; break; }
  }

  // ---------- home: box prossima partita ----------
  var nm = document.getElementById('nextMatch');
  if (nm) {
    var w = nm.querySelector('.wrap');
    if (prossima) {
      var d = inizio(prossima), p = palestra(prossima);
      nm.classList.add('is-set');
      w.innerHTML =
        '<span class="next-match-label">Prossima partita</span>' +
        '<div class="next-match-teams">' +
          '<span class="next-match-team">' + logo(prossima.casa) + SQUADRE[prossima.casa].nome + '</span>' +
          '<span class="next-match-vs">vs</span>' +
          '<span class="next-match-team">' + logo(prossima.ospite) + SQUADRE[prossima.ospite].nome + '</span>' +
        '</div>' +
        '<div class="next-match-meta">' +
          '<div><h4>' + etichetta(prossima) + ' &middot; ' + (inCasa(prossima) ? 'In casa' : 'Trasferta') + '</h4><p>' +
            GIORNI[d.getDay()] + ' ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + ' &middot; ' + prossima.ora + '</p></div>' +
          '<div><h4>Dove</h4><p>' + (p.luogo || p.nome) + '</p></div>' +
          '<a class="next-match-link" href="/risultati">Calendario &rarr;</a>' +
        '</div>';
    } else {
      nm.classList.remove('is-set');
      w.innerHTML =
        '<span class="next-match-label">Prossima partita</span>' +
        '<div class="next-match-teams"><span class="next-match-team">&mdash;</span><span class="next-match-vs">vs</span><span class="next-match-team">&mdash;</span></div>' +
        '<div class="next-match-meta"><span class="next-match-soon">Calendario in arrivo</span></div>';
    }
  }

  // ---------- pagina calendario ----------
  var list = document.getElementById('calList');
  if (list) {
    var html = '';
    PARTITE.forEach(function (m) {
      var d = inizio(m);
      if (m.riposo) {
        html += '<div class="cal-rest' + (finita(m, adesso) ? ' is-played' : '') + '"><span class="cal-match-tag">' + etichetta(m) +
          '</span><span>Turno di riposo per BGV</span><span class="cal-rest-date">Settimana del ' + pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '</span></div>';
        return;
      }
      var giocata = finita(m, adesso), isNext = m === prossima;
      var p = palestra(m);
      var cls = 'cal-match' + (isNext ? ' is-next' : '') + (giocata ? ' is-played' : '');
      var tags = '<span class="cal-match-tag">' + etichetta(m) + '</span>' +
        '<span class="cal-match-tag' + (inCasa(m) ? ' is-home' : '') + '">' + (inCasa(m) ? 'In casa' : 'Trasferta') + '</span>' +
        (isNext ? '<span class="cal-match-tag is-next">Prossima</span>' : '');
      var info;
      if (giocata) {
        if (m.risultato) {
          var noi = inCasa(m) ? m.risultato[0] : m.risultato[1], loro = inCasa(m) ? m.risultato[1] : m.risultato[0];
          var esito = noi > loro ? 'Vittoria' : (noi < loro ? 'Sconfitta' : 'Pareggio');
          info = '<div><h4>Risultato</h4><p class="cal-score ' + (noi > loro ? 'is-win' : 'is-loss') + '">' + m.risultato[0] + ' &ndash; ' + m.risultato[1] + '</p></div>' +
                 '<div><h4>Esito</h4><p>' + esito + '</p></div>';
        } else {
          info = '<div><h4>Risultato</h4><p>In aggiornamento</p></div>';
        }
      } else {
        info = '<div><h4>Palla a due</h4><p>' + m.ora + '</p></div>' +
          '<div><h4>Palestra</h4><p><a href="' + mappa(p) + '" target="_blank" rel="noopener">' + p.nome + '</a></p><small>' + p.indirizzo + '</small></div>' +
          '<a class="btn btn-outline btn-sm" href="' + gcal(m) + '" target="_blank" rel="noopener">Aggiungi al calendario</a>';
      }
      html += '<article class="' + cls + '" aria-label="' + SQUADRE[m.casa].nome + ' contro ' + SQUADRE[m.ospite].nome + ', ' +
          GIORNI_LUNGHI[d.getDay()] + ' ' + d.getDate() + ' ' + MESI[d.getMonth()] + '">' +
        '<div class="cal-match-date"><span class="cal-match-day">' + GIORNI[d.getDay()] + '</span><span class="cal-match-num">' + pad(d.getDate()) +
          '</span><span class="cal-match-month">' + MESI[d.getMonth()] + '</span></div>' +
        '<div class="cal-match-main"><div class="cal-match-tags">' + tags + '</div>' +
          '<div class="cal-match-teams">' +
            '<div class="cal-match-team">' + logo(m.casa) + '<strong>' + SQUADRE[m.casa].nome + '</strong></div>' +
            '<span class="cal-match-vs">vs</span>' +
            '<div class="cal-match-team">' + logo(m.ospite) + '<strong>' + SQUADRE[m.ospite].nome + '</strong></div>' +
          '</div></div>' +
        '<div class="cal-match-info">' + info + '</div>' +
      '</article>';
    });
    list.innerHTML = html;

    // dati strutturati per Google (SportsEvent)
    var eventi = PARTITE.filter(function (m) { return !m.riposo; }).map(function (m) {
      var p = palestra(m), d = inizio(m);
      var off = -d.getTimezoneOffset(), sign = off >= 0 ? '+' : '-';
      off = Math.abs(off);
      return {
        '@context': 'https://schema.org', '@type': 'SportsEvent',
        name: SQUADRE[m.casa].nome + ' vs ' + SQUADRE[m.ospite].nome,
        description: competizione(m), sport: 'Basketball',
        startDate: m.data + 'T' + m.ora + ':00' + sign + pad(Math.floor(off / 60)) + ':' + pad(off % 60),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: p.nome, address: p.indirizzo },
        homeTeam: { '@type': 'SportsTeam', name: SQUADRE[m.casa].nome },
        awayTeam: { '@type': 'SportsTeam', name: SQUADRE[m.ospite].nome }
      };
    });
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify(eventi);
    document.head.appendChild(ld);

    // porta in vista la prossima partita se la stagione è già avanzata
    var nx = list.querySelector('.is-next');
    if (nx && list.querySelectorAll('.is-played').length > 2) {
      window.scrollTo({ top: nx.getBoundingClientRect().top + window.scrollY - 120 });
    }
  }
})();
