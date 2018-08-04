importScripts('workbox-sw.js')
if (workbox) {
  console.log('Workbox is loaded');

  workbox.core.setLogLevel(workbox.core.LOG_LEVELS.silent);

  // manifest injected
  workbox.precaching.precacheAndRoute([])

  workbox.skipWaiting()
  workbox.clientsClaim()

  // cahing the map tiles
  // have to add 0 for opaque responses
  // https://stackoverflow.com/questions/39109789/what-limitations-apply-to-opaque-responses
  workbox.routing.registerRoute(
    /http:\/\/(.*)tile.osm.org\/(.*)\.png/,
    workbox.strategies.cacheFirst({
      cacheName: 'map-tiles',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          //purgeOnQuotaError: true, // Opt-in to automatic cleanup.
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        })
      ]
    })
  );

} else {
  console.log('Workbox loading error');
}