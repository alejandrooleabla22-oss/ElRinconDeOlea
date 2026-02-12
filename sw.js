const CACHE_NAME = 'deolea-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/contacto.html',
    '/pc.html',
    '/movil.html',
    '/consolas.html',
    '/hogar.html',
    '/especializados.html',
    '/planes.html',
    '/servicios.html',
    '/style.css',
    '/script.js'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching assets');
                return cache.addAll(ASSETS);
            })
    );
});

// Activate and clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch behavior: Network first, then Cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});
