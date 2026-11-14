/* =====================================================================
   DEMO ACCOUNTS — NOT REAL SECURITY
   =====================================================================
   These logins are hardcoded for the demo. Anyone can read this file.
   A real version would sign in with GSU's CampusID instead.

   role decides what the account sees (see ACCESS_LEVELS in settings.js):
     student  public + student rooms, can reserve equipment and book rooms
     staff    + staff rooms, guest codes, equipment check-out / check-in
     admin    everything, can revoke codes, close study rooms, mark repairs
   ===================================================================== */

const DEMO_ACCOUNTS = [
  { username: "student", password: "paws123", role: "student", name: "Demo Student" },
  { username: "staff", password: "paws123", role: "staff", name: "Demo Staff" },
  { username: "admin", password: "paws123", role: "admin", name: "Demo Admin" },
];
