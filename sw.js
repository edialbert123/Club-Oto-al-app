const CACHE_NAME = 'club-otonal-v5';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './multimedia/imagenes/banner.jpeg',
  './multimedia/imagenes/Icono.jpeg',
  './textos/proxima_actividad.html',
  './textos/colaborar.html',
  './textos/contacto.html',
  './textos/donativos.html',
  './textos/aliento.txt',
  './multimedia/documentos/informe_proyecto.html',
  './multimedia/documentos/guia_dones.html',
  './multimedia/documentos/Conócete.pdf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Dejar que OneSignal y peticiones externas pasen directo por red
  if (url.origin !== self.location.origin || url.pathname.includes('OneSignalSDK')) {
    return;
  }

  // Para index.html y raíz, intentar red primero y caer a caché solo si no hay internet
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const copia = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copia));
          }
          return networkResponse;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
