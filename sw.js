const CACHE_NAME = 'club-otonal-v3';
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

// Instalación del Service Worker y almacenamiento en caché de todos los recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos del Club Otoñal guardados en caché con éxito');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clientsClaim();
});

// Interceptar peticiones para servir contenido offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, lo devuelve; si no, intenta buscarlo en la red
        return response || fetch(event.request);
      }).catch(() => {
        // Si falla la red y no está en caché, devuelve el index.html principal
        return caches.match('./index.html');
      })
  );
});
