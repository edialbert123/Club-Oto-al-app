const CACHE_NAME = 'club-otonal-v9';
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
  './multimedia/documentos/Proyecto_APP.html',
  './multimedia/documentos/guia_dones.html',
  './multimedia/documentos/Conócete.pdf'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url => cache.add(url).catch(() => null))
      );
    })
  );
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

  if (url.origin !== self.location.origin || url.pathname.includes('OneSignal')) {
    return;
  }

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
      return cachedResponse || fetch(event.request);
    })
  );
});
