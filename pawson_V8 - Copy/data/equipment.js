/* =====================================================================
   EQUIPMENT — ALL MADE UP (demo)
   =====================================================================
   Gear people can borrow, listed per building id. When GSU shares the
   real inventory, replace these lists.

   Fields
     id         short key, unique inside the building
     name       what it is
     icon       an emoji shown next to it
     total      how many exist
     startOut   how many are already checked out when the demo starts
     loanHours  how long one loan lasts, in hours
     borrowers  who can borrow it: "student" (students and staff) or "staff"
     details    one or two lines about it
   Each building also has
     pickup     where people pick gear up
   ===================================================================== */

// Rules for students. Staff and admins are not limited.
const EQUIPMENT_RULES = {
  holdMinutes: 30, // a reserved item waits this long for pickup
  maxHoldsPerStudent: 2, // items one student can hold at the same time
};

// Made-up names shown on the items that start checked out (startOut).
const DEMO_BORROWERS = ["J. Smith", "M. Garcia", "A. Patel", "K. Nguyen", "D. Johnson", "S. Ali",
  "R. Brown", "L. Kim", "T. Davis", "E. Lopez", "B. Wilson", "N. Ahmed"];

const EQUIPMENT = {
  cl: {
    pickup: "Circulation Desk",
    items: [
      {
        id: "laptop",
        name: "Windows laptop",
        icon: "💻",
        total: 12,
        startOut: 5,
        loanHours: 4,
        borrowers: "student",
        details: "Office, Chrome and Python installed. Charger in the bag.",
      },
      {
        id: "chromebook",
        name: "Chromebook",
        icon: "💻",
        total: 10,
        startOut: 3,
        loanHours: 4,
        borrowers: "student",
        details: "Good for iCollege, Google Docs and email.",
      },
      {
        id: "usb-c",
        name: "USB-C phone charger",
        icon: "🔌",
        total: 15,
        startOut: 6,
        loanHours: 4,
        borrowers: "student",
        details: "Fast charger with a 6 ft cable.",
      },
      {
        id: "lightning",
        name: "Lightning phone charger",
        icon: "🔌",
        total: 8,
        startOut: 2,
        loanHours: 4,
        borrowers: "student",
        details: "For iPhones before the iPhone 15.",
      },
      {
        id: "calculator",
        name: "TI-84 graphing calculator",
        icon: "🧮",
        total: 10,
        startOut: 7,
        loanHours: 24,
        borrowers: "student",
        details: "Allowed in most math exams. Batteries included.",
      },
      {
        id: "headphones",
        name: "Noise-cancelling headphones",
        icon: "🎧",
        total: 6,
        startOut: 2,
        loanHours: 4,
        borrowers: "student",
        details: "Over-ear, with a 3.5 mm and USB-C cable.",
      },
      {
        id: "camera",
        name: "DSLR camera kit",
        icon: "📷",
        total: 3,
        startOut: 1,
        loanHours: 48,
        borrowers: "student",
        details: "Camera, two lenses, tripod and an SD card.",
      },
      {
        id: "projector",
        name: "Portable projector",
        icon: "📽️",
        total: 2,
        startOut: 0,
        loanHours: 24,
        borrowers: "staff",
        details: "HDMI and USB-C. For classes and events.",
      },
      {
        id: "doc-cam",
        name: "Document camera",
        icon: "📄",
        total: 2,
        startOut: 1,
        loanHours: 24,
        borrowers: "staff",
        details: "Shows paper on a projector or in a Webex call.",
      },
    ],
  },
  cf: {
    pickup: "Media Design Lab",
    items: [
      {
        id: "video",
        name: "Video camera kit",
        icon: "🎥",
        total: 4,
        startOut: 1,
        loanHours: 48,
        borrowers: "student",
        details: "4K camera, tripod and a shotgun mic.",
      },
      {
        id: "mic",
        name: "USB microphone",
        icon: "🎙️",
        total: 6,
        startOut: 2,
        loanHours: 24,
        borrowers: "student",
        details: "For podcasts and voice-overs.",
      },
      {
        id: "lights",
        name: "LED lighting kit",
        icon: "💡",
        total: 3,
        startOut: 0,
        loanHours: 48,
        borrowers: "staff",
        details: "Three panels with stands, for shoots and stage work.",
      },
    ],
  },
  cg: {
    pickup: "Rec Front Desk",
    items: [
      {
        id: "basketball",
        name: "Basketball",
        icon: "🏀",
        total: 10,
        startOut: 4,
        loanHours: 2,
        borrowers: "student",
        details: "Use in the gym only.",
      },
      {
        id: "racket",
        name: "Tennis racket set",
        icon: "🎾",
        total: 8,
        startOut: 2,
        loanHours: 2,
        borrowers: "student",
        details: "Two rackets and a can of balls.",
      },
      {
        id: "towel",
        name: "Gym towel",
        icon: "🧺",
        total: 30,
        startOut: 12,
        loanHours: 2,
        borrowers: "student",
        details: "Return to the bin by the front desk.",
      },
      {
        id: "lock",
        name: "Day locker lock",
        icon: "🔒",
        total: 20,
        startOut: 9,
        loanHours: 4,
        borrowers: "student",
        details: "Must be returned the same day.",
      },
    ],
  },
};
