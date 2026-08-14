/* Dzidziuś — service worker.
   Cel: aplikacja otwiera się i zapisuje bez zasięgu (winda, szpital, wieś).
   Po każdej zmianie plików podbij CACHE — inaczej telefony zostaną na starej wersji. */

var CACHE = 'dzidzius-v4';

var SHELL = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './config.js',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })
          .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;

  /* Zapytania do bazy nigdy z cache — inaczej zobaczylibyśmy stare wpisy. */
  if (req.method !== 'GET' || req.url.indexOf('/rest/v1/') !== -1) return;

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) {
        /* Odśwież w tle, oddaj natychmiast to, co jest. */
        fetch(req).then(function (res) {
          if (res && res.ok) caches.open(CACHE).then(function (c) { c.put(req, res.clone()); });
        }).catch(function () {});
        return hit;
      }
      return fetch(req).catch(function () { return caches.match('./index.html'); });
    })
  );
});
