const staticCacheName = 'restaurant-static-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  // http://a.tile.osm.org/13/1339/3140.png
  if (event.request.url.indexOf('tile.osm.org')>-1) {
    event.respondWith(serveTiles(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
  return;
});

function serveTiles(request) {
  var url = request.url;
  url = url.replace(/\?.*$/, '');
  return caches.open(staticCacheName).then(function(cache) {
    return cache.match(url).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(url, networkResponse.clone());
        return networkResponse;
      }).catch(function () {
        console.log('Error: ', request.url);
      });
    });
  });
}