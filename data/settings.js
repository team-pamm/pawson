/* =====================================================================
   SETTINGS — general app settings and the word lists the app uses
   ===================================================================== */

// Where the map opens.
const CAMPUS = {
  name: "GSU Clarkston Campus",
  address: "555 N Indian Creek Dr, Clarkston, GA 30021",
  lat: 33.7929,
  lng: -84.234,
  zoom: 17,
};

// The team, shown one by one on the start screen. Add, remove or reorder names here.
const MADE_BY = ["Ahmed", "Preet", "Maheen", "Martin"];

// Map backgrounds. Swap these links if GSU gives you its own map tiles.
const MAP_LAYERS = {
  street: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    credit: "Map © Esri, © OpenStreetMap contributors",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    credit: "Imagery © Esri",
  },
};

// Places walking directions can start from (besides "My location").
const START_POINTS = {
  deck: { name: "Parking deck", icon: "🅿️", lat: 33.79274, lng: -84.23226 },
  gate: { name: "Main entrance", icon: "🚪", lat: 33.7928, lng: -84.236 },
};

// Who can see what. A higher rank sees everything below it too.
const ACCESS_LEVELS = {
  public: { rank: 0, label: "Open to all" },
  student: { rank: 1, label: "Students" },
  staff: { rank: 2, label: "Staff" },
  admin: { rank: 3, label: "Admins" },
};

// Tags that tell people what they need to use something.
const NEEDS = {
  card: "PantherCard",
  cid: "CampusID login",
  wifi: "eduroam Wi-Fi",
  book: "Book online",
  funds: "Print funds",
  appt: "Appointment",
  meal: "Card / payment",
  open: "Open to all",
};

// Categories for "What's here" and the filter chips under the search box.
const CATEGORIES = {
  food: "🍔 Food",
  study: "📚 Study",
  computers: "💻 Computers",
  print: "🖨 Printing",
  help: "🛟 Offices",
  health: "🩺 Health",
  gym: "🏋️ Gym",
  chill: "🎭 Arts",
  gear: "🎒 Gear",
};

// Extra words that make the search box pick a chip (e.g. "printer" → Printing).
const SEARCH_WORDS = {
  events: ["event", "events", "tonight", "show", "happening", "concert", "play"],
  print: ["print", "printer", "copy", "scan", "pawprint"],
  food: ["eat", "food", "lunch", "coffee", "hungry", "cafe", "café", "dining", "snack", "vending", "drink", "pantry"],
  study: [
    "study",
    "quiet",
    "library",
    "tutor",
    "tutoring",
    "class",
    "english",
    "math",
    "science",
    "honors",
    "nursing",
    "room",
  ],
  computers: ["computer", "lab", "pc", "laptop", "catlab", "jagspot"],
  help: [
    "help",
    "office",
    "advis",
    "financial",
    "aid",
    "registrar",
    "admission",
    "enroll",
    "international",
    "disability",
    "police",
    "safety",
    "mail",
    "atm",
    "cash",
    "panthercard",
    "id card",
    "parking",
    "permit",
    "counsel",
    "military",
  ],
  health: ["health", "clinic", "sick", "nurse", "testing", "nutrition", "lactation", "wellness"],
  gym: ["gym", "workout", "pool", "swim", "weight", "exercise", "rec"],
  chill: ["auditorium", "art", "gallery", "perform", "theatre", "theater", "music", "bookstore", "sga", "student life"],
  gear: ["borrow", "gear", "charger", "checkout", "equipment", "camera", "calculator", "headphones"],
};

// Building photos come from GSU's campus map. This turns a file name into a full link.
function gsuPhoto(fileName) {
  return "https://cms.concept3d.com/map/lib/image-cache/i.php?mapId=1108&image=1108/" + fileName + "&w=900&h=508&r=1";
}
