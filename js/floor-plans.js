/* =====================================================================
   FLOOR PLANS — draws the plans from data/interiors.js
   =====================================================================
   Every plan uses the same simple shape: an outer wall, a hallway across
   the middle, rooms above it, rooms below it on each side of the entrance.
   Coordinates are in a 420 × 268 drawing.
   ===================================================================== */

const PLAN = {
  entranceX: 210, // middle of the entrance (bottom wall)
  hallwayY: 127, // middle of the hallway
  topRow: { left: 20, right: 400, y: 20, height: 84 },
  bottomLeft: { left: 20, right: 192, y: 150, height: 84 },
  bottomRight: { left: 228, right: 400, y: 150, height: 84 },
  gap: 6, // space between rooms
};

// Room colors by who can see them (locked rooms are grey).
const ROOM_COLORS = { public: "#ffffff", student: "#e9effc", staff: "#d3dff7", admin: "#b9cbf0" };

// Turns the rows in INTERIORS into boxes with positions and a walking path from the entrance.
function layoutRooms(buildingId) {
  const interior = INTERIORS[buildingId];
  if (!interior) return [];

  function placeRow(rooms, area, side) {
    const totalWidth = rooms.reduce((sum, room) => sum + (room.width || 1), 0);
    const usable = area.right - area.left - PLAN.gap * (rooms.length - 1);
    let x = area.left;
    return rooms.map((room) => {
      const width = (usable * (room.width || 1)) / totalWidth;
      const box = { ...room, x, y: area.y, w: width, h: area.height, side };
      x += width + PLAN.gap;
      return box;
    });
  }

  const boxes = [
    ...placeRow(interior.top || [], PLAN.topRow, "top"),
    ...placeRow(interior.bottomLeft || [], PLAN.bottomLeft, "bottom"),
    ...placeRow(interior.bottomRight || [], PLAN.bottomRight, "bottom"),
  ];

  // Path: in through the entrance → up to the hallway → along it → into the room's door.
  boxes.forEach((box) => {
    const doorX = Math.round(box.x + box.w / 2);
    const doorY = box.side === "top" ? box.y + box.h : box.y;
    box.path = [
      [PLAN.entranceX, 246],
      [PLAN.entranceX, PLAN.hallwayY],
      [doorX, PLAN.hallwayY],
      [doorX, doorY],
    ];
  });
  return boxes;
}

