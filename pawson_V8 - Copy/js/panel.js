/* =====================================================================
   PANEL — the card that slides in when you tap a building
   =====================================================================
   The panel holds a STACK of pages. Opening something new (events,
   directions, equipment…) slides a page in from the right; Back slides
   it away again. Each page is a plain object like { type: "events",
   building: "cl" } and pageHtml() turns it into HTML.
   ===================================================================== */

function pageHtml(page) {
  switch (page.type) {
    case "building":
      return buildingPage(buildingById(page.building));
    case "events":
      return eventsPage(page);
    case "event":
      return eventDetailPage(page);
    case "route":
      return routePage(page);
    case "guest":
      return guestPage(page);
    case "equipment":
      return equipmentPage(page);
    case "gear":
      return gearItemPage(page);
    case "study":
      return studyRoomsPage(page);
    default:
      return "";
  }
}

// Runs when a page appears / disappears (only routes need this).
function onPageShown(page) {
  if (page.type === "route") drawRoute(page);
}
function onPageLeft(page) {
  if (page.type === "route") clearRoute();
}

function makePageElement(page) {
  const element = document.createElement("section");
  element.className = "page";
  element.innerHTML = pageHtml(page);
  return element;
}

function currentPage() {
  return app.pages[app.pages.length - 1];
}

// Opens the panel with one page (replaces whatever was open).
function openPanel(page) {
  const panel = $("drawer");
  app.pages.forEach(onPageLeft);
  app.pages = [page];
  panel.innerHTML = "";
  panel.appendChild(makePageElement(page));
  panel.classList.add("open");
  document.body.classList.add("dopen");
  afterPageChange();
  onPageShown(page);
  renderApp();
}

// Slides a new page in on top.
function pushPage(page) {
  const panel = $("drawer");
  const previous = panel.lastElementChild;
  const element = makePageElement(page);
  element.classList.add("in-right");
  panel.appendChild(element);
  app.pages.push(page);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      element.classList.remove("in-right");
      if (previous) previous.classList.add("behind");
    }),
  );
  afterPageChange();
  onPageShown(page);
}

// Back: slides the top page away.
function popPage() {
  if (app.pages.length < 2) return closePanel();
  const panel = $("drawer");
  const element = panel.lastElementChild;
  const previous = element.previousElementSibling;
  const leaving = app.pages.pop();
  element.classList.add("in-right");
  previous.classList.remove("behind");
  setTimeout(() => element.remove(), 460);
  onPageLeft(leaving);

  // Redraw the page we went back to (counts may have changed, e.g. after a booking).
  const top = currentPage();
  const scroll = previous.querySelector(".body") ? previous.querySelector(".body").scrollTop : 0;
  previous.innerHTML = pageHtml(top);
  if (previous.querySelector(".body")) previous.querySelector(".body").scrollTop = scroll;
  afterPageChange();

  // Back on a building page: zoom to it again and show its photo.
  if (top.type === "building") {
    const building = buildingById(top.building);
    flyToPoint(building.lat, building.lng, 19);
    setTimeout(() => openPhotoPopup(building), 900);
  }
}

// Redraws the page on top (after logging in, booking a room, …).
function refreshTopPage() {
  const element = $("drawer").lastElementChild;
  if (!element || !currentPage()) return;
  const scroll = element.querySelector(".body") ? element.querySelector(".body").scrollTop : 0;
  element.innerHTML = pageHtml(currentPage());
  const body = element.querySelector(".body");
  if (body) body.scrollTop = scroll;
  afterPageChange();
}

function closePanel() {
  $("drawer").classList.remove("open");
  document.body.classList.remove("dopen");
  app.pages.forEach(onPageLeft);
  app.pages = [];
  app.selectedId = null;
  closePhotoPopup();
  renderApp();
}

function afterPageChange() {
  setTimeout(moveTabUnderline, 30);
}

// The blue line under the active tab.
function moveTabUnderline() {
  const visiblePages = document.querySelectorAll(".drawer .page:not(.in-right):not(.behind)");
  const page = visiblePages[visiblePages.length - 1];
  const tabs = page && page.querySelector(".tabs");
  if (!tabs) return;
  const active = tabs.querySelector("button.on");
  const line = tabs.querySelector(".tabline");
  if (active && line) {
    line.style.width = active.offsetWidth + "px";
    line.style.transform = `translateX(${active.offsetLeft}px)`;
  }
}
window.addEventListener("resize", moveTabUnderline);

/* ---------- opening a building ---------- */

function selectBuilding(buildingId, options = {}) {
  const building = buildingById(buildingId);
  app.selectedId = buildingId;
  app.photoIndex = 0;
  if (!options.keepTab) app.tab = "here";
  closePhotoPopup();
  if (map) {
    flyToPoint(building.lat, building.lng, 19);
    setTimeout(() => {
      const stillOpen = app.selectedId === buildingId && app.pages.length === 1 && app.pages[0].type === "building";
      if (stillOpen) openPhotoPopup(building);
    }, 950);
  }
  openPanel({ type: "building", building: buildingId });
}

function setTab(tab) {
  app.tab = tab;
  const page = $("drawer").lastElementChild;
  page.querySelectorAll(".tabs button").forEach((button) => button.classList.toggle("on", button.dataset.tab === tab));
  moveTabUnderline();
  const body = page.querySelector(".tabc");
  body.innerHTML = tabHtml(buildingById(currentPage().building));
  body.parentElement.scrollTop = 0;
}

/* ---------- the building page ---------- */

const BUILDING_TABS = { here: "What's here", inside: "Inside", classes: "Classes", events: "Events" };

