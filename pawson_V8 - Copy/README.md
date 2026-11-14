# PawsOn — GSU Clarkston Campus Map

PawsOn shows what is inside every building on GSU's Clarkston campus and what you need to use it. Tap a building on the map to see its offices, food, labs, classes and events, borrow equipment, book a study room, then walk there with in-app directions.

**Pitch:** Google Maps shows you where a building is. PawsOn shows you what's inside it and what you need to use it.

Built for the AI build event on Nov 13, 2026 (theme: campus or education problems, team of 3). Feature freeze 4:30 PM, hard deadline 5:30 PM.

## Features (pawson_V8)

- **Map:** full-screen street map with a Satellite switch; 14 building pins (CA to CS) placed from OpenStreetMap outlines; search box and chips (Events, Food, Study, Computers, Printing, Offices, Health, Gym, Arts, Gear).
- **Building panel:** tapping a building zooms in and pops up a photo of its front. Buttons: Directions, Events, Equipment and Study rooms (when the building has them). Tabs: What's here, Inside, Classes, Events. Each item shows what you need: PantherCard, CampusID login, Print funds, Appointment, Card / payment, or Open to all.
- **Equipment (demo):** made-up gear to borrow at the library Circulation Desk (CL), the Media Design Lab (CF) and the Rec front desk (CG). Students reserve, staff run the desk, admins track repairs.
- **Study rooms (demo):** 5 made-up group study rooms in the library, booked in one-hour slots for today and tomorrow.
- **Events:** made-up demo events (dates set relative to today), with an in-app list and detail page.
- **Walking directions:** in-app route from your location, the parking deck or the main entrance, with minutes, meters and steps.
- **Accounts and interiors (demo):** student, staff and admin accounts each see more. Every building has a made-up floor plan in its Inside tab; rooms with a dark outline open study rooms or equipment. Staff and admins make one-time codes that show a visitor the path to one room.
- **GPS and offline:** smoothed location dot with an accuracy pill and a Fix button; tracking pauses when you leave the tab. Save for offline stores the app, map tiles and photos for airplane mode.
- **Design:** GSU blue and white, paw cursor, a start screen with the GSU Panther logo and the team's names, slide and spring animations. No links leave the app.

## Run it

1. **Laptop:** double-click `index.html`. Keep the `css`, `data`, `img` and `js` folders next to it. Everything works except real GPS and offline saving.
2. **Hosted (for GPS and offline):** upload everything in this folder (the 5 files and the 4 folders) to the top level of a public GitHub repo, then Settings → Pages → Deploy from a branch → main → Save.
3. **Phone:** open the hosted link, then Share → Add to Home Screen.

**Test offline:** open the hosted link online, tap the download button, wait for "Campus saved", turn on airplane mode, reload.

**Reset the demo:** logins, holds, bookings and guest codes are saved in the browser. To start fresh, press F12 → Console, type `localStorage.clear()`, press Enter and refresh.

### Demo logins (hardcoded, no backend)

| Username | Password | What it unlocks |
| --- | --- | --- |
| (not logged in) | — | Public building info; sees equipment and study-room availability; can redeem a guest code |
| student | paws123 | Floor plans with public and student rooms; reserve up to 2 items (30-minute hold with a pickup code); book study rooms, up to 2 hours a day |
| staff | paws123 | Adds staff rooms and items; equipment desk (check out, check in, lend to anyone); book rooms with no limit and cancel any booking; guest codes for any non-admin room |
| admin | paws123 | Everything, plus admin-only rooms; marks gear as in repair; closes or reopens a study room for the day; sees and revokes every guest code |

### Demo script

1. Open the app: campus map with your dot.
2. Tap CL: what it offers, plus Directions, Events, Equipment and Study rooms.
3. Log in as student: the library floor plan appears. Tap Group Study Rooms and book a room. Go to Equipment, reserve a calculator and show the pickup code.
4. Log in as staff: Equipment shows the desk overview. The student's calculator is waiting for pickup; tap Check out.
5. Log in as admin: close a study room for the day, mark an item as in repair, and make a guest code on CL's Inside tab.
6. Save for offline, airplane mode on: the map is still there and the dot still moves.
7. Log out and enter that guest code: one path to one room lights up.

## Folder layout

```
pawson_V8/
├── index.html      page layout only (no styles, data or code)
├── css/styles.css  how everything looks: colors, sizes, animations
├── data/           ALL the campus info: the only folder you edit to change info
├── img/            the GSU Panther logo for the start screen
├── js/             the code, one file per feature
├── sw.js           offline support (service worker)
├── manifest.json   lets phones install the app
├── icon.svg        app icon
└── README.md       this document
```

### data/ (what is real and what is fake)

