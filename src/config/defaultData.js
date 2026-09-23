// Default seed data for Future Event Organization (Kishore, Ramapuram, Chennai)
// All data is fully editable from the Admin Dashboard and persists in Firestore / local engine

export const initialBusinessData = {
  id: "future_events_chennai",
  businessName: "Future Event Organization",
  manager: "Kishore",
  category: "Event Planner & Wedding Decorator",
  rating: 5.0,
  reviewCount: 12,
  priceStarting: "₹ 50,000",
  priceUnit: "Starting Price (Planning Fee)",
  profileImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  description: "Based in Ramapuram, Chennai, Future Event Organization is a premier complete event planning and decor company led by Kishore. We specialize in curating breathtaking weddings, engagements, traditional baby showers (valaikappu), birthday celebrations, catering, and bespoke stage decors. With an eye for creative elegance and flawless execution, our dedicated team ensures your special celebrations become cherished lifelong memories.",
  yearsOfExperience: 6,
  planningSince: 2018,
  servicesProvided: [
    "Complete Wedding Planning & Coordination",
    "Stage & Mandap Theme Decoration",
    "Engagement Decor & Photography",
    "Traditional Baby Shower (Valaikappu) & Catering",
    "Birthday Parties & Theme Setups",
    "Food, Traditional Feast & Beverage Catering",
    "Professional Photography & Videography",
    "Music, DJ, Sound & Lighting Setup",
    "Floral Garlands & Bridal Entry Concepts"
  ],
  decorPolicy: "Work with in-house & outside decorators tailored to client venue preferences",
  cancellationPolicy: "Advance booking amount can be adjusted towards future dates or rescheduled events with mutual coordination. Transparent terms with zero hidden fees.",
  feeStructure: "Flexible planning fee starting from ₹ 50,000 or customized percentage of event budget based on scope",
  serviceAreas: [
    "Chennai",
    "Ramapuram",
    "Porur",
    "Guindy",
    "Kanchipuram",
    "Chengalpattu",
    "Coimbatore",
    "Madurai",
    "Pondicherry"
  ],
  teamMembers: [
    "Kishore (Founder & Lead Planner)",
    "Dinesh (Decor & Technical Lead)",
    "Priya (Client Coordination & Hospitality)",
    "Senthil (Catering & Logistics)"
  ],
  stats: {
    eventsCompleted: 180,
    satisfiedClients: 350,
    citiesCovered: 8
  },
  faqs: [
    {
      q: "How does Future Event Organization charge for events and weddings planned by them?",
      a: "We offer transparent fee structures starting from ₹ 50,000 for event management or customized percentage-based planning depending on your guest count, venue, and decor requirements."
    },
    {
      q: "How is Future Event Organization's style different from other wedding planners in Chennai?",
      a: "Led personally by Kishore, our USP is personalized, stress-free planning with hands-on attention to detail. From custom modern floral stage concepts to authentic traditional South Indian feasts, we blend tradition with contemporary aesthetics."
    },
    {
      q: "What is your policy on decor and styling?",
      a: "We provide comprehensive in-house bespoke decor concepts (mandap, floral arches, fairy lighting, backdrop) and are also happy to coordinate with venue-specific decorators."
    },
    {
      q: "What is the cancellation or date adjustment policy?",
      a: "In case of unforeseen date changes, your advance is securely retained and adjusted towards your revised event schedule without penalty."
    }
  ]
};

export const initialContactData = {
  phoneNumber: "+91 93604 55217",
  whatsappNumber: "+91 93604 55217",
  rawPhone: "+919360455217",
  email: "futureeventskishore@gmail.com",
  instagram: "https://instagram.com/futureevents_chennai",
  instagramHandle: "@futureevents_chennai",
  facebook: "https://facebook.com/futureeventsorganization",
  address: "11th Cross St, Venkateshwara Nagar, Ramapuram, Chennai, Tamil Nadu 600089",
  plusCode: "25HF+XV Chennai, Tamil Nadu",
  googleMapsLink: "https://maps.google.com/?q=11th+Cross+St,+Venkateshwara+Nagar,+Ramapuram,+Chennai,+Tamil+Nadu+600089",
  workingHours: "Open Daily · 7:00 AM – 10:00 PM"
};