function buildingPage(building) {
  const walk = tracker.position ? ` · ${walkMinutes(distanceMeters(tracker.position, building))} min walk` : "";
  const eventCount = upcomingEventsIn(building.id).length;

  // Quick buttons under the name. Equipment and Study rooms only show when the building has them.
  const buttons = [
    `<button class="act primary" onclick="pushPage({type:'route', building:'${building.id}', from: defaultRouteStart()})">${ICONS.walk}Directions</button>`,
    `<button class="act" onclick="pushPage({type:'events', building:'${building.id}'})">${ICONS.calendar}Events${eventCount ? ` (${eventCount})` : ""}</button>`,
  ];
  if (EQUIPMENT[building.id]) {
    buttons.push(
      `<button class="act" onclick="pushPage({type:'equipment', building:'${building.id}'})">${ICONS.gear}Equipment</button>`,
    );
  }
  if (studyRoomsIn(building.id).length) {
    buttons.push(
      `<button class="act" onclick="pushPage({type:'study', building:'${building.id}'})">${ICONS.door}Study rooms</button>`,
    );
  }

  const tabs = Object.entries(BUILDING_TABS)
    .map(
      ([id, label]) =>
        `<button data-tab="${id}" class="${app.tab === id ? "on" : ""}" onclick="setTab('${id}')">${label}</button>`,
    )
    .join("");

  return `<div class="ph-head">
      <button class="x" onclick="closePanel()" aria-label="Close">✕</button>
      <div class="mob hero">${galleryHtml(building)}</div>
      <div class="dh"><div class="code">${escapeHtml(building.code)}</div>
        <div><h2>${escapeHtml(building.name)}</h2><p>${escapeHtml(building.subtitle)}${walk}</p></div></div>
      <div class="actions">${buttons.join("")}</div>
      ${building.note ? `<div class="warn">⚠️ ${escapeHtml(building.note)}</div>` : ""}
      <div class="tabs">${tabs}<span class="tabline"></span></div>
    </div>
    <div class="body"><div class="tabc">${tabHtml(building)}</div></div>`;
}

function tabHtml(building) {
  const content = {
    here: whatsHereTab,
    inside: insideTab,
    classes: classesTab,
    events: eventsTab,
  }[app.tab](building);
  return `<div class="stagger">${content}</div>`;
}

// "What's here": the building's offers grouped by category. Locked rows hide their details.
function whatsHereTab(building) {
  const groups = {};
  building.offers.forEach((offer) => (groups[offer.category] = groups[offer.category] || []).push(offer));

  const whoCanSee = { student: "a student", staff: "staff", admin: "an admin" };
  let html = "";
  let index = 0;
  for (const [category, offers] of Object.entries(groups)) {
    const rows = offers.map((offer) => {
      if (!canAccess(offer.access)) {
        return `<div class="it lock"><b data-need="${accessLabel(offer.access)} only">${escapeHtml(offer.what)}</b>
          <div class="w">Log in as ${whoCanSee[offer.access]} to see details</div></div>`;
      }
      return `<div class="it"><b>${escapeHtml(offer.what)}</b><div class="w">${escapeHtml(offer.where)}</div>${needTagsHtml(offer.needs)}</div>`;
    });
    html += `<div class="grp" style="--i:${index++}"><h3>${CATEGORIES[category] || category}</h3>${rows.join("")}${categoryButton(building, category)}</div>`;
  }
  html += `<button class="bigbtn ghost" style="--i:${index}" onclick="setTab('inside')">See inside ${escapeHtml(building.code)}</button>`;
  return html;
}

// A button under some categories that opens the working feature.
function categoryButton(building, category) {
  if (category === "gear" && EQUIPMENT[building.id]) {
    return `<button class="bigbtn ghost" onclick="pushPage({type:'equipment', building:'${building.id}'})">Browse equipment</button>`;
  }
  if (category === "study") {
    if (studyRoomsIn(building.id).length) {
      return `<button class="bigbtn ghost" onclick="pushPage({type:'study', building:'${building.id}'})">Book a study room</button>`;
    }
    return `<button class="bigbtn ghost" onclick="openLibraryStudyRooms()">Need a room? Book one in the library (CL)</button>`;
  }
  return "";
}

function classesTab(building) {
  const classes = building.classes || [];
  if (!classes.length)
    return '<div class="empty">No regular classes here. This building is mainly offices and services.</div>';
  const rows = classes.map(
    (c) => `<div class="it"><b>${escapeHtml(c.subject)}</b><div class="w">${escapeHtml(c.details)}</div></div>`,
  );
  return `<div class="grp" style="--i:0"><h3>Subjects taught here</h3>${rows.join("")}</div>
    <div class="empty" style="--i:1">Your exact room is in PAWS. Clarkston rooms start with the building code, e.g. ${escapeHtml(building.code)}1140 is in building ${escapeHtml(building.code)}.</div>`;
}

/* ---------- the top bar, hint and re-drawing ---------- */

// Re-draws everything outside the panel (account buttons, chips, pins, results, hint).
function renderApp() {
  renderAccountButtons();
  document
    .querySelectorAll(".chip[data-chip]")
    .forEach((chip) => chip.classList.toggle("on", chip.dataset.chip === app.filter));
  updatePins();
  renderResults();
  const busy = app.selectedId || app.filter || app.query || app.pages.length;
  $("hint").classList.toggle("gone", Boolean(busy));
}

// Small icons used on buttons.
const ICONS = {
  walk: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 3 3 10.5l7.2 2.3L12.5 20z"/></svg>',
  calendar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4m8-4v4"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17M3 21h18"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg>',
};
