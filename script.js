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

  // Modale Open Day
  var opendayBtn = document.getElementById('opendayBtn');
  var opendayOverlay = document.getElementById('opendayOverlay');
  var opendayClose = document.getElementById('opendayClose');
  var OPENDAY_DEADLINE = new Date('2026-09-07T00:00:00');

  if (opendayOverlay) {
    var opendayOpen = function () { opendayOverlay.classList.add('is-open'); };
    var opendayHide = function () {
      opendayOverlay.classList.remove('is-open');
      try { sessionStorage.setItem('bgvOpendaySeen', '1'); } catch (e) {}
    };

    if (opendayBtn) opendayBtn.addEventListener('click', opendayOpen);
    if (opendayClose) opendayClose.addEventListener('click', opendayHide);
    opendayOverlay.addEventListener('click', function (e) {
      if (e.target === opendayOverlay) opendayHide();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') opendayHide();
    });

    // Apertura automatica alla prima visita di ogni sessione del browser,
    // solo finch\u00e9 l'Open Day non \u00e8 passato.
    var opendayAlreadySeen = false;
    try { opendayAlreadySeen = sessionStorage.getItem('bgvOpendaySeen') === '1'; } catch (e) {}
    if (!opendayAlreadySeen && new Date() < OPENDAY_DEADLINE) {
      setTimeout(function () {
        opendayOpen();
        try { sessionStorage.setItem('bgvOpendaySeen', '1'); } catch (e) {}
      }, 600);
    }
  }

  // Modale Lavinia
  var laviniaBtn = document.getElementById('laviniaBtn');
  var laviniaOverlay = document.getElementById('laviniaOverlay');
  var laviniaClose = document.getElementById('laviniaClose');

  if (laviniaBtn && laviniaOverlay) {
    laviniaBtn.addEventListener('click', function () { laviniaOverlay.classList.add('is-open'); });
    if (laviniaClose) laviniaClose.addEventListener('click', function () { laviniaOverlay.classList.remove('is-open'); });
    laviniaOverlay.addEventListener('click', function (e) {
      if (e.target === laviniaOverlay) laviniaOverlay.classList.remove('is-open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') laviniaOverlay.classList.remove('is-open');
    });
  }

});
