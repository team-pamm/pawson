/* =====================================================================
   EQUIPMENT — reserve, check out and check in gear (demo, no backend)
   =====================================================================
   Inventory and rules come from data/equipment.js. What happens to it (holds,
   loans, repairs) is saved in this browser under "pawson-gear":
     { "cl:laptop": { holds: [...], loans: [...], repair: 0 }, … }
   ===================================================================== */

const gearState = storage.get("pawson-gear", {});

function saveGear() {
  storage.set("pawson-gear", gearState);
}

function findGearItem(buildingId, itemId) {
  return EQUIPMENT[buildingId].items.find((item) => item.id === itemId);
}

// The saved state for one item. Created the first time, with fake loans from `startOut`.
function gearRecord(buildingId, item) {
  const key = `${buildingId}:${item.id}`;
  if (!gearState[key]) {
    const loans = [];
    for (let i = 0; i < (item.startOut || 0); i++) {
      const hoursLeft = 1 + ((i * 1.7) % Math.max(item.loanHours - 1, 1));
      loans.push({ who: DEMO_BORROWERS[i % DEMO_BORROWERS.length], due: Date.now() + hoursLeft * 3600000 });
    }
    gearState[key] = { holds: [], loans, repair: 0 };
    saveGear();
  }
  // Drop holds older than EQUIPMENT_RULES.holdMinutes.
  const record = gearState[key];
  const expiry = Date.now() - EQUIPMENT_RULES.holdMinutes * 60000;
  const kept = record.holds.filter((hold) => hold.at > expiry);
  if (kept.length !== record.holds.length) {
    record.holds = kept;
    saveGear();
  }
  return record;
}

function availableCount(buildingId, item) {
  const record = gearRecord(buildingId, item);
  return Math.max(0, item.total - record.loans.length - record.holds.length - record.repair);
}

function myHold(buildingId, item) {
  return app.user ? gearRecord(buildingId, item).holds.find((hold) => hold.who === app.user.name) : null;
}

function myHoldCount() {
  if (!app.user) return 0;
  let count = 0;
  Object.values(gearState).forEach(
    (record) => (count += record.holds.filter((hold) => hold.who === app.user.name).length),
  );
  return count;
}

function availabilityBar(available, total) {
  const percent = Math.round((available / total) * 100);
  return `<div class="avail-bar ${percent <= 25 ? "low" : ""}"><i style="width:${percent}%"></i></div>`;
}

function loanLength(hours) {
  return hours >= 24 ? `${hours / 24}-day loan` : `${hours}-hour loan`;
}

function dueLabel(timestamp) {
  const due = new Date(timestamp);
  return isSameDay(due, new Date()) ? `due ${timeLabel(due)}` : `due ${dayLabel(due)} ${timeLabel(due)}`;
}

/* ---------- the list ---------- */

function equipmentPage(page) {
  const building = buildingById(page.building);
  const inventory = EQUIPMENT[page.building];

  let summary = "";
  if (isStaffOrAdmin()) {
    let holds = 0,
      out = 0,
      repair = 0;
    inventory.items.forEach((item) => {
      const record = gearRecord(page.building, item);
      holds += record.holds.length;
      out += record.loans.length;
      repair += record.repair;
    });
    summary = `<div class="card" style="--i:0;margin-top:12px"><b>Desk overview</b>
      <div class="kv" style="margin-top:8px"><span>Waiting for pickup</span><div>${holds}</div><span>Checked out</span><div>${out}</div><span>In repair</span><div>${repair}</div></div></div>`;
  }

  const rows = inventory.items.map((item, i) => {
    const available = availableCount(page.building, item);
    const record = gearRecord(page.building, item);
    let badge = "";
    if (isStaffOrAdmin() && record.holds.length) badge = `<span class="badge">${record.holds.length} waiting</span>`;
    else if (myHold(page.building, item)) badge = `<span class="badge">Your hold</span>`;
    const staffOnly = item.borrowers === "staff" ? " · Staff only" : "";
    return `<button class="gear-row" style="--i:${i + 1}" onclick="pushPage({type:'gear', building:'${page.building}', item:'${item.id}'})">
        <div class="gear-icon">${item.icon}</div>
        <div style="flex:1;min-width:0"><div class="t">${escapeHtml(item.name)}</div>
          <div class="m">${available} of ${item.total} available · ${loanLength(item.loanHours)}${staffOnly}</div>${availabilityBar(available, item.total)}</div>
        ${badge}<span class="chev">›</span></button>`;
  });

  return `<div class="ph-head"><button class="back" onclick="popPage()">‹ Back</button><button class="x" onclick="closePanel()">✕</button>
      <h2 class="subh">Equipment in ${escapeHtml(building.code)}</h2>
      <p class="subp">Pick up at the ${escapeHtml(inventory.pickup)} · demo inventory</p></div>
    <div class="body stagger">${summary}${rows.join("")}</div>`;
}

