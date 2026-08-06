/* =============================================================
   Nav behaviour - carried over from the earlier builds
   1. hairline swaps for a shadow once the page is scrolled
   2. active link follows the section in view
   3. hamburger + overlay on small screens
   ============================================================= */

document.documentElement.classList.add('js');

var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

(function () {
  var nav = document.querySelector('.nav');
  var links = document.querySelectorAll('.nav__link');
  var toggle = document.querySelector('.nav__toggle');
  var panel = document.querySelector('.nav__links');
  var overlay = document.querySelector('.nav__overlay');

  /* ---------- 1. scrolled state ---------- */
  var ticking = false;
  function onScroll() {
    nav.classList.toggle('is-scrolled', scrollY > 40);
    if (scrollY < 80) {
      links.forEach(function (l) { l.classList.remove('is-active'); });
    }
    ticking = false;
  }
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- 2. active link ---------- */
  var sections = document.querySelectorAll('[id]');
  var watched = [];
  sections.forEach(function (s) {
    if (document.querySelector('.nav__link[href="#' + s.id + '"]')) watched.push(s);
  });

  if ('IntersectionObserver' in window && watched.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var active = document.querySelector('.nav__link[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    watched.forEach(function (s) { io.observe(s); });
  }

  /* ---------- 3. mobile menu ---------- */
  if (!toggle || !panel) return;

  function openNav() {
    panel.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    panel.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    panel.classList.contains('is-open') ? closeNav() : openNav();
  });
  if (overlay) overlay.addEventListener('click', closeNav);
  links.forEach(function (l) { l.addEventListener('click', closeNav); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
})();

/* =============================================================
   Quiet details
   1. separators draw themselves in
   2. the three hero numbers count up
   ============================================================= */

(function () {
  var rules = document.querySelectorAll('.rule');
  var stats = document.querySelectorAll('.stat__n');

  if (REDUCED || !('IntersectionObserver' in window)) {
    rules.forEach(function (r) { r.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      io.unobserve(el);

      if (el.classList.contains('rule')) { el.classList.add('is-in'); return; }

      /* count up - the label stays put, only the figure moves */
      var target = parseInt(el.textContent, 10);
      if (isNaN(target)) return;
      var start = null, dur = 900;
      (function step(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }, { threshold: 0.4, rootMargin: '0px 0px -10% 0px' });

  rules.forEach(function (r) { io.observe(r); });
  stats.forEach(function (s) { s.dataset.to = s.textContent; io.observe(s); });
})();

/* =============================================================
   Case study pages
   1. point-of-view switcher (Insights)
   2. annotation <-> pin pairing on hover
   ============================================================= */

/* ---------- 1. switcher ---------- */
(function () {
  var root = document.querySelector('[data-pov]');
  if (!root) return;

  var labels = { ceo: 'Strategic Plan', exec: 'Initiative details', owner: 'My page' };
  var view = root.querySelector('[data-pov-view]');

  root.querySelectorAll('.pov__tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.dataset.view;

      root.querySelectorAll('.pov__tab').forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      root.querySelectorAll('[data-panel]').forEach(function (p) {
        p.classList.toggle('is-on', p.dataset.panel === key);
      });
      root.querySelectorAll('[data-shot]').forEach(function (s) {
        s.classList.toggle('is-on', s.dataset.shot === key);
      });
      if (view) view.textContent = 'View: ' + (labels[key] || '');
    });
  });
})();

/* ---------- 2. annotation / pin pairing ----------
   Scoped per panel (switcher) or per step, so the same index in two
   different blocks never cross-activates. */
(function () {
  var scopes = document.querySelectorAll('.pov__panel, .step');
  if (!scopes.length) return;

  scopes.forEach(function (scope) {
    /* a switcher panel holds the notes, its screenshot lives in the sibling media
       column - so pair against the surrounding section in that case only */
    var media = scope.classList.contains('pov__panel')
      ? scope.closest('.pov')
      : scope;

    function set(i, on) {
      media.querySelectorAll('[data-i="' + i + '"]').forEach(function (el) {
        el.classList.toggle('is-hot', on);
      });
    }

    scope.querySelectorAll('.ann li').forEach(bind);
    if (media !== scope) media.querySelectorAll('.pin').forEach(bind);
    else scope.querySelectorAll('.pin').forEach(bind);

    function bind(el) {
      var i = el.dataset.i;
      if (!i) return;
      el.addEventListener('mouseenter', function () { set(i, true); });
      el.addEventListener('mouseleave', function () { set(i, false); });
    }
  });
})();
