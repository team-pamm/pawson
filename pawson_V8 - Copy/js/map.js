/* =====================================================================
   MAP — the Leaflet map, building pins, photo pop-up and photo viewer
   ===================================================================== */

let map = null; // the Leaflet map (null if Leaflet failed to load)
const pinMarkers = {}; // building id → Leaflet marker
const mapLayers = {}; // "street" | "satellite" → Leaflet tile layer
let photoPopup = null; // the photo pop-up above a building

function initMap() {
  if (!window.L) {
    $("map").innerHTML =
      '<div style="padding:120px 30px;color:#5f6f8f;text-align:center;font-weight:600">' +
      "The map library didn't load. Open the app once while online, then it also works offline.</div>";
    return;
  }

  map = L.map("map", { zoomControl: false, zoomSnap: 0.25 }).setView([CAMPUS.lat, CAMPUS.lng], CAMPUS.zoom);

  const tileOptions = { maxZoom: 20, maxNativeZoom: 19 };
  mapLayers.street = L.tileLayer(MAP_LAYERS.street.url, { ...tileOptions, attribution: MAP_LAYERS.street.credit });
  mapLayers.satellite = L.tileLayer(MAP_LAYERS.satellite.url, {
    ...tileOptions,
    attribution: MAP_LAYERS.satellite.credit,
  });
  mapLayers.street.addTo(map);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  addBuildingPins();

  // Tapping empty map: either sets your location (Fix mode) or closes the panel.
  map.on("click", (e) => {
    if (tracker.picking) {
      setManualPosition(e.latlng.lat, e.latlng.lng);
    } else if (app.pages.length) {
      closePanel();
    }
  });

  $("bMap").onclick = () => setMapStyle("street");
  $("bSat").onclick = () => setMapStyle("satellite");
  $("home").onclick = () => {
    closePanel();
    map.flyTo([CAMPUS.lat, CAMPUS.lng], CAMPUS.zoom, { duration: 0.8 });
  };
}

function setMapStyle(style) {
  const other = style === "street" ? "satellite" : "street";
  map.removeLayer(mapLayers[other]);
  mapLayers[style].addTo(map);
  $("bMap").classList.toggle("on", style === "street");
  $("bSat").classList.toggle("on", style === "satellite");
}

/* ---------- building pins ---------- */

function addBuildingPins() {
  // Pins drop in from north to south, one after another.
  const northToSouth = [...BUILDINGS].sort((a, b) => b.lat - a.lat);
  northToSouth.forEach((building, index) => {
    const delay = 0.75 + index * 0.06;
    const icon = L.divIcon({
      className: "pinwrap",
      html: `<div class="pin" style="--d:${delay}s"><div class="lab">${PAW_ICON}${escapeHtml(building.code)}</div><div class="stem"></div></div>`,
      iconSize: [56, 40],
      iconAnchor: [28, 40],
    });
    const marker = L.marker([building.lat, building.lng], { icon, riseOnHover: true, title: building.name });
    marker.on("click", () => {
      if (tracker.picking) setManualPosition(building.lat, building.lng, building);
      else selectBuilding(building.id);
    });
    marker.addTo(map);
    pinMarkers[building.id] = marker;
  });
}

// Selected = white pin, matching the search = darker pin, not matching = faded.
function updatePins() {
  const searching = Boolean(app.filter || app.query);
  BUILDINGS.forEach((building) => {
    const marker = pinMarkers[building.id];
    const pin = marker && marker.getElement() && marker.getElement().querySelector(".pin");
    if (!pin) return;
    let state = "";
    if (building.id === app.selectedId) state = "sel";
    else if (searching) state = buildingMatches(building) ? "hit" : "dim";
    pin.className = "pin " + state;
    marker.setZIndexOffset(building.id === app.selectedId ? 1000 : 0);
  });
}

// Zooms to a point but leaves room for the panel (right side on laptops, bottom on phones).
function flyToPoint(lat, lng, zoom) {
  if (!map) return;
  const point = map.project([lat, lng], zoom);
  const offset = isDesktop() ? L.point(216, -120) : L.point(0, window.innerHeight * 0.33);
  map.flyTo(map.unproject(point.add(offset), zoom), zoom, { duration: 0.9, easeLinearity: 0.15 });
}

/* ---------- photos: gallery, pop-up on the map, full-screen viewer ---------- */

function galleryHtml(building) {
  const photos = building.photos || [];
  const current = photos[app.photoIndex % Math.max(photos.length, 1)];
  let html = `<div class="gal" data-gallery="${building.id}"><div class="ph">${PAW_ICON}&nbsp;${escapeHtml(building.code)}</div>`;
  if (photos.length) {
    html += `<img src="${current}" alt="${escapeHtml(building.code)} building" onclick="openPhotoViewer('${building.id}')" onerror="this.style.display='none'">`;
    html += `<button class="zoom" onclick="openPhotoViewer('${building.id}')">⤢ View</button>`;
  }
  if (photos.length > 1) {
    const dots = photos.map((_, i) => `<i class="${i === app.photoIndex ? "on" : ""}"></i>`).join("");
    html += `<button class="nav prev" onclick="changePhoto(-1, event)">‹</button>`;
    html += `<button class="nav next" onclick="changePhoto(1, event)">›</button>`;
    html += `<div class="dots">${dots}</div>`;
  }
  return html + "</div>";
}

// Next / previous photo, with a fade.
function changePhoto(step, clickEvent) {
  if (clickEvent) clickEvent.stopPropagation();
  const building = buildingById(app.selectedId);
  const photos = building ? building.photos || [] : [];
  if (photos.length < 2) return;
  app.photoIndex = (app.photoIndex + step + photos.length) % photos.length;

  document.querySelectorAll(`.gal[data-gallery="${building.id}"]`).forEach((gallery) => {
    const img = gallery.querySelector("img");
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = photos[app.photoIndex];
      img.onload = () => (img.style.opacity = 1);
    }, 250);
    gallery.querySelectorAll(".dots i").forEach((dot, i) => dot.classList.toggle("on", i === app.photoIndex));
  });
}

// The photo card that pops up above the building (laptops only; phones show it in the panel).
function openPhotoPopup(building) {
  if (!map || !isDesktop()) return;
  closePhotoPopup();
  const content =
    galleryHtml(building) +
    `<div class="cap"><b>${escapeHtml(building.code)} · ${escapeHtml(building.name)}</b><span>Photo: Georgia State University</span></div>`;
  photoPopup = L.popup({
    className: "photo-pop",
    closeButton: false,
    autoPan: false,
    offset: [0, -34],
    maxWidth: 320,
    minWidth: 320,
    closeOnClick: false,
  })
    .setLatLng([building.lat, building.lng])
    .setContent(content)
    .openOn(map);
}

function closePhotoPopup() {
  if (photoPopup && map) map.closePopup(photoPopup);
  photoPopup = null;
}

// Full-screen photo viewer
function openPhotoViewer(buildingId) {
  const building = buildingById(buildingId);
  $("lbImg").src = building.photos[app.photoIndex];
  $("lbCap").textContent = `${building.code} · ${building.name}`;
  $("lb").classList.add("show");
}

function stepPhotoViewer(step) {
  changePhoto(step);
  const building = buildingById(app.selectedId);
  const img = $("lbImg");
  img.style.opacity = 0;
  setTimeout(() => {
    img.src = building.photos[app.photoIndex];
    img.onload = () => (img.style.opacity = 1);
  }, 250);
}

function closePhotoViewer() {
  $("lb").classList.remove("show");
}
