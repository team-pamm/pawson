/* =====================================================================
   STUDY ROOMS — ALL MADE UP (demo)
   =====================================================================
   Bookable group study rooms. Right now only the library (CL) has them.
   To add rooms in another building, add rows with that building's id.
   ===================================================================== */

// Bookable hours: one-hour slots from `firstHour` to `lastHour` (24-hour clock).
// 9 and 20 means the first slot is 9–10 AM and the last is 8–9 PM.
const STUDY_HOURS = { firstHour: 9, lastHour: 20 };

// Booking rules for students. Staff and admins are not limited.
const BOOKING_RULES = {
  maxHoursPerDay: 2, // per student, per day
  daysAhead: 2, // 2 = today and tomorrow
};

// The rooms.  seats = how many people fit.  features = short tags.
const STUDY_ROOMS = [
  { id: "cl-2101", building: "cl", name: "Room 2101", seats: 4, features: ["Whiteboard", "TV screen"] },
  { id: "cl-2102", building: "cl", name: "Room 2102", seats: 6, features: ["Whiteboard"] },
  { id: "cl-2103", building: "cl", name: "Room 2103", seats: 2, features: ["Quiet", "Desk lamps"] },
  { id: "cl-2104", building: "cl", name: "Room 2104", seats: 8, features: ["Projector", "Whiteboard"] },
  { id: "cl-2105", building: "cl", name: "Room 2105", seats: 4, features: ["TV screen"] },
];

// Fake bookings so the demo isn't empty.  day: 0 = today, 1 = tomorrow.  hour: start hour.
const DEMO_BOOKINGS = [
  { room: "cl-2101", day: 0, hour: 13, by: "Biology study group" },
  { room: "cl-2101", day: 0, hour: 14, by: "Biology study group" },
  { room: "cl-2102", day: 0, hour: 18, by: "Coding Club" },
  { room: "cl-2102", day: 0, hour: 19, by: "Coding Club" },
  { room: "cl-2103", day: 0, hour: 16, by: "A. Rivera" },
  { room: "cl-2104", day: 0, hour: 10, by: "Nursing cohort" },
  { room: "cl-2104", day: 0, hour: 11, by: "Nursing cohort" },
  { room: "cl-2105", day: 0, hour: 17, by: "J. Chen" },
  { room: "cl-2101", day: 1, hour: 15, by: "Calc I review" },
  { room: "cl-2104", day: 1, hour: 12, by: "Math Club" },
];
