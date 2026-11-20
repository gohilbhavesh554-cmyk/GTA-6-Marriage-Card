import type { WeddingConfig } from '../types/wedding';

export const EDITORIAL_IMAGES = {
  couplePosterHero: '/src/assets/images/gta6_couple_poster_hero_1795107014916.jpg',
  coupleSunsetWalk: '/src/assets/images/couple_sunset_beach_walk_1795107013622.jpg',
  coupleMiamiNight: '/src/assets/images/couple_neon_miami_night_1795107011141.jpg',
  coupleConvertibleDrive: '/src/assets/images/couple_convertible_drive_1795107014876.jpg',
  sunsetHighway: '/src/assets/images/miami_sunset_highway_1795104924246.jpg',
  beachEstateHero: '/src/assets/images/miami_beach_estate_hero_1795104923346.jpg',
  palmsReception: '/src/assets/images/palms_estate_reception_1795104921917.jpg',
  tropicalFormal: '/src/assets/images/tropical_formal_editorial_1795105117469.jpg',
  convertiblePalms: '/src/assets/images/miami_convertible_palms_1795104922246.jpg',
  nightOceanfront: '/src/assets/images/miami_night_oceanfront_1795104923210.jpg',
} as const;

export const DEFAULT_WEDDING_CONFIG: WeddingConfig = {
  brideFirstName: 'Ava',
  brideLastName: 'Bennett',
  groomFirstName: 'Noah',
  groomLastName: 'Carter',
  displayNames: 'Ava & Noah',
  weddingTagline: 'From New York & London to one unforgettable twilight in Miami Beach.',
  storyTitle: 'Two continents, four cities, one sunset forever.',
  brideParents: 'Mr. & Mrs. Bennett (London)',
  groomParents: 'Mr. & Mrs. Carter (New York)',
  weddingDate: '2027-06-19',
  ceremonyTime: '16:30',
  displayDate: 'Saturday, 19 June 2027',
  timezone: 'America/New_York',
  city: 'Miami Beach',
  state: 'Florida',
  country: 'USA',
  venueName: 'The Palms Estate',
  venueAddress: '4400 Collins Avenue, Miami Beach, FL 33140',
  dressCode: 'Coastal Black-Tie Optional',
  dressCodeDescription:
    'Effortless European-coastal tailoring meets Miami twilight: fluid silk gowns, warm sunset or midnight tones, lightweight tuxedos, and crisp summer dinner jackets.',
  dressCodeAvoidNote:
    'We kindly ask guests to reserve ivory, white, and cream for the bride.',
  rsvpDeadline: '2027-05-15',
  rsvpContact: 'concierge@avaandnoah.com',
  nearestAirport: 'Miami International Airport',
  airportCode: 'MIA',
  hotelInformation:
    'Preferred oceanfront suites are held along Collins Avenue, minutes from The Palms Estate.',
  transportation:
    'Private black-car transfers run every 20 minutes from partner hotels starting at 3:45 PM.',
  parkingInformation:
    'Complimentary private valet service is hosted at the Collins Avenue entrance from 3:30 PM.',
  plusOnePolicy: 'As addressed on your personal invitation.',
  childrenPolicy: 'An intimate evening celebration for adults and close family.',
  accessibilityInformation:
    'Step-free coastal pathways, private lift access, and dedicated lawn seating throughout the estate.',
  giftInformation:
    'Travelling from across the U.S. and Europe to celebrate with us is the finest gift of all.',
  schedule: [
    {
      id: 'event-01',
      title: 'The Vows',
      subtitle: 'Oceanfront Ceremony',
      time: '4:30 PM',
      endTime: '5:15 PM',
      description:
        'An intimate ceremony beneath the palms overlooking the Atlantic as late-afternoon light turns golden.',
      location: 'The Palms Ocean Lawn',
      dressHint: 'Doors open at 4:00 PM · Chilled champagne on arrival',
      icon: 'ceremony',
    },
    {
      id: 'event-02',
      title: 'Sunset Aperitivo',
      subtitle: 'Golden Hour Cocktails',
      time: '5:30 PM',
      endTime: '6:45 PM',
      description:
        'Italian-inspired spritzes, coastal raw bar, acoustic rhythms, and twilight views over the water.',
      location: 'The Sea Terrace',
      dressHint: 'Sunset terrace · Live strings & coastal bites',
      icon: 'cocktail',
    },
    {
      id: 'event-03',
      title: 'Candlelit Dinner',
      subtitle: 'Reception & Toasts',
      time: '7:00 PM',
      endTime: '10:00 PM',
      description:
        'A four-course seasonal tasting dinner, heartfelt speeches from New York and London, and first dances.',
      location: 'The Grand Pavilion',
      dressHint: 'Seated dinner · Fine European & Californian wines',
      icon: 'reception',
    },
    {
      id: 'event-04',
      title: 'After Dark',
      subtitle: 'Midnight Vinyl Lounge',
      time: '10:00 PM',
      endTime: '1:00 AM',
      description:
        'Espresso martinis, late-night vinyl sets, and dancing under the warm Miami sky until 1:00 AM.',
      location: 'The Palm Lounge',
      dressHint: 'Late-night bites · Open bar until 1:00 AM',
      icon: 'afterparty',
    },
  ],
  storyChapters: [
    {
      id: 'chapter-01',
      year: '2020',
      title: 'SoHo, New York',
      location: 'Manhattan · USA',
      description:
        'An autumn evening in downtown New York — a quiet gallery opening, an unplanned espresso, and a conversation that lasted until the city fell silent.',
      photo: EDITORIAL_IMAGES.couplePosterHero,
      caption: 'Where two cities first crossed paths',
    },
    {
      id: 'chapter-02',
      year: '2022',
      title: 'Paris & The Coast',
      location: 'France & Italy · Europe',
      description:
        'Long weekends split between Parisian cafés, coastal drives with the roof down, and golden-hour dinners overlooking the sea.',
      photo: EDITORIAL_IMAGES.coupleConvertibleDrive,
      caption: 'Chasing warm horizons together',
    },
    {
      id: 'chapter-03',
      year: '2025',
      title: 'Mayfair, London',
      location: 'London · United Kingdom',
      description:
        'Beneath twinkling twilight lights overlooking the skyline, champagne glasses rose and one quiet question sealed forever.',
      photo: EDITORIAL_IMAGES.coupleMiamiNight,
      caption: 'A champagne promise at midnight',
    },
    {
      id: 'chapter-04',
      year: '2027',
      title: 'Miami Beach',
      location: 'Florida · USA',
      description:
        'Bringing our families and dearest friends together from New York, London, Paris, and beyond for one luminous weekend by the ocean.',
      photo: EDITORIAL_IMAGES.coupleSunsetWalk,
      caption: 'Saturday, 19 June 2027 · The Palms Estate',
    },
  ],
  galleryItems: [
    {
      id: 'gal-01',
      src: EDITORIAL_IMAGES.couplePosterHero,
      alt: 'Ava and Noah beside a vintage convertible on Ocean Drive at twilight',
      caption: 'Ocean Drive Twilight',
      location: 'Miami Beach',
      aspect: 'portrait',
    },
    {
      id: 'gal-02',
      src: EDITORIAL_IMAGES.coupleConvertibleDrive,
      alt: 'Ava and Noah driving a classic ivory convertible down a palm-lined causeway at sunset',
      caption: 'The Coastal Drive',
      location: 'Biscayne Bay',
      aspect: 'wide',
    },
    {
      id: 'gal-03',
      src: EDITORIAL_IMAGES.coupleSunsetWalk,
      alt: 'Ava and Noah walking hand-in-hand along a sunlit palm promenade',
      caption: 'Golden Hour Promenade',
      location: 'The Palms Estate',
      aspect: 'standard',
    },
    {
      id: 'gal-04',
      src: EDITORIAL_IMAGES.coupleMiamiNight,
      alt: 'Ava and Noah raising champagne coupes beneath illuminated palms at night',
      caption: 'After Dark Toast',
      location: 'Biscayne Bay',
      aspect: 'standard',
    },
    {
      id: 'gal-05',
      src: EDITORIAL_IMAGES.palmsReception,
      alt: 'Candlelit oceanfront dinner tables beneath palm trees at twilight',
      caption: 'Candlelit Pavilion',
      location: 'The Palms Estate',
      aspect: 'standard',
    },
    {
      id: 'gal-06',
      src: EDITORIAL_IMAGES.beachEstateHero,
      alt: 'Evening coastal promenade framed by palms at sunset',
      caption: 'Into Forever',
      location: 'Miami Beach',
      aspect: 'wide',
    },
  ],
  faqs: [
    {
      id: 'faq-01',
      question: 'Which airports offer direct flights from the U.S. & Europe?',
      answer:
        'Miami International Airport (MIA) welcomes daily nonstop flights from London Heathrow (LHR), Paris (CDG), Frankfurt (FRA), Madrid (MAD), New York (JFK), and Los Angeles (LAX) — just 22 minutes from Miami Beach.',
    },
    {
      id: 'faq-02',
      question: 'What is the dress code for the evening?',
      answer:
        'Coastal Black-Tie Optional — fluid floor-length or midi silk gowns, warm sunset or deep evening hues, and lightweight summer tuxedos or tailored linen-wool dinner jackets.',
    },
    {
      id: 'faq-03',
      question: 'What time should guests arrive?',
      answer:
        'Scratch the metallic foil timings above to reveal each hour. Chilled champagne is served on the ocean lawn 30 minutes prior to the ceremony.',
    },
    {
      id: 'faq-04',
      question: 'Are hotel transfers and valet arranged?',
      answer:
        'Yes — complimentary valet awaits at The Palms Estate entrance, and private black-car shuttles run every 20 minutes from The Setai and Faena Hotel.',
    },
  ],
  hotels: [
    {
      id: 'hotel-01',
      name: 'The Setai Miami Beach',
      neighborhood: 'Collins Avenue',
      distance: '4 min drive',
      bookingUrl: '',
      notes: 'Serene oceanfront suites with direct evening shuttle transfers.',
    },
    {
      id: 'hotel-02',
      name: 'Faena Hotel Miami Beach',
      neighborhood: 'Mid-Beach',
      distance: '5 min drive',
      bookingUrl: '',
      notes: 'Art Deco glamour, beachfront dining, and preferred wedding rates.',
    },
  ],
};

export const DRESS_CODE_SWATCHES = [
  { name: 'Sunset Rose', hex: '#F26386', note: 'Silk gowns & evening colour' },
  { name: 'Warm Coral', hex: '#F48C5E', note: 'Aperitivo & dusk elegance' },
  { name: 'Champagne', hex: '#F2C97D', note: 'Satin & metallic accents' },
  { name: 'Coastal Mist', hex: '#7AC8DB', note: 'Soft summer tailoring' },
  { name: 'Midnight', hex: '#1B172A', note: 'Classic dinner jackets' },
];
