// Basket Grandi Valli — interazioni di base

document.addEventListener('DOMContentLoaded', function () {

  // Anno corrente nel footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Menu mobile
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Chiudi il menu quando si clicca un link
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Dropdown contatti rapidi
  var quickToggle   = document.getElementById('quickToggle');
  var quickDropdown = document.getElementById('quickDropdown');

  if (quickToggle && quickDropdown) {
    quickToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = quickDropdown.classList.toggle('is-open');
      quickToggle.classList.toggle('is-open', isOpen);
      quickToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Chiudi cliccando fuori
    document.addEventListener('click', function () {
      quickDropdown.classList.remove('is-open');
      quickToggle.classList.remove('is-open');
      quickToggle.setAttribute('aria-expanded', 'false');
    });

    // Chiudi premendo Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        quickDropdown.classList.remove('is-open');
        quickToggle.classList.remove('is-open');
        quickToggle.setAttribute('aria-expanded', 'false');
      }
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

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: mostra tutto subito
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Tilt 3D sulle card squadra (disattivato se l'utente preferisce meno movimento o su touch)
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (!prefersReducedMotion && !isTouchDevice) {
    var tiltCards = document.querySelectorAll('.team-card');

    tiltCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -6;
        var rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = 'perspective(700px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // Modale Lavinia
  var laviniaBtn     = document.getElementById('laviniaBtn');
  var laviniaOverlay = document.getElementById('laviniaOverlay');
  var laviniaClose   = document.getElementById('laviniaClose');

  if (laviniaBtn && laviniaOverlay) {
    laviniaBtn.addEventListener('click', function () {
      laviniaOverlay.classList.add('is-open');
    });
    laviniaClose.addEventListener('click', function () {
      laviniaOverlay.classList.remove('is-open');
    });
    laviniaOverlay.addEventListener('click', function (e) {
      if (e.target === laviniaOverlay) {
        laviniaOverlay.classList.remove('is-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') laviniaOverlay.classList.remove('is-open');
    });
  }

  // ── Carosello Novità ────────────────────────────────────────────────
  var newsCarousel = document.getElementById('newsCarousel');
  var newsDotsWrap = document.getElementById('newsDots');
  var newsPrev     = document.getElementById('newsPrev');
  var newsNext     = document.getElementById('newsNext');

  if (newsCarousel && newsDotsWrap) {
    var newsCards   = newsCarousel.querySelectorAll('.news-card');
    var newsCurrent = 0;

    // Genera i dots
    newsCards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'news-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Vai alla news ' + (i + 1));
      dot.addEventListener('click', function () { newsGoTo(i); });
      newsDotsWrap.appendChild(dot);
    });

    var newsDots = newsDotsWrap.querySelectorAll('.news-dot');

    function newsGoTo(index) {
      newsCurrent = (index + newsCards.length) % newsCards.length;
      // Calcola offset: scorri la card attiva al centro
      var cardEl    = newsCards[newsCurrent];
      var wrapEl    = newsCarousel.parentElement;
      var cardLeft  = cardEl.offsetLeft;
      var cardW     = cardEl.offsetWidth;
      var wrapW     = wrapEl.offsetWidth;
      var offset    = cardLeft - (wrapW - cardW) / 2;
      newsCarousel.style.transform = 'translateX(-' + Math.max(0, offset) + 'px)';
      newsDots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === newsCurrent);
      });
    }

    if (newsPrev) newsPrev.addEventListener('click', function () { newsGoTo(newsCurrent - 1); });
    if (newsNext) newsNext.addEventListener('click', function () { newsGoTo(newsCurrent + 1); });

    // Swipe su mobile
    var touchStartX = 0;
    newsCarousel.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    newsCarousel.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) newsGoTo(dx < 0 ? newsCurrent + 1 : newsCurrent - 1);
    });

    // Nasconde frecce se c'è una sola card
    if (newsCards.length <= 1 && newsPrev && newsNext) {
      newsPrev.style.display = 'none';
      newsNext.style.display = 'none';
    }
  }

});
