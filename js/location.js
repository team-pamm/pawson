/* =====================================================================
   LOCATION — your blue dot, its accuracy, and setting it by hand
   =====================================================================
   Accuracy: a laptop finds itself by Wi-Fi (about ±100 m); a phone's GPS
   outdoors is about ±5–20 m. We average the best recent readings, show
   the accuracy in the pill, and let people tap "Fix" to place themselves.

   Permission (V7 fix): when you switch tabs, tracking pauses. Coming back
   resumes it ONLY if the browser already allows location, so the app
   never pops up the permission question on its own. Otherwise the pill
   shows "Resume", and tapping it asks.
   ===================================================================== */

const tracker = {
  position: null, // { lat, lng } or null
  accuracy: null, // meters
  source: null, // "gps" | "manual"
  readings: [], // recent GPS readings used for averaging
  watchId: null, // id from navigator.geolocation.watchPosition
  wanted: false, // the user turned location on
  paused: false, // paused because the tab was hidden
  picking: false, // "Fix" mode: the next map tap sets your location
};

let myDot = null; // the blue dot on the map
let myCircle = null; // the accuracy circle

function nearestBuilding(point) {
  let best = null;
  let bestDistance = Infinity;
  BUILDINGS.forEach((building) => {
    const meters = distanceMeters(point, building);
    if (meters < bestDistance) {
      bestDistance = meters;
      best = building;
    }
  });
  return { building: best, meters: bestDistance };
}

/* ---------- drawing ---------- */

function drawMyLocation() {
  if (!map || !tracker.position) return;
  const latLng = [tracker.position.lat, tracker.position.lng];
  const rough = tracker.source !== "manual" && tracker.accuracy > 60;

  if (!myDot) {
    const icon = L.divIcon({ className: "", html: '<div class="me"></div>', iconSize: [20, 20], iconAnchor: [10, 10] });
    myDot = L.marker(latLng, { icon, zIndexOffset: 2000, interactive: false }).addTo(map);
    myCircle = L.circle(latLng, { radius: 5, weight: 1, fillOpacity: 0.07, interactive: false }).addTo(map);
  } else {
    myDot.setLatLng(latLng);
    myCircle.setLatLng(latLng);
  }
  myCircle.setRadius(Math.max(tracker.accuracy || 5, 5));
  myCircle.setStyle({
    color: rough ? "#b45309" : "#1f5bd1",
    fillColor: rough ? "#f59e0b" : "#1f5bd1",
    dashArray: rough ? "6 6" : null,
  });
  updateLocationPill();
}

// The pill at the bottom left: accuracy, nearest building, and a button.
function updateLocationPill() {
  const pill = $("locpill");
  if (!tracker.wanted && !tracker.position) {
    pill.hidden = true;
    return;
  }
  pill.hidden = false;
  const fixLabel = tracker.picking ? "Tap the map…" : "Fix";

  if (tracker.paused) {
    pill.className = "locpill paused";
    pill.innerHTML = `<span class="ld"></span><b>Location paused</b><button onclick="resumeTracking()">Resume</button>`;
    return;
  }
  if (!tracker.position) {
    pill.className = "locpill poor";
    pill.innerHTML = `<span class="ld"></span><b>Finding you…</b><button onclick="startPicking()">${tracker.picking ? fixLabel : "Set it"}</button>`;
    return;
  }

  const manual = tracker.source === "manual";
  const quality = manual || tracker.accuracy <= 25 ? "good" : tracker.accuracy <= 60 ? "ok" : "poor";
  const words = { good: "precise", ok: "approximate", poor: "rough" };
  const near = nearestBuilding(tracker.position);
  const atBuilding = near.meters < 45 ? ` · at ${escapeHtml(near.building.code)}` : "";
  pill.className = "locpill " + quality;
  pill.innerHTML = `<span class="ld"></span><b>${manual ? "Set by you" : "±" + tracker.accuracy + " m"}</b>
    <span>${manual ? "" : words[quality]}${atBuilding}</span><button onclick="startPicking()">${fixLabel}</button>`;
}

/* ---------- GPS readings ---------- */

