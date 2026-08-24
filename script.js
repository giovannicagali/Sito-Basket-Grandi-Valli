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

  // Flip card squadre (clic o tastiera)
  var flipCards = document.querySelectorAll('.team-card-flip');
  flipCards.forEach(function (card) {
    function doFlip() {
      flipCards.forEach(function (c) { if (c !== card) c.classList.remove('is-flipped'); });
      card.classList.toggle('is-flipped');
    }
    card.addEventListener('click', doFlip);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doFlip(); }
    });
  });

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