/* ---------- one item ---------- */

function gearItemPage(page) {
  const inventory = EQUIPMENT[page.building];
  const item = findGearItem(page.building, page.item);
  const record = gearRecord(page.building, item);
  const available = availableCount(page.building, item);
  const who = item.borrowers === "staff" ? "Staff only" : "Students and staff";

  return `<div class="ph-head"><button class="back" onclick="popPage()">‹ Back</button><button class="x" onclick="closePanel()">✕</button></div>
    <div class="body stagger">
      <div class="bigdate" style="--i:0"><div class="gear-icon big">${item.icon}</div>
        <div><h2 style="margin:0;font-size:19px;font-weight:800">${escapeHtml(item.name)}</h2>
        <div style="color:var(--mut);font-size:13px;margin-top:4px">${escapeHtml(item.details)}</div></div></div>
      <div class="card" style="--i:1"><b>${available} of ${item.total} available</b>${availabilityBar(available, item.total)}
        <div class="kv"><span>Loan</span><div>${loanLength(item.loanHours)}</div><span>Pick up</span><div>${escapeHtml(inventory.pickup)}</div><span>Who can borrow</span><div>${who}</div></div></div>
      ${isStaffOrAdmin() ? deskTools(page, item, record, available) : borrowerTools(page, item, available)}
    </div>`;
}

// What a guest or student sees.
function borrowerTools(page, item, available) {
  if (!app.user) {
    return `<div class="card" style="--i:2"><b>Want to borrow this?</b><div class="w" style="color:var(--mut);font-size:13px;margin-top:4px">Log in to reserve it for pickup.</div>
      <button class="bigbtn" onclick="openLogin()">Log in</button></div>`;
  }
  if (item.borrowers === "staff") {
    return `<div class="card" style="--i:2"><b>Staff only</b><div class="w" style="color:var(--mut);font-size:13px;margin-top:4px">Ask at the desk if you need it for a class or event.</div></div>`;
  }
  const hold = myHold(page.building, item);
  if (hold) {
    const minutesLeft = Math.max(1, Math.round((hold.at + EQUIPMENT_RULES.holdMinutes * 60000 - Date.now()) / 60000));
    return `<div class="card" style="--i:2"><b>Your hold</b><div class="bigcode">${hold.code}</div>
      <div class="w" style="text-align:center;color:var(--mut);font-size:12.5px;margin-top:6px">Show this code at the ${escapeHtml(EQUIPMENT[page.building].pickup)} within ${minutesLeft} min.</div>
      <button class="bigbtn ghost" onclick="cancelHold('${page.building}','${item.id}')">Cancel hold</button></div>`;
  }
  if (available === 0) {
    return `<div class="card" style="--i:2"><b>None available right now</b><div class="w" style="color:var(--mut);font-size:13px;margin-top:4px">Check back later — loans come back every few hours.</div></div>`;
  }
  return `<div class="card" style="--i:2"><b>Reserve for pickup</b><div class="w" style="color:var(--mut);font-size:13px;margin-top:4px">We hold it for ${EQUIPMENT_RULES.holdMinutes} minutes. You can hold up to ${EQUIPMENT_RULES.maxHoldsPerStudent} items.</div>
    <button class="bigbtn" onclick="reserveGear('${page.building}','${item.id}')">Reserve one</button></div>`;
}

