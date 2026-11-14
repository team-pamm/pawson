/* =====================================================================
   ACCOUNTS — demo log in / log out and one-time guest codes
   =====================================================================
   Accounts come from data/accounts.js. There is no server: the logged-in
   account and the guest codes are saved in this browser only.
   ===================================================================== */

// Older versions saved the account without a username; fill it in.
if (app.user && !app.user.username) app.user.username = app.user.user || app.user.role;

/* ---------- the buttons in the top bar ---------- */

function renderAccountButtons() {
  const box = $("acct");
  if (app.user) {
    const role = app.user.role[0].toUpperCase() + app.user.role.slice(1);
    box.innerHTML = `<button class="pill solid" onclick="logout()">👤 ${escapeHtml(role)} · Log out</button>`;
  } else {
    box.innerHTML = `<button class="pill" onclick="openGuestCodeForm()">Guest code</button><button class="pill solid" onclick="openLogin()">Log in</button>`;
  }
}

/* ---------- pop-up dialog (used by log in, guest codes, study rooms) ---------- */

function showModal(html) {
  $("mbox").innerHTML = html;
  $("modal").classList.add("show");
}

function closeModal() {
  $("modal").classList.remove("show");
}

function shakeModal() {
  $("mbox").animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-8px)" },
      { transform: "translateX(8px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 300 },
  );
}

/* ---------- log in / log out ---------- */

function openLogin() {
  showModal(`<div class="mtop"><h2>Log in</h2><p>Demo accounts: student, staff or admin. Password: paws123</p></div>
    <form class="mform" onsubmit="event.preventDefault(); submitLogin()">
      <input class="inp" id="lu" placeholder="Username" autocomplete="username">
      <input class="inp" id="lp" type="password" placeholder="Password" autocomplete="current-password">
      <div class="err" id="lerr"></div>
      <button class="bigbtn">Log in</button>
      <button type="button" class="bigbtn ghost" onclick="closeModal()">Cancel</button>
    </form>`);
  setTimeout(() => $("lu").focus(), 80);
}

function submitLogin() {
  const username = $("lu").value.trim().toLowerCase();
  const account = DEMO_ACCOUNTS.find((a) => a.username === username && a.password === $("lp").value);
  if (!account) {
    $("lerr").textContent = "Wrong username or password";
    shakeModal();
    return;
  }
  app.user = { username: account.username, role: account.role, name: account.name };
  storage.set("pawson-user", app.user);
  closeModal();
  showToast(`Signed in as ${account.name}`);
  refreshAfterLogin(true);
}

function logout() {
  app.user = null;
  storage.set("pawson-user", null);
  showToast("Signed out");
  refreshAfterLogin(false);
}

// After logging in, open the building's Inside tab so the difference shows right away.
function refreshAfterLogin(justLoggedIn) {
  const page = currentPage();
  if (page && page.type === "building") {
    if (justLoggedIn) app.tab = "inside";
    $("drawer").lastElementChild.innerHTML = pageHtml(page);
    afterPageChange();
  } else if (page) {
    refreshTopPage();
  } else if (justLoggedIn) {
    app.tab = "inside";
    selectBuilding("cl", { keepTab: true });
  }
  renderApp();
}

/* ---------- guest codes ---------- */

// The card on the Inside tab where staff and admins make a code.
function guestCodeCard(building, rooms) {
  const allowed = rooms.filter((box) => canAccess(box.access) && (box.access !== "admin" || isAdmin()));
  const options = allowed.map((box) => `<option value="${box.id}">${escapeHtml(box.name)}</option>`).join("");
  return `<div class="card" style="--i:1"><b>One-time guest code</b>
      <div class="w" style="color:var(--mut);font-size:12.5px;margin-top:4px">A visitor sees the path to one room, once.</div>
      <select id="gr" style="margin-top:10px">${options}</select>
      <button class="bigbtn" onclick="generateGuestCode('${building.id}')">Generate code</button>
      <div id="newcode"></div></div>`;
}

function generateGuestCode(buildingId) {
  const roomId = $("gr").value;
  const code = randomCode(6);
  app.guestCodes[code] = { building: buildingId, room: roomId, used: false, by: app.user.name, at: Date.now() };
  saveGuestCodes();
  const room = layoutRooms(buildingId).find((box) => box.id === roomId);
  $("newcode").innerHTML = `<div class="bigcode">${code}</div>
    <div style="text-align:center;margin-top:6px;color:var(--mut);font-size:12.5px">Single use · ${escapeHtml(room.name)} in ${escapeHtml(buildingById(buildingId).code)} only</div>`;
  if ($("adm")) $("adm").innerHTML = guestCodeListHtml(buildingId);
}

// Admin list of every code for one building.
function guestCodeListHtml(buildingId) {
  const rooms = layoutRooms(buildingId);
  const codes = Object.entries(app.guestCodes)
    .filter(([, info]) => (info.building || info.b || "cl") === buildingId)
    .sort((a, b) => (b[1].at || 0) - (a[1].at || 0));
  if (!codes.length)
    return '<div class="w" style="color:var(--mut);font-size:13px;margin-top:6px">No guest codes for this building yet.</div>';

  return codes
    .map(([code, info]) => {
      const room = rooms.find((box) => box.id === info.room);
      const status = info.revoked ? "Revoked" : info.used ? "Used" : "Active";
      const revoke = info.used
        ? ""
        : `<button class="mini" onclick="revokeGuestCode('${code}','${buildingId}')">Revoke</button>`;
      return `<div class="crow"><code>${code}</code><div style="min-width:0"><b>${escapeHtml(room ? room.name : info.room)}</b>
        <small>${status}${info.by ? " · by " + escapeHtml(info.by) : ""}</small></div>${revoke}</div>`;
    })
    .join("");
}

function revokeGuestCode(code, buildingId) {
  app.guestCodes[code].revoked = true;
  app.guestCodes[code].used = true;
  saveGuestCodes();
  if ($("adm")) $("adm").innerHTML = guestCodeListHtml(buildingId);
  showToast("Code revoked");
}

function openGuestCodeForm() {
  showModal(`<div class="mtop"><h2>Guest code</h2><p>Enter the 6-character code you were given.</p></div>
    <form class="mform" onsubmit="event.preventDefault(); redeemGuestCode()">
      <input class="inp" id="gc" maxlength="6" placeholder="ABC123" style="text-transform:uppercase;font:800 24px ui-monospace,monospace;letter-spacing:7px;text-align:center">
      <div class="err" id="gerr"></div>
      <button class="bigbtn">Unlock</button>
      <button type="button" class="bigbtn ghost" onclick="closeModal()">Cancel</button>
    </form>`);
  setTimeout(() => $("gc").focus(), 80);
}

function redeemGuestCode() {
  const code = $("gc").value.trim().toUpperCase();
  const info = app.guestCodes[code];
  const fail = (message) => {
    $("gerr").textContent = message;
    shakeModal();
  };
  if (!info) return fail("Code not found");
  if (info.revoked) return fail("This code was revoked by an admin");
  if (info.used) return fail("This code has already been used");

  info.used = true;
  saveGuestCodes();
  closeModal();
  const buildingId = info.building || info.b || "cl";
  const building = buildingById(buildingId);
  app.selectedId = buildingId;
  closePhotoPopup();
  flyToPoint(building.lat, building.lng, 19);
  openPanel({ type: "guest", building: buildingId, room: info.room });
  showToast("Code accepted — follow the path");
}
