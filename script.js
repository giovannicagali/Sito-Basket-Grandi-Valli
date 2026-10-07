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


  // Instagram — novità in home: tutti i post del feed, dal più recente, a scorrimento.
  // Indirizzo del feed JSON (Behold: https://feeds.behold.so/XXXXXXXX)
  var IG_FEED_URL = 'https://feeds.behold.so/WPlVGJehRqXpt8NA4iar';
  var IG_PROFILE = 'https://instagram.com/basketgrandivalli';

  var igMarquee = document.getElementById('igMarquee');
  var igTrack = document.getElementById('igTrack');

  if (igMarquee && igTrack) {
    var MESI_IG = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
    var lentezza = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function igData(ts) {
      var d = new Date(ts);
      if (isNaN(d)) return '';
      var s = d.getDate() + ' ' + MESI_IG[d.getMonth()];
      return d.getFullYear() !== new Date().getFullYear() ? s + ' ' + d.getFullYear() : s;
    }
    function igImg(post) {
      var sz = post.sizes || {};
      return (sz.medium && sz.medium.mediaUrl) || (sz.large && sz.large.mediaUrl) ||
        post.thumbnailUrl || post.mediaUrl || post.media_url || '';
    }
    function igTipo(post) {
      var t = (post.mediaType || post.media_type || '').toUpperCase();
      if (t === 'VIDEO') return '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      if (t === 'CAROUSEL_ALBUM') return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="7" width="13" height="13" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>';
      return '';
    }
    function igTile(post, clone) {
      var a = document.createElement('a');
      a.className = 'ig-post';
      a.href = post.permalink || IG_PROFILE;
      a.target = '_blank';
      a.rel = 'noopener';
      if (clone) { a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); }
      var testo = (post.prunedCaption || post.caption || '').replace(/\s+/g, ' ').trim();
      var img = document.createElement('img');
      img.src = igImg(post);
      img.alt = testo ? testo.slice(0, 110) : 'Post Instagram di Basket Grandi Valli';
      img.loading = 'lazy';
      a.appendChild(img);
      var tipo = igTipo(post);
      if (tipo) { var t = document.createElement('span'); t.className = 'ig-post-type'; t.innerHTML = tipo; a.appendChild(t); }
      var meta = document.createElement('span');
      meta.className = 'ig-post-meta';
      var data = igData(post.timestamp);
      if (data) { var tm = document.createElement('time'); tm.dateTime = post.timestamp; tm.textContent = data; meta.appendChild(tm); }
      if (testo) { var c = document.createElement('span'); c.className = 'ig-post-cap'; c.textContent = testo; meta.appendChild(c); }
      a.appendChild(meta);
      return a;
    }
    function igVuoto() { igMarquee.setAttribute('data-state', 'empty'); }

    function igRender(posts) {
      posts = (posts || []).filter(function (p) { return igImg(p); });
      if (!posts.length) { igVuoto(); return; }
      // dal più recente al più vecchio
      posts.sort(function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
      igTrack.innerHTML = '';
      posts.forEach(function (p) { igTrack.appendChild(igTile(p, false)); });

      if (!lentezza) {
        // ripete la sequenza finché copre lo schermo, poi la duplica per un loop senza stacchi
        var giro = posts.slice();
        var larghezza = 286; // larghezza tile + gap (desktop)
        while (giro.length * larghezza < window.innerWidth * 1.15) giro = giro.concat(posts);
        giro.slice(posts.length).forEach(function (p) { igTrack.appendChild(igTile(p, true)); });
        giro.forEach(function (p) { igTrack.appendChild(igTile(p, true)); });
        igTrack.style.setProperty('--ig-durata', Math.max(30, giro.length * 6) + 's');
        igMarquee.setAttribute('data-anim', 'true');
      }
      igMarquee.setAttribute('data-state', 'ready');
    }

    if (!IG_FEED_URL) {
      igVuoto();
    } else {
      for (var k = 0; k < 6; k++) { var sk = document.createElement('span'); sk.className = 'ig-skel'; igTrack.appendChild(sk); }
      fetch(IG_FEED_URL)
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (data) { igRender(Array.isArray(data) ? data : (data.posts || [])); })
        .catch(igVuoto);
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

  // ---------- classifica ----------
  var stBody = document.getElementById('standingsBody');
  var CL = window.BGV_CLASSIFICA;
  if (stBody && CL && CL.squadre) {
    var righe = CL.squadre.map(function (r) {
      var o = {}; for (var k in r) o[k] = r[k];
      o.diff = (r.pf || 0) - (r.ps || 0);
      o.nome = (SQUADRE[r.squadra] || { nome: r.squadra }).nome;
      return o;
    });
    var iniziata = righe.some(function (r) { return r.g > 0; });
    righe.sort(function (a, b) {
      if (!iniziata) return a.nome.localeCompare(b.nome, 'it');
      return (b.pt - a.pt) || (b.diff - a.diff) || (b.pf - a.pf) || a.nome.localeCompare(b.nome, 'it');
    });
    stBody.innerHTML = righe.map(function (r, i) {
      var diff = r.diff > 0 ? '+' + r.diff : String(r.diff);
      return '<tr' + (r.squadra === 'bgv' ? ' class="is-us"' : '') + '>' +
        '<td class="st-pos">' + (iniziata ? i + 1 : '&ndash;') + '</td>' +
        '<td class="st-team"><span class="st-team-in">' + logo(r.squadra, 32) + '<span>' + r.nome + '</span></span></td>' +
        '<td class="st-pt">' + r.pt + '</td><td>' + r.g + '</td><td>' + r.v + '</td><td>' + r.p + '</td>' +
        '<td class="st-opt">' + r.pf + '</td><td class="st-opt">' + r.ps + '</td>' +
        '<td class="st-diff' + (r.diff > 0 ? ' is-pos' : (r.diff < 0 ? ' is-neg' : '')) + '">' + diff + '</td></tr>';
    }).join('');
    var nota = document.getElementById('standingsNote');
    if (nota) {
      if (CL.aggiornata) {
        var d = CL.aggiornata.split('-');
        nota.textContent = 'Aggiornata al ' + d[2] + '/' + d[1] + '/' + d[0] + '.';
      } else {
        var prima = PARTITE.filter(function (m) { return m.giornata === 1; })[0];
        nota.textContent = 'Il campionato non \u00e8 ancora iniziato' +
          (prima ? ': la classifica si aggiorna dopo la 1\u00aa giornata (' + prima.data.split('-').reverse().join('/') + ').' : '.');
      }
    }
  }
})();
