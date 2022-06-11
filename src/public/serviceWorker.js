const cacheName = "v0.0.1";

self.addEventListener("install", (e) => {
  console.log("[Service Worker] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("[Service Worker] Activated");
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== cacheName) {
        caches.delete(key);
        console.log(`[Service Worker] Clearing Cache ${key}`);
      }
    });
  });
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open(cacheName).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const fetchedResponse = fetch(event.request)
        .then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        .catch((e) => {
          console.log("[Service Worker] App is Offline, Cache Not Updated");
        });
      return cachedResponse || fetchedResponse;
    })
  );
});
