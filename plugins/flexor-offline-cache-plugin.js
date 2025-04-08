Flexor.registerPlugin('offline-cache', (container, config) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/flexor-sw.js').then(reg => {
        const cacheName = 'flexor-cache-v1';
        const urlsToCache = [location.href, ...Array.from(container.querySelectorAll('img, link[rel="stylesheet"]')).map(el => el.src || el.href)];
  
        reg.addEventListener('install', event => {
          event.waitUntil(
            caches.open(cacheName).then(cache => cache.addAll(urlsToCache))
          );
        });
  
        container.addEventListener('fetch', event => {
          event.respondWith(
            caches.match(event.request).then(response => response || fetch(event.request))
          );
        });
      });
  
      // Fallback rendering if offline
      window.addEventListener('offline', () => {
        container.innerHTML = '<div style="padding: 10px; background: #ffeeee;">Offline Mode: Layout Cached</div>';
      });
    }
  });