export const initialReviewsData = [
  {
    id: "rev-1",
    reviewerName: "B. Abirami",
    rating: 5.0,
    reviewDate: "6 months ago",
    dateTimestamp: Date.now() - 180 * 24 * 60 * 60 * 1000,
    reviewText: "We booked Future Event Organization for my engagement, and they delivered outstanding service. Their decoration work was elegant, creative, and perfectly aligned with my expectations. The team’s dedication and professionalism truly made the day unforgettable.",
    spendAmount: "₹ 1,80,000",
    tags: ["Quality of Work", "Professionalism", "Elegant Decor"],
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
    ],
    isPinned: true,
    ownerResponse: "Happy to hear from you mam thank you ☺️",
    ownerResponseDate: "6 months ago"
  },
  {
    id: "rev-2",
    reviewerName: "kayalvizhi jeyakanthan",
    badge: "Local Guide",
    rating: 5.0,
    reviewDate: "5 months ago",
    dateTimestamp: Date.now() - 150 * 24 * 60 * 60 * 1000,
    reviewText: "We planned for Baby shower function, they provide a awesome valaikappu lunch and neat service. We and our Guest are happy with food.",
    spendAmount: "₹ 1,20,000",
    tags: ["Authentic Catering", "Neat Service", "Value for Money"],
    photos: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80"
    ],
    isPinned: true,
    ownerResponse: "Thank you so much for your kind words! Delighted that your family loved the lunch and arrangements!",
    ownerResponseDate: "5 months ago"
  },
  {
    id: "rev-3",
    reviewerName: "ashok rock",
    rating: 5.0,
    reviewDate: "10 months ago",
    dateTimestamp: Date.now() - 300 * 24 * 60 * 60 * 1000,
    reviewText: "We planned birthday party for my son we are really got satisfied by there team thank you Kishore 👍",
    spendAmount: "₹ 75,000",
    tags: ["Birthday Theme", "Dedication", "Great Team"],
    photos: [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80"
    ],
    isPinned: true,
    ownerResponse: "Happy to hear from you sir 😊",
    ownerResponseDate: "10 months ago"
  },
  {
    id: "rev-4",
    reviewerName: "Sridhar & Deepa",
    rating: 5.0,
    reviewDate: "3 months ago",
    dateTimestamp: Date.now() - 90 * 24 * 60 * 60 * 1000,
    reviewText: "I highly recommend Future Event Organization for anyone looking for event management. Kishore brother took care of every single requirement for our reception at Chennai with supreme care. Appreciate the team and thanks for wonderful decor 🤗",
    spendAmount: "₹ 3,50,000",
    tags: ["Stress-Free Planning", "Stage Decor", "Superb Hospitality"],
    photos: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
    ],
    isPinned: false,
    ownerResponse: "Hearty congratulations to the lovely couple! Thank you for trusting us with your special day ✨",
    ownerResponseDate: "3 months ago"
  },
  {
    id: "rev-5",
    reviewerName: "Venkatesh Kumar",
    rating: 5.0,
    reviewDate: "4 months ago",
    dateTimestamp: Date.now() - 120 * 24 * 60 * 60 * 1000,
    reviewText: "Outstanding floral mandap decoration and lighting! Guests were clicking photos non-stop. Timely coordination and prompt responses throughout.",
    spendAmount: "₹ 2,10,000",
    tags: ["Punctual", "Creative Florals"],
    photos: [],
    isPinned: false,
    ownerResponse: null
  },
  {
    id: "rev-6",
    reviewerName: "Praveen & Nandhini",
    rating: 5.0,
    reviewDate: "2 months ago",
    dateTimestamp: Date.now() - 60 * 24 * 60 * 60 * 1000,
    reviewText: "Booked them for our wedding muhurtham and evening musical sangeet. Kishore's team managed vendor coordination smoothly. Five stars all the way!",
    spendAmount: "₹ 4,00,000",
    tags: ["Top Tier Wedding", "Music & Decor"],
    photos: [
      "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=600&q=80"
    ],
    isPinned: false,
    ownerResponse: "Thank you Praveen & Nandhini! Wishing you both a lifetime of happiness!",
    ownerResponseDate: "2 months ago"
  }
];

