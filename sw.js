/* PawsOn service worker — keeps the app, map tiles and photos for offline use.
   Change CACHE_NAME (v7 → v8) whenever you update files on the hosted site,
   so phones download the new version. Keep APP_FILES the same as in js/offline.js. */

const CACHE_NAME = "pawson-app-v8";
const TILE_CACHE = "pawson-tiles";
const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./img/gsu-panther.png",
  "./css/styles.css",
  "./data/settings.js",
  "./data/accounts.js",
  "./data/buildings.js",
  "./data/interiors.js",
  "./data/events.js",
  "./data/equipment.js",
  "./data/study-rooms.js",
  "./js/helpers.js",
  "./js/state.js",
  "./js/map.js",
  "./js/search.js",
  "./js/panel.js",
  "./js/floor-plans.js",
  "./js/pages-events.js",
  "./js/pages-route.js",
  "./js/pages-equipment.js",
  "./js/pages-study.js",
  "./js/accounts.js",
  "./js/location.js",
  "./js/offline.js",
  "./js/splash.js",
  "./js/app.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener("activate", () => self.clients.claim());

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  // Map tiles: use the saved copy first, save new ones as you browse.
  if (/arcgisonline\.com/.test(request.url)) {
    event.respondWith(
      caches.match(request).then(
        (saved) =>
          saved ||
          fetch(request)
            .then((response) => {
              const copy = response.clone();
              caches.open(TILE_CACHE).then((cache) => cache.put(request, copy));
              return response;
            })
            .catch(() => new Response("", { status: 504 })),
      ),
    );
    return;
  }

  // Everything else: try the network first (so updates show), fall back to the saved copy.
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((saved) => saved || caches.match("./index.html"))),
  );
});
