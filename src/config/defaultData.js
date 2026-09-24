// Default seed data for Future Event Organization (Kishore, Ramapuram, Chennai)
// All data is fully editable from the Admin Dashboard and persists in Firestore / local engine

export const initialBusinessData = {
  id: "future_events_chennai",
  businessName: "Future Event Organization",
  manager: "Kishore",
  category: "Event Planner & Wedding Decorator",
  rating: 5.0,
  reviewCount: 12,
  priceStarting: "₹ 99,000",
  priceUnit: "Starting Price (Planning Fee)",
  logoUrl: "",
  profileImage: "",
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
  specialists: [
    {
      title: "Luxury Mandap & Stage Decor",
      desc: "Signature South Indian floral backdrops, fiber carvings, brass props, and atmospheric fairy lights."
    },
    {
      title: "Full Wedding & Reception Coordination",
      desc: "End-to-end planning from muhurtham timing, guest hospitality, vendor coordination to farewell."
    },
    {
      title: "Sangeet, DJ & Concert Sound Systems",
      desc: "High-octane sound setups, club-style truss moving heads, and live music direction."
    },
    {
      title: "Authentic Valaikappu & Traditional Feasts",
      desc: "Exquisite 7-variety rice preparations, banana leaf dining, sweet stalls, and traditional seating."
    },
    {
      title: "Cinematic Photography & Drone Coverage",
      desc: "Capturing candid emotions, 4K wedding films, teasers, and high-resolution heirloom albums."
    }
  ],
  vendors: [
    {
      id: "v-photo",
      category: "Photography & Videography",
      name: "Cinematic & Candid Wedding Coverage",
      description: "Traditional photography, candid wedding film, 4K drone shoots, pre-wedding & post-wedding shoots.",
      priceStarting: "₹ 45,000",
      image: ""
    },
    {
      id: "v-dj",
      category: "DJ, Music & Sound",
      name: "Club DJ, Concert Sound & Truss Lighting",
      description: "High-power sound systems, live DJ mixing for Sangeet & Reception, beam lights, and cold spark pyros.",
      priceStarting: "₹ 25,000",
      image: ""
    },
    {
      id: "v-decor",
      category: "Stage & Mandap Decor",
      name: "Bespoke Royal Mandap & Florals",
      description: "Custom floral mandaps, grand reception backdrops, floral pathway arches, neon signs, and fairy lighting.",
      priceStarting: "₹ 60,000",
      image: ""
    },
    {
      id: "v-catering",
      category: "Food & Catering",
      name: "Authentic South Indian & Multi-Cuisine Feasts",
      description: "Traditional banana leaf feast, live chaat stalls, mocktail counters, desserts, and royal wedding buffet.",
      priceStarting: "₹ 450 / plate",
      image: ""
    },
    {
      id: "v-makeup",
      category: "Bridal Makeup & Styling",
      name: "Bridal HD Artistry & Styling",
      description: "HD bridal makeup, hair styling, saree draping, mehendi artists, and groom grooming.",
      priceStarting: "₹ 15,000",
      image: ""
    }
  ],
  decorPolicy: "Work with in-house & outside decorators tailored to client venue preferences",
  cancellationPolicy: "Advance booking amount can be adjusted towards future dates or rescheduled events with mutual coordination. Transparent terms with zero hidden fees.",
  feeStructure: "Flexible planning fee starting from ₹ 99,000 or customized percentage of event budget based on scope",
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
    "Kishore (Founder & Lead Planner)"
  ],
  stats: {
    eventsCompleted: 180,
    satisfiedClients: 350,
    citiesCovered: 8
  },
  faqs: [
    {
      q: "How does Future Event Organization charge for events and weddings planned by them?",
      a: "We offer transparent fee structures starting from ₹ 99,000 for event management or customized percentage-based planning depending on your guest count, venue, and decor requirements."
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
    photos: [],
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
    photos: [],
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
    photos: [],
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
    photos: [],
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
    photos: [],
    isPinned: false,
    ownerResponse: "Thank you Praveen & Nandhini! Wishing you both a lifetime of happiness!",
    ownerResponseDate: "2 months ago"
  }
];

export const initialAlbumsData = [
  {
    id: "album-babyshower",
    name: "Baby Shower (Valaikappu)",
    category: "Baby Shower (Valaikappu)",
    thumbnail: "",
    photoCount: 0,
    videoCount: 0,
    description: "Traditional valaikappu floral stages, seating, and ceremony setups.",
    createdDate: "2024-03-20",
    photos: [],
    videos: []
  },
  {
    id: "album-weddings",
    name: "Weddings & Mandaps",
    category: "Weddings",
    thumbnail: "",
    photoCount: 0,
    videoCount: 0,
    description: "Royal stage decors, traditional South Indian mandaps, and grand floral installations.",
    createdDate: "2024-01-15",
    photos: [],
    videos: []
  },
  {
    id: "album-photography",
    name: "Photography & Moments",
    category: "Photography",
    thumbnail: "",
    photoCount: 0,
    videoCount: 0,
    description: "Candid emotional wedding portraits, rituals, and unforgettable family smiles.",
    createdDate: "2024-02-10",
    photos: [],
    videos: []
  },
  {
    id: "album-haldi",
    name: "Haldi & Sangeet Celebrations",
    category: "Haldi & Sangeet",
    thumbnail: "",
    photoCount: 0,
    videoCount: 0,
    description: "Vibrant yellow marigold decors, traditional urlis, and joyful festive setups.",
    createdDate: "2024-03-01",
    photos: [],
    videos: []
  },
  {
    id: "album-catering",
    name: "Catering & Feasts",
    category: "Catering & Food",
    thumbnail: "",
    photoCount: 0,
    videoCount: 0,
    description: "Authentic South Indian plantain leaf spreads, variety rice, and dessert buffet.",
    createdDate: "2024-03-20",
    photos: [],
    videos: []
  },
  {
    id: "album-birthdays",
    name: "Birthdays & Special Events",
    category: "Birthdays",
    thumbnail: "",
    photoCount: 0,
    videoCount: 0,
    description: "Theme setups, organic balloon arches, marquee letters, and dessert backdrops.",
    createdDate: "2024-04-05",
    photos: [],
    videos: []
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
  // Up to 3 authorized Google emails allowed to log in via Google OAuth
  allowedEmails: [
    "pagesofanisha@gmail.com",
    "futureeventskishore@gmail.com"
  ],
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
    image: ""
  },
  {
    id: "sim-2",
    name: "Wedding Project India",
    location: "Alwarpet, Chennai",
    rating: 4.9,
    reviewCount: 36,
    startingPrice: "₹ 5,00,000",
    image: ""
  },
  {
    id: "sim-3",
    name: "Destiny Tales",
    location: "Besant Nagar, Chennai",
    rating: 5.0,
    reviewCount: 27,
    startingPrice: "₹ 1,50,000",
    image: ""
  }
];