| File | What's in it | Real or fake |
| --- | --- | --- |
| settings.js | Map center and styles, route start points, access levels, "what you need" tags, categories, search words, team names for the start screen | Setup |
| buildings.js | The 14 buildings: what's inside, classes, regular uses, clubs, photos, pin positions | Real (GSU campus map), except entries marked `demo: true` |
| interiors.js | Floor plans for the Inside tab | All fake |
| equipment.js | Gear to borrow per building, pickup desks, hold rules, fake borrower names | All fake |
| study-rooms.js | Rooms, open hours, booking rules, fake bookings | All fake |
| events.js | Events | All fake |
| accounts.js | Demo logins | Demo only |

### js/ (the code)

| File | What it does |
| --- | --- |
| helpers.js | Small tools used everywhere: dates, saving to the browser, who is logged in |
| state.js | What the app is showing right now (selected building, open pages) |
| map.js | The map, building pins and photo viewer |
| search.js | Search box, chips and results list |
| panel.js | The side panel: page stack, building page and its tabs |
| floor-plans.js | Draws the Inside tab floor plan and the guest-code page |
| pages-events.js | Events list and event details |
| pages-route.js | Walking directions |
| pages-equipment.js | Equipment list, reserve, check out, check in, repairs |
| pages-study.js | Study room booking |
| accounts.js | Log in, log out, guest codes |
| location.js | Your location dot, accuracy pill, Fix and pause |
| offline.js | Save for offline and the online/offline badge |
| splash.js | The start screen: Panther logo, then the team's names one by one |
| app.js | Starts the app and checks the data for mistakes |

`index.html` loads the data files first, then the code files (helpers and state first, app last).

## Replacing the fake info with real GSU info

You never need to touch `js/` to change info. Each file in `data/` starts with a box that explains every field.

