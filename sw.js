const CACHE_NAME = 'cimbar-decoder-cache-v1';

// Список файлов для сохранения в память устройства
const ASSETS = [
  './',
  './index.html',
  './cimbar_receiver.js',
  './cimbar_receiver.wasm',
  './manifest.json',
  './icon.png'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Активация и удаление старого кэша, если вы обновите файлы
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов: если интернета нет, файлы берутся из кэша
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
