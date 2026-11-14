/* =====================================================================
   HELPERS — small tools used by every other file
   ===================================================================== */

// Shortcut for document.getElementById
const $ = (id) => document.getElementById(id);

// Makes text safe to put inside HTML (stops "<" in a name from breaking the page).
function escapeHtml(value) {
  const replacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value ?? "").replace(/[&<>"']/g, (ch) => replacements[ch]);
}

// Saved data lives in this browser only (localStorage). Some browsers block it, so every call is wrapped.
const storage = {
  get(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* storage not available — the demo still works, it just forgets on reload */
    }
  },
};

/* ---------- buildings ---------- */

function buildingById(id) {
  return BUILDINGS.find((building) => building.id === id);
}

/* ---------- distance and walking time ---------- */

// Straight-line distance in meters between two {lat, lng} points.
function distanceMeters(a, b) {
  const earthRadius = 6371000;
  const toRadians = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toRadians;
  const dLng = (b.lng - a.lng) * toRadians;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toRadians) * Math.cos(b.lat * toRadians) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

// About 80 meters per minute of walking.
function walkMinutes(meters) {
  return Math.max(1, Math.round(meters / 80));
}

/* ---------- screen size ---------- */

function isDesktop() {
  return window.innerWidth > 760;
}

/* ---------- toast (the little message at the top) ---------- */

function showToast(text) {
  const toast = $("toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- access levels (who can see what) ---------- */

function currentRole() {
  return app.user ? app.user.role : "public";
}

function userRank() {
  return ACCESS_LEVELS[currentRole()].rank;
}

function canAccess(access) {
  return ACCESS_LEVELS[access || "public"].rank <= userRank();
}

function accessLabel(access) {
  return ACCESS_LEVELS[access || "public"].label;
}

function isStaffOrAdmin() {
  return userRank() >= ACCESS_LEVELS.staff.rank;
}

function isAdmin() {
  return currentRole() === "admin";
}

// The little tags that say what you need: "PantherCard", "CampusID login", …
function needTagsHtml(needs) {
  const tags = (needs || []).map((key) => {
    const style = key === "open" ? "tag open" : "tag";
    return `<span class="${style}">${escapeHtml(NEEDS[key] || key)}</span>`;
  });
  return `<div class="tags">${tags.join("")}</div>`;
}

/* ---------- dates and times ---------- */

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isSameDay(a, b) {
  return a.toDateString() === b.toDateString();
}

// "YYYY-MM-DD" in local time (used as a key for bookings).
function dateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// "Today", "Tonight", "Tomorrow" or "Thu, Nov 19"
function dayLabel(date) {
  const now = new Date();
  if (isSameDay(date, now)) return date.getHours() >= 17 ? "Tonight" : "Today";
  if (isSameDay(date, addDays(now, 1))) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// "7:30 PM"
function timeLabel(date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// "3 PM" for an hour number like 15
function hourLabel(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelveHour} ${suffix}`;
}

/* ---------- codes ---------- */

// Random code without look-alike characters (no 0/O, 1/I/L).
function randomCode(length) {
  const characters = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  return code;
}

// The paw icon used on pins, the logo and the hint.
const PAW_ICON =
  '<svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">' +
  '<ellipse cx="16" cy="21.5" rx="7.2" ry="6.2"/><ellipse cx="6.8" cy="13.5" rx="2.9" ry="3.7"/>' +
  '<ellipse cx="12.4" cy="8" rx="2.9" ry="3.9"/><ellipse cx="19.6" cy="8" rx="2.9" ry="3.9"/>' +
  '<ellipse cx="25.2" cy="13.5" rx="2.9" ry="3.7"/></svg>';
