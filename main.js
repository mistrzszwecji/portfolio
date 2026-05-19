/* =============================================================
   MAIN.JS - Kamil Zagrodnik Portfolio
   ============================================================= */

/* -----------------------------------------------------------
   Content injection — reads from content.js
   **bold** → <strong>, newline → <br>
----------------------------------------------------------- */

function renderCopy(str) {
  return str
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

document.querySelectorAll('[data-copy]').forEach((el) => {
  const raw = typeof COPY !== 'undefined' && COPY[el.dataset.copy];
  if (raw) el.innerHTML = renderCopy(raw);
});

/* -----------------------------------------------------------
   Hero entrance - triggers CSS animation sequence
----------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('is-loaded');
  });
});

/* -----------------------------------------------------------
   Nav scroll state - swaps border for shadow on scroll
----------------------------------------------------------- */

const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

/* -----------------------------------------------------------
   Scroll reveal - observes .reveal elements, adds .is-visible
----------------------------------------------------------- */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? `${el.dataset.delay}ms` : '0ms';
        el.style.setProperty('--reveal-delay', delay);
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


/* -----------------------------------------------------------
   Annotation hover - paired highlight: ann-item ↔ pin
   Scoped per .annotated-split so same index in different
   sections don't cross-activate.
----------------------------------------------------------- */

document.querySelectorAll('.annotated-split').forEach((section) => {
  const pins  = section.querySelectorAll('.annotated-split__image .pin');
  const items = section.querySelectorAll('.ann-item');

  function activate(index) {
    pins.forEach((p)  => p.classList.remove('is-active'));
    items.forEach((i) => i.classList.remove('is-active'));
    section.querySelector(`.annotated-split__image .pin[data-index="${index}"]`)
      ?.classList.add('is-active');
    section.querySelector(`.ann-item[data-index="${index}"]`)
      ?.classList.add('is-active');
  }

  function clear() {
    pins.forEach((p)  => p.classList.remove('is-active'));
    items.forEach((i) => i.classList.remove('is-active'));
  }

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => activate(item.dataset.index));
    item.addEventListener('mouseleave', clear);
  });

  pins.forEach((pin) => {
    pin.addEventListener('mouseenter', () => activate(pin.dataset.index));
    pin.addEventListener('mouseleave', clear);
  });
});

/* -----------------------------------------------------------
   Nav active state - highlights current section link
----------------------------------------------------------- */

const navLinks = document.querySelectorAll('.nav__link');
const sections  = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('is-active'));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('is-active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => sectionObserver.observe(s));

/* Clear active state when scrolled back to hero */
window.addEventListener('scroll', () => {
  if (window.scrollY < 80) {
    navLinks.forEach((l) => l.classList.remove('is-active'));
  }
}, { passive: true });