export const initialAlbumsData = [
  {
    id: "album-weddings",
    name: "Golden Glimmer Weddings",
    category: "Weddings",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    photoCount: 10,
    description: "Royal stage decors, traditional South Indian mandaps, and grand floral installations.",
    createdDate: "2024-01-15",
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", caption: "Grand floral mandap entrance with traditional marigold garlands" },
      { id: "p2", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80", caption: "Illuminated evening reception stage with warm fairy lighting" },
      { id: "p3", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80", caption: "Couple stage with pastel rose backdrop" },
      { id: "p4", url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80", caption: "Bespoke banquet hall ceiling draping" },
      { id: "p5", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80", caption: "Floral walkway canopy and walkway lanterns" },
      { id: "p6", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80", caption: "Outdoor lawn reception setup" },
      { id: "p7", url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80", caption: "Intricate floral wall photo booth" },
      { id: "p8", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80", caption: "Bridal entry floral chadar and pyrotechnic cold sparks" },
      { id: "p9", url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80", caption: "Muhurtham traditional brass lamp and flower arrangements" },
      { id: "p10", url: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80", caption: "Grand wedding pathway floral pillars" }
    ]
  },
  {
    id: "album-photography",
    name: "Photography & Moments",
    category: "Photography",
    thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
    photoCount: 6,
    description: "Candid emotional wedding portraits, rituals, and unforgettable family smiles.",
    createdDate: "2024-02-10",
    photos: [
      { id: "p11", url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80", caption: "Candid bride portrait in silk saree" },
      { id: "p12", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", caption: "Exchange of floral garlands" },
      { id: "p13", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80", caption: "Emotional blessings ritual with family" },
      { id: "p14", url: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80", caption: "Groom procession and celebration" },
      { id: "p15", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80", caption: "Couple portraits under fairy light canopy" },
      { id: "p16", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80", caption: "Artistic mehendi detail photography" }
    ]
  },
  {
    id: "album-haldi",
    name: "Haldi & Sangeet Celebrations",
    category: "Haldi",
    thumbnail: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80",
    photoCount: 5,
    description: "Vibrant yellow marigold decors, traditional urlis, and joyful festive setups.",
    createdDate: "2024-03-01",
    photos: [
      { id: "p17", url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80", caption: "Traditional brass urli with marigold floral carpet" },
      { id: "p18", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", caption: "Yellow drape photo backdrop with floral tassels" },
      { id: "p19", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80", caption: "Festive floral swing (Oonjal) setup" },
      { id: "p20", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80", caption: "Haldi fun with colorful smoke bombs" },
      { id: "p21", url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80", caption: "Festive props and decorated umbrellas" }
    ]
  },
  {
    id: "album-catering",
    name: "Catering & Valaikappu Feasts",
    category: "Catering",
    thumbnail: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
    photoCount: 5,
    description: "Authentic South Indian plantain leaf spreads, variety rice, and dessert buffet.",
    createdDate: "2024-03-20",
    photos: [
      { id: "p22", url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80", caption: "Grand South Indian wedding feast on banana leaf" },
      { id: "p23", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80", caption: "Traditional 7-variety rice spread for Baby Shower (Valaikappu)" },
      { id: "p24", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80", caption: "Live dessert and sweet stall arrangement" },
      { id: "p25", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80", caption: "Neat catering uniform service team" },
      { id: "p26", url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80", caption: "Welcome drinks and mocktail counter" }
    ]
  },
  {
    id: "album-birthdays",
    name: "Birthday Celebrations & Themes",
    category: "Birthdays",
    thumbnail: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
    photoCount: 4,
    description: "Magical balloon arches, themed character backdrops, and joyous cake cutting setups.",
    createdDate: "2024-04-05",
    photos: [
      { id: "p27", url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80", caption: "Grand pastel organic balloon arch backdrop" },
      { id: "p28", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", caption: "Illuminated marquee LED age number with balloon pillars" },
      { id: "p29", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80", caption: "Kids entertainment and fun corner" },
      { id: "p30", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80", caption: "Custom designer dessert table" }
    ]
  },
  {
    id: "album-communion",
    name: "Holy Communion & Receptions",
    category: "Special Events",
    thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    photoCount: 4,
    description: "Pristine white floral themes, church decors, and elegant banquet tables.",
    createdDate: "2024-04-18",
    photos: [
      { id: "p31", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80", caption: "Pure white rose floral cross and altar backdrop" },
      { id: "p32", url: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80", caption: "Banquet dining centerpiece with candlelight" },
      { id: "p33", url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80", caption: "Communion celebration cake table with floral garland" },
      { id: "p34", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80", caption: "Entrance welcome mirror with personalized calligraphy" }
    ]
  }
];

export const initialSettingsData = {
  themePref: "light",
  imagesPerPage: 8,
  paginationMode: "button", // "button" | "infinite"
  emailNotifications: true,
  inquiryNotifications: true,
  galleryNotifications: true
};

// Initial admin auth credential configuration
export const initialAuthData = {
  // Plain initial temporary password is "Futureeventskishore2026"
  // When changed in settings, it is updated securely.
  adminPassword: "Futureeventskishore2026",
  lastChanged: "2026-09-23",
  isConfigured: true
};

export const similarVendorsData = [
  {
    id: "sim-1",
    name: "Oh Yes Events",
    location: "Chromepet, Chennai",
    rating: 4.9,
    reviewCount: 121,
    startingPrice: "₹ 2,50,000",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "sim-2",
    name: "Wedding Project India",
    location: "Alwarpet, Chennai",
    rating: 4.9,
    reviewCount: 36,
    startingPrice: "₹ 5,00,000",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "sim-3",
    name: "Destiny Tales",
    location: "Besant Nagar, Chennai",
    rating: 5.0,
    reviewCount: 27,
    startingPrice: "₹ 1,50,000",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=500&q=80"
  }
];
