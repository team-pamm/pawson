/* =====================================================================
   START — checks the data files, then starts everything
   ===================================================================== */

// Catches typos when you replace the fake data with real data.
// Problems are listed in the browser console (F12 → Console).
function checkData() {
  const problems = [];
  const buildingIds = new Set(BUILDINGS.map((b) => b.id));

  BUILDINGS.forEach((b) => {
    if (typeof b.lat !== "number" || typeof b.lng !== "number") problems.push(`buildings.js: ${b.id} has no lat/lng`);
    (b.offers || []).forEach((offer) => {
      if (!CATEGORIES[offer.category])
        problems.push(`buildings.js: ${b.id} "${offer.what}" has unknown category "${offer.category}"`);
      if (offer.access && !ACCESS_LEVELS[offer.access])
        problems.push(`buildings.js: ${b.id} "${offer.what}" has unknown access "${offer.access}"`);
      (offer.needs || []).forEach((need) => {
        if (!NEEDS[need]) problems.push(`buildings.js: ${b.id} "${offer.what}" has unknown need "${need}"`);
      });
    });
  });

  Object.entries(INTERIORS).forEach(([id, interior]) => {
    if (!buildingIds.has(id)) problems.push(`interiors.js: "${id}" is not a building id`);
    [...(interior.top || []), ...(interior.bottomLeft || []), ...(interior.bottomRight || [])].forEach((room) => {
      if (!ACCESS_LEVELS[room.access])
        problems.push(`interiors.js: ${id} room "${room.name}" has unknown access "${room.access}"`);
    });
  });

  DEMO_EVENTS.forEach((ev) => {
    if (ev.building && !buildingIds.has(ev.building))
      problems.push(`events.js: "${ev.title}" has unknown building "${ev.building}"`);
    if (!ev.allDay && !/^\d{1,2}:\d{2}$/.test(ev.start || ""))
      problems.push(`events.js: "${ev.title}" needs a start like "19:00"`);
  });

  Object.keys(EQUIPMENT).forEach((id) => {
    if (!buildingIds.has(id)) problems.push(`equipment.js: "${id}" is not a building id`);
  });

  STUDY_ROOMS.forEach((room) => {
    if (!buildingIds.has(room.building))
      problems.push(`study-rooms.js: ${room.id} has unknown building "${room.building}"`);
  });

  if (problems.length) {
    console.warn(`PawsOn data check found ${problems.length} problem(s):\n` + problems.join("\n"));
    showToast(`Data check: ${problems.length} problem(s) — see console`);
  }
}

function startApp() {
  initMap();
  initSearch();
  initOffline();
  $("locate").onclick = onLocateButton;

  // Close buttons and keyboard
  $("modal").onclick = (e) => {
    if (e.target.id === "modal") closeModal();
  };
  $("lb").onclick = (e) => {
    if (e.target.id === "lb") closePhotoViewer();
  };
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if ($("lb").classList.contains("show")) closePhotoViewer();
    else if ($("modal").classList.contains("show")) closeModal();
    else if (app.pages.length > 1) popPage();
    else if (app.pages.length) closePanel();
  });

  renderApp();
  checkData();

  // Start screen: Panther logo, then the team's names (js/splash.js).
  playSplash();
}

startApp();
