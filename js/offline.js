/* =====================================================================
   OFFLINE — online badge, service worker, "Save for offline"
   =====================================================================
   Offline only works from a hosted https link (e.g. GitHub Pages), not
   when you double-click index.html.
   ===================================================================== */

// Every file the app needs. Keep this list the same as APP_FILES in sw.js.
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
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
];

// The area around campus to save map tiles for.
const OFFLINE_AREA = { north: 33.7958, south: 33.7898, west: -84.2378, east: -84.2302 };

function updateNetworkBadge() {
  const online = navigator.onLine;
  $("net").classList.toggle("off", !online);
  $("netTxt").textContent = online ? "Online" : "Offline — saved map still works";
}

// Lists the map tile links covering campus at zoom 16–19 (satellite 16–18).
function campusTileUrls() {
  const tileX = (lng, z) => Math.floor(((lng + 180) / 360) * 2 ** z);
  const tileY = (lat, z) => {
    const rad = (lat * Math.PI) / 180;
    return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z);
  };
  const fill = (url, x, y, z) => url.replace("{z}", z).replace("{x}", x).replace("{y}", y);
  const urls = [];
  for (let z = 16; z <= 19; z++) {
    for (let x = tileX(OFFLINE_AREA.west, z); x <= tileX(OFFLINE_AREA.east, z); x++) {
      for (let y = tileY(OFFLINE_AREA.north, z); y <= tileY(OFFLINE_AREA.south, z); y++) {
        urls.push(fill(MAP_LAYERS.street.url, x, y, z));
        if (z <= 18) urls.push(fill(MAP_LAYERS.satellite.url, x, y, z));
      }
    }
  }
  return urls;
}

async function saveForOffline() {
  if (!("caches" in window) || !location.protocol.startsWith("http")) {
    return showToast("Open the hosted link to save offline");
  }
  try {
    await navigator.serviceWorker.register("sw.js");

    const tiles = await caches.open("pawson-tiles");
    const urls = campusTileUrls();
    for (let i = 0; i < urls.length; i++) {
      try {
        const response = await fetch(urls[i], { mode: "cors" });
        if (response.ok) await tiles.put(urls[i], response);
      } catch (error) {
        /* skip a tile that fails */
      }
      if (i % 15 === 0) showToast(`Saving campus… ${Math.round((i / urls.length) * 100)}%`);
    }

    const photos = await caches.open("pawson-photos");
    for (const building of BUILDINGS) {
      for (const photo of building.photos || []) {
        try {
          await photos.put(photo, await fetch(photo, { mode: "no-cors" }));
        } catch (error) {
          /* skip */
        }
      }
    }

    const appCache = await caches.open("pawson-app-v8");
    await appCache.addAll(APP_FILES).catch(() => {});
    $("dl").classList.add("on");
    showToast("✅ Campus saved — works in airplane mode");
  } catch (error) {
    showToast("Could not save offline here");
  }
}

function initOffline() {
  window.addEventListener("online", updateNetworkBadge);
  window.addEventListener("offline", () => {
    updateNetworkBadge();
    showToast("You're offline — your saved campus still works");
  });
  updateNetworkBadge();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  $("dl").onclick = saveForOffline;
}