// Splits a room name into up to 3 short lines that fit the box.
function wrapLabel(text, boxWidth) {
  const maxChars = Math.max(4, Math.floor((boxWidth - 6) / 5.1));
  const lines = [];
  let line = "";
  for (const word of String(text).split(" ")) {
    const attempt = line ? `${line} ${word}` : word;
    if (attempt.length <= maxChars) {
      line = attempt;
    } else {
      if (line) lines.push(line);
      line = word.length > maxChars ? word.slice(0, maxChars - 1) + "…" : word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > 3) {
    lines.length = 3;
    lines[2] = lines[2].slice(0, Math.max(1, maxChars - 1)) + "…";
  }
  return lines;
}

function roomLabelSvg(box, lines, color) {
  const firstLineY = box.y + box.h / 2 - (lines.length - 1) * 5.5 + 3.5;
  const spans = lines.map(
    (line, i) => `<tspan x="${box.x + box.w / 2}" y="${firstLineY + i * 11}">${escapeHtml(line)}</tspan>`,
  );
  return `<text text-anchor="middle" class="rl" style="fill:${color}">${spans.join("")}</text>`;
}

// The plan as SVG. With `highlightRoomId` (guest codes) only that room and its path are drawn.
function floorPlanSvg(buildingId, highlightRoomId) {
  const rooms = layoutRooms(buildingId);
  let svg =
    `<svg class="fp" viewBox="0 0 420 268">` +
    `<rect x="10" y="10" width="400" height="234" rx="10" fill="#fff" stroke="#9fb4e3" stroke-width="2"/>` +
    `<rect x="20" y="110" width="380" height="34" rx="6" fill="#f4f7fe"/>` +
    `<rect x="194" y="240" width="32" height="8" rx="2" fill="#0039A6"/>` +
    `<text x="210" y="262" text-anchor="middle" class="rl">Entrance</text>`;

  rooms.forEach((box) => {
    const rect = (fill, stroke, extra = "") =>
      `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5" ${extra}/>`;

    if (highlightRoomId) {
      if (box.id !== highlightRoomId) return;
      svg +=
        rect("#0039A6", "#002873", 'stroke-width="2.5"') + roomLabelSvg(box, wrapLabel(box.name, box.w), "#ffffff");
      return;
    }

    if (!canAccess(box.access)) {
      svg +=
        rect("#eef1f6", "#c3cbdb", 'stroke-dasharray="4 3"') +
        roomLabelSvg(box, ["🔒", ...wrapLabel(accessLabel(box.access) + " only", box.w)], "#7a879f");
      return;
    }

    // Rooms with `opens` can be tapped (study rooms, equipment desk).
    const icon = box.opens === "study" ? "📅 " : box.opens === "equipment" ? "🎒 " : "";
    const label = roomLabelSvg(box, wrapLabel(icon + box.name, box.w), "#0b1b3f");
    if (box.opens) {
      svg += `<g class="tap" onclick="openRoomFeature('${buildingId}','${box.opens}')">${rect(ROOM_COLORS[box.access], "#0039A6", 'stroke-width="2"')}${label}</g>`;
    } else {
      svg += rect(ROOM_COLORS[box.access], "#9fb4e3") + label;
    }
  });

  if (highlightRoomId) {
    const target = rooms.find((box) => box.id === highlightRoomId);
    if (target) svg += `<polyline class="path" points="${target.path.map((p) => p.join(",")).join(" ")}"/>`;
  }
  svg += "</svg>";

  if (highlightRoomId) return svg;
  const legend = Object.keys(ROOM_COLORS)
    .map((access) => `<span><i style="background:${ROOM_COLORS[access]}"></i>${accessLabel(access)}</span>`)
    .join("");
  return svg + `<div class="legend">${legend}<span><i class="lk"></i>Locked</span></div>`;
}

function openRoomFeature(buildingId, feature) {
  pushPage({ type: feature === "study" ? "study" : "equipment", building: buildingId });
}

/* ---------- the Inside tab ---------- */

function insideTab(building) {
  if (!app.user) {
    return `<div class="card" style="--i:0"><b>🔒 Inside ${escapeHtml(building.code)}</b>
      <div class="w" style="color:var(--mut);font-size:13px;margin-top:6px;line-height:1.5">Log in to see the floor plan. Students see public and student rooms, staff also see staff rooms, and admins see everything. Visitors can unlock one room with a guest code.</div>
      <button class="bigbtn" onclick="openLogin()">Log in</button><button class="bigbtn ghost" onclick="openGuestCodeForm()">Enter a guest code</button></div>`;
  }

  const rooms = layoutRooms(building.id);
  const lockedCount = rooms.filter((box) => !canAccess(box.access)).length;
  const roleView = { student: "Student view", staff: "Staff view", admin: "Admin view" }[app.user.role];
  const floor = (INTERIORS[building.id] || {}).floor || "Floor 1";

  let html = `<div class="card" style="--i:0">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>${escapeHtml(floor)} · demo layout</b><span class="tag solid">${roleView}</span></div>
      ${floorPlanSvg(building.id)}
      ${lockedCount ? `<div class="w" style="margin-top:8px;color:var(--mut);font-size:12.5px">${lockedCount} room${lockedCount > 1 ? "s are" : " is"} locked at your access level.</div>` : ""}
      ${rooms.some((box) => box.opens && canAccess(box.access)) ? `<div class="w" style="margin-top:4px;color:var(--mut);font-size:12.5px">Tap a room with a dark outline to open it.</div>` : ""}
    </div>`;

  if (isStaffOrAdmin()) html += guestCodeCard(building, rooms);
  if (isAdmin())
    html += `<div class="card" style="--i:2"><b>Guest codes for ${escapeHtml(building.code)}</b> <span class="tag">Admin</span><div id="adm">${guestCodeListHtml(building.id)}</div></div>`;
  return html;
}

/* ---------- what a visitor sees after entering a guest code ---------- */

function guestPage(page) {
  const building = buildingById(page.building);
  const room = layoutRooms(page.building).find((box) => box.id === page.room) || { name: page.room };
  return `<div class="ph-head"><button class="x" onclick="closePanel()">✕</button>
      <div class="dh"><div class="code">${escapeHtml(building.code)}</div><div><h2>Guest access</h2><p>${escapeHtml(room.name)} · ${escapeHtml(building.code)}, floor 1</p></div></div></div>
    <div class="body stagger"><div class="card" style="--i:0">Follow the dashed path from the entrance to your room. This code has now been used.${floorPlanSvg(page.building, page.room)}</div></div>`;
}