1. Open the data file and replace the values. Keep the same shape: quotes around text, a comma after each item, matching `{ }` and `[ ]`.
2. Save and refresh the page.
3. Press F12 → Console. When the app starts it checks the data. If something is wrong (a typo in a category, a building id that doesn't exist, a start time like "7pm" instead of "19:00"), a toast says "Data check: … problem(s)" and the console lists each one.

**Building info:** most of it is real. Search `buildings.js` for `demo: true` to find the 23 made-up entries, then replace or delete them.

**Floor plans:** in `interiors.js`, each building lists its rooms in three rows: `top` (above the hallway), `bottomLeft` and `bottomRight` (below it, either side of the entrance). Set `access` to hide a room from lower accounts. Add `opens: "study"` or `opens: "equipment"` to make a room tappable. Guest codes point at room ids, so keep an id the same once codes are handed out.

**Equipment:** in `equipment.js`, replace a building's `pickup` and `items`. Set `startOut: 0` to start with nothing checked out. `EQUIPMENT_RULES` sets the hold time and how many items a student can hold.

**Study rooms:** in `study-rooms.js`, replace `STUDY_ROOMS`, change `STUDY_HOURS` and `BOOKING_RULES`, and empty the fake bookings with `const DEMO_BOOKINGS = [];`. Rooms in other buildings work too: give them that building's id.

**Events:** in `events.js`, replace `DEMO_EVENTS`. Use `date: "2026-12-03"` for a real date instead of `day`.

**A new building:** add it to `buildings.js` first, then use its `id` in the other data files.

**Photos:** `gsuPhoto("file.jpg")` uses a photo from GSU's campus map. For your own photo, put it in a `photos` folder and write `"photos/cl.jpg"`.

**On the hosted site:** after uploading changes, bump the cache name in `sw.js` and `js/offline.js` (`pawson-app-v8` → `pawson-app-v9`) so phones get the new version. If you add a new file, also add it to `APP_FILES` in both `sw.js` and `js/offline.js`, and add a `<script>` line for it in `index.html`.

## Data sources and credits

| What | Source |
| --- | --- |
| Buildings, contents, rooms, hours, photos | GSU campus map, Clarkston — https://map.concept3d.com/?id=1108 (read Nov 13, 2026) |
| Events, interiors, equipment, study rooms, most clubs | Made up for the demo |
| Building positions | OpenStreetMap building outlines, © OpenStreetMap contributors |
| Street and satellite map | Esri World Street Map and World Imagery |
| Walking routes | OpenStreetMap foot routing (routing.openstreetmap.de) |
| Map library | Leaflet 1.9.4 |
| Panther logo on the start screen | Georgia State University (supplied by the team) |

## Version history (Nov 13, 2026, newest first)

| Version | What changed |
| --- | --- |
| pawson_V8 | Start screen shows the GSU Panther logo, then the team's names one by one (Ahmed, Preet, Maheen, Martin); click to skip |
| pawson_V7 | Location no longer asks again after you leave the tab; working equipment lending by account level (fake inventory); study room booking in the library; code split into css/, data/ and js/ with a field guide in every data file and a data check on start |
| pawson_V6 | Student, staff and admin accounts; made-up interiors for all 14 buildings; made-up events and clubs; smoothed location with accuracy pill and Fix; route line starts at your start point |
| pawson_V5 | Building photos with zoom pop-up; in-app events, event details and walking routes; Events chip; GSU blue and white; paw cursor; animations; no outside links |
| pawson_V4 | Map tiles switched from CARTO (now needs an API key) to Esri |
| pawson_V3 | Real full-screen street map; building panel with What's here, Classes, Events & clubs tabs; Satellite switch |
| pawson_V2 | Official GSU campus map details for all 14 buildings; positions traced from GSU's map |
| pawson_V1 | Team-plan build: 14 buildings, staff login, library floor plan, one-time guest codes, Save for offline, Edit map mode |
| PantherMap prototype | First demo with a drawn map, login tags and Demo walk (not saved) |

## Known limitations and to-dos

- [ ] Host on GitHub Pages and test GPS and airplane mode on a phone.
- [ ] Get GSU's permission to map the interiors, then replace `data/interiors.js`, starting with CL.
- [ ] Get the library's real equipment list and study rooms.
- [ ] Check each building's details (the team flagged some as wrong).

Limits: logins, holds, bookings and codes are demo-only and saved in one browser, so nothing is shared between devices; events, interiors, equipment, study rooms and most clubs are made up; classes are subject areas, not a live schedule; a laptop's location is only about ±100 m; photos and routes need internet unless saved offline; positions are accurate to about 20 m; Esri tiles are for prototyping only.

## Next steps

1. Live events from GSU's calendar.
2. CampusID sign-in instead of demo accounts.
3. A small server so holds, bookings and guest codes are live and shared by everyone.
4. Real floor plans, starting with CL and CN.
5. Student-submitted fixes, approved by staff.
6. Every GSU campus, starting with downtown Atlanta.
7. A phone app from the same code.

## V6 update: accounts, interiors, demo events, location and directions

**Accounts.** Not logged in: public info, no floor plans. Student: public and student rooms. Staff: adds staff rooms and can make guest codes. Admin: sees everything, makes codes for any room, and can view or revoke every code. Locked rooms show as grey "Staff only" or "Admins only" boxes.

**Interiors.** Every building has a made-up floor 1 layout in a new Inside tab, built from its real offices plus fake staff and admin rooms. Guest codes work for any room in any building.

**Events.** The real GSU calendar events were replaced with 20 made-up events whose dates are relative to today. Most clubs are made up too and marked (demo).

**Location.** A laptop gets its location from Wi-Fi (about ±100 m); phone GPS outdoors is usually ±5–20 m, so code can't make a laptop precise. The app averages the best recent readings, shows the accuracy and nearest building in a pill, draws a dashed amber circle when the fix is rough, and lets you tap Fix to set your spot by hand. GPS takes over again once it reaches ±20 m.

**Directions check.** The routing service snaps the parking-deck start 19 m and the main-entrance start 2 m, so those were left alone. From inside a building (CL) it snapped 37 m, so the line didn't start at your dot; the line now starts exactly at your start point. With a rough location (over ±50 m), Directions starts from the parking deck and says why.

## V7 update: location bug, equipment, study rooms and readable code

**Location asked again after leaving the tab.** The app kept tracking your location while the tab was in the background. When the browser's permission doesn't stick (common for a page opened from a file, or after "Allow this time"), coming back to the tab made the browser ask again. Now tracking pauses when you leave the tab. When you come back it resumes by itself if the browser still allows location; if not, the pill says "Location paused · Resume" and the browser only asks when you tap Resume. On the hosted link, pick the option that allows every visit (not "Allow this time") and it won't ask again.

**Equipment.** The Equipment button opens the building's gear list with how many are available. Students tap an item and Reserve one: it is held for 30 minutes with a 4-character pickup code, up to 2 items at a time. Staff-only gear (projector, document camera, lighting kit) is locked for students. Staff see a desk overview (waiting for pickup, checked out, in repair), check out a held item, check in returns and lend to anyone by name. Admins also mark items as in repair.

**Study rooms.** Only the library (CL) has them, as far as the team knows; any building can get rooms later in `data/study-rooms.js`. Rooms 2101–2105 are booked in one-hour slots from 9 AM to 9 PM, today and tomorrow. Students get up to 2 hours a day and can cancel their own bookings. Staff and admins have no limit and can cancel any booking. Admins can close a room for the day. Open the rooms from the Study rooms button, the Group Study Rooms box on the floor plan, or "Book a study room" in What's here.

**Readable code.** V6 kept the styles, data and code in one 90 KB `index.html` with very long lines. V7 splits it into `css/`, `data/` and `js/` (one file per feature), with plain names, short comments and a field guide at the top of every data file. All the fake info, including equipment rules and fake borrower names, now lives in `data/`. On start, the app checks the data and points to any mistake.

## V8 update: start screen

The start screen now shows the GSU Panther logo, the PawsOn name, and "Made by" with the team's names one at a time: Ahmed, Preet, Maheen, Martin. Each name slides in from the left, stays a moment and slides out to the right. After the last name the app opens. Click, tap or press any key to skip it.

To change the names, edit `MADE_BY` in `data/settings.js`. To change the timing, edit `LOGO_INTRO_MS` and `NAME_MS` at the top of `js/splash.js`. The logo is `img/gsu-panther.png`.

