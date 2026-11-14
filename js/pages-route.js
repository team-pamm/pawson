/* =====================================================================
   WALKING DIRECTIONS — draws a route on the map and lists the steps
   =====================================================================
   Online: asks OpenStreetMap's walking router for real paths.
   Offline (or if that fails): a straight line with an estimate.
   The line always starts exactly at your start point (V6 fix).
   ===================================================================== */

let routeLayer = null; // what is drawn on the map
let routeRequestId = 0; // ignores old answers when you switch start points quickly

// Start from your location only when it is good (±50 m or set by hand); otherwise the parking deck.
function defaultRouteStart() {
  const good = tracker.position && (tracker.source === "manual" || tracker.accuracy <= 50);
  return good ? "me" : "deck";
}

function routePage(page) {
  const building = buildingById(page.building);
  const choices = [
    ["me", "📍", "my location"],
    ...Object.entries(START_POINTS).map(([id, p]) => [id, p.icon, p.name.toLowerCase()]),
  ];
  const startButtons = choices
    .map(
      ([id, icon, label]) =>
        `<button class="chip ${page.from === id ? "on" : ""}" onclick="setRouteStart('${id}')">${icon} From ${label}</button>`,
    )
    .join("");

  return `<div class="ph-head"><button class="back" onclick="popPage()">‹ Back</button><button class="x" onclick="closePanel()">✕</button>
      <h2 class="subh">Walk to ${escapeHtml(building.code)}</h2><p class="subp">${escapeHtml(building.name)}</p>
      <div class="startrow">${startButtons}</div></div>
    <div class="body">${routeWarning(page)}
      <div class="sum"><b id="rMin">…</b><span id="rDist">Finding the best walking route</span></div>
      <div id="rSteps" class="stagger" style="margin-top:6px"></div></div>`;
}

// Explains when the start may be off because location is rough.
function routeWarning(page) {
  if (!tracker.position || tracker.source === "manual" || tracker.accuracy <= 50) return "";
  if (page.from === "me") {
    return `<div class="warn" style="margin-top:12px">Your location is ±${tracker.accuracy} m, so this start may be off. Tap Fix on the location pill to set your spot.</div>`;
  }
  return `<div class="warn" style="margin-top:12px">Starting from the ${START_POINTS[page.from].name.toLowerCase()} because your location is rough (±${tracker.accuracy} m). Tap From my location to use it anyway.</div>`;
}

function setRouteStart(startId) {
  if (startId === "me" && !tracker.position) {
    showToast("Turn on your location first (➤ button)");
    return;
  }
  currentPage().from = startId;
  refreshTopPage();
  drawRoute(currentPage());
}

function clearRoute() {
  routeRequestId++;
  if (routeLayer && map) map.removeLayer(routeLayer);
  routeLayer = null;
}

async function drawRoute(page) {
  if (!map) return;
  clearRoute();
  const requestId = routeRequestId;
  const building = buildingById(page.building);
  const start =
    page.from === "me" && tracker.position ? tracker.position : START_POINTS[page.from === "me" ? "deck" : page.from];
  closePhotoPopup();

  // 1) Straight line right away, so something shows instantly.
  const straight = distanceMeters(start, building);
  const startText =
    page.from === "me" && tracker.position
      ? "Start at your location"
      : `Start at the ${START_POINTS[page.from].name.toLowerCase()}`;
  showRoute(
    requestId,
    [
      [start.lat, start.lng],
      [building.lat, building.lng],
    ],
    straight * 1.25,
    (straight * 1.25) / 1.3,
    [startText, `Head toward ${building.code} (${building.name})`, `Arrive at ${building.code}`],
    true,
  );

  // 2) Real walking route when online.
  if (!navigator.onLine) return;
  try {
    const timeout = new AbortController();
    setTimeout(() => timeout.abort(), 4000);
    const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${start.lng},${start.lat};${building.lng},${building.lat}?overview=full&geometries=geojson&steps=true`;
    const answer = await (await fetch(url, { signal: timeout.signal })).json();
    const route = answer.routes && answer.routes[0];
    if (!route) return;

    const points = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    points.unshift([start.lat, start.lng]); // start exactly where you are
    points.push([building.lat, building.lng]); // end at the building pin
    showRoute(requestId, points, route.distance, route.duration, routeSteps(route, building), false);
  } catch (error) {
    /* keep the straight line */
  }
}

function routeSteps(route, building) {
  const compass = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];
  return route.legs[0].steps
    .map((step) => {
      const move = step.maneuver;
      const meters = step.distance > 5 ? ` <span style="color:var(--mut)">· ${Math.round(step.distance)} m</span>` : "";
      if (move.type === "depart")
        return `Head ${compass[Math.round(move.bearing_after / 45) % 8]}${step.name ? " on " + escapeHtml(step.name) : ""}${meters}`;
      if (move.type === "arrive") return `Arrive at ${escapeHtml(building.code)} — ${escapeHtml(building.name)}`;
      const turn = !move.modifier || move.modifier === "straight" ? "Continue straight" : `Turn ${move.modifier}`;
      return turn + (step.name ? ` onto ${escapeHtml(step.name)}` : "") + meters;
    })
    .slice(0, 8);
}

function showRoute(requestId, points, meters, seconds, steps, approximate) {
  if (requestId !== routeRequestId) return; // an older request — ignore
  if (routeLayer) map.removeLayer(routeLayer);
  const startDot = L.marker(points[0], {
    icon: L.divIcon({ className: "", html: '<div class="startpt"></div>', iconSize: [16, 16], iconAnchor: [8, 8] }),
  });
  routeLayer = L.layerGroup([
    L.polyline(points, { color: "#fff", weight: 9, opacity: 0.9 }),
    L.polyline(points, { color: "#0039A6", weight: 6, className: "route-line" }),
    startDot,
  ]).addTo(map);
  map.flyToBounds(L.latLngBounds(points), {
    paddingTopLeft: isDesktop() ? [460, 90] : [30, 90],
    paddingBottomRight: isDesktop() ? [450, 60] : [30, window.innerHeight * 0.82],
    duration: 0.8,
    maxZoom: 19,
  });

  if (!$("rMin")) return;
  $("rMin").textContent = `${Math.max(1, Math.round(seconds / 60))} min`;
  $("rDist").textContent = `${Math.round(meters)} m walk${approximate ? " · approximate" : ""}`;
  $("rSteps").innerHTML = steps
    .map((text, i) => `<div class="step" style="--i:${i}"><i>${i + 1}</i><div>${text}</div></div>`)
    .join("");
}