// What staff and admins see: holds, loans, check out to someone, repairs.
function deskTools(page, item, record, available) {
  const b = page.building;
  const holds = record.holds.length
    ? record.holds
        .map(
          (
            hold,
            i,
          ) => `<div class="person"><div style="flex:1"><b>${escapeHtml(hold.who)}</b><small>Code ${hold.code} · held ${timeLabel(new Date(hold.at))}</small></div>
        <button class="mini" onclick="checkOutHold('${b}','${item.id}',${i})">Check out</button></div>`,
        )
        .join("")
    : '<div class="w" style="color:var(--mut);font-size:13px">No one is waiting.</div>';
  const loans = record.loans.length
    ? record.loans
        .map(
          (
            loan,
            i,
          ) => `<div class="person"><div style="flex:1"><b>${escapeHtml(loan.who)}</b><small>${dueLabel(loan.due)}${loan.due < Date.now() ? " · LATE" : ""}</small></div>
        <button class="mini" onclick="checkInGear('${b}','${item.id}',${i})">Check in</button></div>`,
        )
        .join("")
    : '<div class="w" style="color:var(--mut);font-size:13px">Nothing checked out.</div>';
  const repair = isAdmin()
    ? `<div class="card" style="--i:5"><b>In repair</b> <span class="tag">Admin</span>
        <div class="stepper"><button class="mini" style="margin:0" onclick="changeRepair('${b}','${item.id}',-1)">−</button><b>${record.repair}</b>
        <button class="mini" style="margin:0" onclick="changeRepair('${b}','${item.id}',1)">+</button><span class="w" style="color:var(--mut);font-size:12.5px">not lendable</span></div></div>`
    : "";

  return `<div class="card" style="--i:2"><b>Waiting for pickup</b>${holds}</div>
    <div class="card" style="--i:3"><b>Checked out</b>${loans}</div>
    <div class="card" style="--i:4"><b>Check out to someone</b>
      <div class="inline-form"><input class="inp" id="gearWho" placeholder="Name or student ID"><button class="bigbtn" onclick="checkOutTo('${b}','${item.id}')" ${available ? "" : "disabled"}>Check out</button></div>
      ${available ? "" : '<div class="w" style="color:var(--mut);font-size:12.5px;margin-top:6px">None available to lend.</div>'}</div>
    ${repair}`;
}

/* ---------- actions ---------- */

function reserveGear(buildingId, itemId) {
  const item = findGearItem(buildingId, itemId);
  if (myHoldCount() >= EQUIPMENT_RULES.maxHoldsPerStudent)
    return showToast(`You can hold up to ${EQUIPMENT_RULES.maxHoldsPerStudent} items at a time`);
  if (availableCount(buildingId, item) === 0) return showToast("Sorry, none left");
  gearRecord(buildingId, item).holds.push({ who: app.user.name, code: randomCode(4), at: Date.now() });
  saveGear();
  refreshTopPage();
  showToast(`${item.name} held for ${EQUIPMENT_RULES.holdMinutes} minutes`);
}

function cancelHold(buildingId, itemId) {
  const record = gearRecord(buildingId, findGearItem(buildingId, itemId));
  record.holds = record.holds.filter((hold) => hold.who !== app.user.name);
  saveGear();
  refreshTopPage();
  showToast("Hold cancelled");
}

function lendTo(buildingId, item, who) {
  gearRecord(buildingId, item).loans.push({ who, due: Date.now() + item.loanHours * 3600000 });
}

function checkOutHold(buildingId, itemId, holdIndex) {
  const item = findGearItem(buildingId, itemId);
  const record = gearRecord(buildingId, item);
  const [hold] = record.holds.splice(holdIndex, 1);
  lendTo(buildingId, item, hold.who);
  saveGear();
  refreshTopPage();
  showToast(`Checked out to ${hold.who}`);
}

function checkOutTo(buildingId, itemId) {
  const who = $("gearWho").value.trim();
  const item = findGearItem(buildingId, itemId);
  if (!who) return showToast("Type a name or student ID first");
  if (availableCount(buildingId, item) === 0) return showToast("None available to lend");
  lendTo(buildingId, item, who);
  saveGear();
  refreshTopPage();
  showToast(`Checked out to ${who}`);
}

function checkInGear(buildingId, itemId, loanIndex) {
  const record = gearRecord(buildingId, findGearItem(buildingId, itemId));
  const [loan] = record.loans.splice(loanIndex, 1);
  saveGear();
  refreshTopPage();
  showToast(`Checked in from ${loan.who}`);
}

function changeRepair(buildingId, itemId, change) {
  const item = findGearItem(buildingId, itemId);
  const record = gearRecord(buildingId, item);
  const maxRepair = item.total - record.loans.length - record.holds.length;
  record.repair = Math.min(maxRepair, Math.max(0, record.repair + change));
  saveGear();
  refreshTopPage();
}
