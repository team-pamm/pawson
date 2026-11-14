/* =====================================================================
   STUDY ROOMS — book one-hour slots (demo, no backend)
   =====================================================================
   Rooms, hours and rules come from data/study-rooms.js. Bookings made
   in the app are saved in this browser under "pawson-study":
     { bookings: [{ room, date, hour, by, username }],
       cancelled: ["room|date|hour", …],   ← cancelled demo bookings
       closed: ["room|date", …] }          ← rooms an admin closed
   ===================================================================== */

const studyState = storage.get("pawson-study", { bookings: [], cancelled: [], closed: [] });

function saveStudy() {
  storage.set("pawson-study", studyState);
}

function studyRoomsIn(buildingId) {
  return STUDY_ROOMS.filter((room) => room.building === buildingId);
}

function openLibraryStudyRooms() {
  selectBuilding("cl");
  pushPage({ type: "study", building: "cl" });
}

const slotKey = (roomId, date, hour) => `${roomId}|${date}|${hour}`;

// Everyone's bookings for one room on one date: the fake ones from the data file + the ones made in the app.
function bookingsFor(roomId, date) {
  const fake = DEMO_BOOKINGS.filter((b) => b.room === roomId && dateKey(addDays(startOfToday(), b.day)) === date)
    .map((b) => ({ room: b.room, date, hour: b.hour, by: b.by, demo: true }))
    .filter((b) => !studyState.cancelled.includes(slotKey(b.room, b.date, b.hour)));
  const real = studyState.bookings.filter((b) => b.room === roomId && b.date === date);
  return [...fake, ...real];
}

function isRoomClosed(roomId, date) {
  return studyState.closed.includes(`${roomId}|${date}`);
}

// "free" | "booked" | "mine" | "past" | "closed"
function slotStatus(roomId, date, hour) {
  if (isRoomClosed(roomId, date)) return "closed";
  const today = dateKey(new Date()) === date;
  if (today && hour < new Date().getHours()) return "past";
  const booking = bookingsFor(roomId, date).find((b) => b.hour === hour);
  if (!booking) return "free";
  return app.user && booking.username === app.user.username ? "mine" : "booked";
}

function hoursBookedBy(username, date) {
  return studyState.bookings.filter((b) => b.username === username && b.date === date).length;
}

/* ---------- the page ---------- */

function studyRoomsPage(page) {
  const building = buildingById(page.building);
  const dayOffset = page.day || 0;
  const date = dateKey(addDays(startOfToday(), dayOffset));
  const dayNames = ["Today", "Tomorrow", "In 2 days", "In 3 days"];

  const dayTabs = Array.from(
    { length: BOOKING_RULES.daysAhead },
    (_, d) =>
      `<button class="chip ${d === dayOffset ? "on" : ""}" onclick="setStudyDay(${d})">${dayNames[d] || `In ${d} days`}</button>`,
  ).join("");

  const loginNote = app.user
    ? ""
    : `<div class="warn" style="margin-top:12px">Log in as a student to book. You can still see what's free.</div>`;

  const roomCards = studyRoomsIn(page.building).map((room, i) => {
    const closed = isRoomClosed(room.id, date);
    let slots = "";
    for (let hour = STUDY_HOURS.firstHour; hour <= STUDY_HOURS.lastHour; hour++) {
      const status = slotStatus(room.id, date, hour);
      const disabled = status === "past" || status === "closed" ? "disabled" : "";
      slots += `<button class="slot ${status}" ${disabled} onclick="tapStudySlot('${room.id}','${date}',${hour})">${hourLabel(hour).replace(" ", "")}</button>`;
    }
    const features = room.features.map((f) => `<span class="tag">${escapeHtml(f)}</span>`).join("");
    const adminButton = isAdmin()
      ? `<button class="mini" onclick="toggleRoomClosed('${room.id}','${date}')">${closed ? "Reopen" : "Close for the day"}</button>`
      : "";
    return `<div class="room-card ${closed ? "closed" : ""}" style="--i:${i + 1}">
        <div class="room-head"><div><b>${escapeHtml(room.name)}</b> <span style="color:var(--mut);font-size:12.5px">· ${room.seats} seats${closed ? " · closed" : ""}</span></div>${adminButton}</div>
        <div class="tags">${features}</div><div class="slots">${slots}</div></div>`;
  });

  return `<div class="ph-head"><button class="back" onclick="popPage()">‹ Back</button><button class="x" onclick="closePanel()">✕</button>
      <h2 class="subh">Study rooms in ${escapeHtml(building.code)}</h2>
      <p class="subp">Students can book up to ${BOOKING_RULES.maxHoursPerDay} hours a day · demo</p>
      <div class="day-tabs">${dayTabs}</div></div>
    <div class="body stagger">${loginNote}${myBookingsHtml()}${roomCards.join("")}
      <div class="slot-key" style="--i:9"><span><i></i>Free</span><span><i class="booked"></i>Booked</span><span><i class="mine"></i>Yours</span></div></div>`;
}

