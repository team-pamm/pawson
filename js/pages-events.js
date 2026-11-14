/* =====================================================================
   EVENTS — turns data/events.js into dated events and draws the pages
   ===================================================================== */

// Builds real dates from `day` + `start` (or uses `date` when an event has one).
const EVENT_LIST = DEMO_EVENTS.map((ev, index) => {
  const start = ev.date ? new Date(ev.date + "T00:00:00") : addDays(startOfToday(), ev.day || 0);
  let end = null;
  if (!ev.allDay) {
    const [hours, minutes] = ev.start.split(":").map(Number);
    start.setHours(hours, minutes, 0, 0);
    end = new Date(start.getTime() + (ev.minutes || 60) * 60000);
  }
  return { ...ev, index, startsAt: start, endsAt: end };
});

function isUpcoming(ev) {
  const ends = ev.endsAt || addDays(ev.startsAt, 1);
  return ends >= new Date();
}

function upcomingEventsIn(buildingId) {
  return EVENT_LIST.filter((ev) => ev.building === buildingId && isUpcoming(ev)).sort(
    (a, b) => a.startsAt - b.startsAt,
  );
}

function allUpcomingEvents() {
  return EVENT_LIST.filter(isUpcoming).sort((a, b) => a.startsAt - b.startsAt);
}

// "Tonight · 7:00 PM – 9:00 PM"
function eventWhen(ev) {
  if (ev.allDay) return `${dayLabel(ev.startsAt)} · All day`;
  return `${dayLabel(ev.startsAt)} · ${timeLabel(ev.startsAt)}${ev.endsAt ? " – " + timeLabel(ev.endsAt) : ""}`;
}

function dateTileHtml(date) {
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return `<div class="date"><small>${month}</small><b>${date.getDate()}</b></div>`;
}

function eventRowHtml(ev, staggerIndex) {
  const building = ev.building ? buildingById(ev.building) : null;
  const where = building ? `${building.code} · ${ev.room || building.name}` : ev.room || "Clarkston campus";
  const today = isSameDay(ev.startsAt, new Date()) ? "today" : "";
  return `<button class="ev ${today}" style="--i:${staggerIndex}" onclick="pushPage({type:'event', index:${ev.index}})">
      ${dateTileHtml(ev.startsAt)}
      <div style="min-width:0"><div class="t">${escapeHtml(ev.title)}</div><div class="m">${eventWhen(ev)} · ${escapeHtml(where)}</div></div>
      <span class="chev">›</span></button>`;
}

/* ---------- Events tab on a building ---------- */

function eventsTab(building) {
  const events = upcomingEventsIn(building.id);
  const regularUses = building.regularUses || [];
  const clubs = building.clubs || [];

  const eventRows = events.length
    ? events
        .slice(0, 3)
        .map((ev, i) => eventRowHtml(ev, i))
        .join("")
    : '<div class="empty">Nothing on the calendar in this building right now.</div>';
  const seeAll = events.length
    ? `See all ${events.length} event${events.length > 1 ? "s" : ""} here`
    : "See what's happening on campus";

  const listHtml = (items, titleKey) =>
    items
      .map(
        (item) =>
          `<div class="it"><b>${escapeHtml(item[titleKey])}${item.demo ? " (demo)" : ""}</b><div class="w">${escapeHtml(item.details)}</div></div>`,
      )
      .join("");

  return `<div class="empty" style="--i:0;padding:12px 0 0;font-size:12.5px">Demo data: these events and the clubs marked (demo) are made up.</div>
    <div class="grp" style="--i:0"><h3>Coming up here</h3>${eventRows}
      <button class="bigbtn ${events.length ? "" : "ghost"}" onclick="pushPage({type:'events', building:'${building.id}'})">${seeAll}</button></div>
    ${regularUses.length ? `<div class="grp" style="--i:1"><h3>Regular uses</h3>${listHtml(regularUses, "title")}</div>` : ""}
    <div class="grp" style="--i:2"><h3>Clubs that meet here</h3>${clubs.length ? listHtml(clubs, "name") : '<div class="empty">No clubs listed for this building yet. Student Life in CN can tell you where each club meets.</div>'}</div>`;
}

/* ---------- Events list page ---------- */

function eventsPage(page) {
  const building = page.building ? buildingById(page.building) : null;
  const here = building ? upcomingEventsIn(building.id) : [];
  const elsewhere = allUpcomingEvents().filter((ev) => !building || ev.building !== building.id);
  let i = 0;

  return `<div class="ph-head"><button class="back" onclick="popPage()">‹ Back</button><button class="x" onclick="closePanel()">✕</button>
      <h2 class="subh">${building ? `Events in ${escapeHtml(building.code)}` : "Events on campus"}</h2>
      <p class="subp">${building ? escapeHtml(building.name) : "GSU Clarkston"} · demo events (made up)</p></div>
    <div class="body stagger">
      ${building ? `<div class="grp" style="--i:${i++}"><h3>In this building</h3>${here.length ? here.map((ev) => eventRowHtml(ev, i++)).join("") : '<div class="empty">No events scheduled in this building right now.</div>'}</div>` : ""}
      <div class="grp" style="--i:${i++}"><h3>${building ? "Elsewhere on campus" : "Coming up"}</h3>${elsewhere.length ? elsewhere.map((ev) => eventRowHtml(ev, i++)).join("") : '<div class="empty">Nothing else scheduled.</div>'}</div>
    </div>`;
}

/* ---------- One event ---------- */

function eventDetailPage(page) {
  const ev = EVENT_LIST[page.index];
  const building = ev.building ? buildingById(ev.building) : null;
  const price =
    ev.free === true
      ? '<span class="tag solid">Free</span>'
      : ev.free === false
        ? '<span class="tag solid">Ticketed</span>'
        : "";

  return `<div class="ph-head"><button class="back" onclick="popPage()">‹ Back</button><button class="x" onclick="closePanel()">✕</button></div>
    <div class="body stagger">
      <div class="bigdate" style="--i:0">${dateTileHtml(ev.startsAt)}
        <div><div style="font-size:12px;font-weight:800;color:var(--blue);letter-spacing:.06em;text-transform:uppercase">${dayLabel(ev.startsAt)}</div>
        <h2 style="margin:4px 0 0;font-size:19px;font-weight:800;line-height:1.25">${escapeHtml(ev.title)}</h2></div></div>
      <div class="kv" style="--i:1">
        <span>When</span><div>${eventWhen(ev)}</div>
        <span>Where</span><div>${building ? `${escapeHtml(building.code)} · ${escapeHtml(building.name)}` : "Clarkston campus"}${ev.room ? `<br><span style="color:var(--mut);font-weight:500">${escapeHtml(ev.room)}</span>` : ""}</div>
        <span>Format</span><div>${ev.format === "hybrid" ? "In person + online" : "In person"}</div>
      </div>
      <div class="tags" style="--i:2;margin-top:14px">${price}${ev.type ? `<span class="tag">${escapeHtml(ev.type)}</span>` : ""}</div>
      ${
        building
          ? `<button class="bigbtn" style="--i:3;margin-top:18px" onclick="pushPage({type:'route', building:'${building.id}', from: defaultRouteStart()})">Walk me there</button>
        <button class="bigbtn ghost" style="--i:4" onclick="selectBuilding('${building.id}')">Show ${escapeHtml(building.code)} on the map</button>`
          : ""
      }
    </div>`;
}

function openAllEvents() {
  app.selectedId = null;
  app.filter = null;
  app.query = "";
  $("q").value = "";
  openPanel({ type: "events", building: null });
}
