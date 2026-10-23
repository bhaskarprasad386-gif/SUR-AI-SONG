const CACHE = 'sur-ai-studio-shell-v2';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest'];
const isCacheableRequest = (request) => request.method === 'GET' && !request.headers.has('range');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (!isCacheableRequest(request) || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          event.waitUntil(
            caches.open(CACHE).then((cache) => cache.put(request, response.clone()))
          );
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => {
        if (cached) return cached;
        return request.mode === 'navigate'
          ? caches.match('./index.html')
          : Response.error();
      }))
  );
});
