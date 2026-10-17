const CACHE_NAME = 'club-otonal-v4';
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

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Precargando archivos base...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activación y limpieza
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
    })
  );
  self.clientsClaim();
});

// Estrategia Cache First (Primero memoria local, luego red)
self.addEventListener('fetch', event => {
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
    }).catch(() => {
      return caches.match('./index.html');
    })
  );
});
