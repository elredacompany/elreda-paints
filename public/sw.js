const CACHE_NAME = 'alreda-paints-pwa-v6';
const SHELL_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/assets/aistudio/logo_alreda.webp',
  '/favicon.png',
  '/favicon.ico',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
            return Promise.resolve();
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Network-First for core app files (HTML, JS, CSS, manifest)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request, { cache: 'no-cache' });
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch(() => {});
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const rootCached = await caches.match('/');
      if (rootCached) return rootCached;
      const offlineCached = await caches.match('/offline.html');
      if (offlineCached) return offlineCached;
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

// Stale-While-Revalidate for images & static icons
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
        cache.put(request, networkResponse.clone()).catch(() => {});
      }
      return networkResponse;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }
  const netRes = await networkPromise;
  return netRes || new Response('Offline', { status: 503, statusText: 'Offline' });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Always bypass Vite dev modules, API endpoints, and HMR paths
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/@vite/') ||
    url.pathname.startsWith('/node_modules/')
  ) {
    return;
  }

  const isStaticMedia = /\.(webp|png|jpg|jpeg|svg|ico|woff2?)$/i.test(url.pathname);
  if (isStaticMedia && req.mode !== 'navigate') {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  event.respondWith(networkFirst(req));
});
