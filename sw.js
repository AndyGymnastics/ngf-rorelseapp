const CACHE_NAME = 'ngf-v1';
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/app.css',
  './js/app.js',
  './js/i18n.js',
  './js/store.js',
  './js/views/home.js',
  './js/views/workout.js',
  './js/views/exercise.js',
  './js/views/player.js',
  './js/views/myworkouts.js',
  './js/views/settings.js',
  './data/data.json'
];

// Install: cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for assets, network-first for data
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Never cache Google Drive video iframes
  if (url.hostname.includes('google.com') || url.hostname.includes('drive.google.com')) {
    return;
  }

  // Network-first for data.json (always try to get fresh content)
  if (url.pathname.endsWith('data.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for everything else (but not chrome extensions)
  if (!event.request.url.startsWith('chrome-extension://')) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request)
          .then(response => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            return response;
          })
        )
    );
  }
});
