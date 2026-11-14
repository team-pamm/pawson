/* =====================================================================
   INTERIORS — floor plans for the Inside tab
   =====================================================================
   ALL OF THESE ARE MADE UP (demo). When GSU shares real layouts, replace
   a building's rooms here; the drawing updates by itself.

   Each building has one floor, drawn as a hallway with rooms above it
   (`top`) and below it, to the left and right of the entrance
   (`bottomLeft`, `bottomRight`).

   Room fields
     id      short key, unique inside the building (used by guest codes)
     name    label on the plan
     access  who can see the room: public | student | staff | admin
     width   optional, relative width (1 = normal, 1.5 = wider)
     opens   optional, what tapping the room opens:
             "study" = study room booking, "equipment" = equipment list
   ===================================================================== */

const INTERIORS = {
  cl: {
    floor: "Floor 1",
    top: [
      {
        id: "comp",
        name: "Computer Area (CATLab)",
        access: "student",
        width: 1.2,
      },
      {
        id: "quiet",
        name: "Quiet Study",
        access: "public",
      },
      {
        id: "group",
        name: "Group Study Rooms",
        access: "student",
        opens: "study",
      },
      {
        id: "aud",
        name: "Jim Cherry Auditorium",
        access: "public",
        width: 1.3,
      },
    ],
    bottomLeft: [
      {
        id: "circ",
        name: "Circulation Desk",
        access: "public",
        opens: "equipment",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "work",
        name: "Staff Workroom",
        access: "staff",
      },
      {
        id: "server",
        name: "Server Closet",
        access: "admin",
      },
    ],
  },
  cn: {
    floor: "Floor 1",
    top: [
      {
        id: "cafe",
        name: "Campus Café",
        access: "public",
        width: 1.4,
      },
      {
        id: "pantry",
        name: "Panther's Pantry",
        access: "student",
      },
      {
        id: "store",
        name: "Bookstore",
        access: "public",
      },
      {
        id: "m2220",
        name: "Meeting Room 2220",
        access: "student",
      },
    ],
    bottomLeft: [
      {
        id: "info",
        name: "Information Desk",
        access: "public",
      },
      {
        id: "card",
        name: "PantherCard Office",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "aid",
        name: "Financial Aid",
        access: "public",
      },
      {
        id: "lounge",
        name: "Staff Lounge",
        access: "staff",
      },
      {
        id: "sec",
        name: "Security Office",
        access: "admin",
      },
    ],
  },
  ch: {
    floor: "Floor 1",
    top: [
      {
        id: "health",
        name: "Student Health Center",
        access: "public",
        width: 1.2,
      },
      {
        id: "test",
        name: "Testing Center",
        access: "student",
      },
      {
        id: "r1800",
        name: "Nutrition (Room 1800)",
        access: "public",
      },
      {
        id: "math",
        name: "Math Lab",
        access: "student",
      },
    ],
    bottomLeft: [
      {
        id: "adv",
        name: "Advisement (Suite 2300)",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "fac",
        name: "Faculty Offices",
        access: "staff",
      },
      {
        id: "it",
        name: "IT Closet",
        access: "admin",
      },
    ],
  },
  cb: {
    floor: "Floor 1",
    top: [
      {
        id: "ltc",
        name: "Learning & Tutoring",
        access: "public",
        width: 1.3,
      },
      {
        id: "dis",
        name: "Disability Services",
        access: "public",
      },
      {
        id: "cb1140",
        name: "Classroom CB1140",
        access: "student",
      },
      {
        id: "news",
        name: "Collegian Newsroom",
        access: "student",
      },
    ],
    bottomLeft: [
      {
        id: "trio",
        name: "TRIO Office",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "fac",
        name: "Faculty Offices",
        access: "staff",
      },
      {
        id: "mech",
        name: "Mechanical Room",
        access: "admin",
      },
    ],
  },
  cc: {
    floor: "Floor 1",
    top: [
      {
        id: "lab1",
        name: "Science Lab 1",
        access: "student",
      },
      {
        id: "lab2",
        name: "Science Lab 2",
        access: "student",
      },
      {
        id: "stem",
        name: "STEM Lab",
        access: "public",
      },
      {
        id: "lec",
        name: "Lecture Hall",
        access: "student",
        width: 1.2,
      },
    ],
    bottomLeft: [
      {
        id: "dual",
        name: "Dual Enrollment",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "prep",
        name: "Lab Prep Room",
        access: "staff",
      },
      {
        id: "chem",
        name: "Chemical Storage",
        access: "admin",
      },
    ],
  },
  cd: {
    floor: "Floor 1",
    top: [
      {
        id: "asl",
        name: "ASL Lab",
        access: "student",
      },
      {
        id: "cd1100",
        name: "Classroom CD1100",
        access: "student",
      },
      {
        id: "gate",
        name: "Gateway Office",
        access: "public",
      },
    ],
    bottomLeft: [
      {
        id: "lounge",
        name: "Student Lounge",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "fac",
        name: "Faculty Offices",
        access: "staff",
      },
      {
        id: "store",
        name: "Storage",
        access: "admin",
      },
    ],
  },
  ce: {
    floor: "Floor 1",
    top: [
      {
        id: "write",
        name: "Writing Classroom",
        access: "student",
      },
      {
        id: "honors",
        name: "Honors Lounge",
        access: "student",
      },
      {
        id: "ce1200",
        name: "Classroom CE1200",
        access: "student",
      },
    ],
    bottomLeft: [
      {
        id: "eng",
        name: "English Office",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "fac",
        name: "Faculty Offices",
        access: "staff",
      },
      {
        id: "it",
        name: "IT Closet",
        access: "admin",
      },
    ],
  },
  cf: {
    floor: "Floor 1",
    top: [
      {
        id: "aud",
        name: "Marvin Cole Auditorium",
        access: "public",
        width: 1.7,
      },
      {
        id: "studio",
        name: "Performance Studio",
        access: "public",
      },
      {
        id: "media",
        name: "Media Design Lab",
        access: "student",
        opens: "equipment",
      },
    ],
    bottomLeft: [
      {
        id: "gallery",
        name: "Fine Arts Gallery",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "back",
        name: "Backstage",
        access: "staff",
      },
      {
        id: "costume",
        name: "Costume Shop",
        access: "staff",
      },
      {
        id: "light",
        name: "Lighting Control",
        access: "admin",
      },
    ],
  },
  cg: {
    floor: "Floor 1",
    top: [
      {
        id: "gym",
        name: "Gymnasium",
        access: "student",
        width: 1.6,
      },
      {
        id: "pool",
        name: "Swimming Pool",
        access: "student",
        width: 1.3,
      },
      {
        id: "weights",
        name: "Weight Room",
        access: "student",
      },
    ],
    bottomLeft: [
      {
        id: "lockers",
        name: "Locker Rooms",
        access: "student",
      },
      {
        id: "desk",
        name: "Rec Front Desk",
        access: "public",
        opens: "equipment",
      },
    ],
    bottomRight: [
      {
        id: "safety",
        name: "Public Safety & Permits",
        access: "public",
      },
      {
        id: "equip",
        name: "Equipment Storage",
        access: "staff",
      },
      {
        id: "pump",
        name: "Pool Pump Room",
        access: "admin",
      },
    ],
  },
  ci: {
    floor: "Floor 1",
    top: [
      {
        id: "skills",
        name: "Nursing Skills Lab",
        access: "student",
        width: 1.3,
      },
      {
        id: "sim",
        name: "Simulation Lab",
        access: "student",
      },
      {
        id: "nclass",
        name: "Nursing Classroom",
        access: "student",
      },
    ],
    bottomLeft: [
      {
        id: "noff",
        name: "Nursing Office",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "supply",
        name: "Supply Room",
        access: "staff",
      },
      {
        id: "meds",
        name: "Medication Storage",
        access: "admin",
      },
    ],
  },
  cj: {
    floor: "Floor 1",
    top: [
      {
        id: "dispatch",
        name: "Dispatch Center",
        access: "admin",
        width: 1.4,
      },
      {
        id: "records",
        name: "Records Office",
        access: "staff",
      },
    ],
    bottomLeft: [
      {
        id: "lobby",
        name: "Lobby",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "officers",
        name: "Officer Room",
        access: "staff",
      },
      {
        id: "evidence",
        name: "Evidence Room",
        access: "admin",
      },
    ],
  },
  ca: {
    floor: "Floor 1",
    top: [
      {
        id: "lang",
        name: "Language Lab",
        access: "student",
      },
      {
        id: "esl",
        name: "ESL Classroom",
        access: "student",
      },
      {
        id: "ca1100",
        name: "Classroom CA1100",
        access: "student",
      },
    ],
    bottomLeft: [
      {
        id: "mail",
        name: "Mail Room",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "qep",
        name: "QEP Office",
        access: "staff",
      },
      {
        id: "store",
        name: "Storage",
        access: "admin",
      },
    ],
  },
  cm: {
    floor: "Floor 1",
    top: [
      {
        id: "shop",
        name: "Facilities Shop",
        access: "staff",
        width: 1.3,
      },
      {
        id: "ware",
        name: "Warehouse",
        access: "staff",
        width: 1.3,
      },
    ],
    bottomLeft: [
      {
        id: "front",
        name: "Front Office",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "plan",
        name: "Planning Office",
        access: "staff",
      },
      {
        id: "elec",
        name: "Electrical Room",
        access: "admin",
      },
    ],
  },
  cs: {
    floor: "Floor 1",
    top: [
      {
        id: "print",
        name: "PawPrints Print Shop",
        access: "public",
        width: 1.3,
      },
      {
        id: "mail",
        name: "Mail Services",
        access: "public",
      },
      {
        id: "aux",
        name: "Auxiliary Services",
        access: "public",
      },
    ],
    bottomLeft: [
      {
        id: "counter",
        name: "Service Counter",
        access: "public",
      },
      {
        id: "rest",
        name: "Restrooms",
        access: "public",
      },
    ],
    bottomRight: [
      {
        id: "prod",
        name: "Print Production",
        access: "staff",
      },
      {
        id: "store",
        name: "Storage",
        access: "admin",
      },
    ],
  },
};