// "Your bookings" list at the top.
function myBookingsHtml() {
  if (!app.user) return "";
  const today = dateKey(new Date());
  const mine = studyState.bookings
    .filter((b) => b.username === app.user.username && b.date >= today)
    .sort((a, b) => (a.date + String(a.hour).padStart(2, "0")).localeCompare(b.date + String(b.hour).padStart(2, "0")));
  if (!mine.length) return "";
  const rows = mine.map((b) => {
    const room = STUDY_ROOMS.find((r) => r.id === b.room);
    const day = b.date === today ? "Today" : "Tomorrow";
    return `<div class="person"><div style="flex:1"><b>${escapeHtml(room.name)}</b><small>${day} · ${hourLabel(b.hour)} – ${hourLabel(b.hour + 1)}</small></div>
      <button class="mini" onclick="cancelStudyBooking('${b.room}','${b.date}',${b.hour})">Cancel</button></div>`;
  });
  return `<div class="card" style="--i:0;margin-top:12px"><b>Your bookings</b>${rows.join("")}</div>`;
}

function setStudyDay(dayOffset) {
  currentPage().day = dayOffset;
  refreshTopPage();
}

/* ---------- tapping a slot ---------- */

function tapStudySlot(roomId, date, hour) {
  const room = STUDY_ROOMS.find((r) => r.id === roomId);
  const status = slotStatus(roomId, date, hour);
  const when = `${date === dateKey(new Date()) ? "Today" : "Tomorrow"}, ${hourLabel(hour)} – ${hourLabel(hour + 1)}`;

  if (status === "free") {
    if (!app.user) return openLogin();
    if (app.user.role === "student" && hoursBookedBy(app.user.username, date) >= BOOKING_RULES.maxHoursPerDay) {
      return showToast(`Students can book up to ${BOOKING_RULES.maxHoursPerDay} hours a day`);
    }
    return showModal(`<div class="mtop"><h2>Book ${escapeHtml(room.name)}?</h2><p>${when} · ${room.seats} seats</p></div>
      <div class="mform"><button class="bigbtn" onclick="bookStudySlot('${roomId}','${date}',${hour})">Book it</button>
      <button class="bigbtn ghost" onclick="closeModal()">Cancel</button></div>`);
  }

  if (status === "mine") {
    return showModal(`<div class="mtop"><h2>Cancel your booking?</h2><p>${escapeHtml(room.name)} · ${when}</p></div>
      <div class="mform"><button class="bigbtn" onclick="cancelStudyBooking('${roomId}','${date}',${hour})">Yes, cancel it</button>
      <button class="bigbtn ghost" onclick="closeModal()">Keep it</button></div>`);
  }

  if (status === "booked") {
    if (!isStaffOrAdmin()) return showToast("That slot is already booked");
    const booking = bookingsFor(roomId, date).find((b) => b.hour === hour);
    return showModal(`<div class="mtop"><h2>${escapeHtml(room.name)} · ${when}</h2><p>Booked by ${escapeHtml(booking.by)}</p></div>
      <div class="mform"><button class="bigbtn" onclick="cancelStudyBooking('${roomId}','${date}',${hour})">Cancel this booking</button>
      <button class="bigbtn ghost" onclick="closeModal()">Close</button></div>`);
  }
}

function bookStudySlot(roomId, date, hour) {
  studyState.bookings.push({ room: roomId, date, hour, by: app.user.name, username: app.user.username });
  saveStudy();
  closeModal();
  refreshTopPage();
  const room = STUDY_ROOMS.find((r) => r.id === roomId);
  showToast(`Booked ${room.name}, ${hourLabel(hour)} – ${hourLabel(hour + 1)}`);
}

function cancelStudyBooking(roomId, date, hour) {
  const before = studyState.bookings.length;
  studyState.bookings = studyState.bookings.filter((b) => !(b.room === roomId && b.date === date && b.hour === hour));
  if (studyState.bookings.length === before) studyState.cancelled.push(slotKey(roomId, date, hour)); // it was a demo booking
  saveStudy();
  closeModal();
  refreshTopPage();
  showToast("Booking cancelled");
}

function toggleRoomClosed(roomId, date) {
  const key = `${roomId}|${date}`;
  studyState.closed = isRoomClosed(roomId, date)
    ? studyState.closed.filter((k) => k !== key)
    : [...studyState.closed, key];
  saveStudy();
  refreshTopPage();
}
