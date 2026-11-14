/* =====================================================================
   APP STATE — everything the app remembers while it runs
   =====================================================================
   Parts marked "saved" are kept in this browser (localStorage), so they
   survive a reload but are NOT shared with other devices (no backend).
   ===================================================================== */

const app = {
  // Logged-in demo account, or null. (saved)
  user: storage.get("pawson-user", null),

  // Search and filters
  filter: null, // id of the active chip ("food", "events", …) or null
  query: "", // text typed in the search box

  // The building panel
  selectedId: null, // building whose panel is open
  tab: "here", // "here" | "inside" | "classes" | "events"
  pages: [], // stack of panel pages; the last one is on screen
  photoIndex: 0, // which photo of the building is showing

  // One-time guest codes: { CODE: { building, room, used, revoked, by, at } } (saved)
  guestCodes: storage.get("pawson-codes", {}),
};

function saveGuestCodes() {
  storage.set("pawson-codes", app.guestCodes);
}
