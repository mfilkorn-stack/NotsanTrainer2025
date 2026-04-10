const CACHE_VERSION = 'notsantrainer-v0.9.1';

const APP_SHELL = [
  './',
  './index.html',
  './landing.html',
  './app.jsx',
  './data.js',
  './utils.js',
  './entities.js',
  './manifest.json',
  './robots.txt',
  './og-image.png',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  // EKG images
  './ekg/asystolie_1.jpg',
  './ekg/asystolie_2.jpg',
  './ekg/avblock1_1.jpg',
  './ekg/avblock2_1_1.jpg',
  './ekg/avblock2_1_2.jpg',
  './ekg/avblock2_2_1.jpg',
  './ekg/avblock2_2_2.jpg',
  './ekg/avblock3_1.jpg',
  './ekg/avblock3_2.jpg',
  './ekg/hyperkaliaemie_1.jpg',
  './ekg/hyperkaliaemie_2.jpg',
  './ekg/hypokaliaemie_1.jpg',
  './ekg/hypokaliaemie_2.jpg',
  './ekg/hypothermie_ekg_1.jpg',
  './ekg/hypothermie_ekg_2.jpg',
  './ekg/lae_ekg_1.jpg',
  './ekg/lae_ekg_2.jpg',
  './ekg/lsb_1.jpg',
  './ekg/lsb_2.jpg',
  './ekg/pea_1.jpg',
  './ekg/pea_2.jpg',
  './ekg/perikarditis_ekg_1.jpg',
  './ekg/perikarditis_ekg_2.jpg',
  './ekg/pvt_1.jpg',
  './ekg/pvt_2.jpg',
  './ekg/rsb_1.jpg',
  './ekg/rsb_2.jpg',
  './ekg/sinusbrady_1.jpg',
  './ekg/sinusbrady_2.jpg',
  './ekg/sinusrhythmus_1.jpg',
  './ekg/sinusrhythmus_2.jpg',
  './ekg/sinustachy_1.jpg',
  './ekg/sinustachy_2.jpg',
  './ekg/stemi_anterior_1.jpg',
  './ekg/stemi_anterior_2.jpg',
  './ekg/stemi_inferior_1.jpg',
  './ekg/stemi_inferior_2.jpg',
  './ekg/stemi_posterior_1.jpg',
  './ekg/stemi_posterior_2.jpg',
  './ekg/svt_1.jpg',
  './ekg/svt_2.jpg',
  './ekg/torsade_1.jpg',
  './ekg/torsade_2.jpg',
  './ekg/vf_1.jpg',
  './ekg/vf_2.jpg',
  './ekg/vhf_1.jpg',
  './ekg/vhf_2.jpg',
  './ekg/vhflattern_1.jpg',
  './ekg/vhflattern_2.jpg',
  './ekg/vt_1.jpg',
  './ekg/vt_2.jpg'
];

const CDN_URLS = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first for local assets, network-first for CDN
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // CDN resources: network-first with cache fallback
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Local assets: cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      });
    })
  );
});

// Notify clients when a new version is available
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
