/* =====================================================================
   SEARCH — the search box, the filter chips and the results list
   ===================================================================== */

// Chips under the search box: Events first, then every category.
const CHIPS = { events: "📅 Events", ...CATEGORIES };

function initSearch() {
  const chipRow = $("chips");
  Object.entries(CHIPS).forEach(([id, label]) => {
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = label;
    chip.dataset.chip = id;
    chip.onclick = () => {
      app.filter = app.filter === id ? null : id;
      app.query = "";
      $("q").value = "";
      renderApp();
      zoomToMatches();
    };
    chipRow.appendChild(chip);
  });

  $("q").oninput = (e) => {
    app.query = e.target.value.toLowerCase().trim();
    app.filter = app.query ? chipFromWords(app.query) : null;
    renderApp();
  };
}

// "printer" → "print", "hungry" → "food" (see SEARCH_WORDS in data/settings.js)
function chipFromWords(text) {
  for (const [chip, words] of Object.entries(SEARCH_WORDS)) {
    if (words.some((word) => text.includes(word))) return chip;
  }
  return null;
}

// Everything about a building that typing can match.
function searchableText(building) {
  const parts = [
    building.code,
    building.name,
    ...building.offers.map((offer) => offer.what),
    ...(building.classes || []).map((c) => `${c.subject} ${c.details}`),
    ...upcomingEventsIn(building.id).map((ev) => ev.title),
  ];
  return parts.join(" ").toLowerCase();
}

function buildingMatches(building) {
  if (app.filter === "events") return upcomingEventsIn(building.id).length > 0;
  if (app.filter === "gear")
    return Boolean(EQUIPMENT[building.id]) || building.offers.some((o) => o.category === "gear");
  if (app.filter) return building.offers.some((offer) => offer.category === app.filter);
  if (app.query) return searchableText(building).includes(app.query);
  return true;
}

function zoomToMatches() {
  if (!map || !app.filter) return;
  const matches = BUILDINGS.filter(buildingMatches);
  if (!matches.length) return;
  const bounds = L.latLngBounds(matches.map((b) => [b.lat, b.lng])).pad(0.6);
  map.flyToBounds(bounds, { duration: 0.8, maxZoom: 18, paddingTopLeft: isDesktop() ? [460, 0] : [0, 0] });
}

// The list under the search box, closest building first when location is on.
function renderResults() {
  const box = $("results");
  if (!app.filter && !app.query) {
    box.classList.remove("show");
    return;
  }

  let matches = BUILDINGS.filter(buildingMatches);
  if (tracker.position)
    matches.sort((a, b) => distanceMeters(tracker.position, a) - distanceMeters(tracker.position, b));

  let html = "";
  const closest = tracker.position && matches[0];
  if (closest) {
    const minutes = walkMinutes(distanceMeters(tracker.position, closest));
    html += `<div class="near">📍 Closest: <b>${escapeHtml(closest.code)} — ${escapeHtml(closest.name)}</b> · ${minutes} min walk</div>`;
  }
  html += `<div class="sec"><span>${app.filter ? CHIPS[app.filter] : "Results"}</span><span>${matches.length}</span></div>`;

  if (!matches.length) {
    html +=
      '<div class="empty" style="padding:14px 16px">No matches. Try “printing”, “food”, “math” or a code like CN.</div>';
  }
  matches.forEach((building) => {
    const meters = tracker.position
      ? `<span class="dist">${Math.round(distanceMeters(tracker.position, building))} m</span>`
      : "";
    html += `<button class="row" onclick="selectBuilding('${building.id}')"><div class="code">${escapeHtml(building.code)}</div>
      <div style="min-width:0"><b>${escapeHtml(building.name)}</b><small>${escapeHtml(resultSubtitle(building))}</small></div>${meters}</button>`;
  });

  if (app.filter === "events") {
    html += `<div style="padding:4px 12px 12px"><button class="bigbtn ghost" onclick="openAllEvents()">See every event on campus</button></div>`;
  }
  box.innerHTML = html;
  box.classList.add("show");
}

// The grey line under each result: why this building matched.
function resultSubtitle(building) {
  if (app.filter === "events") {
    const next = upcomingEventsIn(building.id)[0];
    return `Next: ${next.title} · ${eventWhen(next)}`;
  }
  if (app.filter === "gear" && EQUIPMENT[building.id]) {
    return `${EQUIPMENT[building.id].items.length} kinds of equipment to borrow`;
  }
  const hits = app.filter
    ? building.offers.filter((o) => o.category === app.filter)
    : building.offers.filter((o) => o.what.toLowerCase().includes(app.query));
  return (hits.length ? hits.map((o) => o.what) : [building.subtitle]).slice(0, 3).join(" · ");
}
