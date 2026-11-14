/* =====================================================================
   BUILDINGS — what is in each building on the Clarkston campus
   =====================================================================
   Source: GSU's official campus map (map.concept3d.com/?id=1108), read
   Nov 13, 2026. Anything marked `demo: true` is MADE UP for the demo:
   search this file for "demo: true" to find every fake entry.

   Fields
     id         short lowercase key used everywhere else (interiors, events…)
     code       building letters shown on the map pin
     name       full building name
     subtitle   one line under the name
     lat, lng   pin position (traced from OpenStreetMap building outlines)
     gsuMapId   the building's id on GSU's campus map
     note       optional warning shown at the top of the panel
     photos     front photo first. gsuPhoto("file.jpg") = a photo on GSU's
                map; you can also use your own files, e.g. "photos/cl.jpg"
     offers     the "What's here" list:
                  category  one of the keys in CATEGORIES (data/settings.js)
                  what      what it is
                  where     room / floor
                  needs     what you need to use it (keys in NEEDS)
                  access    optional: student | staff | admin (default = open to all)
     classes    subjects taught here  { subject, details }
     regularUses  how the building is often used  { title, details }
     clubs      clubs that meet here  { name, details }
   ===================================================================== */

const BUILDINGS = [
  // ----- CL · Jim Cherry Learning Resources Center -----
  {
    id: "cl",
    code: "CL",
    name: "Jim Cherry Learning Resources Center",
    subtitle: "Library",
    lat: 33.793604,
    lng: -84.235003,
    gsuMapId: 295282,
    photos: [gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_004_668da95b792a4.jpg")],
    offers: [
      {
        category: "study",
        what: "Library (JCLRC)",
        where: "CL",
        needs: ["card"],
      },
      {
        category: "computers",
        what: "CATLab computer lab",
        where: "CL2350 · 678-891-3207",
        needs: ["cid"],
      },
      {
        category: "computers",
        what: "JagSPOT computer lab · Media SPOT",
        where: "CL",
        needs: ["cid"],
      },
      {
        category: "help",
        what: "Media Services · GPC Online",
        where: "CL",
        needs: ["open"],
      },
      {
        category: "chill",
        what: "Jim Cherry Auditorium",
        where: "CL1100",
        needs: ["open"],
      },
      {
        category: "print",
        what: "Printing",
        where: "Library",
        needs: ["cid", "funds"],
      },
      {
        category: "gear",
        what: "Laptop & charger checkout",
        where: "Circulation desk",
        needs: ["card"],
        access: "staff",
        demo: true,
      },
      {
        category: "gear",
        what: "Staff workroom / scanning station",
        where: "Staff area",
        needs: ["card"],
        access: "staff",
        demo: true,
      },
      {
        category: "study",
        what: "Group study rooms",
        where: "2nd floor · book online",
        needs: ["cid", "book"],
        access: "student",
        demo: true,
      },
      {
        category: "help",
        what: "Door alarm & access panel",
        where: "Staff entrance",
        needs: ["card"],
        access: "admin",
        demo: true,
      },
    ],
    classes: [],
    regularUses: [
      {
        title: "Jim Cherry Auditorium (CL1100)",
        details: "Talks, screenings and campus events",
      },
      {
        title: "Meeting rooms CL1200 & CL4190",
        details: "Workshops and info sessions",
      },
    ],
    clubs: [
      {
        name: "Coding Club",
        details: "Hack nights in the CATLab",
        demo: true,
      },
      {
        name: "Book Club",
        details: "Monthly in Quiet Study",
        demo: true,
      },
    ],
  },
  // ----- CN · Student Center -----
  {
    id: "cn",
    code: "CN",
    name: "Student Center",
    subtitle: "Student Center",
    lat: 33.792794,
    lng: -84.235052,
    gsuMapId: 295284,
    photos: [
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_001_668da8422117d.jpg"),
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_014_668daa07c32f9.jpg"),
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_067_668daed70e483.jpg"),
    ],
    offers: [
      {
        category: "food",
        what: "Campus Café — grab-and-go, made-to-order sandwiches & wraps",
        where: "CN",
        needs: ["meal"],
      },
      {
        category: "food",
        what: "Panther's Pantry — free food & hygiene supplies",
        where: "CN · lockers: back corner, right of the vending room",
        needs: ["open"],
      },
      {
        category: "help",
        what: "PantherCard office",
        where: "CN-1510 · M–F 8:30–5:15 · 678-891-3347",
        needs: ["open"],
      },
      {
        category: "help",
        what: "Admissions · Enrollment & Registration · Financial Aid",
        where: "CN",
        needs: ["cid"],
      },
      {
        category: "help",
        what: "Student Accounts & Cashier · ATM",
        where: "CN",
        needs: ["open"],
      },
      {
        category: "help",
        what: "Advising, Counseling & Retention Services",
        where: "CN",
        needs: ["appt"],
      },
      {
        category: "help",
        what: "Information Desk · Military Resource Booth",
        where: "CN",
        needs: ["open"],
      },
      {
        category: "help",
        what: "Study Abroad · Center for Teaching & Learning",
        where: "CN",
        needs: ["open"],
      },
      {
        category: "chill",
        what: "Bookstore · Student Life · SGA",
        where: "CN",
        needs: ["open"],
      },
      {
        category: "food",
        what: "Vending machines",
        where: "CN vending room",
        needs: ["open"],
      },
      {
        category: "chill",
        what: "Student lounge & game room",
        where: "CN 2nd floor",
        needs: ["card"],
        access: "student",
        demo: true,
      },
      {
        category: "help",
        what: "Staff break room",
        where: "CN 1st floor",
        needs: ["card"],
        access: "staff",
        demo: true,
      },
      {
        category: "help",
        what: "Building security office",
        where: "CN 1st floor",
        needs: ["card"],
        access: "admin",
        demo: true,
      },
    ],
    classes: [],
    regularUses: [
      {
        title: "Career Services events",
        details: "Workshops and career events at the Career Services Center",
      },
      {
        title: "Campus Café events",
        details: "Free student events are often held here",
      },
      {
        title: "Meeting rooms 2220 & 2240",
        details: "Club meetings, support groups and workshops",
      },
    ],
    clubs: [
      {
        name: "Student Government Association",
        details: "SGA office is in CN",
      },
      {
        name: "Student Life",
        details: "Club and organization hub — ask here where each club meets",
      },
      {
        name: "International Student Association",
        details: "Meets in Meeting Room 2220",
        demo: true,
      },
    ],
  },
  // ----- CH · Math / English / Health -----
  {
    id: "ch",
    code: "CH",
    name: "Math / English / Health",
    subtitle: "Building CH",
    lat: 33.793365,
    lng: -84.233447,
    gsuMapId: 295279,
    note: "Window replacement under way until Jan 2027",
    photos: [
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_049_668dad679818b.jpg"),
      gsuPhoto("Advisement_Building_CH_-_Clarkston_Campus_.jpg"),
    ],
    offers: [
      {
        category: "health",
        what: "Student Health Center",
        where: "CH",
        needs: ["appt"],
      },
      {
        category: "health",
        what: "Nutrition Services",
        where: "CH 1800",
        needs: ["appt"],
      },
      {
        category: "health",
        what: "Lactation space — call 678-891-4105 to book",
        where: "CH 1800",
        needs: ["appt"],
      },
      {
        category: "health",
        what: "Testing Center",
        where: "CH",
        needs: ["cid"],
      },
      {
        category: "help",
        what: "International Student Admissions & Advising",
        where: "CH",
        needs: ["appt"],
      },
      {
        category: "help",
        what: "Military Outreach Center · TRIO Upward Bound",
        where: "CH",
        needs: ["open"],
      },
      {
        category: "study",
        what: "Mathematics · English · MESA · Nursing",
        where: "CH",
        needs: ["open"],
      },
      {
        category: "food",
        what: "Vending machines",
        where: "CH",
        needs: ["open"],
      },
    ],
    classes: [
      {
        subject: "Mathematics",
        details: "e.g. College Algebra (MATH 1111), Precalculus (MATH 1113)",
      },
      {
        subject: "English",
        details: "English courses",
      },
      {
        subject: "Nursing",
        details: "Nursing courses",
      },
      {
        subject: "MESA",
        details: "Math, Engineering & Science Achievement program",
      },
    ],
    regularUses: [],
    clubs: [
      {
        name: "Math Club",
        details: "Weekly in the Math Lab",
        demo: true,
      },
      {
        name: "Pre-Nursing Society",
        details: "Meets in Room 1800",
        demo: true,
      },
    ],
  },
  // ----- CB · Business / Social Science -----
  {
    id: "cb",
    code: "CB",
    name: "Business / Social Science",
    subtitle: "Building CB",
    lat: 33.791538,
    lng: -84.234384,
    gsuMapId: 295272,
    photos: [
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_021_668daaa2783dc.jpg"),
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_069_668daf0b533fe.jpg"),
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_033_668dab6ca5ff5.jpg"),
    ],
    offers: [
      {
        category: "study",
        what: "Learning & Tutoring Center",
        where: "CB",
        needs: ["open"],
      },
      {
        category: "help",
        what: "Disability Services",
        where: "CB",
        needs: ["appt"],
      },
      {
        category: "help",
        what: "TRIO Student Support Services · Leadership Academy",
        where: "CB",
        needs: ["open"],
      },
      {
        category: "help",
        what: "Student Development & Special Programs · Recruitment",
        where: "CB",
        needs: ["open"],
      },
      {
        category: "chill",
        what: "The Collegian (student newspaper)",
        where: "CB",
        needs: ["open"],
      },
      {
        category: "food",
        what: "Vending machines",
        where: "CB",
        needs: ["open"],
      },
    ],
    classes: [
      {
        subject: "Business",
        details: "Business courses",
      },
      {
        subject: "Social Science",
        details: "Social science courses",
      },
    ],
    regularUses: [],
    clubs: [
      {
        name: "The Collegian",
        details: "Student newspaper office",
      },
      {
        name: "Business Leaders Club",
        details: "Mixers in CB1140",
        demo: true,
      },
    ],
  },
  // ----- CC · Science / Dual Enrollment -----
  {
    id: "cc",
    code: "CC",
    name: "Science / Dual Enrollment",
    subtitle: "Building CC",
    lat: 33.792423,
    lng: -84.234329,
    gsuMapId: 295274,
    photos: [
      gsuPhoto("DECA_Building_CC_-_Clarkston_Campus_.jpg"),
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_036_668dac030ea98.jpg"),
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_012_668da9ae25a1c.jpg"),
    ],
    offers: [
      {
        category: "study",
        what: "Science",
        where: "CC",
        needs: ["open"],
      },
      {
        category: "help",
        what: "Dual Enrollment · DeKalb Early College Academy",
        where: "CC",
        needs: ["appt"],
      },
    ],
    classes: [
      {
        subject: "Science",
        details: "Science lectures and labs",
      },
      {
        subject: "Dual Enrollment / DeKalb Early College Academy",
        details: "Classes for high-school dual enrollment students",
      },
    ],
    regularUses: [],
    clubs: [
      {
        name: "STEM Society",
        details: "Lab demos in the STEM Lab",
        demo: true,
      },
    ],
  },
  // ----- CD · Gateway / Sign Language -----
  {
    id: "cd",
    code: "CD",
    name: "Gateway / Sign Language",
    subtitle: "Building CD",
    lat: 33.793034,
    lng: -84.234294,
    gsuMapId: 295275,
    photos: [gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_002_668da9135d21b.jpg")],
    offers: [
      {
        category: "study",
        what: "Sign Language Interpreting Program",
        where: "CD",
        needs: ["open"],
      },
      {
        category: "help",
        what: "Gateway to College Academy",
        where: "CD",
        needs: ["open"],
      },
    ],
    classes: [
      {
        subject: "Sign Language Interpreting Program",
        details: "ASL and interpreting courses",
      },
      {
        subject: "Gateway to College Academy",
        details: "Gateway program classes",
      },
    ],
    regularUses: [],
    clubs: [],
  },
  // ----- CE · English / Honors / Humanities -----
  {
    id: "ce",
    code: "CE",
    name: "English / Honors / Humanities",
    subtitle: "Building CE",
    lat: 33.793621,
    lng: -84.23426,
    gsuMapId: 295276,
    photos: [gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_048_668dad242c041.jpg")],
    offers: [
      {
        category: "study",
        what: "English · Honors Program · Humanities",
        where: "CE",
        needs: ["open"],
      },
    ],
    classes: [
      {
        subject: "English",
        details: "Composition and literature, e.g. ENGL 1101 / 1102",
      },
      {
        subject: "Honors Program",
        details: "Honors sections and seminars",
      },
      {
        subject: "Humanities",
        details: "Humanities courses",
      },
    ],
    regularUses: [],
    clubs: [
      {
        name: "Poetry & Writers Circle",
        details: "Readings in the Honors Lounge",
        demo: true,
      },
    ],
  },
  // ----- CF · Fine Arts & Humanities -----
  {
    id: "cf",
    code: "CF",
    name: "Fine Arts & Humanities",
    subtitle: "Building CF",
    lat: 33.794494,
    lng: -84.234107,
    gsuMapId: 295277,
    photos: [
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_057_668dadb24cce9.jpg"),
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_059_668dadb1428b8.jpg"),
    ],
    offers: [
      {
        category: "chill",
        what: "Marvin Cole Auditorium",
        where: "CF",
        needs: ["open"],
      },
      {
        category: "chill",
        what: "Performance Studio",
        where: "CF",
        needs: ["open"],
      },
      {
        category: "computers",
        what: "Media Design Lab",
        where: "CF",
        needs: ["cid"],
      },
      {
        category: "food",
        what: "Vending machines",
        where: "CF",
        needs: ["open"],
      },
    ],
    classes: [
      {
        subject: "Fine Arts",
        details: "Art, music and theatre classes",
      },
      {
        subject: "Humanities",
        details: "Humanities courses",
      },
      {
        subject: "Media Design Lab",
        details: "Media and design classes",
      },
    ],
    regularUses: [
      {
        title: "Marvin Cole Auditorium",
        details: "Performances and lectures",
      },
      {
        title: "Gallery shows",
        details: "Student art exhibits and receptions",
      },
    ],
    clubs: [
      {
        name: "Theatre Club",
        details: "Rehearsals in the Performance Studio",
        demo: true,
      },
      {
        name: "Art Collective",
        details: "Meets in the Fine Arts Gallery",
        demo: true,
      },
    ],
  },
  // ----- CG · Gym / Public Safety -----
  {
    id: "cg",
    code: "CG",
    name: "Gym / Public Safety",
    subtitle: "Building CG",
    lat: 33.791938,
    lng: -84.233654,
    gsuMapId: 295278,
    photos: [
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_034_668daba67e55e.jpg"),
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_037_668dac40412ad.jpg"),
      gsuPhoto("clk-gym.jpg"),
    ],
    offers: [
      {
        category: "gym",
        what: "Gymnasium · Weight Room",
        where: "CG",
        needs: ["card"],
      },
      {
        category: "gym",
        what: "Swimming Pool",
        where: "CG",
        needs: ["card"],
      },
      {
        category: "health",
        what: "Health & Wellness · Physical Education",
        where: "CG",
        needs: ["open"],
      },
      {
        category: "help",
        what: "Public Safety & Parking Permits",
        where: "CG",
        needs: ["open"],
      },
      {
        category: "food",
        what: "Vending machines",
        where: "CG",
        needs: ["open"],
      },
    ],
    classes: [
      {
        subject: "Physical Education",
        details: "PE and activity classes",
      },
      {
        subject: "Health & Wellness",
        details: "Health and wellness courses",
      },
    ],
    regularUses: [],
    clubs: [
      {
        name: "Intramural Sports League",
        details: "Games in the Gymnasium",
        demo: true,
      },
      {
        name: "Swim Club",
        details: "Morning practice at the pool",
        demo: true,
      },
    ],
  },
  // ----- CA · Foreign Language / ESL -----
  {
    id: "ca",
    code: "CA",
    name: "Foreign Language / ESL",
    subtitle: "Building CA",
    lat: 33.791995,
    lng: -84.234914,
    gsuMapId: 295273,
    photos: [
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_016_668daa5830883.jpg"),
      gsuPhoto("Foreign_Language_ESL_Building_CA_-_Clarkston_Campus_.jpg"),
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_030_668dab3e03d8a.jpg"),
    ],
    offers: [
      {
        category: "study",
        what: "Foreign Language / ESL",
        where: "CA",
        needs: ["open"],
      },
      {
        category: "help",
        what: "Mail Room",
        where: "CA",
        needs: ["open"],
      },
      {
        category: "food",
        what: "Vending machines",
        where: "CA",
        needs: ["open"],
      },
    ],
    classes: [
      {
        subject: "Foreign Language / ESL",
        details: "Language and English-as-a-Second-Language classes",
      },
    ],
    regularUses: [],
    clubs: [
      {
        name: "Language Exchange Club",
        details: "Conversation hours in the Language Lab",
        demo: true,
      },
    ],
  },
  // ----- CS · PawPrints / Auxiliary -----
  {
    id: "cs",
    code: "CS",
    name: "PawPrints / Auxiliary",
    subtitle: "Building CS",
    lat: 33.791035,
    lng: -84.234355,
    gsuMapId: 295285,
    photos: [
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_023_668daada69131.jpg"),
      gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_026_668dab02c5da8.jpg"),
    ],
    offers: [
      {
        category: "print",
        what: "PawPrints printing services",
        where: "CS · 678-891-3335 · pawprintsclk@gsu.edu",
        needs: ["funds"],
      },
      {
        category: "help",
        what: "Mail Services · Auxiliary Services",
        where: "CS",
        needs: ["open"],
      },
      {
        category: "food",
        what: "Vending machines",
        where: "CS",
        needs: ["open"],
      },
    ],
    classes: [],
    regularUses: [],
    clubs: [],
  },
  // ----- CM · Facilities -----
  {
    id: "cm",
    code: "CM",
    name: "Facilities",
    subtitle: "Building CM",
    lat: 33.791834,
    lng: -84.231394,
    gsuMapId: 295283,
    photos: [gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_071_668daf3ad162e.jpg")],
    offers: [
      {
        category: "help",
        what: "Facilities Operations · Planning & Projects · Logistics",
        where: "CM",
        needs: ["open"],
      },
      {
        category: "food",
        what: "Vending machines",
        where: "CM",
        needs: ["open"],
      },
    ],
    classes: [],
    regularUses: [],
    clubs: [],
  },
  // ----- CI · Nursing -----
  {
    id: "ci",
    code: "CI",
    name: "Nursing",
    subtitle: "652 N Indian Creek Dr (across the road)",
    lat: 33.794802,
    lng: -84.237,
    gsuMapId: 295280,
    photos: [gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_074_668daf73c5a2c.jpg")],
    offers: [
      {
        category: "study",
        what: "Nursing",
        where: "CI",
        needs: ["open"],
      },
      {
        category: "food",
        what: "Vending machines",
        where: "CI",
        needs: ["open"],
      },
    ],
    classes: [
      {
        subject: "Nursing",
        details: "Nursing program classes and labs",
      },
    ],
    regularUses: [],
    clubs: [
      {
        name: "Student Nurses Association",
        details: "Meets in the Nursing Classroom",
        demo: true,
      },
    ],
  },
  // ----- CJ · Public Safety Admin -----
  {
    id: "cj",
    code: "CJ",
    name: "Public Safety Admin",
    subtitle: "652 N Indian Creek Dr (across the road)",
    lat: 33.79511,
    lng: -84.237027,
    gsuMapId: 295281,
    photos: [gsuPhoto("20240708BR_CLK_buildings_for_3D_maps_078_668daf9cec1dc.jpg")],
    offers: [
      {
        category: "help",
        what: "Public Safety Administration & Communications",
        where: "CJ",
        needs: ["open"],
      },
    ],
    classes: [],
    regularUses: [],
    clubs: [],
  },
];