function onPositionReading(reading) {
  const accuracy = Math.round(reading.coords.accuracy || 999);
  const now = Date.now();

  // A location you set by hand stays until GPS is truly precise (±20 m).
  if (tracker.source === "manual" && accuracy > 20) return;

  // Keep the last 20 seconds of readings and average the best ones (better accuracy counts more).
  tracker.readings.push({ lat: reading.coords.latitude, lng: reading.coords.longitude, accuracy, at: now });
  tracker.readings = tracker.readings.filter((r) => now - r.at < 20000).slice(-6);
  const best = Math.min(...tracker.readings.map((r) => r.accuracy));
  const good = tracker.readings.filter((r) => r.accuracy <= best * 1.5);
  let weightSum = 0,
    lat = 0,
    lng = 0;
  good.forEach((r) => {
    const weight = 1 / (r.accuracy * r.accuracy);
    weightSum += weight;
    lat += r.lat * weight;
    lng += r.lng * weight;
  });

  const firstFix = !tracker.position;
  const wasManual = tracker.source === "manual";
  tracker.position = { lat: lat / weightSum, lng: lng / weightSum };
  tracker.accuracy = best;
  tracker.source = "gps";
  drawMyLocation();
  $("locate").classList.add("on");

  if (wasManual) {
    showToast(`Switched back to GPS · ±${tracker.accuracy} m`);
  } else if (firstFix) {
    showToast(
      tracker.accuracy > 60
        ? `Location is rough (±${tracker.accuracy} m) — tap Fix to set your spot`
        : `Location on · ±${tracker.accuracy} m`,
    );
    if (!app.pages.length && map) map.flyTo([tracker.position.lat, tracker.position.lng], 18, { duration: 0.8 });
  }
  renderApp();
}

function onPositionError(error) {
  if (error && error.code === 1) {
    // permission denied
    stopWatching();
    tracker.wanted = false;
    showToast("Location blocked — tap Set it to place yourself");
  }
  updateLocationPill();
}

function startWatching() {
  if (tracker.watchId !== null || !navigator.geolocation) return;
  tracker.paused = false;
  tracker.watchId = navigator.geolocation.watchPosition(onPositionReading, onPositionError, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 20000,
  });
  updateLocationPill();
}

function stopWatching() {
  if (tracker.watchId !== null) navigator.geolocation.clearWatch(tracker.watchId);
  tracker.watchId = null;
}

// The ➤ button.
function onLocateButton() {
  if (!navigator.geolocation) return showToast("Location not available on this device");
  if (tracker.watchId !== null) {
    if (tracker.position && map) map.flyTo([tracker.position.lat, tracker.position.lng], 18, { duration: 0.8 });
    return;
  }
  tracker.wanted = true;
  showToast("Finding you…");
  startWatching();
}

/* ---------- pause when the tab is hidden (the permission fix) ---------- */

async function locationPermission() {
  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state; // "granted" | "prompt" | "denied"
  } catch (error) {
    return "unknown";
  }
}

function pauseTracking() {
  if (tracker.watchId === null) return;
  stopWatching();
  tracker.paused = true;
}

async function resumeTrackingIfAllowed() {
  if (!tracker.wanted || !tracker.paused) return;
  if ((await locationPermission()) === "granted")
    startWatching(); // no question pops up
  else updateLocationPill(); // shows "Location paused · Resume"
}

// The "Resume" button: the user asked, so the browser may ask too.
function resumeTracking() {
  tracker.paused = false;
  startWatching();
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseTracking();
  else resumeTrackingIfAllowed();
});

/* ---------- Fix: set your location by tapping ---------- */

function startPicking() {
  tracker.picking = !tracker.picking;
  updateLocationPill();
  if (tracker.picking) {
    closePhotoPopup();
    showToast("Tap the map or a building where you are");
  }
}

function setManualPosition(lat, lng, building) {
  tracker.picking = false;
  tracker.position = { lat, lng };
  tracker.accuracy = 5;
  tracker.source = "manual";
  tracker.readings = [];
  drawMyLocation();
  $("locate").classList.add("on");
  showToast(building ? `You're at ${building.code}` : "Location set — GPS takes over once it is precise");
  renderApp();
}
